import { onMounted, onUnmounted, type Ref } from 'vue';

export interface HeroRainOptions {
  /** Nº de gotas. 'medium' escala con el ancho de pantalla. */
  density?: 'low' | 'medium' | 'high';
  /** Porcentaje (0-1) de gotas doradas; el resto blanco. */
  goldRatio?: number;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  opacity: number;
  gold: boolean;
  drift: number;
}

const SPEED_BASE = 0.5; // px/frame a 60fps

export function useHeroRain(canvasRef: Ref<HTMLCanvasElement | null>, options: HeroRainOptions = {}) {
  const { density = 'medium', goldRatio = 0.15 } = options;

  let ctx: CanvasRenderingContext2D | null = null;
  let drops: RainDrop[] = [];
  let raf = 0;
  let lastTime = 0;
  let running = false;
  let width = 0;
  let height = 0;
  let dpr = 1;

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function countFor(w: number): number {
    if (density === 'low') return Math.min(90, Math.floor(w / 22));
    if (density === 'high') return Math.min(260, Math.floor(w / 11));
    return Math.min(180, Math.floor(w / 16));
  }

  function buildDrops(list: RainDrop[], w: number, h: number): RainDrop[] {
    const n = countFor(w);
    const seed = list.length ? list : [];
    const next: RainDrop[] = [];

    for (let i = 0; i < n; i++) {
      const existing = seed[i];
      next.push({
        x: existing ? existing.x : Math.random() * w,
        y: existing ? existing.y : Math.random() * h,
        length: 12 + Math.random() * 14,
        speed: SPEED_BASE * (0.85 + Math.random() * 0.4),
        width: Math.random() < 0.75 ? 1 : 1.5,
        opacity: 0.18 + Math.random() * 0.22,
        gold: Math.random() < goldRatio,
        drift: (Math.random() - 0.5) * 0.4,
      });
    }
    return next;
  }

  function resize() {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    width = parent.clientWidth;
    height = parent.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const n = countFor(width);
    if (drops.length !== n) drops = buildDrops(drops, width, height);
    if (reduceMotion) {
      drawFrame();
    } else if (!running) {
      start();
    }
  }

  function drawFrame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (const d of drops) {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 2.5, d.y + d.length);
      ctx.strokeStyle = d.gold ? `rgba(200,138,61,${d.opacity})` : `rgba(255,255,255,${d.opacity})`;
      ctx.lineWidth = d.width;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  function step(now: number) {
    if (!running) return;
    const dt = lastTime ? Math.min(now - lastTime, 50) : 16.67;
    lastTime = now;
    const factor = dt / 16.67;

    for (const d of drops) {
      d.y += d.speed * factor;
      d.x += d.drift * factor;
      if (d.y - d.length > height) {
        d.y = -d.length - Math.random() * 40;
        d.x = Math.random() * width;
      }
      if (d.x > width) d.x = 0;
      if (d.x < 0) d.x = width;
    }

    drawFrame();
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    lastTime = 0;
    raf = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  let ro: ResizeObserver | null = null;
  let io: IntersectionObserver | null = null;

  function onVisibility() {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  }

  function mount() {
    const canvas = canvasRef.value;
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();

    if (reduceMotion) return;

    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', resize);
    }

    document.addEventListener('visibilitychange', onVisibility);
    if (typeof IntersectionObserver !== 'undefined' && canvas.parentElement) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      });
      io.observe(canvas.parentElement);
    }
  }

  function destroy() {
    stop();
    ro?.disconnect();
    io?.disconnect();
    ro = null;
    io = null;
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', resize);
  }

  onMounted(mount);
  onUnmounted(destroy);

  return { mount, destroy, start, stop };
}