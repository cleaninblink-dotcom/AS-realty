import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Database,
  Loader2,
  AlertCircle,
  ListFilter,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Check,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Property } from '../types';
import { COMPANY_DETAILS } from '../data/properties';
import { useAuth } from '../context/AuthContext';
import {
  createFirestoreBookVisit,
  subscribeUserBookVisits,
  subscribeAllBookVisits,
  updateFirestoreVisitStatus,
  cancelFirestoreBookVisit,
  FirestoreBookVisit,
} from '../lib/firestore-service';
import { saveBookVisit, BookVisitRecord } from '../lib/supabase';

export interface BookVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPropertyName?: string;
  properties: Property[];
  initialTab?: 'form' | 'list';
}

export const BookVisitModal: React.FC<BookVisitModalProps> = ({
  isOpen,
  onClose,
  selectedPropertyName,
  properties,
  initialTab = 'form',
}) => {
  const { user, userProfile, isAdmin, signInWithGoogle } = useAuth();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyName, setPropertyName] = useState(selectedPropertyName || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [notes, setNotes] = useState('');

  // UI state
  const [viewMode, setViewMode] = useState<'form' | 'confirmed' | 'list'>(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<FirestoreBookVisit | BookVisitRecord | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Bookings list state
  const [bookingsList, setBookingsList] = useState<FirestoreBookVisit[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [adminViewAll, setAdminViewAll] = useState(false);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (!fullName && (user.displayName || userProfile?.displayName)) {
        setFullName(user.displayName || userProfile?.displayName || '');
      }
      if (!email && user.email) {
        setEmail(user.email);
      }
      if (!phone && userProfile?.phone) {
        setPhone(userProfile.phone);
      }
    }
  }, [user, userProfile]);

  // Sync selectedPropertyName when modal opens or property changes
  useEffect(() => {
    if (selectedPropertyName) {
      setPropertyName(selectedPropertyName);
    } else if (properties.length > 0 && !propertyName) {
      setPropertyName(properties[0].name || properties[0].title);
    }
  }, [selectedPropertyName, properties]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset or load initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setViewMode(initialTab);
      setConfirmedBooking(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialTab]);

  // Subscribe to bookings from Firestore in real-time
  useEffect(() => {
    if (!isOpen || viewMode !== 'list') return;

    setIsLoadingBookings(true);

    let unsubscribe: (() => void) | null = null;

    if (isAdmin && adminViewAll) {
      unsubscribe = subscribeAllBookVisits(
        (visits) => {
          setBookingsList(visits);
          setIsLoadingBookings(false);
        },
        () => setIsLoadingBookings(false)
      );
    } else if (user) {
      unsubscribe = subscribeUserBookVisits(
        user.uid,
        (visits) => {
          setBookingsList(visits);
          setIsLoadingBookings(false);
        },
        () => setIsLoadingBookings(false)
      );
    } else {
      setIsLoadingBookings(false);
      setBookingsList([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen, viewMode, user, isAdmin, adminViewAll]);

  if (!isOpen) return null;

  const finalTime = useCustomTime ? customTime || '11:00 AM' : selectedTime;

  // Format date nicely
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Pending Selection';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleGoogleQuickSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !propertyName) return;

    setIsSubmitting(true);

    try {
      if (user) {
        // Save to Firestore with verified User UID
        const firestoreRecord = await createFirestoreBookVisit({
          userId: user.uid,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || user.email || undefined,
          propertyName,
          visitDate: selectedDate,
          visitTime: finalTime,
          visitType: 'Private Site Visit',
          notes: notes.trim() || undefined,
        });

        // Also dual-sync to Supabase table in background
        saveBookVisit({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          propertyName,
          visitDate: selectedDate,
          visitTime: finalTime,
          notes: notes.trim(),
        }).catch(() => {});

        setConfirmedBooking(firestoreRecord);
        setSyncStatus('Stored in Firestore (Protected by Firebase Security Rules)');
      } else {
        // Fallback: save to Supabase
        const result = await saveBookVisit({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          propertyName,
          visitDate: selectedDate,
          visitTime: finalTime,
          notes: notes.trim(),
        });

        setConfirmedBooking(result.data);
        setSyncStatus('Stored in Supabase Database');
      }

      setViewMode('confirmed');
    } catch (err: any) {
      console.error('Booking submission error:', err);
      alert('An error occurred while saving your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (visitId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateFirestoreVisitStatus(visitId, status);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCancelBooking = async (visitId: string) => {
    if (!window.confirm('Are you sure you want to cancel this site visit request?')) return;
    try {
      await cancelFirestoreBookVisit(visitId);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const timeSlots = [
    '10:30 AM (Morning Slot)',
    '01:00 PM (Afternoon Slot)',
    '04:00 PM (Tea & Sunset Slot)',
    '06:00 PM (Evening Twilight)',
  ];

  return (
    <div
      id="book-visit-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#001730]/75 backdrop-blur-md transition-all duration-300 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="book-visit-modal-container"
        className="relative w-full max-w-xl my-6 bg-white border border-slate-200 border-b-4 border-b-[#002347] rounded-2xl shadow-2xl text-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Gold Metallic Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#9E7D3B] via-[#E5C378] to-[#9E7D3B]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-7 pb-4 flex items-start justify-between border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#002347] text-[#E6C687] border border-[#C5A059]/40 uppercase tracking-widest">
                <Database className="w-3 h-3 text-[#C5A059]" />
                Firebase + Firestore
              </span>
              {user ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  Authenticated: {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-500 bg-slate-200/80">
                  Guest Mode
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#002347] tracking-tight">
              {viewMode === 'list'
                ? 'Site Visit Appointments'
                : 'Schedule a VIP Site Visit'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct booking captured securely with Firestore for <strong className="text-[#002347]">{COMPANY_DETAILS.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-1">
            {/* View Bookings / Switch Tab Button */}
            {viewMode !== 'list' ? (
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="View captured bookings"
              >
                <ListFilter className="w-3.5 h-3.5 text-[#002347]" />
                <span className="hidden sm:inline">My Bookings</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode('form')}
                className="px-2.5 py-1.5 rounded-lg bg-[#002347] hover:bg-[#001730] text-[11px] font-semibold text-[#E6C687] transition-colors flex items-center gap-1 cursor-pointer"
                title="Book another visit"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Booking</span>
              </button>
            )}

            <button
              id="close-booking-modal-button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 pt-5 max-h-[76vh] overflow-y-auto">
          {/* 1. BOOKING FORM VIEW */}
          {viewMode === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Optional Quick Sign-in Banner if Not Authenticated */}
              {!user && (
                <div className="p-3.5 rounded-xl bg-[#002347] border border-[#C5A059]/40 text-white flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#E6C687] shrink-0" />
                    <div>
                      <h5 className="font-bold text-xs text-[#E6C687]">Sign In with Google</h5>
                      <p className="text-[11px] text-slate-300">
                        Connect your account to auto-fill details & track appointments live in Firestore.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleQuickSignIn}
                    disabled={isSigningIn}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isSigningIn ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {/* Client Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5">
                  1. Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="booking-client-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Agrawal"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                  />
                </div>
              </div>

              {/* Phone and Email in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5">
                    2. Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="booking-client-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5">
                    3. Email <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="booking-client-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Selected Property Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5">
                  4. Select Property for Site Visit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <select
                    id="booking-property-name"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors appearance-none cursor-pointer"
                  >
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.name || prop.title} className="bg-white text-slate-800">
                        {prop.name || prop.title} — {prop.location} ({prop.price})
                      </option>
                    ))}
                    <option value="General Luxury Portfolio Consultation" className="bg-white text-slate-800">
                      General Luxury Portfolio Consultation (Custom Tour)
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5">
                  5. Preferred Visit Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="booking-selected-date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#002347]">
                    6. Preferred Time Slot <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomTime(!useCustomTime)}
                    className="text-xs text-[#9E7D3B] hover:text-[#002347] underline font-medium transition-colors cursor-pointer"
                  >
                    {useCustomTime ? 'Use recommended slots' : 'Enter specific time'}
                  </button>
                </div>

                {!useCustomTime ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`flex items-center gap-2 p-2.5 sm:p-3 text-left rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#002347] border-[#002347] text-[#E6C687] shadow-sm'
                              : 'bg-[#F8F9FA] border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E6C687]' : 'text-slate-400'}`} />
                          <span className="truncate">{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 03:30 PM (or specific hour)"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>
                )}
              </div>

              {/* Special Requirements / Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5">
                  7. Special Requirements / Notes <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Prefer East-facing unit, need parking space inspection, or weekend arrival."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Database Storage Notice */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-600">
                <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Persisted with real-time sync across <strong>Cloud Firestore</strong> and <strong>Supabase</strong>.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  id="submit-book-visit-btn"
                  type="submit"
                  disabled={isSubmitting || !fullName.trim() || !phone.trim()}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#002347] via-[#003366] to-[#002347] hover:from-[#001730] hover:to-[#002347] text-[#E6C687] font-bold text-xs uppercase tracking-wider border border-[#C5A059]/40 shadow-lg shadow-[#002347]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#E6C687]" />
                      <span>Saving Booking to Database...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-[#C5A059]" />
                      <span>Confirm Site Visit Booking</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 2. CONFIRMATION VIEW */}
          {viewMode === 'confirmed' && confirmedBooking && (
            <div className="py-4 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                  <Database className="w-3 h-3" />
                  Database Booking Confirmed
                </span>
                <h4 className="text-2xl font-serif-luxury font-bold text-[#002347]">
                  Site Visit Scheduled!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Thank you, <strong className="text-[#002347]">{confirmedBooking.fullName}</strong>. Your visit details have been registered in the database.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                    Booking Reference
                  </span>
                  <span className="font-mono font-bold text-[#002347]">
                    {confirmedBooking.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Property</span>
                    <strong className="text-slate-900">{confirmedBooking.propertyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Client Phone</span>
                    <strong className="text-slate-900">{confirmedBooking.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Visit Date</span>
                    <strong className="text-slate-900">{formatDisplayDate(confirmedBooking.visitDate)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Time Slot</span>
                    <strong className="text-slate-900">{confirmedBooking.visitTime}</strong>
                  </div>
                </div>

                {confirmedBooking.notes && (
                  <div className="pt-2 border-t border-slate-200 text-slate-600 text-[11px]">
                    <span className="text-slate-500 block text-[10px] uppercase">Notes</span>
                    {confirmedBooking.notes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Persistence Status:</span>
                  <span className="font-medium text-emerald-700">{syncStatus}</span>
                </div>
              </div>

              {/* Status Note */}
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Our luxury relationship desk will reach out to you at <strong className="text-slate-800">{confirmedBooking.phone}</strong> to confirm gate clearance and property manager escort.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#002347] hover:bg-[#001730] text-[#E6C687] font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  View All Bookings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('form');
                    setConfirmedBooking(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#002347] font-bold text-xs uppercase tracking-wider transition-all border border-slate-200"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Book Another Visit
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-[#002347] font-medium transition-colors"
                >
                  Back to Property Catalog
                </button>
              </div>
            </div>
          )}

          {/* 3. BOOKINGS LIST / DB RECORDS VIEW */}
          {viewMode === 'list' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#002347]">
                    <Database className="w-4 h-4 text-emerald-600" />
                    Firestore Collection: <code className="font-mono text-slate-800">/bookVisits</code>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {user
                      ? `Live real-time subscription for ${user.displayName || user.email}`
                      : 'Please sign in with Google to view your personalized bookings'}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setAdminViewAll(!adminViewAll)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                      adminViewAll
                        ? 'bg-[#C5A059] text-[#002347]'
                        : 'bg-[#002347] text-[#E6C687]'
                    }`}
                  >
                    {adminViewAll ? 'Showing All (Admin)' : 'Show All Clients'}
                  </button>
                )}
              </div>

              {/* If not authenticated in list view */}
              {!user ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl p-6 space-y-3">
                  <User className="w-8 h-8 text-slate-400 mx-auto" />
                  <h5 className="font-bold text-slate-800 text-sm">Sign in to view your bookings</h5>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Sign in with your Google account to access your live site visit appointments and manage requests.
                  </p>
                  <button
                    type="button"
                    onClick={handleGoogleQuickSignIn}
                    disabled={isSigningIn}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002347] text-[#E6C687] font-bold text-xs uppercase tracking-wider"
                  >
                    {isSigningIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>Sign In with Google</span>
                  </button>
                </div>
              ) : isLoadingBookings ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#002347]" />
                  <span className="text-xs font-medium">Fetching real-time appointments from Firestore...</span>
                </div>
              ) : bookingsList.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl p-6">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-700 text-sm">No Bookings Recorded Yet</h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Schedule a site visit to view your upcoming property appointments here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('form')}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#002347] text-[#E6C687] font-bold text-xs uppercase tracking-wider"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Create First Booking
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>
                      {bookingsList.length} appointment{bookingsList.length > 1 ? 's' : ''} recorded
                    </span>
                    <span className="text-emerald-600 font-medium text-[11px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync Active
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                    {bookingsList.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#F8F9FA] hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <strong className="text-sm font-bold text-[#002347]">
                            {item.fullName}
                          </strong>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                item.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : item.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                                  : item.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              {item.status.toUpperCase()}
                            </span>

                            {/* Client Cancel Action */}
                            {item.status === 'pending' && item.userId === user?.uid && (
                              <button
                                type="button"
                                onClick={() => handleCancelBooking(item.id)}
                                className="text-[10px] text-red-600 hover:underline font-medium"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600 text-[11px] mb-2">
                          <div>
                            <span className="text-slate-400">Property: </span>
                            <span className="font-semibold text-slate-800">{item.propertyName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Phone: </span>
                            <span className="font-semibold text-slate-800">{item.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Date: </span>
                            <span className="font-medium text-slate-700">{formatDisplayDate(item.visitDate)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Time: </span>
                            <span className="font-medium text-slate-700">{item.visitTime}</span>
                          </div>
                        </div>

                        {item.notes && (
                          <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 text-[11px] italic mb-1.5">
                            "{item.notes}"
                          </div>
                        )}

                        {/* Admin Status Controls */}
                        {isAdmin && (
                          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase font-bold text-[#002347]">Admin Status:</span>
                            <div className="flex items-center gap-1">
                              {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleUpdateStatus(item.id, st)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                    item.status === st
                                      ? 'bg-[#002347] text-[#E6C687]'
                                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 mt-1.5">
                          <span className="font-mono">{item.id}</span>
                          <span>
                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className="px-5 py-2.5 rounded-xl bg-[#002347] text-[#E6C687] font-bold text-xs uppercase tracking-wider"
                >
                  Back to Booking Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
