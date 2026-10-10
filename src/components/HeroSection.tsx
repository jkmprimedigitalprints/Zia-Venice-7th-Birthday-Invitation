import React from 'react';
import { Sparkles, Crown, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

interface HeroSectionProps {
  onEnterClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterClick }) => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-16 text-center overflow-hidden">
      {/* 1. Daylight Fairytale Castle */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/images/fairytale_castle_daylight_1791472226707.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F3]/85 via-[#FFF9F3]/65 to-[#FFF9F3]" />
      </div>

      {/* 2. Magical Castle Atmosphere: Lightweight effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 left-1/4 h-80 w-80 rounded-full bg-[#C49A55]/15 blur-2xl" />
        <div className="absolute -top-16 right-1/4 h-80 w-80 rounded-full bg-[#E9DDF7]/20 blur-2xl" />
        <div className="absolute bottom-6 -left-1/4 w-[150%] h-28 bg-gradient-to-t from-white/60 via-[#F8DDE8]/20 to-transparent blur-xl" />
      </div>

      {/* 3. Center Hero Invitation Card */}
      <div className="relative z-30 mx-auto max-w-4xl text-center">
        {/* Royal Crown Crest */}
        <div className="mb-4 inline-flex items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C49A55] bg-white/95 shadow-[0_4px_20px_rgba(196,154,85,0.3)]">
            <Crown className="h-8 w-8 text-[#C49A55]" />
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-[#C49A55] animate-twinkle" />
          </div>
        </div>

        {/* Once Upon a Time... (Cursive: Sacramento, Pale Lavender) */}
        <div className="mb-1">
          <p className="font-sacramento text-4xl sm:text-5xl md:text-6xl text-[#6C567B] font-normal leading-relaxed">
            Once Upon a Time...
          </p>
        </div>

        {/* Celebrant Name (Large & Visually Dominant, Sacramento, Blush Pink) */}
        <div className="mb-2 px-2">
          <h1 className="font-sacramento text-6xl font-normal leading-tight text-[#9E4D6E] drop-shadow-[0_2px_14px_rgba(158,77,110,0.2)] sm:text-7xl md:text-8xl lg:text-9xl">
            Zia Venice
          </h1>
        </div>

        {/* Glowing "turns 7!" (Soft Powder Blue / Blush Pink) */}
        <div className="my-2 inline-flex items-center justify-center gap-3">
          <span className="text-xl animate-twinkle text-[#C49A55]">✨</span>
          <span className="font-sacramento text-4xl font-normal tracking-wide text-[#4A7B9D] sm:text-5xl md:text-6xl">
            {EVENT_DATA.tagline}
          </span>
          <span className="text-xl animate-twinkle text-[#C49A55]">✨</span>
        </div>

        {/* A Magical 7th Birthday Celebration */}
        <div className="mb-3">
          <h2 className="font-playfair text-base sm:text-lg md:text-xl font-bold tracking-wide text-[#6C567B]">
            {EVENT_DATA.celebrationTitle}
          </h2>
        </div>

        <p className="mx-auto mb-6 max-w-xl font-poppins text-sm leading-relaxed text-[#6C567B] sm:text-base">
          {EVENT_DATA.subtitle}
        </p>

        {/* Quick Details Badges */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#C49A55]/40 bg-white/90 px-4 py-2 text-xs sm:text-sm text-[#6C567B] shadow-sm backdrop-blur-xs">
            <Calendar className="h-4 w-4 text-[#C49A55]" />
            <span className="font-poppins font-medium">{EVENT_DATA.displayDate}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#C49A55]/40 bg-white/90 px-4 py-2 text-xs sm:text-sm text-[#6C567B] shadow-sm backdrop-blur-xs">
            <MapPin className="h-4 w-4 text-[#C49A55]" />
            <span className="font-poppins font-medium">{EVENT_DATA.venueName}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <button
            onClick={onEnterClick}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-[#C49A55] bg-gradient-to-r from-[#F8DDE8] via-[#FFF9F3] to-[#E9DDF7] px-8 py-3.5 font-poppins text-xs sm:text-sm font-semibold tracking-wider text-[#6C567B] shadow-[0_6px_25px_rgba(196,154,85,0.3)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer will-change-transform"
          >
            <Sparkles className="h-4 w-4 text-[#C49A55]" />
            <span>Enter the Fairytale</span>
          </button>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-75">
        <span className="font-poppins tracking-wider text-[11px] font-semibold text-[#6C567B]">Scroll to Explore</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[#C49A55]" />
      </div>
    </section>
  );
};
