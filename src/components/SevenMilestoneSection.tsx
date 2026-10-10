import React from 'react';
import { Sparkles, Crown } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

export const SevenMilestoneSection: React.FC = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-transparent via-[#F8DDE8]/25 to-transparent">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-80 w-80 rounded-full bg-[#F8DDE8]/30 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Crown Badge */}
        <div className="mb-4 inline-flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C49A55] bg-white/95 shadow-sm">
            <Crown className="h-7 w-7 text-[#C49A55]" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#C49A55] animate-twinkle" />
          </div>
        </div>

        {/* Section Pre-title */}
        <div className="mb-2">
          <span className="font-poppins text-xs font-semibold tracking-widest text-[#4A7B9D]">
            A Lucky & Blessed Milestone
          </span>
        </div>

        {/* Big Fairytale "7" with Sacramento Script */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Decorative Sparkles */}
          <div className="pointer-events-none absolute -top-4 -left-6 text-2xl animate-float">
            ✨
          </div>
          <div className="pointer-events-none absolute top-10 -right-8 text-2xl animate-twinkle">
            ✨
          </div>

          <div className="font-sacramento text-8xl font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#9E4D6E] via-[#6C567B] to-[#4A7B9D] drop-shadow-[0_4px_20px_rgba(158,77,110,0.2)] sm:text-9xl md:text-[11rem] leading-none">
            7
          </div>
        </div>

        {/* Title */}
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#6C567B] mb-4">
          Seven Years of Magic & Wonder
        </h2>

        {/* Subtitle */}
        <p className="mx-auto max-w-xl font-poppins text-base sm:text-lg leading-relaxed text-[#6C567B] mb-12">
          Turning seven is one of the most cherished milestones in a young princess’s life.
          Join us as we celebrate{' '}
          <span className="font-sacramento text-3xl sm:text-4xl inline-block px-1 font-normal text-[#9E4D6E]">
            Zia Venice
          </span>{' '}
          and the beginning of her new chapter.
        </p>

        {/* Seven Princess Virtues Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-3xl mx-auto">
          {[
            { num: '1', title: 'Grace', desc: 'Gentle & Kind' },
            { num: '2', title: 'Joy', desc: 'Heart Full of Smiles' },
            { num: '3', title: 'Wonder', desc: 'Curious & Dreamer' },
            { num: '4', title: 'Love', desc: 'Cherished by All' },
            { num: '5', title: 'Laughter', desc: 'Spreading Sunshine' },
            { num: '6', title: 'Courage', desc: 'Bright & Bold' },
            { num: '7', title: 'Blessings', desc: 'Happily Ever After' },
          ].map((item) => (
            <div
              key={item.num}
              className="rounded-2xl border border-[#C49A55]/30 bg-white/85 p-4 text-center shadow-xs transition-transform duration-200 hover:-translate-y-1 hover:border-[#C49A55]"
            >
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E9DDF7] text-xs font-bold text-[#4A7B9D]">
                {item.num}
              </div>
              <h3 className="font-playfair text-sm sm:text-base font-semibold text-[#6C567B]">
                {item.title}
              </h3>
              <p className="font-poppins text-[11px] text-[#4A7B9D] mt-0.5">
                {item.desc}
              </p>
            </div>
          ))}

          {/* Special 8th card completing the grid */}
          <div className="rounded-2xl border-2 border-dashed border-[#C49A55]/40 bg-gradient-to-br from-[#FFF9F3] to-[#F8DDE8]/50 p-4 text-center flex flex-col items-center justify-center">
            <span className="text-xl">👑</span>
            <span className="font-sacramento text-2xl text-[#9E4D6E] mt-1">Princess Zia</span>
          </div>
        </div>
      </div>
    </section>
  );
};
