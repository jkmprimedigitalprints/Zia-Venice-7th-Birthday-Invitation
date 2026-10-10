import React from 'react';
import { Crown, ArrowUp, Heart, Sparkles, MapPin, Calendar, Clock } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

export const FooterSection: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#F8DDE8] bg-gradient-to-b from-[#FFF9F3] via-[#FFF9F3] to-[#F8DDE8]/40 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Subtle Fairy Glow / Decorative Background elements */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#F8DDE8]/30 blur-2xl rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-48 h-48 bg-[#E9DDF7]/30 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-48 h-48 bg-[#F8DDE8]/30 blur-3xl rounded-full" />

      <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center">
        {/* Crown Icon Emblem */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-[#C49A55]/60 bg-white/95 shadow-md text-[#C49A55] backdrop-blur-xs">
            <Crown className="h-7 w-7 sm:h-8 sm:w-8 animate-pulse" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#C49A55]" />
        </div>

        {/* Cursive Celebrant Name using Great Vibes */}
        <h2 className="font-greatvibes text-5xl sm:text-6xl md:text-7xl text-[#9E4D6E] leading-tight tracking-wide drop-shadow-xs">
          Zia Venice
        </h2>

        {/* Subtitle with Playfair / Poppins */}
        <p className="mt-2 font-playfair text-lg sm:text-xl font-semibold tracking-wide text-[#6C567B]">
          7th Birthday Fairytale Celebration
        </p>

        {/* Cursive Tagline / Fairytale Sentiment using Great Vibes */}
        <p className="mt-2 font-greatvibes text-2xl sm:text-3xl md:text-4xl text-[#4A7B9D] font-normal tracking-wide">
          Happily Ever After Begins
        </p>

        {/* Quick event highlights reminder card - responsive on mobile & desktop */}
        <div className="mt-6 w-full max-w-md rounded-2xl border border-[#F8DDE8] bg-white/75 backdrop-blur-xs px-5 py-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#6C567B] font-poppins text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#9E4D6E] shrink-0" />
              <span>{EVENT_DATA.displayDate}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Clock className="h-3.5 w-3.5 text-[#9E4D6E] shrink-0" />
              <span>{EVENT_DATA.displayTime}</span>
            </div>
            <div className="sm:col-span-2 flex items-center justify-center sm:justify-start gap-2 pt-1 border-t border-[#F8DDE8]/60">
              <MapPin className="h-3.5 w-3.5 text-[#C49A55] shrink-0" />
              <span className="truncate">{EVENT_DATA.venueName}</span>
            </div>
          </div>
        </div>

        {/* Closing fairytale quote */}
        <p className="mt-6 max-w-lg font-poppins text-xs sm:text-sm italic text-[#6C567B]/90 leading-relaxed px-4">
          “And they lived joyfully and happily ever after, surrounded by the warm embrace, laughter, and blessings of family and friends.”
        </p>

        {/* Back to Beginning / Scroll To Top Button */}
        <div className="mt-6">
          <button
            onClick={scrollToTop}
            type="button"
            className="group inline-flex items-center gap-2 rounded-full border border-[#C49A55]/40 bg-white/95 px-6 py-2.5 font-poppins text-xs sm:text-sm font-medium text-[#6C567B] shadow-xs transition-all duration-300 hover:border-[#C49A55] hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp className="h-4 w-4 text-[#C49A55] transition-transform group-hover:-translate-y-0.5" />
            <span>Back to Beginning</span>
          </button>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-10 w-full border-t border-[#F8DDE8]/80 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 font-poppins text-xs text-[#6C567B]/80 text-center">
            <span className="flex items-center gap-1.5">
              <span>Crafted with</span>
              <Heart className="h-3.5 w-3.5 text-[#9E4D6E] fill-[#9E4D6E]" />
              <span>for</span>
            </span>
            <span className="font-greatvibes text-xl text-[#9E4D6E] leading-none px-1">
              Princess Zia Venice Abonal
            </span>
            <span className="hidden sm:inline">·</span>
            <span>November 14, 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
