import React, { useEffect, useRef } from 'react';

interface StarSparkle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  vx: number;
  vy: number;
  colorType: 'gold' | 'white' | 'pink' | 'lavender';
  rotation: number;
  rotSpeed: number;
  isFourPointStar: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  angle: number;
  angularSpeed: number;
  swaySpeed: number;
  swayDist: number;
  initialX: number;
  color: string;
}

interface Butterfly {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  wingAngle: number;
  wingSpeed: number;
  direction: number;
  wobbleSpeed: number;
  wobbleDist: number;
  sparkleTimer: number;
}

interface TrailSparkle {
  x: number;
  y: number;
  alpha: number;
  decay: number;
  color: string;
  radius: number;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    // Soft pastel butterfly palette with gentle opacity
    const butterflyPalette = ['#e88b9e', '#6ba3e8', '#b57bec', '#e09f3e'];
    let nextButterflySpawnTime = 15;
    const activeButterflies: Butterfly[] = [];
    const trailSparkles: TrailSparkle[] = [];

    const isMobile = width < 768;

    const spawnButterfly = () => {
      const maxButterflies = isMobile ? 2 : 3;
      if (activeButterflies.length >= maxButterflies) return;
      const flyRight = Math.random() > 0.5;
      const startX = flyRight ? -40 : width + 40;
      const startY = height * (0.15 + Math.random() * 0.65);
      const color = butterflyPalette[Math.floor(Math.random() * butterflyPalette.length)];

      const bSize = isMobile ? 18 : 16;

      activeButterflies.push({
        id: Date.now() + Math.random(),
        x: startX,
        y: startY,
        size: bSize,
        vx: (flyRight ? 1 : -1) * (isMobile ? 0.95 : 0.85),
        vy: (Math.random() - 0.5) * 0.3,
        color,
        wingAngle: 0,
        wingSpeed: 0.18,
        direction: flyRight ? 1 : -1,
        wobbleSpeed: 0.035,
        wobbleDist: isMobile ? 1.3 : 1.1,
        sparkleTimer: 0,
      });
    };

    spawnButterfly();

    // Soft pastel rose petals with reduced, delicate opacity
    const petalColors = [
      'rgba(244, 143, 177, 0.55)', // Soft rose pink
      'rgba(248, 185, 205, 0.50)', // Light blush
      'rgba(235, 115, 155, 0.48)', // Gentle magenta
      'rgba(209, 178, 245, 0.50)', // Pale lavender
    ];

