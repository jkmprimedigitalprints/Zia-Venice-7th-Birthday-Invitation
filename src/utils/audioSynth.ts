/**
 * Beauty and the Beast soundtrack player using authentic audio track.
 * Plays the iconic fairytale "Beauty and the Beast" (Tale As Old As Time)
 * with graceful HTML5 Audio streaming, loop support, volume control,
 * and intelligent browser autoplay unlock on first user gesture.
 */

class FairytaleAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isPendingPlay = false;
  private isUserMuted = false;
  private currentVolume = 0.8; // 80% volume for clear, balanced fairytale ambiance
  private audioSrc = '/beauty_and_the_beast.mp3';
  private fallbackSrc = '/beauty_and_the_beast_duet.mp3';
  private listeners: Set<(playing: boolean) => void> = new Set();
  private hasUnlockedAudio = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
      this.attachGlobalInteractionListener();
      // Attempt immediate autoplay on mount (allowed on browsers with user permission/MEI)
      this.tryAutoPlay();
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.add(cb);
    cb(this.isPlaying);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  /**
   * Modern browsers (Chrome, iOS Safari, Android) enforce strict Autoplay Policies:
   * Audio cannot start without a user interaction (click, tap, touch).
   * This global listener ensures that the VERY FIRST tap or click anywhere on the page
   * (e.g. tapping "Open Invitation", tapping background, scrolling) seamlessly unlocks
   * and starts the fairytale music without requiring the user to find the music button.
   */
  private attachGlobalInteractionListener() {
    const unlockAndPlay = () => {
      if (this.hasUnlockedAudio) return;
      this.hasUnlockedAudio = true;

      // Clean up event listeners once first gesture is registered
      window.removeEventListener('click', unlockAndPlay, true);
      window.removeEventListener('touchstart', unlockAndPlay, true);
      window.removeEventListener('pointerdown', unlockAndPlay, true);
      window.removeEventListener('keydown', unlockAndPlay, true);

      // If user hasn't explicitly muted and music isn't already playing, play now
      if (!this.isPlaying && !this.isUserMuted) {
        this.play().catch(() => {});
      }
    };

    window.addEventListener('click', unlockAndPlay, { capture: true, passive: true });
    window.addEventListener('touchstart', unlockAndPlay, { capture: true, passive: true });
    window.addEventListener('pointerdown', unlockAndPlay, { capture: true, passive: true });
    window.addEventListener('keydown', unlockAndPlay, { capture: true, passive: true });
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio();
      this.audio.src = this.audioSrc;
      this.audio.loop = true;
      this.audio.volume = this.currentVolume;
      this.audio.preload = 'auto';
      // Eager pre-load audio buffer so playback starts immediately with 0 delay
      this.audio.load();

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.isPendingPlay = false;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.isPendingPlay = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.isPendingPlay = false;
        this.notify();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('[Audio] Error on primary track, trying fallback track:', e);
        if (this.audio && !this.audio.src.includes(this.fallbackSrc)) {
          this.audio.src = this.fallbackSrc;
          this.audio.load();
          if (!this.isUserMuted && this.isPlaying) {
            this.audio.play().catch(() => {});
          }
        }
      });
    } catch (err) {
      console.warn('[Audio] Failed to initialize audio element', err);
    }
  }

  public tryAutoPlay() {
    if (typeof window === 'undefined') return;
    this.initAudio();
    if (!this.audio || this.isUserMuted || this.isPlaying || this.isPendingPlay) return;

    // Silent attempt to autoplay on page load if browser policy permits
    const p = this.audio.play();
    if (p !== undefined) {
      p.then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch(() => {
        // Expected on fresh domains or mobile browsers requiring a user gesture
        // Global interaction listener will start it seamlessly on the first tap/click
      });
    }
  }

  public async play(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    this.initAudio();
    if (!this.audio) return false;

    // Already playing or play request currently in-flight
    if (this.isPlaying) return true;
    if (this.isPendingPlay) return true;

    this.isUserMuted = false;
    this.isPendingPlay = true;
    this.audio.volume = this.currentVolume;

    try {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.isPlaying = true;
        this.isPendingPlay = false;
        this.notify();
        return true;
      }
      this.isPendingPlay = false;
      return false;
    } catch (error: unknown) {
      this.isPendingPlay = false;
      const err = error as { name?: string; message?: string };

      // AbortError occurs when a play call was paused or re-triggered rapidly; do NOT switch tracks
      if (err?.name === 'AbortError') {
        return false;
      }

      // NotAllowedError happens when browser requires user gesture first
      if (err?.name === 'NotAllowedError') {
        this.isPlaying = false;
        this.notify();
        return false;
      }

      console.warn('[Audio] Playback error:', err?.message || error);

      // Only attempt fallback track on genuine media or decode errors
      if (this.audio && !this.audio.src.includes(this.fallbackSrc)) {
        try {
          this.audio.src = this.fallbackSrc;
          this.audio.load();
          await this.audio.play();
          this.isPlaying = true;
          this.notify();
          return true;
        } catch {
          this.isPlaying = false;
          this.notify();
          return false;
        }
      }

      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public pause() {
    this.isUserMuted = true;
    this.isPendingPlay = false;
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.pause();
      return Promise.resolve(false);
    } else {
      this.isUserMuted = false;
      return this.play();
    }
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val));
    if (this.audio) {
      this.audio.volume = this.currentVolume;
    }
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const fairytaleAudio = new FairytaleAudioPlayer();
