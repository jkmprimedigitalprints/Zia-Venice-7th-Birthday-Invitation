import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircleHeart, Send, Heart } from 'lucide-react';
import { GuestWish } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

export const GuestbookSection: React.FC = () => {
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👑');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emojis = ['👑', '✨', '💖', '🌸', '🪄', '🦋'];

  // Fetch messages from backend server with localStorage resilience
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setWishes(data);
          try {
            if (data.length > 0) {
              localStorage.setItem('zia_guestbook_wishes', JSON.stringify(data));
            } else {
              localStorage.removeItem('zia_guestbook_wishes');
            }
          } catch {
            // ignore storage quota errors
          }
        }
      }
    } catch {
      // Offline fallback: load from cached wishes if offline
    }
  };

  useEffect(() => {
    fetchMessages();

    // 1. Firebase Firestore Native onSnapshot Real-time Listener
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      unsubscribeFirestore = onSnapshot(
        collection(db, 'messages'),
        (snapshot) => {
          const msgs: GuestWish[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            msgs.push({
              id: data.id || d.id,
              author: data.author,
              relation: data.relation || 'Royal Guest',
              message: data.message,
              sparkleEmoji: data.sparkleEmoji || '✨',
              timestamp: data.timestamp || 'Just now',
            });
          });
          setWishes(msgs);
          try {
            if (msgs.length > 0) {
              localStorage.setItem('zia_guestbook_wishes', JSON.stringify(msgs));
            } else {
              localStorage.removeItem('zia_guestbook_wishes');
            }
          } catch {
            // ignore
          }
        },
        (error) => {
          console.warn('[Guestbook] Firestore listener notice:', error);
          try {
            handleFirestoreError(error, OperationType.GET, 'messages');
          } catch {
            // Handled
          }
        }
      );
    } catch (err) {
      console.warn('[Guestbook] Could not attach Firestore listener:', err);
    }

    return () => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const safeMsgId = `wish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newWish: GuestWish = {
      id: safeMsgId,
      author: author.trim(),
      relation: relation.trim() || 'Royal Guest',
      message: message.trim(),
      timestamp: `Today, ${timeString}`,
      sparkleEmoji: selectedEmoji,
    };

    try {
      // 1. Direct Firebase Firestore write
      try {
        await setDoc(doc(db, 'messages', safeMsgId), {
          ...newWish,
          createdAt: new Date().toISOString(),
        });
        console.log('[Guestbook] Successfully saved directly to Firebase Firestore:', safeMsgId);
      } catch (fErr) {
        console.warn('[Guestbook] Direct Firestore write notice:', fErr);
      }

      // 2. Also notify backend endpoint for server sync / logging
      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWish),
        });
      } catch {
        // Backend API is optional when direct Firestore write succeeded
      }

      setWishes((prev) => {
        if (prev.some((w) => w.id === newWish.id)) return prev;
        const updated = [newWish, ...prev];
        try {
          localStorage.setItem('zia_guestbook_wishes', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      setAuthor('');
      setRelation('');
      setMessage('');
    } catch {
      // Fallback optimistic addition
      setWishes((prev) => {
        const updated = [newWish, ...prev];
        try {
          localStorage.setItem('zia_guestbook_wishes', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
      setAuthor('');
      setRelation('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="relative py-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#FFF9F3] via-[#F8DDE8]/25 to-[#E9DDF7]/25 scroll-mt-12">
      <div id="guestbook" className="absolute -top-24 pointer-events-none" />
      <div className="relative mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#C49A55]/30 bg-white/90 px-4 py-1 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#C49A55]" />
            <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#4A7B9D]">
              Princess Guestbook
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#C49A55]" />
          </div>
          <h2 className="font-playfair text-3xl font-bold tracking-wide text-[#6C567B] sm:text-4xl md:text-5xl">
            Wishes for Princess Zia
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-poppins text-sm sm:text-base text-[#6C567B]/85 font-normal">
            Leave your warmest blessings, smiles, and sweet thoughts as Zia Venice turns 7!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Wish Input Form */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#C49A55]/30 bg-white/95 p-6 shadow-[0_8px_30px_rgba(108,86,123,0.08)] backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <MessageCircleHeart className="h-5 w-5 text-[#9E4D6E]" />
                <h3 className="font-playfair text-base font-bold text-[#6C567B]">
                  Write Your Fairytale Wish
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-poppins text-xs font-medium text-[#6C567B] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Auntie Sarah, Tito Ben"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-3.5 py-2.5 font-poppins text-xs text-[#6C567B] placeholder-[#6C567B]/40 focus:border-[#C49A55] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-medium text-[#6C567B] mb-1">
                    Relationship to Zia (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cousin, Family Friend, Classmate"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full rounded-xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-3.5 py-2.5 font-poppins text-xs text-[#6C567B] placeholder-[#6C567B]/40 focus:border-[#C49A55] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-medium text-[#6C567B] mb-1">
                    Select a Princess Seal
                  </label>
                  <div className="flex gap-2">
                    {emojis.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition-all cursor-pointer ${
                          selectedEmoji === emoji
                            ? 'border-[#C49A55] bg-[#F8DDE8] scale-110 shadow-xs'
                            : 'border-[#F8DDE8] bg-white hover:border-[#C49A55]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-poppins text-xs font-medium text-[#6C567B] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="May your 7th birthday be filled with endless magic..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-[#F8DDE8] bg-[#FFF9F3]/60 px-3.5 py-2.5 font-poppins text-xs text-[#6C567B] placeholder-[#6C567B]/40 focus:border-[#C49A55] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-[#C49A55] bg-gradient-to-r from-[#F8DDE8] via-[#FFF9F3] to-[#E9DDF7] py-3 font-poppins text-xs font-semibold tracking-wider text-[#6C567B] shadow-xs transition-all hover:shadow-md disabled:opacity-50 active:scale-98 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#C49A55]" />
                  <span>{isSubmitting ? 'SENDING YOUR WISH...' : 'POST YOUR WISH'}</span>
                  <Send className="h-3.5 w-3.5 text-[#C49A55]" />
                </button>
              </form>
            </div>
          </div>

          {/* Wishes Feed */}
          <div className="lg:col-span-7">
            {wishes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#F8DDE8] bg-white/70 p-10 text-center shadow-xs">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8DDE8]/50 text-[#9E4D6E] shadow-2xs">
                  <MessageCircleHeart className="h-7 w-7" />
                </div>
                <h4 className="font-playfair text-lg font-bold text-[#6C567B]">
                  No Messages Yet
                </h4>
                <p className="mt-1 max-w-sm font-poppins text-sm text-[#6C567B]/75 font-normal">
                  Be the first to leave a sweet fairytale birthday wish for Little Princess Zia Venice!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="relative rounded-2xl border border-[#F8DDE8] bg-white/95 p-5 shadow-[0_4px_16px_rgba(108,86,123,0.05)] transition-all hover:border-[#C49A55] hover:shadow-[0_6px_22px_rgba(196,154,85,0.15)] animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{w.sparkleEmoji || '✨'}</span>
                        <div>
                          <h4 className="font-playfair text-sm font-bold text-[#6C567B]">
                            {w.author}
                          </h4>
                          <span className="font-poppins text-[11px] font-medium text-[#4A7B9D]">
                            {w.relation} · {w.timestamp}
                          </span>
                        </div>
                      </div>
                      <Heart className="h-4 w-4 text-[#9E4D6E]/60" />
                    </div>
                    <p className="mt-3 font-poppins text-sm text-[#6C567B]/90 leading-relaxed">
                      "{w.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
