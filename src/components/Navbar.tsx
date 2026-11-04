import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Building,
  ChevronRight,
  Instagram,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/properties';

interface NavbarProps {
  onOpenBooking: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onScrollToSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [logoError, setLogoError] = useState(false);

  const navLinks = [
    { name: 'All 7 Properties', id: 'properties-section' },
    { name: 'Property Comparison', id: 'comparison-section' },
    { name: 'About Nagpur Acres', id: 'about-us-section' },
    { name: 'Founder Profile', id: 'founder-section' },
    { name: 'Private Services', id: 'services-section' },
    { name: 'Contact & Offices', id: 'contact-section' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#002347]/95 backdrop-blur-md border-b border-[#C5A059]/30 py-2.5 sm:py-3 shadow-lg shadow-[#002347]/30'
          : 'bg-[#002347] py-3.5 sm:py-4 border-b border-[#001730]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Custom Logo Image with Gold Frame & Monogram Fallback */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#001730] border border-[#C5A059]/80 overflow-hidden flex items-center justify-center shadow-md group-hover:border-[#E6C687] transition-all shrink-0">
            {!logoError && COMPANY_DETAILS.logoUrl ? (
              <img
                src={COMPANY_DETAILS.logoUrl}
                alt="Nagpur Acres Logo"
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-tighter text-[#E6C687]">
                NA
              </span>
            )}
          </div>

          <div>
            <span className="font-cinzel text-lg sm:text-xl md:text-2xl font-bold tracking-widest text-white flex items-center gap-1.5">
              NAGPUR <span className="text-[#C5A059]">ACRES</span>
            </span>
            <span className="block text-[10px] text-slate-300 uppercase tracking-wider font-sans">
              Aditya Shivpeth
            </span>
          </div>
        </div>



        {/* Action Group: Consultations, Instagram & Schedule Button */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Instagram Link */}
          <a
            id="nav-instagram-button"
            href={COMPANY_DETAILS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#001730] border border-[#C5A059]/40 hover:border-[#E6C687] text-xs font-semibold text-slate-200 hover:text-[#E6C687] transition-all group"
            title={`Follow us on Instagram ${COMPANY_DETAILS.instagramHandle}`}
          >
            <Instagram className="w-3.5 h-3.5 text-[#E6C687] group-hover:scale-110 transition-transform" />
            <span className="hidden xl:inline text-[11px]">Follow</span>
          </a>

          {/* Schedule Consultation CTA */}
          <button
            id="nav-contact-us-button"
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-xs uppercase tracking-wider shadow-md shadow-[#C5A059]/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <Building className="w-3.5 h-3.5 text-[#002347]" />
            <span>Schedule Meeting</span>
          </button>
        </div>

        {/* Mobile Action Controls & Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenBooking()}
            className="px-2.5 py-1.5 rounded-lg bg-[#C5A059] text-[#002347] font-bold text-[11px] uppercase tracking-wider cursor-pointer"
          >
            Book Visit
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#001730] border border-white/15 text-slate-200 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#002347] border-b border-[#C5A059]/30 px-6 py-6 space-y-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="flex items-center justify-between text-left py-2.5 text-xs uppercase tracking-wider text-slate-200 hover:text-[#E6C687] border-b border-white/10"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E6C687] text-[#002347] font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>Schedule Consultation</span>
            </button>

            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp: {COMPANY_DETAILS.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
