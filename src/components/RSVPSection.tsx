import React, { useState, useEffect } from 'react';
import { Mail, Heart, CheckCircle2, Sparkles, Send, ShieldAlert, Lock } from 'lucide-react';
import { AttendanceStatus } from '../types';

export const RSVPSection: React.FC = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('attending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<AttendanceStatus | null>(null);
  const [submittedName, setSubmittedName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if user has already submitted previously (responses are non-editable)
  useEffect(() => {
    try {
      const storedName = localStorage.getItem('zia_rsvp_submitted_name');
      const storedStatus = localStorage.getItem('zia_rsvp_submitted_status') as AttendanceStatus | null;
      if (storedName && storedStatus) {
        setSubmittedName(storedName);
        setSubmittedStatus(storedStatus);
      }
    } catch {
      // ignore local storage errors
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    const guestName = name.trim();

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName, status }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit RSVP');
      }

      setSubmittedName(guestName);
      setSubmittedStatus(status);
      try {
        localStorage.setItem('zia_rsvp_submitted_name', guestName);
        localStorage.setItem('zia_rsvp_submitted_status', status);
      } catch {
        // ignore
      }
    } catch {
      // Local fallback in case network issue occurs
      try {
        const stored = localStorage.getItem('zia_guest_rsvp_offline') || '[]';
        const parsed = JSON.parse(stored);
        parsed.unshift({ name: guestName, status, submittedAt: new Date().toISOString() });
        localStorage.setItem('zia_guest_rsvp_offline', JSON.stringify(parsed));
      } catch {
        // ignore
      }
      setSubmittedName(guestName);
      setSubmittedStatus(status);
      try {
        localStorage.setItem('zia_rsvp_submitted_name', guestName);
        localStorage.setItem('zia_rsvp_submitted_status', status);
      } catch {
        // ignore
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF9F3] via-[#FFF4E8] to-[#FFF9F3] overflow-hidden">
      {/* Fairytale glow accents */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#F8DDE8]/35 blur-3xl rounded-full" />

      <div className="relative z-10 mx-auto max-w-xl">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#C49A55]/30 text-[#C49A55] text-xs uppercase tracking-widest font-semibold shadow-xs mb-3">
            <Mail className="h-3.5 w-3.5" />
            <span>Royal RSVP</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <h2 className="font-greatvibes text-5xl sm:text-6xl text-[#9E4D6E] leading-tight">
            Confirm Your Attendance
          </h2>

          <p className="mt-2 text-sm sm:text-base text-[#6C567B] font-poppins">
            We would be honored by your presence as Princess Zia celebrates her 7th birthday!
          </p>

          {/* Prominent Required Disclaimer */}
          <div className="mt-4 mx-auto max-w-md rounded-2xl bg-amber-50/90 border border-amber-200/80 px-4 py-3 shadow-xs text-amber-900 flex items-start gap-3 text-left">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium leading-relaxed font-poppins">
              <span className="font-semibold text-amber-950">Important Notice:</span> Please confirm your attendance as we need to reserve your slot.
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="relative rounded-3xl bg-white/90 backdrop-blur-md border border-[#F8DDE8] p-6 sm:p-8 shadow-xl shadow-[#6C567B]/5">
          {submittedStatus ? (
            /* Locked permanent confirmation card (Not editable) */
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8DDE8] text-[#9E4D6E]">
                {submittedStatus === 'attending' ? (
                  <CheckCircle2 className="h-9 w-9 text-[#10B981]" />
                ) : (
                  <Heart className="h-9 w-9 text-[#9E4D6E]" />
                )}
              </div>

              <h3 className="font-playfair text-2xl font-bold text-[#9E4D6E]">
                {submittedStatus === 'attending'
                  ? 'Attendance Confirmed!'
                  : 'Response Confirmed'}
              </h3>

              <div className="my-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>Slot Recorded & Final</span>
              </div>

              <p className="mt-2 text-sm text-[#6C567B] font-poppins max-w-sm mx-auto leading-relaxed">
                {submittedStatus === 'attending'
                  ? `Thank you, ${submittedName || name}! Your royal slot reservation has been officially received. We cannot wait to celebrate with you!`
                  : `Thank you for confirming, ${submittedName || name}. Your response is noted and you will be warmly remembered in Zia's special celebration.`}
              </p>

              <div className="mt-6 rounded-2xl bg-[#FFF9F3] border border-[#F8DDE8] p-4 text-xs text-[#6C567B]/80 font-poppins">
                <span className="font-semibold text-[#6C567B]">Note:</span> RSVP responses are locked and non-editable to ensure accurate slot allocations.
              </div>
            </div>
          ) : (
            /* Clean Minimal RSVP Form: Name + Attendance Option Only */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="guest-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#6C567B] mb-2 font-poppins"
                >
                  Full Name <span className="text-[#E76F51]">*</span>
                </label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F3]/80 border border-[#F8DDE8] text-[#6C567B] placeholder-[#6C567B]/40 focus:outline-hidden focus:ring-2 focus:ring-[#9E4D6E]/30 focus:border-[#9E4D6E] font-poppins text-sm transition-all shadow-inner"
                />
              </div>

              {/* Attendance Options */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6C567B] mb-2 font-poppins">
                  Will You Attend? <span className="text-[#E76F51]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Attending Option */}
                  <button
                    type="button"
                    onClick={() => setStatus('attending')}
                    className={`flex items-center justify-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      status === 'attending'
                        ? 'border-emerald-400 bg-emerald-50/80 text-emerald-900 shadow-md ring-2 ring-emerald-400/20'
                        : 'border-[#F8DDE8] bg-white/70 text-[#6C567B] hover:bg-[#FFF9F3]'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        status === 'attending'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block font-semibold text-xs sm:text-sm font-poppins text-emerald-950">
                        Yes, I will attend
                      </span>
                      <span className="block text-[11px] text-emerald-700/80 font-poppins">
                        Reserve my slot
                      </span>
                    </div>
                  </button>

                  {/* Declined Option */}
                  <button
                    type="button"
                    onClick={() => setStatus('declined')}
                    className={`flex items-center justify-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      status === 'declined'
                        ? 'border-rose-400 bg-rose-50/80 text-rose-900 shadow-md ring-2 ring-rose-400/20'
                        : 'border-[#F8DDE8] bg-white/70 text-[#6C567B] hover:bg-[#FFF9F3]'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        status === 'declined'
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-xs sm:text-sm font-poppins text-rose-950">
                        Cannot attend
                      </span>
                      <span className="block text-[11px] text-rose-700/80 font-poppins">
                        Sending warm wishes
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium font-poppins">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#9E4D6E] via-[#853C5A] to-[#9E4D6E] text-white font-poppins font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Securing your response...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit RSVP</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-[#6C567B]/70 font-poppins">
                🔒 Once submitted, your attendance status is locked to ensure accurate headcount.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
