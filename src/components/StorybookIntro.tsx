import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown, ChevronRight } from 'lucide-react';

interface StorybookIntroProps {
  onEnter: () => void;
  celebrantName: string;
}

export const StorybookIntro: React.FC<StorybookIntroProps> = ({ onEnter }) => {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Fast, responsive staged cinematic sequence without lag
    const t1 = setTimeout(() => setStage(1), 150);   // Card fades in
    const t2 = setTimeout(() => setStage(2), 500);   // "Once Upon a Time…"
    const t3 = setTimeout(() => setStage(3), 2000);  // "You’re Invited to"
    const t4 = setTimeout(() => setStage(4), 2600);  // "Zia Venice’s"
    const t5 = setTimeout(() => setStage(5), 3200);  // "7th Birthday"
    const t6 = setTimeout(() => setStage(6), 3800);  // Button appears

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  const handleEnterClick = () => {
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#FFF9F3] px-4 select-none">
      {/* Daylight Castle Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: `url('/src/assets/images/fairytale_castle_daylight_1791472226707.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F3]/90 via-[#FFF9F3]/75 to-[#FFF9F3]" />
      </div>

      {/* Decorative Butterflies */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-8 text-2xl animate-float opacity-70" style={{ animationDuration: '7s' }}>
          🦋
        </div>
        <div className="absolute bottom-1/4 right-8 text-2xl animate-float opacity-70" style={{ animationDuration: '8s', animationDelay: '2s' }}>
          🦋
        </div>
      </div>

      {/* Storybook Royal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{
          opacity: stage >= 1 ? 1 : 0,
          scale: stage >= 1 ? 1 : 0.95,
          y: stage >= 1 ? 0 : 15,
        }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border-2 border-[#C49A55]/40 bg-white/95 p-6 sm:p-10 text-center shadow-[0_15px_45px_rgba(108,86,123,0.12)] backdrop-blur-md will-change-transform"
      >
        {/* Ornate Gold Border Corners */}
        <div className="pointer-events-none absolute top-3 left-4 text-[#C49A55]/60 text-xl">❧</div>
        <div className="pointer-events-none absolute top-3 right-4 text-[#C49A55]/60 text-xl">☙</div>
        <div className="pointer-events-none absolute bottom-3 left-4 text-[#C49A55]/60 text-xl">❧</div>
        <div className="pointer-events-none absolute bottom-3 right-4 text-[#C49A55]/60 text-xl">☙</div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Royal Crown Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: stage >= 2 ? 1 : 0,
              scale: stage >= 2 ? 1 : 0.8,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-3 inline-flex items-center justify-center"
          >
            <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-[#C49A55] bg-white shadow-[0_4px_20px_rgba(196,154,85,0.35)]">
              <Crown className="h-7 w-7 text-[#C49A55]" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#C49A55] animate-twinkle" />
            </div>
          </motion.div>

          {/* STAGE A: "Once Upon a Time…" */}
          <AnimatePresence mode="wait">
            {stage === 2 && (
              <motion.div
                key="once-upon-a-time"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="py-4"
              >
                <p className="font-sacramento text-4xl sm:text-5xl md:text-6xl text-[#6C567B] font-normal leading-relaxed">
                  Once Upon a Time…
                </p>
                <p className="mt-2 font-poppins text-xs tracking-widest text-[#4A7B9D] font-semibold">
                  A magical fairytale story begins
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STAGE B: “You’re Invited to Zia Venice’s 7th Birthday” */}
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-1 sm:space-y-2"
            >
              {/* 1. “You’re Invited to” */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 10 }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-playfair text-xl sm:text-2xl tracking-wider font-semibold text-[#6C567B]">
                  You’re Invited to
                </span>
              </motion.div>

              {/* 2. “Zia Venice’s” (Sacramento Font, Title Case, Blush Pink) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: stage >= 4 ? 1 : 0,
                  scale: stage >= 4 ? 1 : 0.95,
                }}
                transition={{ duration: 0.6 }}
                className="py-1"
              >
                <h1 className="font-sacramento text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-tight text-[#9E4D6E]">
                  Zia Venice’s
                </h1>
              </motion.div>

              {/* 3. “7th Birthday” */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: stage >= 5 ? 1 : 0,
                  y: stage >= 5 ? 0 : 10,
                }}
                transition={{ duration: 0.5 }}
                className="space-y-1"
              >
                <div className="inline-flex items-center gap-2">
                  <span className="text-lg animate-twinkle text-[#C49A55]">✨</span>
                  <h2 className="font-sacramento text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-[#4A7B9D]">
                    7th Birthday
                  </h2>
                  <span className="text-lg animate-twinkle text-[#C49A55]">✨</span>
                </div>
                <p className="font-poppins text-xs sm:text-sm text-[#6C567B] font-medium">
                  A magical fairytale celebration filled with wonder, smiles & sweet memories
                </p>
              </motion.div>

              {/* 4. Open Invitation Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: stage >= 6 ? 1 : 0,
                  y: stage >= 6 ? 0 : 15,
                }}
                transition={{ duration: 0.5 }}
                className="pt-4"
              >
                <button
                  onPointerDown={() => {
                    // Start audio on the very first touch contact for zero-delay response
                    onEnter();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    onEnter();
                  }}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-[#C49A55] bg-gradient-to-r from-[#F8DDE8] via-[#FFF9F3] to-[#E9DDF7] px-8 py-3.5 font-poppins text-xs font-semibold tracking-widest text-[#6C567B] shadow-[0_6px_25px_rgba(196,154,85,0.3)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer will-change-transform"
                >
                  <Sparkles className="h-4 w-4 text-[#C49A55]" />
                  <span>Open Invitation</span>
                  <ChevronRight className="h-4 w-4 text-[#C49A55] transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
