'use client';
import { useEffect, useRef } from 'react';

export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const COLORS = ['#f0c060', '#9b7eff', '#4fc3f7', '#e85d3a', '#4ade80'];

    // Pixel-style particles (squares for pixel art feel)
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() < 0.7 ? 1 : 2, // pixel sizes
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
    }));

    let animId: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.twinkle += p.twinkleSpeed;
        const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        // Pixelated squares
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles"
      style={{
        position: 'fixed', top: 0, left: 260, right: 0, bottom: 0,
        width: 'calc(100vw - 260px)', height: '100vh',
        pointerEvents: 'none', zIndex: 0, opacity: 0.4,
      }}
    />
  );
}