    const petalCount = isMobile ? 12 : 20;
    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      const px = Math.random() * width;
      const pSize = isMobile ? Math.random() * 4 + 7 : Math.random() * 4 + 6;
      petals.push({
        x: px,
        initialX: px,
        y: Math.random() * height,
        size: pSize,
        vy: Math.random() * 0.55 + 0.35,
        vx: Math.random() * 0.25 + 0.08,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        swaySpeed: Math.random() * 0.02 + 0.012,
        swayDist: Math.random() * (isMobile ? 22 : 18) + 10,
        color: petalColors[i % petalColors.length],
      });
    }

    // Sparkling stars & fairy dust with gentle soft opacity
    const colorDefinitions = {
      gold: 'rgba(235, 190, 85, ',
      white: 'rgba(255, 255, 255, ',
      pink: 'rgba(246, 175, 202, ',
      lavender: 'rgba(196, 170, 245, ',
    };
    const colorTypes: ('gold' | 'white' | 'pink' | 'lavender')[] = [
      'gold',
      'white',
      'pink',
      'lavender',
    ];

    const sparkleCount = isMobile ? 16 : 24;
    const sparkles: StarSparkle[] = [];
    for (let i = 0; i < sparkleCount; i++) {
      const cType = colorTypes[i % colorTypes.length];
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isMobile ? Math.random() * 1.6 + 1.2 : Math.random() * 1.4 + 1.0,
        baseAlpha: Math.random() * 0.3 + 0.25, // Lower soft base alpha
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.3 - 0.1,
        colorType: cType,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        isFourPointStar: i % 2 === 0,
      });
    }

    // Throttled interactive pointer sparkles
    let lastPointerTime = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      if (now - lastPointerTime < 60) return;
      lastPointerTime = now;

      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const c = colorTypes[Math.floor(Math.random() * colorTypes.length)];
      trailSparkles.push({
        x: clientX,
        y: clientY,
        alpha: 0.55,
        decay: 0.025,
        color: colorDefinitions[c],
        radius: isMobile ? 2.2 : 1.8,
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Gently Falling Flower Petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy;
        p.angle += p.angularSpeed;
        p.x = p.initialX + Math.sin(tick * p.swaySpeed + i) * p.swayDist + p.vx * (tick * 0.1);

        if (p.y > height + 30) {
          p.y = -30;
          p.initialX = Math.random() * width;
          p.x = p.initialX;
        }
        if (p.x > width + 30) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.5, p.size * 0.6, p.size * 0.7, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.7, -p.size * 0.6, -p.size * 0.5, 0, -p.size);
        ctx.fill();

        ctx.restore();
      }

      // 2. Sparkling Stars & Fairy Dust
      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        if (s.y < -15) {
          s.y = height + 15;
          s.x = Math.random() * width;
        }
        if (s.x < -15) s.x = width + 15;
        if (s.x > width + 15) s.x = -15;

        const currentAlpha =
          s.baseAlpha + Math.sin(tick * s.twinkleSpeed + s.twinkleOffset) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(0.65, currentAlpha));
        const colorPrefix = colorDefinitions[s.colorType];

        ctx.save();
        ctx.translate(s.x, s.y);

        if (s.isFourPointStar) {
          ctx.rotate(s.rotation);
          ctx.fillStyle = `${colorPrefix}${clampedAlpha})`;
          const r = s.radius * 2;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();
        } else {
          ctx.fillStyle = `${colorPrefix}${clampedAlpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 3. Trail Sparkles
      for (let i = trailSparkles.length - 1; i >= 0; i--) {
        const ts = trailSparkles[i];
        ts.y -= 0.25;
        ts.alpha -= ts.decay;

        if (ts.alpha <= 0) {
          trailSparkles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${ts.color}${ts.alpha})`;
        ctx.beginPath();
        ctx.arc(ts.x, ts.y, ts.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Fairytale Butterfly
      nextButterflySpawnTime--;
      if (nextButterflySpawnTime <= 0) {
        spawnButterfly();
        nextButterflySpawnTime = isMobile ? 300 + Math.floor(Math.random() * 200) : 380 + Math.floor(Math.random() * 220);
      }

      for (let i = activeButterflies.length - 1; i >= 0; i--) {
        const b = activeButterflies[i];
        b.x += b.vx;
        b.y += Math.sin(tick * b.wobbleSpeed + i) * b.wobbleDist + b.vy;
        b.wingAngle = Math.sin(tick * b.wingSpeed);

        b.sparkleTimer++;
        if (b.sparkleTimer % 14 === 0 && trailSparkles.length < 25) {
          trailSparkles.push({
            x: b.x - b.direction * (b.size * 0.5),
            y: b.y + (Math.random() - 0.5) * 6,
            alpha: 0.50,
            decay: 0.025,
            color: 'rgba(245, 210, 140, ',
            radius: isMobile ? 1.8 : 1.5,
          });
        }

        if (
          (b.direction === 1 && b.x > width + 60) ||
          (b.direction === -1 && b.x < -60) ||
          b.y < -60 ||
          b.y > height + 60
        ) {
          activeButterflies.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(b.direction, 1);
        const wingScale = Math.abs(b.wingAngle);

        ctx.fillStyle = b.color;
        ctx.globalAlpha = 0.65; // Soft gentle opacity

        // Top Forewing
        ctx.beginPath();
        ctx.ellipse(
          b.size * 0.58 * wingScale,
          -b.size * 0.42,
          b.size * 0.75 * wingScale,
          b.size * 0.48,
          Math.PI / 4.2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Bottom Hindwing
        ctx.beginPath();
        ctx.ellipse(
          b.size * 0.42 * wingScale,
          b.size * 0.26,
          b.size * 0.5 * wingScale,
          b.size * 0.36,
          -Math.PI / 5.5,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Butterfly Body
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = '#4a3749';
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.8, b.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* 1. HTML5 Canvas for high-refresh desktop and tablets */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-30 h-full w-full"
        aria-hidden="true"
      />

      {/* 2. Guaranteed CSS Animation Overlay for Mobile / iPhone / Safari / WebKit */}
      {/* Runs purely on GPU CSS transforms - 100% immune to iOS canvas suspension or low-power modes */}
      <div
        className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
        aria-hidden="true"
      >
        {/* Mobile Fluttering Butterflies (gentle soft opacity) */}
        <div className="absolute animate-butterfly-1 opacity-60">
          <div className="flex items-center gap-1 select-none text-2xl filter drop-shadow-sm animate-wing-flutter">
            🦋
          </div>
        </div>

        <div className="absolute animate-butterfly-2 opacity-55">
          <div className="flex items-center gap-1 select-none text-xl filter drop-shadow-sm animate-wing-flutter">
            🦋
          </div>
        </div>

        {/* Softly Drifting Petals (pure CSS falling paths with gentle opacity) */}
        <div
          className="absolute top-0 left-[8%] animate-petal-fall"
          style={{ animationDuration: '13s', animationDelay: '0s' }}
        >
          <div className="h-3.5 w-2.5 rounded-full bg-gradient-to-tr from-[#f48fb1]/60 to-[#f8bbd0]/50 rotate-45 shadow-[0_2px_4px_rgba(244,143,177,0.2)]" />
        </div>

        <div
          className="absolute top-0 left-[28%] animate-petal-fall"
          style={{ animationDuration: '16s', animationDelay: '3s' }}
        >
          <div className="h-4 w-3 rounded-full bg-gradient-to-tr from-[#f06292]/50 to-[#f8bbd0]/45 -rotate-12 shadow-[0_2px_4px_rgba(240,98,146,0.2)]" />
        </div>

        <div
          className="absolute top-0 left-[52%] animate-petal-fall"
          style={{ animationDuration: '14s', animationDelay: '1.5s' }}
        >
          <div className="h-3 w-2.5 rounded-full bg-gradient-to-tr from-[#ce93d8]/55 to-[#f48fb1]/45 rotate-30 shadow-[0_2px_4px_rgba(206,147,216,0.2)]" />
        </div>

        <div
          className="absolute top-0 left-[76%] animate-petal-fall"
          style={{ animationDuration: '17s', animationDelay: '5s' }}
        >
          <div className="h-4 w-3 rounded-full bg-gradient-to-tr from-[#f48fb1]/55 to-[#fce4ec]/50 -rotate-30 shadow-[0_2px_4px_rgba(244,143,177,0.2)]" />
        </div>

        <div
          className="absolute top-0 left-[90%] animate-petal-fall"
          style={{ animationDuration: '15s', animationDelay: '7s' }}
        >
          <div className="h-3.5 w-2.5 rounded-full bg-gradient-to-tr from-[#f8bbd0]/60 to-[#f48fb1]/40 rotate-15 shadow-[0_2px_4px_rgba(248,187,208,0.2)]" />
        </div>
      </div>
    </>
  );
};
