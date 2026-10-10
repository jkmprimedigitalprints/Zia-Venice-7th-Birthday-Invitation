import React, { useState } from 'react';
import { Crown, Sparkles, Heart } from 'lucide-react';

interface TraditionPerson {
  number: number;
  label: string;
  name: string;
}

type TraditionKey =
  | 'roses'
  | 'wishes'
  | 'makeups'
  | 'chocolates'
  | 'blueBills'
  | 'candles'
  | 'gifts'
  | 'miniCakes';

interface TraditionCategory {
  id: TraditionKey;
  label: string;
  symbol: string;
  itemType: string;
  list: TraditionPerson[];
}

export const SevenTraditionsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TraditionKey>('roses');

  const traditionsData: Record<TraditionKey, TraditionCategory> = {
    roses: {
      id: 'roses',
      label: '7 ROSES',
      symbol: '🌹',
      itemType: 'Rose',
      list: [
        { number: 1, label: '1st Rose', name: 'Lolo Melencio' },
        { number: 2, label: '2nd Rose', name: 'Papa Nog' },
        { number: 3, label: '3rd Rose', name: 'Tito Emmel' },
        { number: 4, label: '4th Rose', name: 'Tito Bernard' },
        { number: 5, label: '5th Rose', name: 'Kuya MC' },
        { number: 6, label: '6th Rose', name: 'Kuya Sky' },
        { number: 7, label: '7th Rose', name: 'Daddy Jun' },
      ],
    },
    wishes: {
      id: 'wishes',
      label: '7 WISHES',
      symbol: '🪄',
      itemType: 'Wish',
      list: [
        { number: 1, label: '1st Wish', name: 'Mama Endang' },
        { number: 2, label: '2nd Wish', name: 'Tita Liit' },
        { number: 3, label: '3rd Wish', name: 'Tita Melody' },
        { number: 4, label: '4th Wish', name: 'Tita Sarah' },
        { number: 5, label: '5th Wish', name: 'Lola Lengget' },
        { number: 6, label: '6th Wish', name: 'Lola Lolita' },
        { number: 7, label: '7th Wish', name: 'Nanay Santa' },
      ],
    },
    makeups: {
      id: 'makeups',
      label: '7 MAKE UP',
      symbol: '💄',
      itemType: 'Make Up',
      list: [
        { number: 1, label: '1st Make Up', name: 'Ate Princess' },
        { number: 2, label: '2nd Make Up', name: 'Ate Chloe' },
        { number: 3, label: '3rd Make Up', name: 'Yannah' },
        { number: 4, label: '4th Make Up', name: 'Ate Kia' },
        { number: 5, label: '5th Make Up', name: 'Ate Che' },
        { number: 6, label: '6th Make Up', name: 'Ate Chiel' },
        { number: 7, label: '7th Make Up', name: 'Ate Jannah' },
      ],
    },
    chocolates: {
      id: 'chocolates',
      label: '7 CHOCOLATES',
      symbol: '🍫',
      itemType: 'Chocolate',
      list: [
        { number: 1, label: '1st Chocolate', name: 'Kuya Abiezer' },
        { number: 2, label: '2nd Chocolate', name: 'Kuya Craig' },
        { number: 3, label: '3rd Chocolate', name: 'Hezekiah' },
        { number: 4, label: '4th Chocolate', name: 'Ate Kaykay' },
        { number: 5, label: '5th Chocolate', name: 'Kuya Jayrell' },
        { number: 6, label: '6th Chocolate', name: 'Ate Zhyrish' },
        { number: 7, label: '7th Chocolate', name: 'Ate Tirzah' },
      ],
    },
    blueBills: {
      id: 'blueBills',
      label: '7 BLUE BILLS',
      symbol: '💵',
      itemType: 'Blue Bill',
      list: [
        { number: 1, label: '1st Blue Bill', name: 'Ninong Jed' },
        { number: 2, label: '2nd Blue Bill', name: 'Ninong Mher' },
        { number: 3, label: '3rd Blue Bill', name: 'Ninong Sherman' },
        { number: 4, label: '4th Blue Bill', name: 'Ninong Aike' },
        { number: 5, label: '5th Blue Bill', name: 'Ninong Uya' },
        { number: 6, label: '6th Blue Bill', name: 'Ninong Paul' },
        { number: 7, label: '7th Blue Bill', name: 'Ninong Richard' },
      ],
    },
    candles: {
      id: 'candles',
      label: '7 CANDLES',
      symbol: '🕯️',
      itemType: 'Candle',
      list: [
        { number: 1, label: '1st Candle', name: 'Ninang Melannie' },
        { number: 2, label: '2nd Candle', name: 'Ninang Regine' },
        { number: 3, label: '3rd Candle', name: 'Ninang Camille' },
        { number: 4, label: '4th Candle', name: 'Ninang Sabel' },
        { number: 5, label: '5th Candle', name: 'Ninang Marlyn' },
        { number: 6, label: '6th Candle', name: 'Ninang Rona' },
        { number: 7, label: '7th Candle', name: 'Tita Ninang Mae' },
      ],
    },
    gifts: {
      id: 'gifts',
      label: '7 GIFTS',
      symbol: '🎁',
      itemType: 'Gift',
      list: [
        { number: 1, label: '1st Gift', name: 'Ninang Jacqueline Oraya' },
        { number: 2, label: '2nd Gift', name: 'Ninang Mhira' },
        { number: 3, label: '3rd Gift', name: 'Ninong Angelo' },
        { number: 4, label: '4th Gift', name: 'Ninang Janette' },
        { number: 5, label: '5th Gift', name: 'Tita Ganda' },
        { number: 6, label: '6th Gift', name: 'Tito Harley' },
        { number: 7, label: '7th Gift', name: 'Tito Kenneth' },
      ],
    },
    miniCakes: {
      id: 'miniCakes',
      label: '7 MINI CAKES',
      symbol: '🧁',
      itemType: 'Mini Cake',
      list: [
        { number: 1, label: '1st Mini Cake', name: 'Ninong Dongke' },
        { number: 2, label: '2nd Mini Cake', name: 'Ninong Tinoy' },
        { number: 3, label: '3rd Mini Cake', name: 'Ninang Jacky Rodriguez' },
        { number: 4, label: '4th Mini Cake', name: 'Ninang Sha' },
        { number: 5, label: '5th Mini Cake', name: 'Ninong Peter' },
        { number: 6, label: '6th Mini Cake', name: 'Ninong Reschian' },
        { number: 7, label: '7th Mini Cake', name: 'Ninong Lee' },
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
            The Royal Traditions
          </h2>
          <p className="mt-2 font-poppins text-sm sm:text-base text-[#6C567B]/85 font-normal">
            Honored participants for Princess Zia Venice’s 7th Birthday
          </p>
        </div>

        {/* Tab Buttons (All 8 Categories) */}
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
                  <span className="font-poppins text-sm sm:text-base font-semibold text-[#6C567B]">
                    {item.name}
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
