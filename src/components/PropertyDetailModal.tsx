import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Check,
  ShieldCheck,
  Calendar,
  Maximize2,
  Sparkles,
  Trees,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageSquare,
  CheckCircle2,
  Phone,
  Waves,
  Route,
  Layers,
  IndianRupee,
} from 'lucide-react';
import { Property } from '../types';
import { COMPANY_DETAILS, getPropertyWhatsAppUrl } from '../data/properties';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookNow: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBookNow,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (property) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [property]);

  // Reset active image when property changes
  useEffect(() => {
    setActiveImageIndex(0);
    setCopiedShare(false);
  }, [property?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!property) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [property, activeImageIndex]);

  if (!property) return null;

  const allImages = [
    property.imageUrl || property.heroImage,
    ...(property.gallery || []),
  ].filter(Boolean);

  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const propertyName = property.name || property.title;
  const whatsappUrl = getPropertyWhatsAppUrl(property);

  const handleShare = async () => {
    const shareData = {
      title: `${propertyName} - ${COMPANY_DETAILS.name}`,
      text: `${propertyName}: ${property.ratePerAcre} • Total Land: ${property.totalLand} (${property.location}) by ${COMPANY_DETAILS.name}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Ignored
    }
  };

  const isLakeTouch = property.specialFeature?.includes('Lake');
  const isHighwayTouch = property.specialFeature?.includes('Highway');
  const isFlexible = property.specialFeature?.includes('Flexible');

  return (
    <div
      id="property-detail-modal-overlay"
      className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-[#001730]/75 backdrop-blur-sm sm:backdrop-blur-md transition-all duration-200 overflow-hidden sm:p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="property-detail-modal-content"
        className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-4xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-slate-200 sm:border-b-4 sm:border-b-[#002347] text-slate-800 animate-fadeIn"
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#9E7D3B] via-[#E5C378] to-[#9E7D3B] shrink-0" />

        {/* Sticky Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 shrink-0 shadow-xs">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 -ml-1 rounded-xl bg-slate-100 hover:bg-[#002347] hover:text-[#E6C687] text-[#002347] font-semibold text-xs transition-all cursor-pointer active:scale-95"
            aria-label="Back to properties list"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold">Back</span>
          </button>

          <div className="min-w-0 text-center px-2 flex-1">
            <h2 className="text-xs sm:text-sm font-serif-luxury font-bold text-[#002347] truncate">
              {property.name} — {property.totalLand}
            </h2>
            <p className="text-[11px] text-slate-500 truncate flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
              <span>{property.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#002347] transition-colors relative cursor-pointer"
              aria-label="Share property link"
              title="Share Property"
            >
              {copiedShare ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              aria-label="Close property details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-24 sm:pb-6">
          {/* Main Visual Carousel (100% clean photo, no overlaid text) */}
          <div className="relative bg-slate-900 aspect-[16/10] sm:aspect-[21/9] overflow-hidden select-none">
            <img
              src={allImages[activeImageIndex] || property.imageUrl}
              alt={`${propertyName} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Image Navigation Controls */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Visual Image Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === activeImageIndex ? 'w-5 bg-[#E6C687]' : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                      aria-label={`Jump to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Detailed Content */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Clean Property Overview Header (Below image) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#002347] text-[#E6C687] border border-[#C5A059]/40 shadow-xs">
                    {property.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {property.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {property.type}
                  </span>
                  {property.specialFeature && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {property.specialFeature}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#002347]">
                  {property.name}
                </h1>
                <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{property.location}</span>
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block font-bold">
                  Rate / Outlay
                </span>
                <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#002347] block">
                  {property.ratePerAcre}
                </span>
                <span className="text-xs text-slate-600 font-semibold block">
                  Total: {property.totalPrice}
                </span>
              </div>
            </div>
            {/* The 4-Box Key Specification Cards */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Official Land Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. Total Land Area */}
                <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Total Land
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#002347] mt-1">
                    {isLakeTouch ? (
                      <Waves className="w-4 h-4 text-cyan-600 shrink-0" />
                    ) : isHighwayTouch ? (
                      <Route className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : isFlexible ? (
                      <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                    ) : (
                      <Trees className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate">{property.totalLand}</span>
                  </div>
                </div>

                {/* 2. Total Price */}
                <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Total Price
                  </span>
                  <span className="font-serif-luxury font-bold text-sm sm:text-base text-[#002347] block mt-1 truncate">
                    {property.totalPrice}
                  </span>
                </div>

                {/* 3. Rate / Acre */}
                <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Price / Acre
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block mt-1 truncate">
                    {property.ratePerAcre}
                  </span>
                </div>

                {/* 4. Road Access */}
                <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Road Access
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-slate-800 block mt-1 truncate">
                    {property.roadAccess || 'Direct Access'}
                  </span>
                </div>

                {/* 5. Water Source */}
                <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Water
                  </span>
                  <span className={`font-bold text-xs sm:text-sm block mt-1 truncate ${
                    property.waterSource === 'Yes' ? 'text-emerald-700' : property.waterSource === 'Nearby' ? 'text-cyan-700' : 'text-slate-600'
                  }`}>
                    {property.waterSource === 'Yes' ? '💧 Available' : property.waterSource === 'Nearby' ? '🌊 Nearby' : 'No'}
                  </span>
                </div>

                {/* 6. Distance from Nagpur */}
                <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block truncate">
                    Distance from Nagpur
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-[#002347] block mt-1 truncate">
                    {property.distanceKm} KM from Nagpur
                  </span>
                </div>
              </div>
            </div>

            {/* Clear Title / Due Diligence Callout */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#002347] block text-sm">
                    Verified Revenue Land Title (7/12 &amp; 8A Clear)
                  </span>
                  <span className="text-slate-600 font-mono text-[11px]">
                    Audited by Aditya Shivpeth • Reference: {property.reraId}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-emerald-800 bg-white border border-emerald-300 px-3 py-1 rounded-full font-bold text-[11px] self-start sm:self-auto">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Clear Legal Title
              </span>
            </div>

            {/* Narrative Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                Parcel Overview
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-2.5">
                Key Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.features?.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F8F9FA] border border-slate-200 text-xs text-slate-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Connect Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#002347] border border-[#C5A059]/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="font-serif-luxury font-bold text-base text-[#E6C687]">
                  Connect with {COMPANY_DETAILS.founder}
                </h5>
                <p className="text-xs text-slate-300 mt-0.5">
                  Founder &amp; Managing Director, {COMPANY_DETAILS.name} • Direct WhatsApp: {COMPANY_DETAILS.phoneDisplay}
                </p>
              </div>

              <a
                href={`tel:${COMPANY_DETAILS.phoneDisplay.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#E6C687]" />
                <span>Call {COMPANY_DETAILS.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-2xl">
          <div className="w-full sm:w-auto flex items-center justify-between sm:block">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">
                Rate / Outlay
              </span>
              <span className="text-base sm:text-lg font-serif-luxury font-bold text-[#002347]">
                {property.ratePerAcre}
              </span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-[#002347] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>

            <button
              id={`detail-book-now-${property.id}`}
              type="button"
              onClick={() => {
                onClose();
                onBookNow(property);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E6C687] text-[#002347] font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Site Visit</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
