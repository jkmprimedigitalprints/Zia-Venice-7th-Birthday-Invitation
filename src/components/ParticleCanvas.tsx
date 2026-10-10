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

    // Optimized vivid butterfly palette (fairytale pastel rose, sky blue, lavender, gold)
    const butterflyPalette = ['#e87a90', '#4a90e2', '#a855f7', '#d97706'];
    let nextButterflySpawnTime = 15; // Start quickly so visible right away!
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

      // On mobile, scale butterfly size to 20-24px so it's clearly visible on small mobile screens
      const bSize = isMobile ? 21 : 18;

      activeButterflies.push({
        id: Date.now() + Math.random(),
        x: startX,
        y: startY,
        size: bSize,
        vx: (flyRight ? 1 : -1) * (isMobile ? 1.1 : 0.95),
        vy: (Math.random() - 0.5) * 0.35,
        color,
        wingAngle: 0,
        wingSpeed: 0.2,
        direction: flyRight ? 1 : -1,
        wobbleSpeed: 0.04,
        wobbleDist: isMobile ? 1.6 : 1.2,
        sparkleTimer: 0,
      });
    };

    // Pre-spawn butterflies immediately so user doesn't have to wait 10-15 seconds
    spawnButterfly();
    if (!isMobile) {
      spawnButterfly();
    }

    // Rich falling rose petals with vibrant fairytale colors and clear outlines
    const petalColors = [
      'rgba(235, 94, 138, 0.90)', // Vibrant fairytale rose pink
      'rgba(244, 114, 160, 0.92)', // Rose blush
      'rgba(219, 39, 119, 0.88)', // Deep magenta petal
      'rgba(244, 143, 177, 0.90)', // Soft rose
      'rgba(192, 132, 252, 0.88)', // Fairytale royal lavender
    ];

    // Petal count: 18 on mobile, 24 on desktop so petals are clearly drifting by continuously
    const petalCount = isMobile ? 18 : 26;
    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      const px = Math.random() * width;
      // Slightly larger on mobile for clear visibility on phone screens
      const pSize = isMobile ? Math.random() * 6 + 10 : Math.random() * 5 + 8;
      petals.push({
        x: px,
        initialX: px,
        y: Math.random() * height,
        size: pSize,
        vy: Math.random() * 0.7 + 0.5,
        vx: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        swaySpeed: Math.random() * 0.025 + 0.015,
        swayDist: Math.random() * (isMobile ? 28 : 22) + 14,
        color: petalColors[i % petalColors.length],
      });
    }

    // Sparkling stars & fairy dust
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

    const sparkleCount = isMobile ? 22 : 32;
    const sparkles: StarSparkle[] = [];
    for (let i = 0; i < sparkleCount; i++) {
      const cType = colorTypes[i % colorTypes.length];
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isMobile ? Math.random() * 2 + 1.5 : Math.random() * 1.6 + 1.2,
        baseAlpha: Math.random() * 0.45 + 0.45,
        twinkleSpeed: Math.random() * 0.035 + 0.018,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.4 - 0.15,
        colorType: cType,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        isFourPointStar: i % 2 === 0,
      });
    }

    // Throttled interactive pointer sparkles
    let lastPointerTime = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      if (now - lastPointerTime < 50) return;
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
        alpha: 0.85,
        decay: 0.03,
        color: colorDefinitions[c],
        radius: isMobile ? 2.8 : 2.2,
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let tick = 0;
    let lastFrameTime = performance.now();

    const render = (currentTime: number) => {
      // Delta time check to prevent running if tab was backgrounded
      const elapsed = currentTime - lastFrameTime;
      if (elapsed > 120) {
        lastFrameTime = currentTime;
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = currentTime;

      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Gently Falling Vivid Fairytale Flower Petals
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

        // Petal subtle shadow / glow so it pops over light cards & pictures
        ctx.shadowColor = 'rgba(158, 77, 110, 0.35)';
        ctx.shadowBlur = 4;

        // Realistic curved rose petal drawing
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Teardrop/curved rose petal shape
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.65, -p.size * 0.5, p.size * 0.65, p.size * 0.7, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.65, p.size * 0.7, -p.size * 0.65, -p.size * 0.5, 0, -p.size);
        ctx.fill();

        // Subtle petal vein highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.65);
        ctx.lineTo(0, p.size * 0.6);
        ctx.stroke();

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
          s.baseAlpha + Math.sin(tick * s.twinkleSpeed + s.twinkleOffset) * 0.35;
        const clampedAlpha = Math.max(0.2, Math.min(0.95, currentAlpha));
        const colorPrefix = colorDefinitions[s.colorType];

        ctx.save();
        ctx.translate(s.x, s.y);

        if (s.isFourPointStar) {
          ctx.rotate(s.rotation);
          ctx.fillStyle = `${colorPrefix}${clampedAlpha})`;
          const r = s.radius * 2.2;
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
        ts.y -= 0.3;
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
        // Spawn next butterfly regularly (every 4-7 seconds) so mobile users see them continuously
        nextButterflySpawnTime = isMobile ? 240 + Math.floor(Math.random() * 160) : 320 + Math.floor(Math.random() * 200);
      }

      for (let i = activeButterflies.length - 1; i >= 0; i--) {
        const b = activeButterflies[i];
        b.x += b.vx;
        b.y += Math.sin(tick * b.wobbleSpeed + i) * b.wobbleDist + b.vy;
        b.wingAngle = Math.sin(tick * b.wingSpeed);

        b.sparkleTimer++;
        if (b.sparkleTimer % 12 === 0 && trailSparkles.length < 35) {
          trailSparkles.push({
            x: b.x - b.direction * (b.size * 0.5),
            y: b.y + (Math.random() - 0.5) * 8,
            alpha: 0.85,
            decay: 0.025,
            color: 'rgba(245, 210, 140, ',
            radius: isMobile ? 2.2 : 1.8,
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

        // Glow/shadow to make butterfly clearly visible against any phone screen background
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = b.color;
        ctx.globalAlpha = 0.95;

        // Top Forewing (detailed fairytale wing)
        ctx.beginPath();
        ctx.ellipse(
          b.size * 0.6 * wingScale,
          -b.size * 0.45,
          b.size * 0.8 * wingScale,
          b.size * 0.52,
          Math.PI / 4.2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Inner wing accent (iridescent lighter glow)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.ellipse(
          b.size * 0.55 * wingScale,
          -b.size * 0.45,
          b.size * 0.45 * wingScale,
          b.size * 0.28,
          Math.PI / 4.2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Bottom Hindwing
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(
          b.size * 0.45 * wingScale,
          b.size * 0.28,
          b.size * 0.55 * wingScale,
          b.size * 0.4,
          -Math.PI / 5.5,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Hindwing inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(
          b.size * 0.42 * wingScale,
          b.size * 0.28,
          b.size * 0.32 * wingScale,
          b.size * 0.22,
          -Math.PI / 5.5,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Butterfly Body & Antennae
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#2d1b2e';
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, b.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        // Antennae
        ctx.strokeStyle = '#2d1b2e';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -b.size * 0.5);
        ctx.quadraticCurveTo(b.size * 0.25, -b.size * 0.85, b.size * 0.4, -b.size * 0.9);
        ctx.moveTo(0, -b.size * 0.5);
        ctx.quadraticCurveTo(-b.size * 0.1, -b.size * 0.85, -b.size * 0.2, -b.size * 0.9);
        ctx.stroke();

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
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
      aria-hidden="true"
    />
  );
};
