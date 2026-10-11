import React, { useEffect } from 'react';
import { 
  ArrowLeft, Crown, Sparkles, Heart, Star, Church, Music 
} from 'lucide-react';
import { TRADITIONS_DATA } from '../data/traditionsData';

interface ProgramFlowPageProps {
  onBackToInvitation: () => void;
}

export const ProgramFlowPage: React.FC<ProgramFlowPageProps> = ({ onBackToInvitation }) => {
  // Ensure page scrolls to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#6C567B] font-poppins selection:bg-[#F8DDE8] selection:text-[#6C567B] pb-24">
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F8DDE8] px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToInvitation}
            className="flex items-center gap-2 text-xs font-semibold text-[#6C567B] hover:text-[#9E4D6E] px-3 py-2 rounded-xl border border-[#F8DDE8] bg-[#FFF9F3] hover:bg-white transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#9E4D6E]" />
            <span>Back to Invitation</span>
          </button>

          <div className="text-right">
            <h1 className="font-playfair text-sm sm:text-base font-bold text-[#9E4D6E] leading-tight">
              Program Flow
            </h1>
            <p className="text-[10px] text-[#6C567B]/70 hidden sm:block">
              Princess Zia Venice Abonal · 7th Birthday
            </p>
          </div>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-8">
        {/* Page Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#C49A55]/30 text-[#C49A55] text-xs uppercase tracking-widest font-semibold shadow-2xs">
            <Crown className="h-3.5 w-3.5" />
            <span>Royal Celebration Itinerary</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#6C567B] tracking-wide">
            Program Flow
          </h2>

          <p className="font-sacramento text-4xl sm:text-5xl text-[#9E4D6E] font-normal">
            A Magical Afternoon of Celebrations
          </p>
        </div>

        {/* Timeline Sequence */}
        <div className="relative space-y-6 before:absolute before:inset-0 before:left-4 sm:before:left-7 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#C49A55] before:via-[#9E4D6E]/40 before:to-[#9E4D6E] before:hidden md:before:block">
          
          {/* 1. Grand Entrance (Visually Prominent Highlight) */}
          <section className="relative rounded-3xl bg-gradient-to-br from-[#FFF5EA] via-[#FFF0F4] to-[#FFF9F3] border-2 border-[#C49A55] p-6 sm:p-7 shadow-[0_12px_35px_rgba(196,154,85,0.18)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F8DDE8] to-[#FFF9F3] text-[#9E4D6E] border border-[#C49A55]/40 shadow-xs shrink-0">
                <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-[#C49A55]" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4D6E] text-white text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                  <Sparkles className="h-3 w-3" />
                  <span>Grand Royal Opening</span>
                </div>

                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#9E4D6E]">
                  The Grand Entrance
                </h3>

                <p className="text-sm font-semibold text-[#6C567B] font-poppins">
                  The grand entrance of our birthday celebrant.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Opening Prayer / Ceremony */}
          <section className="rounded-3xl bg-white/95 border border-[#F8DDE8] p-6 sm:p-7 shadow-[0_8px_30px_rgba(108,86,123,0.06)] backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#E9DDF7] text-[#9E4D6E] border border-[#F8DDE8] shrink-0">
                <Church className="h-5 w-5 sm:h-6 sm:w-6 text-[#6C567B]" />
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4A7B9D]">
                  Solemn Blessing
                </span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#6C567B]">
                  Opening Prayer
                </h3>
                <p className="text-sm font-semibold text-[#9E4D6E] font-poppins">
                  Officiated by: Brother Bunso
                </p>
              </div>
            </div>
          </section>

          {/* 3. 7 Gifts 🎁 */}
          <section className="rounded-3xl bg-white/95 border border-[#C49A55]/30 p-6 sm:p-7 shadow-[0_8px_30px_rgba(108,86,123,0.06)] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F8DDE8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{TRADITIONS_DATA.gifts.symbol}</span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#6C567B]">
                  {TRADITIONS_DATA.gifts.label}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF9F3] border border-[#F8DDE8] text-[11px] font-semibold text-[#9E4D6E]">
                7 Participants
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TRADITIONS_DATA.gifts.list.map((person) => (
                <div
                  key={person.number}
                  className="flex items-center gap-3 rounded-2xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-4 py-3 hover:border-[#C49A55] transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F8DDE8] text-[#9E4D6E] font-poppins text-xs font-bold shrink-0">
                    {person.number}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#6C567B] font-poppins">
                    {person.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. 7 Chocolates 🍫 */}
          <section className="rounded-3xl bg-white/95 border border-[#C49A55]/30 p-6 sm:p-7 shadow-[0_8px_30px_rgba(108,86,123,0.06)] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F8DDE8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{TRADITIONS_DATA.chocolates.symbol}</span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#6C567B]">
                  {TRADITIONS_DATA.chocolates.label}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF9F3] border border-[#F8DDE8] text-[11px] font-semibold text-[#9E4D6E]">
                7 Participants
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TRADITIONS_DATA.chocolates.list.map((person) => (
                <div
                  key={person.number}
                  className="flex items-center gap-3 rounded-2xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-4 py-3 hover:border-[#C49A55] transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F8DDE8] text-[#9E4D6E] font-poppins text-xs font-bold shrink-0">
                    {person.number}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#6C567B] font-poppins">
                    {person.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. 7 Make Up 💄 */}
          <section className="rounded-3xl bg-white/95 border border-[#C49A55]/30 p-6 sm:p-7 shadow-[0_8px_30px_rgba(108,86,123,0.06)] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F8DDE8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{TRADITIONS_DATA.makeups.symbol}</span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#6C567B]">
                  {TRADITIONS_DATA.makeups.label}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF9F3] border border-[#F8DDE8] text-[11px] font-semibold text-[#9E4D6E]">
                7 Participants
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TRADITIONS_DATA.makeups.list.map((person) => (
                <div
                  key={person.number}
                  className="flex items-center gap-3 rounded-2xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-4 py-3 hover:border-[#C49A55] transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F8DDE8] text-[#9E4D6E] font-poppins text-xs font-bold shrink-0">
                    {person.number}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#6C567B] font-poppins">
                    {person.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 6. 7 Blue Bills 💵 */}
          <section className="rounded-3xl bg-white/95 border border-[#C49A55]/30 p-6 sm:p-7 shadow-[0_8px_30px_rgba(108,86,123,0.06)] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F8DDE8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{TRADITIONS_DATA.blueBills.symbol}</span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#6C567B]">
                  {TRADITIONS_DATA.blueBills.label}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF9F3] border border-[#F8DDE8] text-[11px] font-semibold text-[#9E4D6E]">
                7 Participants
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TRADITIONS_DATA.blueBills.list.map((person) => (
                <div
                  key={person.number}
                  className="flex items-center gap-3 rounded-2xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-4 py-3 hover:border-[#C49A55] transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F8DDE8] text-[#9E4D6E] font-poppins text-xs font-bold shrink-0">
                    {person.number}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#6C567B] font-poppins">
                    {person.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 7. 7 Mini Cakes 🧁 */}
          <section className="rounded-3xl bg-white/95 border border-[#C49A55]/30 p-6 sm:p-7 shadow-[0_8px_30px_rgba(108,86,123,0.06)] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F8DDE8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{TRADITIONS_DATA.miniCakes.symbol}</span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#6C567B]">
                  {TRADITIONS_DATA.miniCakes.label}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF9F3] border border-[#F8DDE8] text-[11px] font-semibold text-[#9E4D6E]">
                7 Participants
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TRADITIONS_DATA.miniCakes.list.map((person) => (
                <div
                  key={person.number}
                  className="flex items-center gap-3 rounded-2xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-4 py-3 hover:border-[#C49A55] transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F8DDE8] text-[#9E4D6E] font-poppins text-xs font-bold shrink-0">
                    {person.number}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#6C567B] font-poppins">
                    {person.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 8. 7 Wishes 🪄 */}
          <section className="rounded-3xl bg-white/95 border border-[#C49A55]/30 p-6 sm:p-7 shadow-[0_8px_30px_rgba(108,86,123,0.06)] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F8DDE8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{TRADITIONS_DATA.wishes.symbol}</span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#6C567B]">
                  {TRADITIONS_DATA.wishes.label}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF9F3] border border-[#F8DDE8] text-[11px] font-semibold text-[#9E4D6E]">
                7 Participants
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TRADITIONS_DATA.wishes.list.map((person) => (
                <div
                  key={person.number}
                  className="flex items-center gap-3 rounded-2xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-4 py-3 hover:border-[#C49A55] transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F8DDE8] text-[#9E4D6E] font-poppins text-xs font-bold shrink-0">
                    {person.number}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#6C567B] font-poppins">
                    {person.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 9. 7 Candles 🕯️ */}
          <section className="rounded-3xl bg-white/95 border border-[#C49A55]/30 p-6 sm:p-7 shadow-[0_8px_30px_rgba(108,86,123,0.06)] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#F8DDE8] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{TRADITIONS_DATA.candles.symbol}</span>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#6C567B]">
                  {TRADITIONS_DATA.candles.label}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFF9F3] border border-[#F8DDE8] text-[11px] font-semibold text-[#9E4D6E]">
                7 Participants
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TRADITIONS_DATA.candles.list.map((person) => (
                <div
                  key={person.number}
                  className="flex items-center gap-3 rounded-2xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-4 py-3 hover:border-[#C49A55] transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F8DDE8] text-[#9E4D6E] font-poppins text-xs font-bold shrink-0">
                    {person.number}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#6C567B] font-poppins">
                    {person.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Special Birthday Message (Distinct Visual Highlight, Immediately Before 7 Roses) */}
          <section className="relative rounded-3xl bg-gradient-to-r from-[#FFF5EA] via-[#F8DDE8]/80 to-[#E9DDF7]/80 border-2 border-[#C49A55] p-6 sm:p-7 shadow-[0_12px_40px_rgba(196,154,85,0.22)] overflow-hidden">
            {/* Glow backdrop accent */}
            <div className="pointer-events-none absolute -right-6 -bottom-6 text-[#C49A55]/15">
              <Star className="h-32 w-32 fill-current" />
            </div>

            <div className="relative z-10 flex items-center gap-5">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C49A55] to-[#9E4D6E] text-white shadow-md shrink-0">
                <Star className="h-7 w-7 sm:h-8 sm:w-8 fill-current" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C49A55] text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                  <Sparkles className="h-3 w-3" />
                  <span>Special Birthday Message</span>
                </div>

                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#9E4D6E]">
                  Special Birthday Message for Zia Venice
                </h3>

                <p className="text-base sm:text-lg font-bold text-[#6C567B] font-poppins">
                  From her Kap Idol, Jun Laurel
                </p>
              </div>
            </div>
          </section>

          {/* 11. 7 Roses 🌹 (FINAL CEREMONY OF THE PROGRAM - Elegant & Memorable Closing Highlight) */}
          <section className="relative rounded-3xl bg-gradient-to-br from-[#FFF0F4] via-[#FFF9F3] to-[#F8DDE8]/90 border-2 border-[#9E4D6E] p-6 sm:p-7 shadow-[0_14px_45px_rgba(158,77,110,0.2)] overflow-hidden space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F8DDE8] pb-4">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl sm:text-4xl">{TRADITIONS_DATA.roses.symbol}</span>
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-[#9E4D6E]">
                    <Sparkles className="h-3 w-3" />
                    <span></span>
                  </div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#9E4D6E]">
                    {TRADITIONS_DATA.roses.label}
                  </h3>
                </div>
              </div>

              <span className="self-start sm:self-center px-3 py-1 rounded-full bg-[#9E4D6E] text-white text-xs font-bold shadow-2xs">
              
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {TRADITIONS_DATA.roses.list.map((person) => {
                const isDaddyJun = person.name.includes('Daddy Jun');
                return (
                  <div
                    key={person.number}
                    className={`flex items-center justify-between rounded-2xl p-4 transition-all ${
                      isDaddyJun
                        ? 'border-2 border-[#9E4D6E] bg-gradient-to-r from-rose-100/80 via-white to-pink-100/80 shadow-md sm:col-span-2'
                        : 'border border-[#F8DDE8] bg-white/90 hover:border-[#9E4D6E]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl font-poppins text-xs font-bold shadow-2xs shrink-0 ${
                          isDaddyJun
                            ? 'bg-[#9E4D6E] text-white'
                            : 'bg-[#F8DDE8] text-[#9E4D6E]'
                        }`}
                      >
                        {person.number}
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-bold text-[#6C567B] font-poppins block">
                          {person.name}
                        </span>
                      </div>
                    </div>

                    <Heart
                      className={`h-4 w-4 shrink-0 ${
                        isDaddyJun ? 'text-[#9E4D6E] fill-[#9E4D6E]' : 'text-[#9E4D6E]/50'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* 12. Intermission No. of Celebrant */}
          <section className="relative rounded-3xl bg-gradient-to-br from-[#FFF5EA] via-[#FFF0F4] to-[#FFF9F3] border-2 border-[#C49A55] p-6 sm:p-7 shadow-[0_12px_35px_rgba(196,154,85,0.18)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F8DDE8] to-[#FFF9F3] text-[#9E4D6E] border border-[#C49A55]/40 shadow-xs shrink-0">
                <Music className="h-6 w-6 sm:h-7 sm:w-7 text-[#C49A55]" />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#9E4D6E]">
                  Intermission No. of Celebrant
                </h3>

                <p className="text-sm font-semibold text-[#6C567B] font-poppins">
                  A special intermission performance by Princess Zia Venice
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Bottom Back Button */}
        <div className="text-center pt-6">
          <button
            onClick={onBackToInvitation}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#9E4D6E] hover:bg-[#853C5A] text-white px-7 py-3.5 font-poppins text-sm font-semibold shadow-md shadow-[#9E4D6E]/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Main Invitation</span>
          </button>
        </div>
      </main>
    </div>
  );
};
