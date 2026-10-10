import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

export const DetailsSection: React.FC = () => {
  return (
    <section id="details" className="relative py-20 px-4 sm:px-6">
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C49A55]/30 bg-white/80 px-4 py-1.5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#C49A55]" />
            <span className="font-poppins text-xs font-semibold tracking-wider text-[#4A7B9D]">
              Royal Information · Event Details
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#6C567B]">
            Where & When
          </h2>
          <p className="mt-2 font-sacramento text-4xl text-[#9E4D6E] font-normal md:text-5xl">
            7th Birthday Celebration
          </p>
        </div>

        {/* 3 Main Key Event Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
          {/* Card 1: Date */}
          <div className="group relative rounded-3xl border border-[#C49A55]/30 bg-white/90 p-8 text-center shadow-[0_8px_30px_rgba(108,86,123,0.06)] transition-all hover:-translate-y-1 hover:border-[#C49A55] hover:shadow-[0_12px_35px_rgba(196,154,85,0.18)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8DDE8] text-[#C49A55] border border-[#C49A55]/30">
              <Calendar className="h-7 w-7" />
            </div>
            <span className="font-poppins text-xs font-semibold tracking-wider text-[#4A7B9D]">Date</span>
            <h3 className="mt-2 font-playfair text-xl font-bold text-[#6C567B]">Saturday</h3>
            <p className="mt-1 font-poppins text-base font-semibold text-[#9E4D6E]">
              November 14, 2026
            </p>
            <p className="mt-2 font-poppins text-xs text-[#6C567B]/80">Mark your royal calendars!</p>
          </div>

          {/* Card 2: Time */}
          <div className="group relative rounded-3xl border border-[#C49A55]/30 bg-white/90 p-8 text-center shadow-[0_8px_30px_rgba(108,86,123,0.06)] transition-all hover:-translate-y-1 hover:border-[#C49A55] hover:shadow-[0_12px_35px_rgba(196,154,85,0.18)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9DDF7] text-[#C49A55] border border-[#C49A55]/30">
              <Clock className="h-7 w-7" />
            </div>
            <span className="font-poppins text-xs font-semibold tracking-wider text-[#4A7B9D]">Time</span>
            <h3 className="mt-2 font-playfair text-xl font-bold text-[#6C567B]">Evening Gathering</h3>
            <p className="mt-1 font-poppins text-base font-semibold text-[#9E4D6E]">
              {EVENT_DATA.displayTime}
            </p>
            <p className="mt-2 font-poppins text-xs text-[#6C567B]/80">Celebration starts promptly</p>
          </div>

          {/* Card 3: Venue */}
          <div className="group relative rounded-3xl border border-[#C49A55]/30 bg-white/90 p-8 text-center shadow-[0_8px_30px_rgba(108,86,123,0.06)] transition-all hover:-translate-y-1 hover:border-[#C49A55] hover:shadow-[0_12px_35px_rgba(196,154,85,0.18)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8DDE8] text-[#C49A55] border border-[#C49A55]/30">
              <MapPin className="h-7 w-7" />
            </div>
            <span className="font-poppins text-xs font-semibold tracking-wider text-[#4A7B9D]">Venue</span>
            <h3 className="mt-2 font-playfair text-xl font-bold text-[#6C567B]">Jollibee</h3>
            <p className="mt-1 font-poppins text-base font-semibold text-[#9E4D6E]">
              Bayani Road Taguig
            </p>
            <p className="mt-2 font-poppins text-xs text-[#6C567B]/80">Taguig City, Metro Manila</p>
          </div>
        </div>

        {/* Dress Code / Attire Card */}
        <div className="rounded-3xl border-2 border-[#C49A55]/30 bg-white/90 p-8 text-center shadow-[0_8px_30px_rgba(108,86,123,0.06)]">
          <div className="mb-3 inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#C49A55]" />
            <span className="font-poppins text-xs font-semibold tracking-wider text-[#4A7B9D]">
              Royal Attire Guide
            </span>
          </div>

          <h3 className="font-playfair text-2xl font-bold text-[#6C567B] mb-2">
            {EVENT_DATA.dressCode.title}
          </h3>

          <p className="mx-auto max-w-xl font-poppins text-sm leading-relaxed text-[#6C567B] mb-6">
            {EVENT_DATA.dressCode.description}
          </p>

          {/* Color Palette Swatches */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {EVENT_DATA.dressCode.colors.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3.5 py-1.5 shadow-2xs"
              >
                <span
                  className="h-4 w-4 rounded-full border shadow-inner"
                  style={{ backgroundColor: c.hex, borderColor: c.border }}
                />
                <span className="font-poppins text-xs font-medium text-[#6C567B]">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
