import React, { useState } from 'react';
import { Crown, Sparkles, Heart } from 'lucide-react';
import { TRADITIONS_DATA, TRADITIONS_ORDER, TraditionKey } from '../data/traditionsData';

export const SevenTraditionsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TraditionKey>('gifts');
  const traditionsData = TRADITIONS_DATA;
  const currentCategory = traditionsData[activeTab];

  return (
    <section id="traditions" className="relative py-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#E9DDF7]/30 via-[#F8DDE8]/30 to-[#FFF9F3]">
      <div className="relative mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#C49A55]/30 bg-white/90 px-4 py-1 shadow-2xs">
            <Crown className="h-3.5 w-3.5 text-[#C49A55]" />
            <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#4A7B9D]">
              Royal Birthday Ceremonies
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#C49A55]" />
          </div>
          <h2 className="font-playfair text-3xl font-bold tracking-wide text-[#6C567B] sm:text-4xl md:text-5xl">
            The Royal Traditions
          </h2>
          <p className="mt-2 font-poppins text-sm sm:text-base text-[#6C567B]/85 font-normal">
            Honored participants for Princess Zia Venice’s 7th Birthday
          </p>
        </div>

        {/* Tab Buttons (Ordered: Gifts, Chocolates, Make Up, Blue Bills, Mini Cakes, Wishes, Candles, Roses) */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {TRADITIONS_ORDER.map((tabKey) => {
            const cat = traditionsData[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 font-poppins text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'border-2 border-[#C49A55] bg-gradient-to-r from-[#F8DDE8] via-[#FFF9F3] to-[#E9DDF7] text-[#9E4D6E] shadow-md scale-105'
                    : 'border border-[#F8DDE8] bg-white/90 text-[#6C567B]/80 hover:bg-[#F8DDE8]/40 hover:text-[#6C567B] shadow-2xs'
                }`}
              >
                <span className="text-base">{cat.symbol}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Clean Name List (Pure number + name roster cards) */}
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#C49A55]/30 bg-white/95 p-5 sm:p-8 shadow-[0_8px_30px_rgba(108,86,123,0.08)] backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between border-b border-[#F8DDE8] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentCategory.symbol}</span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold tracking-wide text-[#6C567B]">
                {currentCategory.label}
              </h3>
            </div>
            <span className="font-poppins text-xs font-semibold uppercase tracking-wider text-[#4A7B9D]">
              7 Participants
            </span>
          </div>

          <div className="space-y-3">
            {currentCategory.list.map((item) => (
              <div
                key={item.number}
                className="group flex items-center justify-between rounded-xl border border-[#F8DDE8] bg-gradient-to-r from-white via-[#FFF9F3] to-white px-4 py-3.5 transition-all hover:border-[#C49A55] hover:shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg font-poppins text-xs font-bold bg-[#F8DDE8] text-[#9E4D6E] shadow-2xs">
                    {item.number}
                  </div>
                  <span className="font-poppins text-sm sm:text-base font-semibold tracking-wide text-[#6C567B] group-hover:text-[#9E4D6E] transition-colors">
                    {item.name}
                  </span>
                </div>

                <Heart className="h-4 w-4 text-[#9E4D6E]/40 group-hover:text-[#9E4D6E] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
