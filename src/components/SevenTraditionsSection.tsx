import React, { useState } from 'react';
import { Crown, Sparkles, Heart } from 'lucide-react';

interface TraditionPerson {
  number: number;
  label: string;
  name: string; // Name slot
}

type TraditionKey =
  | 'roses'
  | 'candles'
  | 'wishes'
  | 'blueBills'
  | 'chocolates'
  | 'makeups'
  | 'gifts';

interface TraditionCategory {
  id: TraditionKey;
  label: string;
  symbol: string;
  itemType: string;
  list: TraditionPerson[];
}

export const SevenTraditionsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TraditionKey>('roses');

  // Clean list of 7 names per category without paragraphs or long meaning texts
  const traditionsData: Record<TraditionKey, TraditionCategory> = {
    roses: {
      id: 'roses',
      label: '7 ROSES',
      symbol: '🌹',
      itemType: 'Rose',
      list: [
        { number: 1, label: '1st Rose', name: '' },
        { number: 2, label: '2nd Rose', name: '' },
        { number: 3, label: '3rd Rose', name: '' },
        { number: 4, label: '4th Rose', name: '' },
        { number: 5, label: '5th Rose', name: '' },
        { number: 6, label: '6th Rose', name: '' },
        { number: 7, label: '7th Rose', name: '' },
      ],
    },
    candles: {
      id: 'candles',
      label: '7 CANDLES',
      symbol: '🕯️',
      itemType: 'Candle',
      list: [
        { number: 1, label: '1st Candle', name: '' },
        { number: 2, label: '2nd Candle', name: '' },
        { number: 3, label: '3rd Candle', name: '' },
        { number: 4, label: '4th Candle', name: '' },
        { number: 5, label: '5th Candle', name: '' },
        { number: 6, label: '6th Candle', name: '' },
        { number: 7, label: '7th Candle', name: '' },
      ],
    },
    wishes: {
      id: 'wishes',
      label: '7 WISHES',
      symbol: '🪄',
      itemType: 'Wish',
      list: [
        { number: 1, label: '1st Wish', name: '' },
        { number: 2, label: '2nd Wish', name: '' },
        { number: 3, label: '3rd Wish', name: '' },
        { number: 4, label: '4th Wish', name: '' },
        { number: 5, label: '5th Wish', name: '' },
        { number: 6, label: '6th Wish', name: '' },
        { number: 7, label: '7th Wish', name: '' },
      ],
    },
    blueBills: {
      id: 'blueBills',
      label: '7 BLUE BILLS',
      symbol: '💵',
      itemType: 'Blue Bill',
      list: [
        { number: 1, label: '1st Blue Bill', name: '' },
        { number: 2, label: '2nd Blue Bill', name: '' },
        { number: 3, label: '3rd Blue Bill', name: '' },
        { number: 4, label: '4th Blue Bill', name: '' },
        { number: 5, label: '5th Blue Bill', name: '' },
        { number: 6, label: '6th Blue Bill', name: '' },
        { number: 7, label: '7th Blue Bill', name: '' },
      ],
    },
    chocolates: {
      id: 'chocolates',
      label: '7 CHOCOLATES',
      symbol: '🍫',
      itemType: 'Chocolate',
      list: [
        { number: 1, label: '1st Chocolate', name: '' },
        { number: 2, label: '2nd Chocolate', name: '' },
        { number: 3, label: '3rd Chocolate', name: '' },
        { number: 4, label: '4th Chocolate', name: '' },
        { number: 5, label: '5th Chocolate', name: '' },
        { number: 6, label: '6th Chocolate', name: '' },
        { number: 7, label: '7th Chocolate', name: '' },
      ],
    },
    makeups: {
      id: 'makeups',
      label: '7 MAKEUPS',
      symbol: '💄',
      itemType: 'Makeup',
      list: [
        { number: 1, label: '1st Makeup', name: '' },
        { number: 2, label: '2nd Makeup', name: '' },
        { number: 3, label: '3rd Makeup', name: '' },
        { number: 4, label: '4th Makeup', name: '' },
        { number: 5, label: '5th Makeup', name: '' },
        { number: 6, label: '6th Makeup', name: '' },
        { number: 7, label: '7th Makeup', name: '' },
      ],
    },
    gifts: {
      id: 'gifts',
      label: '7 GIFTS',
      symbol: '🎁',
      itemType: 'Gift',
      list: [
        { number: 1, label: '1st Gift', name: '' },
        { number: 2, label: '2nd Gift', name: '' },
        { number: 3, label: '3rd Gift', name: '' },
        { number: 4, label: '4th Gift', name: '' },
        { number: 5, label: '5th Gift', name: '' },
        { number: 6, label: '6th Gift', name: '' },
        { number: 7, label: '7th Gift', name: '' },
      ],
    },
  };

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
            The Royal 7 Traditions
          </h2>
          <p className="mt-2 font-poppins text-sm sm:text-base text-[#6C567B]/85 font-normal">
            Honored participants for Princess Zia Venice’s 7th Birthday
          </p>
        </div>

        {/* Tab Buttons (7 Categories) */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {(Object.keys(traditionsData) as TraditionKey[]).map((tabKey) => {
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

        {/* Clean Name List (Pure name roster cards) */}
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
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg font-poppins text-xs font-semibold bg-[#F8DDE8] text-[#9E4D6E]">
                    {item.number}
                  </div>
                  <span className="font-poppins text-sm font-semibold tracking-wide text-[#6C567B]">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-poppins text-sm sm:text-base font-medium text-[#6C567B]/70">
                    {item.name ? item.name : '—'}
                  </span>
                  <Heart className="h-3.5 w-3.5 text-[#9E4D6E]/60 group-hover:text-[#9E4D6E] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
