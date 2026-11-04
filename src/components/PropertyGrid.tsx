import React, { useState, useMemo } from 'react';
import { Property, FilterState } from '../types';
import { PropertyCard } from './PropertyCard';
import { COMPANY_DETAILS } from '../data/properties';
import {
  SlidersHorizontal,
  MapPin,
  IndianRupee,
  Search,
  RefreshCcw,
  Sparkles,
  Waves,
  Route,
  Layers,
  Trees,
} from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  onBookNow: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  onBookNow,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'lake' | 'highway' | 'flexible' | 'near'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Tab filter
      if (activeTab === 'lake' && !prop.specialFeature?.includes('Lake')) return false;
      if (activeTab === 'highway' && !prop.specialFeature?.includes('Highway')) return false;
      if (activeTab === 'flexible' && !prop.specialFeature?.includes('Flexible')) return false;
      if (activeTab === 'near' && prop.distanceKm > 35) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = prop.name.toLowerCase().includes(q);
        const matchesNumber = prop.propertyNumber.toLowerCase().includes(q);
        const matchesLocation = prop.location.toLowerCase().includes(q);
        const matchesType = prop.type.toLowerCase().includes(q);
        const matchesFeature = (prop.specialFeature || '').toLowerCase().includes(q);
        const matchesPrice = prop.ratePerAcre.toLowerCase().includes(q) || prop.totalPrice.toLowerCase().includes(q);

        if (!matchesName && !matchesNumber && !matchesLocation && !matchesType && !matchesFeature && !matchesPrice) {
          return false;
        }
      }

      return true;
    });
  }, [properties, activeTab, searchQuery]);

  return (
    <section id="properties-section" className="py-20 bg-[#F8F9FA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-[#C5A059]" />
              <span className="text-xs uppercase tracking-widest text-[#002347] font-bold">
                Nagpur Acres • Verified Land Holdings
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#002347] tracking-tight">
              Featured Land &amp; Farmhouse Portfolio
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl">
              Complete collection of 7 legally vetted agricultural holdings, lake-touch parcels, highway-frontage plots, and customizable acreage near Nagpur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-[#002347] font-bold">{filteredProperties.length}</strong> of {properties.length} Available Properties
            </span>
            {(activeTab !== 'all' || searchQuery.trim()) && (
              <button
                id="reset-properties-filter-btn"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[#002347] text-xs hover:border-[#C5A059] transition-colors shadow-xs cursor-pointer"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Tabs & Search Bar */}
        <div className="p-4 sm:p-5 mb-8 rounded-2xl bg-white border border-slate-200 border-b-4 border-b-[#002347] shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Quick Tab Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#002347] text-[#E6C687] shadow-sm'
                  : 'bg-[#F8F9FA] text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All 7 Properties
            </button>

            <button
              onClick={() => setActiveTab('lake')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'lake'
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'bg-[#F8F9FA] text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Lake Touch 🌊 (02)</span>
            </button>

            <button
              onClick={() => setActiveTab('highway')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'highway'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-[#F8F9FA] text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>Highway Touch 🛣️ (06)</span>
            </button>

            <button
              onClick={() => setActiveTab('flexible')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'flexible'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-[#F8F9FA] text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flexible Area (04)</span>
            </button>

            <button
              onClick={() => setActiveTab('near')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'near'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-[#F8F9FA] text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>≤ 32 KM Distance</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 01, Saoner, Lake..."
              className="w-full pl-9 pr-8 py-2.5 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBookNow={onBookNow}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
            <SlidersHorizontal className="w-12 h-12 text-[#C5A059] mx-auto mb-4 opacity-70" />
            <h3 className="text-xl font-serif-luxury font-bold text-[#002347] mb-2">
              No matching land property found
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Contact {COMPANY_DETAILS.founder} directly on WhatsApp for customized land acquisition mandates across Nagpur district.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#002347] text-[#E6C687] font-bold text-xs uppercase tracking-wider hover:bg-[#001730] transition-all cursor-pointer"
            >
              View All 7 Properties
            </button>
          </div>
        )}

        {/* WhatsApp Advisory Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-[#002347] border border-[#C5A059]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#C5A059]/20 text-[#E6C687] border border-[#C5A059]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Founder WhatsApp Channel
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              Interested in a private site walkthrough for any of these parcels?
            </h3>
            <p className="text-sm text-slate-200 max-w-xl">
              Connect directly with {COMPANY_DETAILS.founder} at {COMPANY_DETAILS.phoneDisplay} to schedule on-ground inspections, inspect revenue 7/12 land records, and discuss price negotiations.
            </p>
          </div>

          <a
            href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent('Hello Aditya Shivpeth, I would like to schedule a site visit to inspect land properties near Nagpur.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
          >
            Direct WhatsApp (+91 87677 82263)
          </a>
        </div>
      </div>
    </section>
  );
};
