import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Briefcase,
  MessageSquare,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Property } from '../types';
import { COMPANY_DETAILS } from '../data/properties';

export interface BookVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
}

export interface BookingSubmissionSummary {
  fullName: string;
  phone: string;
  email?: string;
  advisoryDomain: string;
  visitDate: string;
  visitTime: string;
  notes?: string;
  whatsappUrl: string;
  submittedAt: string;
}

const PROPERTY_OPTIONS = [
  'PROPERTY 01 (5 Acres • ₹18 Lakh/Acre • Total: ₹90 Lakh • 32 KM from Nagpur)',
  'PROPERTY 02 (6.67 Acres • Lake Touch 🌊 • ₹19 Lakh/Acre • Total: ₹1.2663 Cr • 60 KM)',
  'PROPERTY 03 (1.75 Acres • ₹25 Lakh/Acre • Total: ₹43.75 Lakh • 32 KM from Nagpur)',
  'PROPERTY 04 (Flexible Land Availability • ₹28 Lakh/Acre • 30 KM from Nagpur)',
  'PROPERTY 05 (2.92 Acres • ₹32 Lakh/Acre • Total: ₹93.44 Lakh • 57 KM from Nagpur)',
  'PROPERTY 06 (1.75 Acres • Highway Touch 🛣️ • Total: ₹1.80 Cr • Near Saoner Road)',
  'PROPERTY 07 (1.75 Acres • ₹24 Lakh/Acre • Total: ₹42 Lakh • 30 KM from Nagpur)',
  'All 7 Land Holdings Portfolio Review with Aditya Shivpeth',
  'Custom Land Demarcation & Acquisition Mandate (+91 87677 82263)',
];

export const BookVisitModal: React.FC<BookVisitModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [advisoryDomain, setAdvisoryDomain] = useState(PROPERTY_OPTIONS[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [notes, setNotes] = useState('');

  // Sync selectedProperty when opening
  useEffect(() => {
    if (selectedProperty) {
      const match = PROPERTY_OPTIONS.find((opt) =>
        opt.includes(`PROPERTY ${selectedProperty.propertyNumber}`)
      );
      if (match) {
        setAdvisoryDomain(match);
      }
    }
  }, [selectedProperty, isOpen]);

  // UI state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<BookingSubmissionSummary | null>(null);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

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

  // Reset modal state when reopening
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen]);

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

  const constructWhatsAppMessage = () => {
    const lines = [
      `*Nagpur Acres — VIP Site Visit & Consultation Request*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 *Client Name:* ${fullName.trim()}`,
      `📱 *Contact Phone:* ${phone.trim()}`,
      email.trim() ? `📧 *Email:* ${email.trim()}` : null,
      `🏛️ *Advisory Domain:* ${advisoryDomain}`,
      `📅 *Preferred Date:* ${formatDisplayDate(selectedDate)}`,
      `⏰ *Preferred Time:* ${finalTime}`,
      notes.trim() ? `📝 *Client Brief:* ${notes.trim()}` : null,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📍 Direct booking via Nagpur Acres website`,
      `Direct Contact: ${COMPANY_DETAILS.founder} (${COMPANY_DETAILS.phoneDisplay})`,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const messageText = constructWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(messageText)}`;

    // Store submission summary
    setLastSubmission({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      advisoryDomain,
      visitDate: selectedDate,
      visitTime: finalTime,
      notes: notes.trim(),
      whatsappUrl,
      submittedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    });

    setIsSubmitted(true);

    // Open WhatsApp directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setNotes('');
  };

  const timeSlots = [
    '10:30 AM (Morning Slot)',
    '01:00 PM (Afternoon Slot)',
    '04:00 PM (Tea & Advisory Slot)',
    '06:00 PM (Evening Slot)',
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
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                <MessageSquare className="w-3 h-3" />
                WhatsApp Direct Booking ({COMPANY_DETAILS.phoneDisplay})
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {COMPANY_DETAILS.founder} Advisory
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#002347] tracking-tight">
              {isSubmitted ? 'Visit Request Dispatched' : 'Book VIP Site Visit / Meeting'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct connection with <strong className="text-[#002347]">{COMPANY_DETAILS.founder}</strong> on WhatsApp.
            </p>
          </div>

          <button
            id="close-booking-modal-button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 pt-5 max-h-[76vh] overflow-y-auto">
          {/* 1. CONSULTATION FORM */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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

              {/* Consultation Area / Advisory Domain */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5">
                  4. Advisory Domain / Area of Interest <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    id="booking-property-name"
                    value={advisoryDomain}
                    onChange={(e) => setAdvisoryDomain(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors appearance-none cursor-pointer"
                  >
                    {PROPERTY_OPTIONS.map((domain) => (
                      <option key={domain} value={domain} className="bg-white text-slate-800">
                        {domain}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5">
                  5. Preferred Consultation Date <span className="text-red-500">*</span>
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
                    {useCustomTime ? 'Use standard slots' : 'Enter specific time'}
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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  id="submit-book-visit-btn"
                  type="submit"
                  disabled={!fullName.trim() || !phone.trim()}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Site Visit Request via WhatsApp ({COMPANY_DETAILS.phoneDisplay})</span>
                </button>
              </div>
            </form>
          ) : (
            /* 2. CONFIRMATION VIEW */
            lastSubmission && (
              <div className="py-4 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                    Directed to WhatsApp ({COMPANY_DETAILS.phoneDisplay})
                  </span>
                  <h4 className="text-2xl font-serif-luxury font-bold text-[#002347]">
                    Visit Details Prepared!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                    Thank you, <strong className="text-[#002347]">{lastSubmission.fullName}</strong>. Your consultation brief has been forwarded directly to <strong className="text-[#002347]">{COMPANY_DETAILS.founder}</strong> on WhatsApp.
                  </p>
                </div>

                {/* Booking Summary Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      Recipient
                    </span>
                    <span className="font-bold text-[#002347]">
                      {COMPANY_DETAILS.founder} ({COMPANY_DETAILS.phoneDisplay})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Domain</span>
                      <strong className="text-slate-900">{lastSubmission.advisoryDomain}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Client Phone</span>
                      <strong className="text-slate-900">{lastSubmission.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Requested Date</span>
                      <strong className="text-slate-900">{formatDisplayDate(lastSubmission.visitDate)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Requested Time</span>
                      <strong className="text-slate-900">{lastSubmission.visitTime}</strong>
                    </div>
                  </div>

                  {lastSubmission.notes && (
                    <div className="pt-2 border-t border-slate-200 text-slate-600 text-[11px]">
                      <span className="text-slate-500 block text-[10px] uppercase">Brief Requirements</span>
                      {lastSubmission.notes}
                    </div>
                  )}
                </div>

                {/* Direct Action: Re-open WhatsApp in case browser popup was blocked */}
                <div className="pt-1 space-y-2.5 max-w-md mx-auto">
                  <a
                    href={lastSubmission.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in WhatsApp (+91 87677 82263)</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#002347] font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Schedule Another Visit / Inquiry</span>
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-slate-500 hover:text-[#002347] font-medium transition-colors cursor-pointer"
                  >
                    Back to Website
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
