import React from 'react';
import { COMPANY_DETAILS } from '../data/properties';
import { ShieldCheck, MessageSquare, ArrowUp, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onOpenBooking }) => {
  const [logoError, setLogoError] = React.useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#002347] border-t-2 border-[#C5A059]/40 text-slate-300 text-xs">
      {/* Top Banner */}
      <div className="border-b border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#001730] border border-[#C5A059]/60 overflow-hidden flex items-center justify-center shrink-0">
              {!logoError && COMPANY_DETAILS.logoUrl ? (
                <img
                  src={COMPANY_DETAILS.logoUrl}
                  alt="Nagpur Acres Logo"
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-cinzel text-[#E6C687] font-bold text-sm">NA</span>
              )}
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold text-white tracking-wider block">
                NAGPUR ACRES
              </span>
              <span className="text-[11px] text-slate-300">
                Under the Leadership of {COMPANY_DETAILS.founder}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent('Hello Nagpur Acres, I would like to connect with your luxury advisory desk.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001730] border border-emerald-400/40 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp: {COMPANY_DETAILS.phoneDisplay}</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-[#001730] border border-white/15 hover:border-[#C5A059] text-slate-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-cinzel">
            Defining Elite Living
          </h4>
          <p className="text-slate-300 leading-relaxed text-xs">
            Nagpur Acres is Nagpur’s dedicated boutique luxury real estate advisory, representing the finest private residences, sky penthouses, and prime commercial assets across Civil Lines, Ramdaspeth, Dharampeth, Byramji Town, and Seminary Hills.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#E6C687] pt-1 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% MahaRERA Due Diligence Audited</span>
          </div>
        </div>

        {/* Advisory Focus */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E6C687]">
            Advisory Focus
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onScrollToSection('services-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Civil Lines & Ramdaspeth High-Rises
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('services-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Dharampeth Luxury Duplexes & Penthouses
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('services-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Byramji Town & Seminary Hills Estates
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('services-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Strategic Commercial Land & Mixed-Use
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('services-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                NRI & Global Capital Repatriation Desk
              </button>
            </li>
          </ul>
        </div>

        {/* Company & Founder */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E6C687]">
            Leadership & Values
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onScrollToSection('founder-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                About {COMPANY_DETAILS.founder}
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('about-us-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Due Diligence Framework
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('services-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                VIP Chauffeur Site Visits
              </button>
            </li>
            <li>
              <button
                onClick={onOpenBooking}
                className="hover:text-[#E6C687] text-white font-medium transition-colors text-left cursor-pointer"
              >
                Schedule Private Consultation
              </button>
            </li>
          </ul>
        </div>

        {/* Social & Verification */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E6C687]">
            Connect &amp; Follow
          </h4>
          <p className="text-xs text-slate-300">
            Follow private showcases and curated architectural tours across our channels.
          </p>
          <div className="pt-1 space-y-2">
            <a
              href={COMPANY_DETAILS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#833ab4]/30 via-[#fd1d1d]/30 to-[#fcb045]/30 border border-[#E6C687]/50 hover:border-[#E6C687] text-white hover:text-[#E6C687] text-xs font-semibold transition-all group shadow-sm"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-4 h-4 text-[#E6C687] group-hover:scale-110 transition-transform" />
              <span>Follow us {COMPANY_DETAILS.instagramHandle}</span>
            </a>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={COMPANY_DETAILS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#001730] border border-white/15 hover:border-[#C5A059] text-slate-200 hover:text-[#E6C687] transition-all"
                aria-label="Instagram"
                title={`Follow us on Instagram ${COMPANY_DETAILS.instagramHandle}`}
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#001730] border border-white/15 hover:border-[#C5A059] text-slate-200 hover:text-[#E6C687] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#001730] border border-white/15 hover:border-[#C5A059] text-slate-200 hover:text-[#E6C687] transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* RERA Disclaimer & Copyright */}
      <div className="border-t border-white/10 py-6 bg-[#001730]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Disclaimer:</strong> Nagpur Acres (Owned by {COMPANY_DETAILS.founder}) is an authorized luxury real estate advisory and facilitation firm. All advisory disclosures, architectural perspectives, and developer agreements are verified against official MahaRERA documentation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} Nagpur Acres. All Rights Reserved. Owned by {COMPANY_DETAILS.founder}.</span>
            <span>Crafted for Discerning Connoisseurs of Architecture.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
