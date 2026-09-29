import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Property } from '../types';

export interface FirestoreBookVisit {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  visitType?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVisitInput {
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  propertyName: string;
  visitDate: string;
  visitTime: string;
  visitType?: string;
  notes?: string;
}

export interface FirestoreFavorite {
  id: string;
  userId: string;
  propertyName: string;
  propertyPrice?: string;
  propertyLocation?: string;
  propertyImage?: string;
  savedAt: string;
}

/**
 * Creates a new luxury property site visit booking in Firestore
 */
export async function createFirestoreBookVisit(input: CreateVisitInput): Promise<FirestoreBookVisit> {
  const visitId = `bv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();

  const record: FirestoreBookVisit = {
    id: visitId,
    userId: input.userId,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    ...(input.email?.trim() ? { email: input.email.trim() } : {}),
    propertyName: input.propertyName.trim(),
    visitDate: input.visitDate,
    visitTime: input.visitTime,
    ...(input.visitType ? { visitType: input.visitType } : {}),
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    status: 'pending',
    createdAt: now,
  };

  const path = `bookVisits/${visitId}`;
  try {
    await setDoc(doc(db, 'bookVisits', visitId), record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Cancel a site visit booking (as client owner or admin)
 */
export async function cancelFirestoreBookVisit(visitId: string): Promise<void> {
  const path = `bookVisits/${visitId}`;
  try {
    await updateDoc(doc(db, 'bookVisits', visitId), {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Update visit booking status (reserved for admin)
 */
export async function updateFirestoreVisitStatus(
  visitId: string,
  newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<void> {
  const path = `bookVisits/${visitId}`;
  try {
    await updateDoc(doc(db, 'bookVisits', visitId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Real-time subscription to bookings for a specific user
 */
export function subscribeUserBookVisits(
  userId: string,
  onUpdate: (visits: FirestoreBookVisit[]) => void,
  onError?: (error: Error) => void
): () => void {
  const visitsCollection = collection(db, 'bookVisits');
  // Client query MUST include where("userId", "==", userId) to comply with Firestore rule
  const q = query(visitsCollection, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const results: FirestoreBookVisit[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as FirestoreBookVisit);
      });
      // Sort in-memory by createdAt descending
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(results);
    },
    (error) => {
      console.error('Subscription error on bookVisits:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, 'bookVisits');
      } catch {
        // logged
      }
    }
  );
}

/**
 * Real-time subscription to all bookings (for Admin)
 */
export function subscribeAllBookVisits(
  onUpdate: (visits: FirestoreBookVisit[]) => void,
  onError?: (error: Error) => void
): () => void {
  const visitsCollection = collection(db, 'bookVisits');

  return onSnapshot(
    visitsCollection,
    (snapshot) => {
      const results: FirestoreBookVisit[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as FirestoreBookVisit);
      });
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(results);
    },
    (error) => {
      console.error('Admin subscription error on bookVisits:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, 'bookVisits');
      } catch {
        // logged
      }
    }
  );
}

/**
 * Toggle favorite property for user in Firestore
 */
export async function toggleFirestoreFavorite(
  userId: string,
  property: Property,
  isCurrentlyFavorite: boolean
): Promise<boolean> {
  const propertyId = String(property.id);
  const path = `users/${userId}/favorites/${propertyId}`;

  if (isCurrentlyFavorite) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'favorites', propertyId));
      return false;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  } else {
    const favoriteData: FirestoreFavorite = {
      id: propertyId,
      userId,
      propertyName: property.name || property.title,
      propertyPrice: property.price,
      propertyLocation: property.location,
      propertyImage: property.imageUrl || property.heroImage,
      savedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'users', userId, 'favorites', propertyId), favoriteData);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
}

/**
 * Real-time subscription to user's saved favorites
 */
export function subscribeUserFavorites(
  userId: string,
  onUpdate: (favorites: Record<string, FirestoreFavorite>) => void,
  onError?: (error: Error) => void
): () => void {
  const path = `users/${userId}/favorites`;
  const favCollection = collection(db, 'users', userId, 'favorites');

  return onSnapshot(
    favCollection,
    (snapshot) => {
      const map: Record<string, FirestoreFavorite> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestoreFavorite;
        map[data.id] = data;
      });
      onUpdate(map);
    },
    (error) => {
      console.error('Subscription error on favorites:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // logged
      }
    }
  );
}
