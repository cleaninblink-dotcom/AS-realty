import React from 'react';
import { Property } from '../types';
import { COMPANY_DETAILS, getPropertyWhatsAppUrl } from '../data/properties';
import {
  Table,
  Sparkles,
  MapPin,
  CalendarCheck,
  Eye,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface PropertyComparisonTableProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookVisit: (property: Property) => void;
}

export const PropertyComparisonTable: React.FC<PropertyComparisonTableProps> = ({
  properties,
  onSelectProperty,
  onBookVisit,
}) => {
  return (
    <section id="comparison-section" className="py-16 sm:py-20 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#002347] border border-[#C5A059]/40 text-xs text-[#E6C687] uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
            Side-by-Side Analysis
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#002347] tracking-tight">
            Property Comparison
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
            Transparent breakdown of all 7 verified land holdings near Nagpur. Compare acreage, total investment outlay, per-acre rates, and distinct locational advantages.
          </p>
        </div>

        {/* The Exact Comparison Matrix Table Container */}
        <div className="bg-[#F8F9FA] border border-slate-200 border-b-4 border-b-[#002347] rounded-2xl shadow-xl overflow-hidden">
          {/* Table Header Bar */}
          <div className="p-4 sm:p-5 bg-[#002347] text-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#001730] border border-[#C5A059]/40 text-[#E6C687]">
                <Table className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-serif-luxury font-bold text-base sm:text-lg text-white">
                  Nagpur Acres — Complete 7 Land Holdings Matrix
                </h3>
                <p className="text-xs text-slate-300">
                  All parcels verified with clear 7/12 &amp; 8A title extracts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All 7 Available
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4 sm:px-6">Property</th>
                  <th className="py-4 px-4 sm:px-6">Area</th>
                  <th className="py-4 px-4 sm:px-6">Total Price</th>
                  <th className="py-4 px-4 sm:px-6">Rate / Acre</th>
                  <th className="py-4 px-4 sm:px-6">Location</th>
                  <th className="py-4 px-4 sm:px-6">Special Feature</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Inquire / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {properties.map((prop, idx) => {
                  const isSpecial = Boolean(prop.specialFeature);
                  return (
                    <tr
                      key={prop.id}
                      className={`hover:bg-amber-50/40 transition-colors group ${
                        idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      {/* Property Number & Title */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#002347] text-[#E6C687] font-bold text-xs flex items-center justify-center font-mono shrink-0 shadow-xs">
                            {prop.propertyNumber}
                          </span>
                          <div>
                            <span className="font-bold text-[#002347] text-sm group-hover:text-[#C5A059] transition-colors block">
                              Property {prop.propertyNumber}
                            </span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {prop.status}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Area */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 text-sm">
                          {prop.areaDisplay}
                        </span>
                        {prop.totalLand !== prop.areaDisplay && (
                          <span className="block text-[11px] text-slate-500 font-normal">
                            {prop.totalLand}
                          </span>
                        )}
                      </td>

                      {/* Total Price */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span className="font-serif-luxury font-bold text-base text-[#002347]">
                          {prop.totalPriceShort}
                        </span>
                        {prop.totalPrice !== prop.totalPriceShort && (
                          <span className="block text-[11px] text-slate-500">
                            {prop.totalPrice}
                          </span>
                        )}
                      </td>

                      {/* Rate / Acre */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-700 font-medium">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                          {prop.ratePerAcre}
                        </span>
                      </td>

                      {/* Location & Distance */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-700">
                        <div className="flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span className="font-medium">{prop.location}</span>
                        </div>
                      </td>

                      {/* Special Feature */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        {prop.specialFeature ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            {prop.specialFeature}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">
                            Agricultural Land
                          </span>
                        )}
                      </td>

                      {/* Actions: View Details + WhatsApp */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectProperty(prop)}
                            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-300 hover:border-[#002347] hover:bg-slate-50 text-[#002347] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="View Full Specifications"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Details</span>
                          </button>

                          <a
                            href={getPropertyWhatsAppUrl(prop)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                            title="Chat on WhatsApp about Property"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Inquire</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Summary Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Need tailored land demarcation or a custom site visit schedule? Direct line with <strong>{COMPANY_DETAILS.founder}</strong>: <strong>{COMPANY_DETAILS.phoneDisplay}</strong>
              </span>
            </div>

            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent('Hello Aditya Shivpeth, I would like to review the complete 15 properties portfolio and title records.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Download Full 15-Property Portfolio on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
