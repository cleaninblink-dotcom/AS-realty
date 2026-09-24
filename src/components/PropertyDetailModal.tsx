import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Check,
  ShieldCheck,
  Calendar,
  BedDouble,
  Maximize2,
  Bath,
  Compass,
  Sparkles,
  Trees,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageSquare,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { Property } from '../types';
import { COMPANY_DETAILS } from '../data/properties';

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

  // Prevent background body scrolling when modal is open on mobile and desktop
  useEffect(() => {
    if (property) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
      };
    }
  }, [property]);

  // Reset active image when property changes
  useEffect(() => {
    setActiveImageIndex(0);
    setCopiedShare(false);
  }, [property?.id]);

  // Keyboard navigation: Escape to close, Left/Right arrows to cycle pictures
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

  const bhkLower = (property.bhk || '').toLowerCase();
  const typeLower = (property.type || '').toLowerCase();
  const isFarm =
    bhkLower.includes('farm') ||
    bhkLower.includes('field') ||
    typeLower.includes('farm') ||
    typeLower.includes('field') ||
    typeLower.includes('agro') ||
    typeLower.includes('agri');
  const isPlot =
    !isFarm &&
    (bhkLower.includes('plot') || typeLower.includes('plot') || typeLower.includes('land'));

  const allImages = [
    property.imageUrl || property.heroImage,
    ...(property.gallery || []),
  ]
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);

  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const propertyName = property.name || property.title;
  const directWhatsAppInquiryUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(
    `Hello Amit Shivpeth (AS Realty), I am interested in details and scheduling a VIP site visit for ${propertyName} (${property.location}, Nagpur - ${property.price}). Please share brochure and available time slots.`
  )}`;

  const handleShare = async () => {
    const shareData = {
      title: `${propertyName} - AS Realty Nagpur`,
      text: `Discover ${propertyName} in ${property.location}, Nagpur. Curated by AS Realty (${COMPANY_DETAILS.founder}). Price: ${property.price}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard if cancelled or failed
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

  return (
    <div
      id="property-detail-modal-overlay"
      className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-[#001730]/75 backdrop-blur-sm sm:backdrop-blur-md transition-all duration-200 overflow-hidden sm:p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 
        Container:
        - Mobile: Fullscreen 100dvh, flex-col, zero trapped scrollbars, high stability
        - Desktop: Elegant centered luxury card max-w-4xl, rounded-2xl, max-h-[92vh]
      */}
      <div
        id="property-detail-modal-content"
        className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-4xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-slate-200 sm:border-b-4 sm:border-b-[#002347] text-slate-800 animate-fadeIn"
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-[#9E7D3B] via-[#E5C378] to-[#9E7D3B] shrink-0" />

        {/* 
          Sticky Top Navigation Bar:
          Critical for mobile friendliness so users can always navigate back or close
        */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 shrink-0 shadow-xs">
          {/* Back button with high-contrast touch target */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 -ml-1 rounded-xl bg-slate-100 hover:bg-[#002347] hover:text-[#E6C687] text-[#002347] font-semibold text-xs transition-all cursor-pointer active:scale-95"
            aria-label="Back to properties list"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold">Back</span>
          </button>

          {/* Center property breadcrumb / title */}
          <div className="min-w-0 text-center px-2 flex-1">
            <h2 className="text-xs sm:text-sm font-serif-luxury font-bold text-[#002347] truncate">
              {propertyName}
            </h2>
            <p className="text-[11px] text-slate-500 truncate flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
              <span>{property.location}, Nagpur</span>
            </p>
          </div>

          {/* Action buttons (Share & Close) */}
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
              {copiedShare && (
                <span className="absolute -bottom-8 right-0 bg-[#002347] text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link copied!
                </span>
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

        {/* 
          Main Scrollable Body Area:
          Single scroll context to eliminate jitter, jumping, or double scrollbars on mobile.
        */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-24 sm:pb-6">
          {/* Gallery / Media Section */}
          <div className="relative bg-slate-950 aspect-[16/10] sm:aspect-[21/9] overflow-hidden select-none">
            <img
              src={allImages[activeImageIndex] || property.imageUrl || property.heroImage}
              alt={`${propertyName} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Photo Counter Pill */}
            {allImages.length > 1 && (
              <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wider">
                Photo {activeImageIndex + 1} of {allImages.length}
              </div>
            )}

            {/* Prev / Next Image Navigation Buttons on Image */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer active:scale-95 z-10"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer active:scale-95 z-10"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badges on image bottom */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-2.5">
              <div className="max-w-[70%]">
                <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#C5A059] text-white tracking-wider uppercase shadow-md mb-1.5">
                  {property.type}
                </span>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-white drop-shadow-md leading-tight">
                  {propertyName}
                </h1>
                <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-200 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#E6C687] shrink-0" />
                  <span>{property.location}, Nagpur</span>
                </p>
              </div>

              <div className="text-right bg-black/50 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-2 sm:p-0 rounded-xl">
                <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-widest block font-medium">
                  Offered At
                </span>
                <span className="text-lg sm:text-2xl lg:text-3xl font-serif-luxury font-bold text-[#E6C687] whitespace-nowrap">
                  {property.price}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Thumbnails Carousel Strip */}
          {allImages.length > 1 && (
            <div className="px-4 py-2.5 bg-[#F1F5F9] border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === index
                      ? 'border-[#002347] scale-105 shadow-md ring-2 ring-[#C5A059]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${index + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Content Body */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Key Metrics / Specifications Bar (Mobile 2x2 grid, Desktop 4x1) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Key Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {/* 1. Configuration */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-[#002347] text-[#E6C687]">
                      {isFarm ? (
                        <Trees className="w-4 h-4 text-emerald-400" />
                      ) : isPlot ? (
                        <Compass className="w-4 h-4 text-[#E6C687]" />
                      ) : (
                        <BedDouble className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      Config
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#002347] truncate">
                    {property.bhk}
                  </p>
                </div>

                {/* 2. Area */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-[#002347] text-[#E6C687]">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      {isFarm ? 'Land Extent' : isPlot ? 'Plot Area' : 'Super Area'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#002347] truncate">
                    {isFarm
                      ? `${(property.sqft || 43560).toLocaleString('en-IN')} Sq.Ft. (1 Acre)`
                      : `${(property.sqft || 1500).toLocaleString('en-IN')} Sq.Ft.`}
                  </p>
                </div>

                {/* 3. Sanction / Bathrooms */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-[#002347] text-[#E6C687]">
                      {isFarm || isPlot ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Bath className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      {isFarm ? 'Land Title' : isPlot ? 'Sanction' : 'Baths'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#002347] truncate">
                    {isFarm ? 'Clear 7/12 & 8A' : isPlot ? 'NMRDA / RL Approved' : `${property.bathrooms || 3} Baths`}
                  </p>
                </div>

                {/* 4. Possession */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-[#002347] text-[#E6C687]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      Possession
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-emerald-600 truncate">
                    {property.possession || 'Ready Possession'}
                  </p>
                </div>
              </div>
            </div>

            {/* RERA & Compliance Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#002347] block text-xs sm:text-sm">
                    MahaRERA & State Title Verified
                  </span>
                  <span className="text-slate-600 font-mono text-[11px]">
                    Registration No: {property.reraId || 'P50500021489'}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 self-start sm:self-auto text-emerald-800 bg-white border border-emerald-300 px-3 py-1 rounded-full font-bold text-[11px] shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                100% Clear Title & Verified
              </span>
            </div>

            {/* Property Overview / Narrative */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                Property Overview
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {property.description ||
                  `${propertyName} is a flagship ${property.type} development in ${property.location}, Nagpur. Featuring premier connectivity, curated master planning, and direct developer advisory under AS Realty.`}
              </p>
            </div>

            {/* Features & Specifications */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-2.5">
                Key Highlights & Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  property.features || [
                    'Prime Nagpur Connectivity',
                    'MahaRERA Registered',
                    'Vastu Compliant Layouts',
                    '24/7 Security & CCTV',
                    'Underground Utilities',
                    'High Appreciation Corridor',
                  ]
                ).map((feat, idx) => (
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

            {/* Amenities & Facilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-2.5">
                Amenities & Facilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  property.amenities || [
                    'Reserved Covered Parking',
                    'Landscaped Green Parks & Walking Track',
                    'Gated Security & Intercom',
                    '100% Power Backup',
                    'Clubhouse & Fitness Zone',
                    'Rainwater Harvesting System',
                  ]
                ).map((amen, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F8F9FA] border border-slate-200 text-xs text-slate-700"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amen}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder Advisory Credibility Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#002347] border border-[#C5A059]/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-[#001730] border-2 border-[#C5A059] flex items-center justify-center font-serif-luxury font-bold text-[#E6C687] text-lg shrink-0">
                  AS
                </div>
                <div>
                  <h5 className="font-serif-luxury font-bold text-base text-[#E6C687]">
                    Amit Shivpeth’s Direct Advisory
                  </h5>
                  <p className="text-xs text-slate-300">
                    Founder & Managing Director, AS Realty • Civil Lines & Ramdaspeth, Nagpur
                  </p>
                </div>
              </div>

              <a
                href={`tel:${COMPANY_DETAILS.phoneDisplay.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#E6C687]" />
                <span>Call {COMPANY_DETAILS.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 
          Sticky Bottom Action Bar:
          Always visible on mobile & desktop so users can take immediate action without scrolling hunting!
        */}
        <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 shrink-0 shadow-2xl">
          {/* Price summary row on mobile */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:block">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">
                Starting Price
              </span>
              <span className="text-lg sm:text-xl font-serif-luxury font-bold text-[#002347]">
                {property.price}
              </span>
            </div>

            {/* Direct WhatsApp Quick Chat Icon Button on mobile */}
            <a
              href={directWhatsAppInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
              aria-label="Direct WhatsApp Chat"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Action buttons */}
          <div className="w-full sm:w-auto flex items-center gap-2 sm:gap-3">
            {/* Desktop Back button */}
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-[#002347] hover:border-[#002347] text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>

            {/* Desktop Direct WhatsApp Inquiry */}
            <a
              href={directWhatsAppInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            {/* Primary Action: Book VIP Site Visit */}
            <button
              id={`detail-book-now-${property.id}`}
              type="button"
              onClick={() => {
                onClose();
                onBookNow(property);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#002347] hover:bg-[#001730] text-[#E6C687] border border-[#C5A059]/50 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#002347]/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <span>Book VIP Site Visit</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
