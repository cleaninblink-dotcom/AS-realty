import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
  MessageSquare,
  Award,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/properties';

interface Testimonial {
  id: number;
  clientName: string;
  role: string;
  location: string;
  propertyPurchased: string;
  acres: string;
  category: 'Farmhouse' | 'Commercial' | 'Agro Land' | 'Land Banking';
  avatar: string;
  rating: number;
  headline: string;
  quote: string;
  registryYear: string;
  verifiedTitle: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    clientName: 'Dr. Rajesh Deshmukh',
    role: 'Senior Consultant Surgeon',
    location: 'Ramdaspeth, Nagpur',
    propertyPurchased: '5 Acres Weekend Farmhouse Estate',
    acres: '5 Acres',
    category: 'Farmhouse',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    headline: 'Flawless 7/12 due diligence and complete peace of mind',
    quote:
      'Aditya Shivpeth’s personal due diligence on the 7/12 land records was impeccable. We acquired our private weekend fruit orchard near Songurli without a single legal ambiguity. The transparency, on-ground boundary demarcation, and sub-registrar registration speed set a gold standard in Nagpur real estate.',
    registryYear: 'Registered 2025',
    verifiedTitle: true,
  },
  {
    id: 2,
    clientName: 'Vikramaditya Kulkarni',
    role: 'Managing Director, Kulkarni Agro Tech',
    location: 'MIDC Hingna, Nagpur',
    propertyPurchased: '20 Acres Contiguous Tar Road Parcel',
    acres: '20 Acres',
    category: 'Agro Land',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    headline: 'Found a 20-acre contiguous holding near Umri Dam in 48 hours',
    quote:
      'Finding a large 20-acre contiguous parcel with direct tar road approach and active nearby water rights seemed nearly impossible until we engaged Nagpur Acres. Aditya organized on-ground DGPS survey inspections and facilitated clean single-owner pedigree documents with zero middlemen markup.',
    registryYear: 'Registered 2026',
    verifiedTitle: true,
  },
  {
    id: 3,
    clientName: 'Anjali & Pradeep Agrawal',
    role: 'HNI Investors & Philanthropists',
    location: 'Civil Lines, Nagpur',
    propertyPurchased: '6.60 Acres Cement Road Touch with Water',
    acres: '6.60 Acres',
    category: 'Farmhouse',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    headline: 'Water source and black soil tested before final registry',
    quote:
      'We wanted fertile agricultural land with a perennial on-site water source for organic plantation. Aditya Shivpeth arranged independent groundwater testing, soil nutrient profiling, and title extract verification. Nagpur Acres handled everything from token to freehold registry with utter professionalism.',
    registryYear: 'Registered 2025',
    verifiedTitle: true,
  },
  {
    id: 4,
    clientName: 'Mahesh Bansal',
    role: 'Director, Bansal Logistics & Warehousing',
    location: 'Wardha Road Corridor, Nagpur',
    propertyPurchased: '6.37 Acres Highway Touch Landmark',
    acres: '6.37 Acres',
    category: 'Commercial',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    headline: 'High-value highway commercial asset acquisition made seamless',
    quote:
      'Commercial highway-touch properties along arterial routes like Padhurna Road require rigorous title pedigree auditing. Aditya’s confidential representation gave our corporate board 100% confidence. Truly the premier land advisory desk in the Vidarbha region.',
    registryYear: 'Registered 2026',
    verifiedTitle: true,
  },
  {
    id: 5,
    clientName: 'CA Sunil Chandak',
    role: 'Senior Partner, Chandak & Associates',
    location: 'Dhantoli, Nagpur',
    propertyPurchased: '11 Acres Strategic Farmland Holding',
    acres: '11 Acres',
    category: 'Land Banking',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    headline: 'Transparent per-acre rates without bloated broker inflated pricing',
    quote:
      'As a chartered accountant, I scrutinize valuation metrics rigorously. Nagpur Acres publishes genuine per-acre rates and verifiable distances from Zero Mile. Aditya saved us months of unvetted broker trips and secured prime acreage at genuine direct-from-owner valuations.',
    registryYear: 'Registered 2025',
    verifiedTitle: true,
  },
];

