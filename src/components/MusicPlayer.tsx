import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';
import { fairytaleAudio } from '../utils/audioSynth';

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onToggle }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(25); // Set gentle default volume around 25%

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      fairytaleAudio.setVolume(volume / 100);
      setIsMuted(false);
    } else {
      fairytaleAudio.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (!isMuted) {
      fairytaleAudio.setVolume(val / 100);
    }
  };

  return (
    <aside
      aria-label="Fairytale music player"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
    >
      {/* Expanded Controls Card */}
      {isExpanded && (
        <div className="mb-2 w-64 rounded-2xl border border-[#C49A55]/40 bg-white/95 p-4 shadow-[0_10px_30px_rgba(108,86,123,0.12)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-[#F8DDE8] pb-2">
            <div className="flex items-center gap-1.5 text-[#6C567B]">
              <Sparkles className="h-3.5 w-3.5 text-[#C49A55]" />
              <span className="font-playfair text-xs font-bold tracking-wider text-[#6C567B]">
                Beauty and the Beast
              </span>
            </div>
            <span className="font-poppins text-[10px] font-medium text-[#4A7B9D]">
              {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>

          <p className="mt-1 font-poppins text-[10px] text-[#6C567B]/75">
            Tale as Old as Time · Fairytale Soundtrack
          </p>

          {/* Volume slider */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleMuteToggle}
              className="text-[#9E4D6E] hover:text-[#6C567B] transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#F8DDE8] accent-[#9E4D6E]"
            />
            <span className="font-poppins text-[10px] tabular-nums text-[#6C567B]/70 w-6">
              {isMuted ? 0 : volume}%
            </span>
          </div>
        </div>
      )}

      {/* Floating Main Music Pill / Button with 🎵 icon */}
      <div className="flex items-center gap-1.5 rounded-full border border-[#C49A55]/40 bg-white/95 p-1.5 shadow-[0_4px_20px_rgba(108,86,123,0.12)] backdrop-blur-md transition-all hover:shadow-[0_6px_25px_rgba(196,154,85,0.3)]">
        <button
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#F8DDE8] via-[#FFF9F3] to-[#E9DDF7] text-[#6C567B] border border-[#C49A55]/30 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label={isPlaying ? 'Pause music' : 'Play fairytale music'}
          title={isPlaying ? 'Pause music' : 'Play fairytale music'}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-[#9E4D6E]" />
          ) : (
            <Play className="h-4 w-4 text-[#9E4D6E] ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-2.5 py-1 text-left cursor-pointer"
          aria-label="Toggle sound settings"
        >
          <div className="hidden sm:block">
            <div className="font-playfair text-[11px] font-bold tracking-wider text-[#6C567B]">
              Beauty and the Beast
            </div>
            <div className="font-poppins text-[9px] text-[#4A7B9D] font-medium">
              {isPlaying ? 'Tale as Old as Time 🎵' : 'Tap to play music'}
            </div>
          </div>
          <span
            className={`text-base transition-transform ${
              isPlaying ? 'animate-bounce inline-block' : 'opacity-70'
            }`}
            role="img"
            aria-label="music note"
          >
            🎵
          </span>
        </button>
      </div>
    </aside>
  );
};
