import React from 'react';
import { MapPin, BedDouble, Maximize2, ShieldCheck, Eye, MessageCircle, Sparkles, Trees, Compass } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onBookNow: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onBookNow,
  onViewDetails,
}) => {
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

  return (
    <div
      id={`property-card-${property.id}`}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${property.name || property.title}`}
      onClick={() => onViewDetails(property)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(property);
        }
      }}
      className="group relative flex flex-col bg-white border border-slate-200 border-b-4 border-b-[#002347] hover:border-b-[#C5A059] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={property.imageUrl || property.heroImage}
          alt={property.name || property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#002347]/90 text-[#E6C687] border border-[#C5A059]/40 backdrop-blur-md shadow-md">
            {property.type}
          </span>
          {property.isFeatured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A059] text-white shadow-md">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Mobile-Friendly Quick View Pill / Tap cue */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 text-white backdrop-blur-md border border-white/20 text-xs font-medium shadow-md transition-all group-hover:bg-[#002347] group-hover:text-[#E6C687]">
          <Eye className="w-3.5 h-3.5 text-[#E6C687]" />
          <span>View Property</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Title */}
          <div className="flex items-center gap-1.5 text-xs text-[#B8924B] mb-1.5 font-semibold">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{property.location}, Nagpur</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#002347] group-hover:text-[#C5A059] transition-colors line-clamp-1">
            {property.name || property.title}
          </h3>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {property.subtitle || `${property.type} in ${property.location}, Nagpur`}
          </p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl bg-[#F8F9FA] border border-slate-200/80 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              {isFarm ? (
                <Trees className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : isPlot ? (
                <Compass className="w-4 h-4 text-[#B8924B] shrink-0" />
              ) : (
                <BedDouble className="w-4 h-4 text-[#002347] shrink-0" />
              )}
              <span className="truncate font-medium">{property.bhk}</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#002347] shrink-0" />
              <span className="truncate font-medium">{property.type}</span>
            </div>
          </div>

          {/* Highlights tag pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(property.features || ['MahaRERA Registered', 'Prime Connectivity']).slice(0, 2).map((feat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 border border-slate-200 font-medium"
              >
                {feat}
              </span>
            ))}
            <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              {property.possession || 'Verified Project'}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Starting At</span>
            <span className="text-lg sm:text-xl md:text-2xl font-serif-luxury font-bold text-[#002347] truncate block">
              {property.price}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Direct Details Action */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(property);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl border border-slate-300 hover:border-[#002347] hover:bg-slate-50 text-[#002347] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              aria-label={`View full details of ${property.name || property.title}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Details</span>
            </button>

            {/* Direct WhatsApp Site Visit Booking */}
            <button
              id={`book-now-button-${property.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(property);
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-xs sm:text-sm shadow-md shadow-[#C5A059]/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-[#002347] shrink-0" />
              <span>Book Visit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