export const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Farmhouse' | 'Agro Land' | 'Commercial' | 'Land Banking'>('All');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filteredTestimonials = selectedFilter === 'All'
    ? TESTIMONIALS
    : TESTIMONIALS.filter((t) => t.category === selectedFilter);

  const totalSlides = filteredTestimonials.length;

  // Safe navigation handlers
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedFilter]);

  // Autoplay functionality with pause on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides, handleNext]);

  const activeTestimonial = filteredTestimonials[currentIndex] || filteredTestimonials[0];

  return (
    <section
      id="testimonials-section"
      className="py-20 bg-white relative border-t border-slate-200 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#002347]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#002347] border border-[#C5A059]/40 text-xs text-[#E6C687] uppercase tracking-widest font-semibold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
            Client Endorsements &amp; Due Diligence Track Record
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#002347] tracking-tight">
            Trusted by Nagpur’s Discerning Land Buyers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
            Real experiences from surgeons, business leaders, corporate investors, and families who acquired verified land parcels with 100% legal clarity under Aditya Shivpeth.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {(['All', 'Farmhouse', 'Agro Land', 'Commercial', 'Land Banking'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-[#002347] text-[#E6C687] shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat === 'All' ? 'All Client Stories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Testimonial Slider Card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative bg-[#002347] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-[#C5A059]/40 overflow-hidden">
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C5A059] via-[#E6C687] to-[#C5A059]" />

            {/* Decorative Quote Mark */}
            <Quote className="absolute top-8 right-8 sm:top-10 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 text-white/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Client Profile Column */}
              <div className="flex flex-col items-center md:items-start shrink-0 text-center md:text-left md:w-60">
                <div className="relative mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-xl bg-slate-900">
                    <img
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.clientName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-600 text-white shadow-md border-2 border-[#002347]" title="Verified Legal Registry">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>

                <h3 className="font-serif-luxury font-bold text-lg text-white">
                  {activeTestimonial.clientName}
                </h3>
                <p className="text-xs text-[#E6C687] font-semibold mt-0.5">
                  {activeTestimonial.role}
                </p>

                <p className="flex items-center gap-1 text-[11px] text-slate-300 mt-1">
                  <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
                  <span>{activeTestimonial.location}</span>
                </p>

                {/* Property Badge */}
                <div className="mt-4 p-2.5 rounded-xl bg-white/10 border border-white/10 w-full text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-medium">
                    Acquisition Done
                  </span>
                  <span className="text-xs font-bold text-white block truncate mt-0.5">
                    {activeTestimonial.propertyPurchased}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 font-semibold mt-1">
                    <span>{activeTestimonial.acres}</span>
                    <span className="flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      {activeTestimonial.registryYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content Column */}
              <div className="flex-1 flex flex-col justify-between space-y-4 text-center md:text-left">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                    {[...Array(activeTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                    ))}
                    <span className="ml-2 text-xs font-bold text-[#E6C687]">
                      5.0 Verified Experience
                    </span>
                  </div>

                  {/* Headline */}
                  <h4 className="text-lg sm:text-2xl font-serif-luxury font-bold text-white leading-snug">
                    “{activeTestimonial.headline}”
                  </h4>

                  {/* Body Quote */}
                  <p className="mt-4 text-sm sm:text-base text-slate-200 font-light leading-relaxed">
                    {activeTestimonial.quote}
                  </p>
                </div>

                {/* Footer Badges & Verification Row */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      100% Clear 7/12 &amp; 8A Audited
                    </span>
                    <span className="hidden sm:inline text-xs text-slate-400">
                      Direct Land Registry by {COMPANY_DETAILS.name}
                    </span>
                  </div>

                  {/* Slider Counter */}
                  <div className="text-xs text-[#E6C687] font-mono font-bold tracking-wider">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Left & Right Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {filteredTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-8 bg-[#002347]'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-white hover:bg-[#002347] text-[#002347] hover:text-[#E6C687] border border-slate-300 hover:border-[#002347] shadow-sm transition-all cursor-pointer active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-[#002347] hover:bg-[#001730] text-[#E6C687] shadow-md transition-all cursor-pointer active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* High-Trust Credibility Strip */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#C5A059] flex items-center justify-center font-bold text-sm shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif-luxury font-bold text-sm text-[#002347]">45+ Parcels</p>
              <p className="text-[11px] text-slate-500">Registered in Nagpur Outskirts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif-luxury font-bold text-sm text-[#002347]">100% Clear</p>
              <p className="text-[11px] text-slate-500">Single Pedigree 7/12 Titles</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif-luxury font-bold text-sm text-[#002347]">Zero Litigation</p>
              <p className="text-[11px] text-slate-500">Full Legal Due Diligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <a
                href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent('Hello Aditya Shivpeth, I would like to speak regarding land acquisition and client references in Nagpur.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>WhatsApp Founder</span>
              </a>
              <p className="text-[11px] text-slate-500">Direct Line with Aditya</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
