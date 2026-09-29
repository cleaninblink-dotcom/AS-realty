# Security Specification: AS Realty Firestore Rules

## 1. Data Invariants
1. **User Profiles (`/users/{userId}`)**:
   - Only authenticated users can create/read/update their own profile (`request.auth.uid == userId`).
   - Standard users cannot promote themselves to `admin` or change their `role` field.
   - PII (email, phone) is protected: non-owners and unauthenticated users cannot read user profiles.
   - The bootstrapped administrator (`shreyashivpeth@gmail.com` with `email_verified == true`) has administrative read access for user support.

2. **User Favorites (`/users/{userId}/favorites/{propertyId}`)**:
   - Only the parent user (`request.auth.uid == userId`) can view, add, or remove items from their favorites subcollection.
   - Unauthenticated or foreign users cannot inspect other clients' shortlisted luxury properties.

3. **Visit Bookings (`/bookVisits/{visitId}`)**:
   - Clients must be signed in with email verification to create site visit bookings.
   - `incoming().userId` must strictly match `request.auth.uid` to prevent identity spoofing.
   - Users can only query (`list`) or fetch (`get`) bookings where `resource.data.userId == request.auth.uid`, or if the requester is the authorized administrator.
   - Users can update notes or cancel their own booking before completion.
   - Status transitions to `confirmed` or `completed` are reserved for administrators (`isAdmin()`).

4. **Connection Health Check (`/test/{docId}`)**:
   - Read-only probe for client online/offline verification. Writes are blocked.

---

## 2. The "Dirty Dozen" Threat Payloads (Must Return PERMISSION_DENIED)

1. **Unauthenticated Read on User Profile**:
   `GET /users/user_123` without auth token -> PERMISSION_DENIED.
2. **Foreign User Read on Profile**:
   `GET /users/user_victim` with auth token `uid: user_attacker` -> PERMISSION_DENIED.
3. **Privilege Escalation on User Profile Create**:
   `POST /users/user_attacker` with payload `{"role": "admin", "email": "attacker@evil.com"}` -> PERMISSION_DENIED.
4. **Shadow Field Injection on User Profile**:
   `POST /users/user_123` with extra unapproved field `{"isVipOverride": true}` -> PERMISSION_DENIED.
5. **Identity Spoofing on Visit Booking**:
   `POST /bookVisits/visit_999` with `incoming().userId: "victim_uid"` while signed in as `"attacker_uid"` -> PERMISSION_DENIED.
6. **Unauthenticated Site Visit Query**:
   `GET /bookVisits` without auth token -> PERMISSION_DENIED.
7. **Listing All Bookings without Admin Status**:
   `GET /bookVisits` query without `where("userId", "==", auth.uid)` as normal user -> PERMISSION_DENIED.
8. **Malicious Giant String (Denial of Wallet)**:
   `POST /bookVisits/visit_overflow` with a 2MB `fullName` string -> PERMISSION_DENIED.
9. **Tampering with Terminal Booking Status**:
   `PATCH /bookVisits/visit_123` modifying `status: "completed"` by standard user -> PERMISSION_DENIED.
10. **Foreign User Deleting Another User's Favorite**:
    `DELETE /users/user_victim/favorites/prop_01` by `user_attacker` -> PERMISSION_DENIED.
11. **Spoofed Admin Email without Verification**:
    `GET /bookVisits` with email `shreyashivpeth@gmail.com` but `email_verified: false` -> PERMISSION_DENIED.
12. **Writing to Unmapped Arbitrary Collection**:
    `POST /secret_internal_logs/log1` -> PERMISSION_DENIED by global default-deny rule.
