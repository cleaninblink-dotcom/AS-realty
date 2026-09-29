import React from 'react';
import { X, Heart, Eye, CalendarCheck, Sparkles, Building, Trash2 } from 'lucide-react';
import { Property } from '../types';
import { FirestoreFavorite } from '../lib/firestore-service';

interface SavedPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Record<string, FirestoreFavorite>;
  properties: Property[];
  onRemoveFavorite: (property: Property) => void;
  onBookVisit: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

export const SavedPropertiesModal: React.FC<SavedPropertiesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  properties,
  onRemoveFavorite,
  onBookVisit,
  onViewDetails,
}) => {
  if (!isOpen) return null;

  const favoriteIds = Object.keys(favorites);
  const favoriteProperties = properties.filter((p) => favoriteIds.includes(String(p.id)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#001730]/75 backdrop-blur-md transition-all duration-300 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl my-6 bg-white border border-slate-200 border-b-4 border-b-[#002347] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Gold Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#9E7D3B] via-[#E5C378] to-[#9E7D3B]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 flex items-start justify-between border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#002347] text-[#E6C687] border border-[#C5A059]/40 uppercase tracking-widest">
                <Heart className="w-3 h-3 fill-[#E6C687] text-[#E6C687]" />
                Firestore Persistence
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {favoriteIds.length} Saved {favoriteIds.length === 1 ? 'Residence' : 'Residences'}
              </span>
            </div>
            <h3 className="text-2xl font-serif-luxury font-bold text-[#002347]">
              Shortlisted Luxury Properties
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Your personalized shortlist saved securely to your Google account in Firestore.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
          {favoriteProperties.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-[#C5A059] flex items-center justify-center mx-auto mb-3 border border-amber-200">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No Saved Properties Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore the AS Realty catalog and tap the heart icon on any residence to save it to your private portfolio.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#002347] text-[#E6C687] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#001730] transition-colors"
              >
                Browse Residences
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {favoriteProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-[#C5A059]/60 bg-white hover:bg-slate-50/50 transition-all shadow-sm"
                >
                  <img
                    src={prop.imageUrl || prop.heroImage}
                    alt={prop.name || prop.title}
                    className="w-full sm:w-28 h-24 object-cover rounded-lg shrink-0 bg-slate-900"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#002347] text-[#E6C687] uppercase">
                        {prop.type}
                      </span>
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {prop.location}, Nagpur
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-[#002347] truncate">
                      {prop.name || prop.title}
                    </h4>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs text-slate-400">Price:</span>
                      <span className="text-sm font-bold font-serif-luxury text-[#002347]">
                        {prop.price}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewDetails(prop);
                      }}
                      className="p-2 text-slate-600 hover:text-[#002347] hover:bg-slate-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onBookVisit(prop);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E6C687] text-[#002347] font-bold text-xs shadow-sm hover:opacity-95 transition-opacity"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Book Visit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(prop)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from shortlisted"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
