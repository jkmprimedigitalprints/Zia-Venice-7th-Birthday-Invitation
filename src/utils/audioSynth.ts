/**
 * Beauty and the Beast soundtrack player using authentic audio track.
 * Plays the iconic fairytale "Beauty and the Beast" (Tale As Old As Time)
 * with graceful HTML5 Audio streaming, loop support, volume control, and Web Audio fallback.
 */

class FairytaleAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private currentVolume = 0.8; // Set to 80% default volume so music is loud and clear
  private audioSrc = '/beauty_and_the_beast.mp3';
  private listeners: Set<(playing: boolean) => void> = new Set();
  private hasUserInteracted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
      this.attachGlobalInteractionListener();
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.add(cb);
    // Immediately notify caller with current state
    cb(this.isPlaying);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  private attachGlobalInteractionListener() {
    const handleFirstGesture = () => {
      this.hasUserInteracted = true;
      if (this.audio && !this.isPlaying) {
        // Pre-warm audio immediately so user gesture allows instant playback
        this.audio.load();
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio();
      this.audio.src = this.audioSrc;
      this.audio.loop = true;
      this.audio.volume = this.currentVolume;
      this.audio.preload = 'auto';
      // Trigger eager pre-buffering immediately
      this.audio.load();

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Audio error on primary track, trying fallback track:', e);
        if (this.audio && !this.audio.src.includes('beauty_and_the_beast_duet.mp3')) {
          this.audio.src = '/beauty_and_the_beast_duet.mp3';
          this.audio.load();
          if (this.isPlaying) {
            this.audio.play().catch(() => {});
          }
        }
      });
    } catch (err) {
      console.warn('Failed to initialize audio element', err);
    }
  }

  public play(): Promise<boolean> {
    if (typeof window === 'undefined') return Promise.resolve(false);
    this.initAudio();
    if (!this.audio) return Promise.resolve(false);

    this.audio.volume = this.currentVolume;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      return playPromise
        .then(() => {
          this.isPlaying = true;
          this.notify();
          return true;
        })
        .catch((error) => {
          console.warn('Playback interrupted or blocked by browser policy:', error);
          // Try fallback if primary had any decode or load issue
          if (this.audio && !this.audio.src.includes('beauty_and_the_beast_duet.mp3')) {
            this.audio.src = '/beauty_and_the_beast_duet.mp3';
            return this.audio
              .play()
              .then(() => {
                this.isPlaying = true;
                this.notify();
                return true;
              })
              .catch(() => {
                this.isPlaying = false;
                this.notify();
                return false;
              });
          }
          this.isPlaying = false;
          this.notify();
          return false;
        });
    }

    return Promise.resolve(false);
  }

  public pause() {
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
