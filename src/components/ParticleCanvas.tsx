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

    // Optimized butterfly palette
    const butterflyPalette = ['#f6a6c1', '#a2c8f8', '#cfbbf7'];
    let nextButterflySpawnTime = 120;
    const activeButterflies: Butterfly[] = [];
    const trailSparkles: TrailSparkle[] = [];

    const spawnButterfly = () => {
      if (activeButterflies.length >= 1) return; // Keep maximum 1 butterfly for high performance
      const flyRight = Math.random() > 0.5;
      const startX = flyRight ? -30 : width + 30;
      const startY = height * (0.2 + Math.random() * 0.5);
      const color = butterflyPalette[Math.floor(Math.random() * butterflyPalette.length)];

      activeButterflies.push({
        id: Date.now(),
        x: startX,
        y: startY,
        size: 13,
        vx: (flyRight ? 1 : -1) * 0.85,
        vy: (Math.random() - 0.5) * 0.25,
        color,
        wingAngle: 0,
        wingSpeed: 0.18,
        direction: flyRight ? 1 : -1,
        wobbleSpeed: 0.035,
        wobbleDist: 1.1,
        sparkleTimer: 0,
      });
    };

    // Soft falling petals - lightweight count (10 on mobile, 16 on desktop)
    const petalColors = [
      'rgba(248, 185, 205, 0.72)',
      'rgba(240, 165, 192, 0.75)',
      'rgba(220, 192, 248, 0.7)',
    ];
    const isMobile = width < 768;
    const petalCount = isMobile ? 8 : 14;
    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      const px = Math.random() * width;
      petals.push({
        x: px,
        initialX: px,
        y: Math.random() * height,
        size: Math.random() * 4 + 6,
        vy: Math.random() * 0.5 + 0.4,
        vx: Math.random() * 0.2 + 0.1,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayDist: Math.random() * 24 + 12,
        color: petalColors[i % petalColors.length],
      });
    }

    // Sparkling stars & fairy dust - lightweight count (18 on mobile, 28 on desktop)
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

    const sparkleCount = isMobile ? 18 : 28;
    const sparkles: StarSparkle[] = [];
    for (let i = 0; i < sparkleCount; i++) {
      const cType = colorTypes[i % colorTypes.length];
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.35,
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
      if (now - lastPointerTime < 60) return; // Limit to ~16 events/sec
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
        alpha: 0.75,
        decay: 0.035,
        color: colorDefinitions[c],
        radius: 2,
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

      // 1. Gently Falling Flower Petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy;
        p.angle += p.angularSpeed;
        p.x = p.initialX + Math.sin(tick * p.swaySpeed + i) * p.swayDist + p.vx * (tick * 0.1);

        if (p.y > height + 20) {
          p.y = -20;
          p.initialX = Math.random() * width;
          p.x = p.initialX;
        }
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.45, p.size, 0, 0, Math.PI * 2);
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
          s.baseAlpha + Math.sin(tick * s.twinkleSpeed + s.twinkleOffset) * 0.35;
        const clampedAlpha = Math.max(0.15, Math.min(0.9, currentAlpha));
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

      // 4. Occasional Butterfly
      nextButterflySpawnTime--;
      if (nextButterflySpawnTime <= 0) {
        spawnButterfly();
        nextButterflySpawnTime = 500 + Math.floor(Math.random() * 400); // every ~10-15s
      }

      for (let i = activeButterflies.length - 1; i >= 0; i--) {
        const b = activeButterflies[i];
        b.x += b.vx;
        b.y += Math.sin(tick * b.wobbleSpeed + i) * b.wobbleDist + b.vy;
        b.wingAngle = Math.sin(tick * b.wingSpeed);

        b.sparkleTimer++;
        if (b.sparkleTimer % 18 === 0 && trailSparkles.length < 20) {
          trailSparkles.push({
            x: b.x - b.direction * (b.size * 0.5),
            y: b.y,
            alpha: 0.65,
            decay: 0.025,
            color: 'rgba(245, 210, 140, ',
            radius: 1.5,
          });
        }

        if (
          (b.direction === 1 && b.x > width + 40) ||
          (b.direction === -1 && b.x < -40) ||
          b.y < -40 ||
          b.y > height + 40
        ) {
          activeButterflies.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(b.direction, 1);
        const wingScale = Math.abs(b.wingAngle);

        ctx.fillStyle = b.color;
        ctx.globalAlpha = 0.85;

        // Top Forewing
        ctx.beginPath();
        ctx.ellipse(
          b.size * 0.55 * wingScale,
          -b.size * 0.4,
          b.size * 0.7 * wingScale,
          b.size * 0.45,
          Math.PI / 4.5,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Bottom Hindwing
        ctx.beginPath();
        ctx.ellipse(
          b.size * 0.4 * wingScale,
          b.size * 0.25,
          b.size * 0.45 * wingScale,
          b.size * 0.35,
          -Math.PI / 5.5,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Body
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = '#4a3b4c';
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.5, b.size * 0.5, 0, 0, Math.PI * 2);
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
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      aria-hidden="true"
    />
  );
};
