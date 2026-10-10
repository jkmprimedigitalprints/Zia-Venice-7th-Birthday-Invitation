import React from 'react';
import { Crown, Sparkles, Heart } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-80 w-80 rounded-full bg-[#F8DDE8]/30 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Section Tag */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C49A55]/30 bg-white/80 px-4 py-1.5 shadow-xs backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#C49A55]" />
          <span className="font-poppins text-xs font-semibold tracking-wider text-[#4A7B9D]">
            Chapter One · The Story
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#6C567B] mb-8">
          A Little Princess Turns Seven
        </h2>

        {/* Story Content Card */}
        <div className="relative rounded-3xl border-2 border-[#C49A55]/35 bg-white/90 p-8 sm:p-12 shadow-[0_10px_35px_rgba(108,86,123,0.08)] backdrop-blur-md">
          {/* Decorative Corner Ornaments */}
          <div className="pointer-events-none absolute top-3 left-4 text-[#C49A55]/60 text-lg">❧</div>
          <div className="pointer-events-none absolute top-3 right-4 text-[#C49A55]/60 text-lg">☙</div>
          <div className="pointer-events-none absolute bottom-3 left-4 text-[#C49A55]/60 text-lg">❧</div>
          <div className="pointer-events-none absolute bottom-3 right-4 text-[#C49A55]/60 text-lg">☙</div>

          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8DDE8]/60 text-[#C49A55] border border-[#C49A55]/30">
              <Crown className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-5 font-poppins text-base sm:text-lg leading-relaxed text-[#6C567B]">
            <p>
              Seven years ago, a beautiful little blessing named{' '}
              <strong className="font-sacramento text-3xl sm:text-4xl font-normal text-[#9E4D6E] inline-block px-1">
                Zia Venice
              </strong>{' '}
              came into our lives and filled every day with wonder, pure joy, and endless love.
            </p>
            <p>
              From her gentle laughter to her bright curious eyes, she has blossomed into a sweet,
              kind-hearted princess who touches everyone around her with sunshine.
            </p>
            <p className="font-medium text-[#6C567B]">
              Now, she is turning <span className="font-sacramento font-normal text-[#4A7B9D] text-3xl sm:text-4xl px-1">7</span>!
              We warmly invite you to be part of her fairytale celebration as we celebrate this milestone year
              with sweet treats, laughter, and magical memories.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-[#4A7B9D]">
            <Heart className="h-3.5 w-3.5 text-[#9E4D6E] fill-[#9E4D6E]" />
            <span>Blessed with 7 Wonderful Years</span>
            <Heart className="h-3.5 w-3.5 text-[#9E4D6E] fill-[#9E4D6E]" />
          </div>
        </div>
      </div>
    </section>
  );
};
