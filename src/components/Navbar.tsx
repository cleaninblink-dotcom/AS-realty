import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Phone,
  MessageSquare,
  Building,
  ShieldCheck,
  ChevronRight,
  Instagram,
  Heart,
  Calendar,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/properties';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBooking: (propertyName?: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenSavedProperties?: () => void;
  onOpenMyBookings?: () => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onScrollToSection,
  onOpenSavedProperties,
  onOpenMyBookings,
  savedCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, userProfile, isAdmin, signInWithGoogle, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Featured Residences', id: 'featured-properties-section' },
    { name: 'About AS Realty', id: 'about-us-section' },
    { name: 'Founder Profile', id: 'founder-section' },
    { name: 'Private Services', id: 'services-section' },
    { name: 'Contact & Offices', id: 'contact-section' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      // Handled in context
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
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
          {/* Custom Gold Monogram Crest */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#001730] border border-[#C5A059]/70 flex items-center justify-center shadow-md group-hover:border-[#E6C687] transition-all">
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-tighter text-[#E6C687]">
              AS
            </span>
          </div>

          <div>
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-white flex items-center gap-1.5">
              AS <span className="text-[#C5A059]">REALTY</span>
            </span>
            <span className="block text-[10px] text-slate-300 uppercase tracking-wider font-sans">
              Amit Shivpeth
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-xs uppercase tracking-widest text-slate-200 hover:text-[#E6C687] font-medium transition-colors cursor-pointer py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C5A059] hover:after:w-full after:transition-all"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Action Group: Shortlist, Google Auth, Instagram & Schedule Button */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Shortlisted Properties Button */}
          {onOpenSavedProperties && (
            <button
              type="button"
              onClick={onOpenSavedProperties}
              className="relative p-2.5 rounded-lg bg-[#001730] border border-[#C5A059]/40 hover:border-[#E6C687] text-slate-200 hover:text-[#E6C687] transition-all group cursor-pointer"
              title="View Shortlisted Luxury Properties"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-rose-400 fill-rose-400' : 'text-[#E6C687]'}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          {/* Instagram Link */}
          <a
            id="nav-instagram-button"
            href="https://www.instagram.com/asrealty.official?igsi=MXhteGNhM3Y0YjBmcg=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#001730] border border-[#C5A059]/40 hover:border-[#E6C687] text-xs font-semibold text-slate-200 hover:text-[#E6C687] transition-all group"
            title="Follow us on Instagram @asrealty.official"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E6C687] group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline text-[11px]">Follow</span>
          </a>

          {/* Google Sign-in / User Account Button */}
          {!loading && (
            <>
              {user ? (
                /* Authenticated User Pill Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#001730] border border-[#C5A059]/60 hover:border-[#E6C687] text-slate-100 transition-all cursor-pointer group"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Client'}
                        className="w-6 h-6 rounded-full border border-[#C5A059]/80 object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#002347] font-bold text-xs flex items-center justify-center">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-medium max-w-[100px] truncate text-slate-200">
                      {user.displayName?.split(' ')[0] || 'Client'}
                    </span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C5A059] text-[#002347] uppercase">
                        Admin
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-2xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#002347] truncate">
                            {user.displayName || 'VIP Client'}
                          </span>
                          {isAdmin && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#002347] text-[#E6C687]">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-emerald-600 font-medium">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Google Verified Identity</span>
                        </div>
                      </div>

                      <div className="py-1">
                        {onOpenMyBookings && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenMyBookings();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#002347] transition-colors cursor-pointer text-left"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>My Site Visit Bookings</span>
                          </button>
                        )}

                        {onOpenSavedProperties && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenSavedProperties();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#002347] transition-colors cursor-pointer text-left"
                          >
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            <span>Shortlisted Properties ({savedCount})</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Google Sign-in Button */
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                  title="Sign in with Google"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E6C687]" />
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Sign In</span>
                </button>
              )}
            </>
          )}

          {/* Schedule Meeting CTA */}
          <button
            id="nav-contact-us-button"
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-xs uppercase tracking-wider shadow-md shadow-[#C5A059]/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <Building className="w-3.5 h-3.5 text-[#002347]" />
            <span>Schedule Visit</span>
          </button>
        </div>

        {/* Mobile Action Controls & Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenSavedProperties && (
            <button
              type="button"
              onClick={onOpenSavedProperties}
              className="p-1.5 rounded-lg bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] relative"
              aria-label="View Saved"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => onOpenBooking()}
            className="px-2.5 py-1.5 rounded-lg bg-[#C5A059] text-[#002347] font-bold text-[11px] uppercase tracking-wider"
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
        <div className="md:hidden bg-[#002347] border-b border-[#C5A059]/30 px-6 py-6 space-y-4 backdrop-blur-xl animate-fadeIn">
          {/* User Status Card for Mobile */}
          {user ? (
            <div className="p-3.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Client'}
                    className="w-9 h-9 rounded-full border border-[#C5A059]/80 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#C5A059] text-[#002347] font-bold text-sm flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{user.displayName || 'Client'}</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C5A059] text-[#002347]">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-300 block truncate">{user.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white text-slate-800 font-bold text-sm shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSigningIn ? 'Connecting...' : 'Sign In with Google'}</span>
            </button>
          )}

          <div className="flex flex-col gap-2 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="flex items-center justify-between text-left py-2 text-xs uppercase tracking-wider text-slate-200 hover:text-[#E6C687] border-b border-white/10"
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E6C687] text-[#002347] font-bold text-xs uppercase tracking-wider shadow-md"
            >
              <Building className="w-4 h-4" />
              <span>Schedule Site Visit</span>
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
