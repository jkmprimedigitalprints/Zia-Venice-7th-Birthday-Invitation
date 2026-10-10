import React, { useState, useEffect } from 'react';
import { Sparkles, Clock } from 'lucide-react';
import { EVENT_DATA } from '../data/eventData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(EVENT_DATA.eventDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="relative py-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#FFF9F3] via-[#F8DDE8]/25 to-[#FFF9F3]">
      <div className="relative mx-auto max-w-4xl text-center">
        {/* Soft Pastel glow backdrop */}
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#F8DDE8]/40 via-[#E9DDF7]/40 to-[#C49A55]/20 blur-2xl" />

        <div className="relative rounded-3xl border border-[#C49A55]/30 bg-white/95 p-8 shadow-[0_12px_40px_rgba(108,86,123,0.08)] backdrop-blur-xl md:p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-2 inline-flex items-center gap-2 text-[#6C567B]">
              <Clock className="h-4 w-4 text-[#C49A55]" />
              <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#4A7B9D]">
                The Celebration Awaits
              </span>
              <Sparkles className="h-4 w-4 text-[#C49A55]" />
            </div>
            <h2 className="font-playfair text-2xl font-bold tracking-wider text-[#6C567B] sm:text-3xl md:text-4xl">
              The Magic Begins In...
            </h2>
          </div>

          {/* Countdown Clock Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {timeUnits.map((unit) => (
              <div
                key={unit.label}
                className="group relative overflow-hidden rounded-2xl border border-[#F8DDE8] bg-gradient-to-b from-white to-[#FFF9F3] p-5 shadow-[0_4px_16px_rgba(108,86,123,0.05)] transition-all hover:border-[#C49A55] hover:shadow-[0_6px_22px_rgba(196,154,85,0.2)]"
              >
                <div className="relative">
                  <div className="font-playfair text-4xl font-extrabold tracking-tight text-[#9E4D6E] sm:text-5xl tabular-nums">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className="mt-2 font-poppins text-xs font-medium uppercase tracking-widest text-[#4A7B9D]">
                    {unit.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Event Status Footer */}
          <div className="mt-8 text-center">
            <p className="font-poppins text-base font-medium text-[#6C567B] sm:text-lg">
              {timeLeft.isPast
                ? 'The celebration is taking place today! Welcome to Princess Zia Venice’s 7th birthday!'
                : `Counting down the days to November 14, 2026!`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
