import React, { useState, useEffect } from 'react';
import { Crown, Menu, X, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  onMusicToggle: () => void;
  isMusicPlaying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMusicToggle,
  isMusicPlaying,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Story', href: '#story' },
    { label: 'Traditions', href: '#traditions' },
    { label: 'Countdown', href: '#countdown' },
    { label: 'Details', href: '#details' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Wishes', href: '#wishes' },
    { label: 'RSVP', href: '#rsvp' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFF9F3]/90 shadow-[0_4px_20px_rgba(108,86,123,0.08)] backdrop-blur-md py-2 border-b border-[#F8DDE8]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C49A55] bg-white/90 text-[#C49A55] shadow-xs transition-transform group-hover:scale-105">
            <Crown className="h-4.5 w-4.5" />
          </div>
          <span className="font-sacramento text-3xl font-normal tracking-wide text-[#9E4D6E] sm:text-4xl">
            Zia Venice
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-poppins text-xs font-semibold tracking-wider text-[#6C567B] transition-colors duration-200 hover:text-[#4A7B9D]"
            >
              {link.label}
            </a>
          ))}

          {/* Quick Music Toggle in Nav */}
          <button
            onClick={onMusicToggle}
            aria-label="Toggle Fairytale Music"
            className="flex items-center gap-1.5 rounded-full border border-[#C49A55]/40 bg-white/80 px-3 py-1.5 text-xs text-[#6C567B] shadow-2xs transition-all hover:border-[#C49A55] hover:bg-white cursor-pointer"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="h-4 w-4 text-[#9E4D6E]" />
                <span className="font-poppins font-medium text-[11px] text-[#9E4D6E]">Music On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-[#6C567B]/70" />
                <span className="font-poppins font-medium text-[11px] text-[#6C567B]/70">Music Off</span>
              </>
            )}
          </button>
        </nav>

        {/* Mobile Hamburger & Music Buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onMusicToggle}
            aria-label="Toggle Fairytale Music"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C49A55]/40 bg-white/90 text-[#6C567B] shadow-2xs cursor-pointer"
          >
            {isMusicPlaying ? (
              <Volume2 className="h-4 w-4 text-[#9E4D6E]" />
            ) : (
              <VolumeX className="h-4 w-4 text-[#6C567B]" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C49A55]/40 bg-white/90 text-[#6C567B] shadow-2xs cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-[#F8DDE8] bg-[#FFF9F3]/95 px-6 py-4 backdrop-blur-md shadow-lg md:hidden">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-poppins text-sm font-semibold tracking-wider text-[#6C567B] py-1.5 border-b border-[#F8DDE8]/50 transition-colors hover:text-[#4A7B9D]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
