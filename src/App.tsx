import React, { useState } from 'react';
import { ParticleCanvas } from './components/ParticleCanvas';
import { StorybookIntro } from './components/StorybookIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { SevenMilestoneSection } from './components/SevenMilestoneSection';
import { SevenTraditionsSection } from './components/SevenTraditionsSection';
import { CountdownSection } from './components/CountdownSection';
import { DetailsSection } from './components/DetailsSection';
import { GallerySection } from './components/GallerySection';
import { GuestbookSection } from './components/GuestbookSection';
import { MusicPlayer } from './components/MusicPlayer';
import { FooterSection } from './components/FooterSection';
import { fairytaleAudio } from './utils/audioSynth';
import { EVENT_DATA } from './data/eventData';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Sync state with audio element events
  React.useEffect(() => {
    const unsubscribe = fairytaleAudio.subscribe((playing) => {
      setIsMusicPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleEnterFairytale = () => {
    setShowIntro(false);
    fairytaleAudio.play();
  };

  const handleHeroEnter = () => {
    const storyElem = document.getElementById('story');
    if (storyElem) {
      storyElem.scrollIntoView({ behavior: 'smooth' });
    }
    if (!isMusicPlaying) {
      fairytaleAudio.play();
    }
  };

  const handleMusicToggle = () => {
    fairytaleAudio.toggle();
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9F3] text-[#6C567B] font-poppins overflow-x-hidden selection:bg-[#F8DDE8] selection:text-[#6C567B]">
      {/* Living Multi-layered Fairytale Canvas (Clouds, Flying Butterflies, Falling Petals, Sparkles & Fairy Dust) */}
      <ParticleCanvas />

      {/* Storybook Intro Modal Sequence on Initial Page Load */}
      {showIntro && (
        <StorybookIntro
          onEnter={handleEnterFairytale}
          celebrantName={EVENT_DATA.celebrantName}
        />
      )}

      {/* Fixed Frosted Light Pastel Top Navigation */}
      <Navbar
        onMusicToggle={handleMusicToggle}
        isMusicPlaying={isMusicPlaying}
      />

      {/* Main Light Pastel Fairytale Sections */}
      <main>
        {/* 1. Hero with Glowing Number 7, Daylight Castle, and Sequenced Animations */}
        <HeroSection onEnterClick={handleHeroEnter} />

        {/* 2. Story: A Little Princess Turns Seven */}
        <StorySection />

        {/* 3. Special "7" Feature: Seven Years of Magic */}
        <SevenMilestoneSection />

        {/* 4. Royal Milestones: 7 Roses · 7 Candles · 7 Wishes */}
        <SevenTraditionsSection />

        {/* 5. Countdown: The Magic Begins In... (November 14, 2026) */}
        <CountdownSection />

        {/* 6. Birthday Details: Date, Time, Jollibee & Dress Code */}
        <DetailsSection />

        {/* 7. Seven Magical Moments: Dedicated 7-Photo Gallery (first.jpg to seven.jpg) */}
        <GallerySection />

        {/* 8. Real-Time Fairytale Messages: Wishes for Princess Zia */}
        <GuestbookSection />
      </main>

      {/* Fixed Floating Music Player with 🎵 */}
      <MusicPlayer
        isPlaying={isMusicPlaying}
        onToggle={handleMusicToggle}
      />

      {/* Footer: Happily Ever After Begins */}
      <FooterSection />
    </div>
  );
}
