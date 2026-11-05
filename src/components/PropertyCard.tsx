import React from 'react';
import {
  MapPin,
  CalendarCheck,
  Eye,
  MessageSquare,
  Trees,
  Waves,
  Route,
  Layers,
  Sparkles,
  ShieldCheck,
  Maximize2,
  IndianRupee,
} from 'lucide-react';
import { Property } from '../types';
import { getPropertyWhatsAppUrl, COMPANY_DETAILS } from '../data/properties';

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
  const isLakeTouch = property.specialFeature?.includes('Lake');
  const isHighwayTouch = property.specialFeature?.includes('Highway');
  const isFlexible = property.specialFeature?.includes('Flexible');

  return (
    <div
      id={`property-card-${property.id}`}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${property.name}`}
      onClick={() => onViewDetails(property)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(property);
        }
      }}
      className="group relative flex flex-col bg-white border border-slate-200 border-b-4 border-b-[#002347] hover:border-b-[#C5A059] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
    >
      {/* Property Image Container (Clean image with no written text) */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.imageUrl || property.heroImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Property Name & Status & Type */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-serif-luxury font-bold text-[#002347] group-hover:text-[#C5A059] transition-colors">
                {property.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {property.status}
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200 shrink-0">
              {property.type}
            </span>
          </div>

          {/* Rate Per Acre & Special Feature Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="text-lg sm:text-xl font-serif-luxury font-bold text-[#002347]">
              {property.ratePerAcre}
            </div>
            {property.specialFeature && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {property.specialFeature}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {property.subtitle}
          </p>

          {/* Exact 4-Box Key Specification Matrix */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs text-slate-700 mb-4">
            {/* 1. Total Land */}
            <div className="p-2 rounded-lg bg-white border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Total Land
              </span>
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#002347] mt-0.5">
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
            <div className="p-2 rounded-lg bg-white border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Total Price
              </span>
              <div className="flex items-center gap-1 font-serif-luxury font-bold text-sm sm:text-base text-[#002347] mt-0.5">
                <IndianRupee className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">{property.totalPrice}</span>
              </div>
            </div>

            {/* 3. Road Access */}
            <div className="p-2 rounded-lg bg-white border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Road Access
              </span>
              <span className="font-semibold text-xs text-slate-800 block truncate mt-0.5">
                {property.roadAccess || 'Direct Road'}
              </span>
            </div>

            {/* 4. Water & Zero Mile */}
            <div className="p-2 rounded-lg bg-white border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Water &amp; Distance
              </span>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mt-0.5">
                <span className={property.waterSource === 'Yes' ? 'text-emerald-700 font-bold' : property.waterSource === 'Nearby' ? 'text-cyan-700 font-bold' : 'text-slate-600'}>
                  Water: {property.waterSource || 'No'}
                </span>
                <span className="text-slate-500 text-[11px] font-normal">
                  {property.zeroMileDistance || `${property.distanceKm} km`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick bullet points */}
          <div className="space-y-1 mb-4 text-xs text-slate-600">
            {property.features?.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Direct WhatsApp Inquiry */}
          <a
            href={getPropertyWhatsAppUrl(property)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            title="Chat with Aditya Shivpeth on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* Schedule Site Visit */}
          <button
            id={`book-now-button-${property.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(property);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-[#002347] shrink-0" />
            <span>Book Visit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
