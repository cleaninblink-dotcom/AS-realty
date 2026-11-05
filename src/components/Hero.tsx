import React from 'react';
import { Shield, Award, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id="hero-section" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Architectural Luxury Image & Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Architecture Nagpur Acres"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.08]"
        />
        {/* Deep Editorial Navy and Gold Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002347] via-[#002347]/90 to-[#002347]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002347] via-transparent to-[#002347]/65" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Prestige Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#001730]/90 border border-[#C5A059]/50 backdrop-blur-md mb-6 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
          <span className="text-xs uppercase tracking-widest text-[#E6C687] font-semibold">
            Nagpur Premier Real Estate Advisory
          </span>
          <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
          <span className="text-xs text-slate-200 font-medium">Aditya Shivpeth</span>
        </div>

        {/* High-Impact Headline */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif-luxury font-bold text-white tracking-tight leading-[1.08]">
            Prime Land &amp; Farmhouse Estates in <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#E6C687] via-[#D4AF37] to-[#C5A059]">Nagpur</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl">
            Bespoke advisory and confidential representation for Nagpur’s verified agricultural acreage, scenic lake-touch retreats, highway-frontage assets, and custom land parcels. Curated personally by Aditya Shivpeth.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#properties-section"
            className="flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#C5A059]/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#002347]" />
            <span>Explore All 15 Properties</span>
          </a>

          <a
            href="#comparison-section"
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-[#001730]/85 hover:bg-[#001730] border border-[#C5A059]/40 text-white font-medium text-sm tracking-wider transition-all"
          >
            <span>Property Comparison Table</span>
            <ArrowRight className="w-4 h-4 text-[#E6C687]" />
          </a>
        </div>

        {/* High-Status Trust Metrics Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/15 text-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-serif-luxury font-bold text-white">100% MahaRERA</p>
              <p className="text-xs text-slate-300">Nagpur Due Diligence Audited</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-serif-luxury font-bold text-white">₹250+ Cr</p>
              <p className="text-xs text-slate-300">High-Value Advisory Track Record</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-serif-luxury font-bold text-white">Nagpur Exclusive</p>
              <p className="text-xs text-slate-300">Bespoke HNI Advisory Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-serif-luxury font-bold text-white">Direct Booking</p>
              <p className="text-xs text-slate-300">Private Boardroom Consultations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
