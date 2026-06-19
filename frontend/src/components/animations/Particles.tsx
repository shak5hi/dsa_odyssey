'use client';
import { useEffect, useRef } from 'react';

// Floating DSA runes that drift across the background
const RUNES = ['{ }', '[]', 'O(n)', 'if', '=>', '++', '==', '&&', 'fn()', '[][]', 'log', 'ptr', 'null', 'true', '01', '10', 'n!', 'dp', 'dfs', 'bfs'];

interface Star { x: number; y: number; size: number; alpha: number; speed: number; pulse: number; pulseSpeed: number; color: string }
interface Rune { x: number; y: number; alpha: number; speed: number; char: string; color: string; size: number; drift: number }
interface Orb { x: number; y: number; r: number; vx: number; vy: number; color: string; alpha: number }

export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();

    const STAR_COLORS = ['#f0c060', '#a78bfa', '#4fc3f7', '#4ade80', '#f87171', '#ffffff'];
    const RUNE_COLORS = ['rgba(167,139,250,0.18)', 'rgba(240,192,96,0.14)', 'rgba(79,195,247,0.16)', 'rgba(74,222,128,0.12)'];
    const ORB_COLORS = [
      'rgba(109,40,217,0.06)',
      'rgba(79,195,247,0.05)',
      'rgba(240,192,96,0.04)',
      'rgba(167,139,250,0.07)',
    ];

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Stars
    const stars: Star[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      size: Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3,
      alpha: Math.random() * 0.6 + 0.1,
      speed: 0,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.025 + 0.008,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));

    // Floating code runes
    const runes: Rune[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      alpha: Math.random() * 0.25 + 0.06,
      speed: Math.random() * 0.18 + 0.05,
      char: RUNES[Math.floor(Math.random() * RUNES.length)],
      color: RUNE_COLORS[Math.floor(Math.random() * RUNE_COLORS.length)],
      size: Math.random() * 6 + 9,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    // Soft glowing orbs
    const orbs: Orb[] = Array.from({ length: 6 }, (_, i) => ({
      x: (W() / 6) * i + Math.random() * 100,
      y: Math.random() * H(),
      r: Math.random() * 180 + 120,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      color: ORB_COLORS[i % ORB_COLORS.length],
      alpha: 1,
    }));

    // Grid lines
    const GRID_SIZE = 80;
    let frame = 0;
    let animId: number;

    function drawGrid() {
      if (!ctx) return;
      const w = W(), h = H();
      ctx.strokeStyle = 'rgba(167,139,250,0.04)';
      ctx.lineWidth = 1;
      // Vertical
      for (let x = 0; x < w; x += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      // Horizontal
      for (let y = 0; y < h; y += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      // Subtle scan line that moves down
      const scanY = (frame * 0.4) % h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, 'rgba(167,139,250,0)');
      scanGrad.addColorStop(0.5, 'rgba(167,139,250,0.04)');
      scanGrad.addColorStop(1, 'rgba(167,139,250,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, w, 80);
    }

    function drawOrbs() {
      if (!ctx) return;
      orbs.forEach(o => {
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, o.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
        o.x += o.vx; o.y += o.vy;
        const w = W(), h = H();
        if (o.x < -o.r) o.x = w + o.r;
        if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r;
        if (o.y > h + o.r) o.y = -o.r;
      });
    }

    function drawStars() {
      if (!ctx) return;
      stars.forEach(s => {
        s.pulse += s.pulseSpeed;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.pulse));
        ctx.globalAlpha = a;
        ctx.fillStyle = s.color;
        if (s.size === 1) {
          ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1);
        } else {
          // Cross/diamond for larger stars
          const cx = Math.floor(s.x), cy = Math.floor(s.y);
          ctx.fillRect(cx, cy, s.size, s.size);
          if (s.size >= 3 && a > 0.3) {
            ctx.globalAlpha = a * 0.3;
            ctx.shadowBlur = 6;
            ctx.shadowColor = s.color;
            ctx.fillRect(cx - 1, cy + 1, s.size + 2, 1);
            ctx.fillRect(cx + 1, cy - 1, 1, s.size + 2);
            ctx.shadowBlur = 0;
          }
        }
        ctx.globalAlpha = 1;
      });
    }

    function drawRunes() {
      if (!ctx) return;
      ctx.fontKerning = 'none';
      runes.forEach(r => {
        r.y -= r.speed;
        r.x += r.drift;
        const w = W(), h = H();
        if (r.y < -30) { r.y = h + 10; r.x = Math.random() * w; }
        if (r.x < -40) r.x = w + 20;
        if (r.x > w + 40) r.x = -20;
        ctx.globalAlpha = r.alpha;
        ctx.fillStyle = r.color;
        ctx.font = `${r.size}px 'JetBrains Mono', monospace`;
        ctx.fillText(r.char, r.x, r.y);
        ctx.globalAlpha = 1;
      });
    }

    // Shooting star occasionally
    let shootStar = { x: -100, y: -100, vx: 0, vy: 0, life: 0, maxLife: 0, active: false };
    function maybeShootStar() {
      if (!ctx) return;
      if (!shootStar.active && Math.random() < 0.004) {
        const startX = Math.random() * W() * 0.7;
        shootStar = {
          x: startX, y: Math.random() * H() * 0.4,
          vx: 4 + Math.random() * 3, vy: 1.5 + Math.random(),
          life: 0, maxLife: 40 + Math.random() * 20, active: true,
        };
      }
      if (shootStar.active) {
        const t = 1 - shootStar.life / shootStar.maxLife;
        ctx.globalAlpha = t * 0.6;
        ctx.strokeStyle = '#f0c060';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8; ctx.shadowColor = '#f0c060';
        ctx.beginPath();
        ctx.moveTo(shootStar.x, shootStar.y);
        ctx.lineTo(shootStar.x - shootStar.vx * 8, shootStar.y - shootStar.vy * 8);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        shootStar.x += shootStar.vx; shootStar.y += shootStar.vy;
        shootStar.life++;
        if (shootStar.life >= shootStar.maxLife) shootStar.active = false;
      }
    }

    function draw() {
      if (!ctx) return;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);
      frame++;
      drawGrid();
      drawOrbs();
      drawStars();
      drawRunes();
      maybeShootStar();
      animId = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => setSize();
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
        position: 'fixed',
        top: 0, left: 260, right: 0, bottom: 0,
        width: 'calc(100vw - 260px)',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
