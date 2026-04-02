import React, { useRef, useEffect, useCallback, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useI18n } from "./i18n";

/** Interval between generated spectrogram columns (ms of sim-time per column) */
const COL_INTERVAL_MS = 60;
const TIMELINE_H = 18;
const PROFILE_W = 90;
const COLORBAR_H = 12;
const FREQ_MAX_DEFAULT = 5.0;
const BUFFER_MULT = 6;
const LABEL_INTERVAL_SEC = 30;
/** Fixed internal height for the ring-buffer (resolution-independent) */
const BUFFER_H = 256;

/** Columns generated per second of sim-time */
const COLS_PER_SECOND = 1000 / COL_INTERVAL_MS;

/* ── helpers ── */
function spectrogramColor(t: number): [number, number, number] {
  const stops: [number, number, number, number][] = [
    [0.0, 8, 15, 80], [0.12, 10, 40, 170], [0.25, 10, 110, 160],
    [0.40, 30, 170, 80], [0.55, 60, 210, 30], [0.68, 160, 220, 20],
    [0.78, 230, 210, 15], [0.88, 250, 160, 10], [1.0, 255, 100, 10],
  ];
  if (t <= 0) return [stops[0][1], stops[0][2], stops[0][3]];
  if (t >= 1) { const l = stops[stops.length - 1]; return [l[1], l[2], l[3]]; }
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, r0, g0, b0] = stops[i];
    const [t1, r1, g1, b1] = stops[i + 1];
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return [Math.round(r0 + (r1 - r0) * f), Math.round(g0 + (g1 - g0) * f), Math.round(b0 + (b1 - b0) * f)];
    }
  }
  const l = stops[stops.length - 1];
  return [l[1], l[2], l[3]];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s >> 16) / 32768; };
}

function computeColumnData(timeIdx: number, h: number, rng?: () => number): { imgData: ImageData | null; intensities: number[] } {
  const offscreen = document.createElement("canvas");
  offscreen.width = 1; offscreen.height = h;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return { imgData: null, intensities: [] };
  const imgData = ctx.createImageData(1, h);
  const intensities: number[] = new Array(h);
  const time = timeIdx * 0.003;
  const rand = rng || Math.random;
  for (let y = 0; y < h; y++) {
    const freq = y / h;
    const band1 = Math.exp(-Math.pow(freq - 0.15, 2) / 0.005) * (0.5 + 0.5 * Math.sin(time * 30));
    const band2 = Math.exp(-Math.pow(freq - 0.35, 2) / 0.008) * (0.3 + 0.7 * Math.sin(time * 15 + 2));
    const band3 = Math.exp(-Math.pow(freq - 0.6, 2) / 0.01) * (0.2 + 0.3 * rand());
    const band4 = Math.exp(-Math.pow(freq - 0.8, 2) / 0.006) * (0.15 + 0.4 * Math.sin(time * 45 + 1));
    const burst = rand() < 0.06 ? rand() * 0.5 : 0;
    const noise = rand() * 0.18;
    const jitter = Math.sin(freq * 40 + time * 20) * 0.08;
    const intensity = Math.min(1, band1 + band2 + band3 + band4 + burst + noise + jitter);
    intensities[y] = intensity;
    const [r, g, b] = spectrogramColor(intensity);
    const flipY = h - y - 1;
    const idx = flipY * 4;
    imgData.data[idx] = r; imgData.data[idx + 1] = g; imgData.data[idx + 2] = b; imgData.data[idx + 3] = 255;
  }
  return { imgData, intensities };
}

/* ── component ── */
interface SpectrogramProps {
  isPlaying: boolean;
  currentSimTimeMs: number;
  scrollOffset: number;
  zoom: number;
  onScroll: (offset: number) => void;
}

export function SpectrogramView({ isPlaying, currentSimTimeMs, scrollOffset, zoom, onScroll }: SpectrogramProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement>(null);
  const profileCanvasRef = useRef<HTMLCanvasElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  /* Off-screen ring buffer */
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferWidthRef = useRef(0);
  const writePosRef = useRef(0);       // next column index to write in buffer
  const colSeedRef = useRef(0);        // global column counter (for deterministic RNG)
  const prefilledRef = useRef(false);

  /* Profile data */
  const frozenAvgRef = useRef<number[] | null>(null);
  const currentIntensitiesRef = useRef<number[] | null>(null);

  /**
   * virtualHead — a floating-point counter of "how many columns have been
   * conceptually produced".  Integer part = columns written to buffer.
   * Fractional part = sub-pixel offset for smooth scrolling between columns.
   * Advances continuously while isPlaying.
   */
  const virtualHeadRef = useRef(0);
  const playStartTsRef = useRef(0);       // wall-clock ms when play started
  const headAtPlayStartRef = useRef(0);   // virtualHead snapshot at play start

  /** panOffset — columns back from live edge (0 = live, positive = looking at older data) */
  const panOffsetRef = useRef(0);
  const [panOffset, setPanOffset] = useState(0);

  /** Drag state */
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPanRef = useRef(0);

  const simTimeMsRef = useRef(currentSimTimeMs);
  const rafRef = useRef(0);

  const [freqMax, setFreqMax] = useState(FREQ_MAX_DEFAULT);
  const freqMaxRef = useRef(freqMax);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  useEffect(() => { freqMaxRef.current = freqMax; }, [freqMax]);
  useEffect(() => { simTimeMsRef.current = currentSimTimeMs; }, [currentSimTimeMs]);

  /* Resolve CSS var for canvas font */
  const resolvedFontRef = useRef("'Inter', sans-serif");
  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--font-family-base").trim();
    if (v) resolvedFontRef.current = v;
  }, []);

  /* ResizeObserver */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ w: Math.floor(width), h: Math.floor(height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── buffer management ── */
  const ensureBuffer = useCallback((viewW: number) => {
    const bw = viewW * BUFFER_MULT;
    if (!bufferCanvasRef.current || bufferWidthRef.current !== bw) {
      const oldBuf = bufferCanvasRef.current;
      const newBuf = document.createElement("canvas");
      newBuf.width = bw; newBuf.height = BUFFER_H;
      const ctx = newBuf.getContext("2d")!;
      ctx.fillStyle = "#080F18"; ctx.fillRect(0, 0, bw, BUFFER_H);
      if (oldBuf) ctx.drawImage(oldBuf, 0, 0);
      bufferCanvasRef.current = newBuf;
      bufferWidthRef.current = bw;
    }
    return bufferCanvasRef.current;
  }, []);

  /** Fill initial data so the spectrogram isn't blank on mount */
  const prefillBuffer = useCallback((viewW: number) => {
    if (prefilledRef.current || viewW === 0) return;
    prefilledRef.current = true;
    const bw = viewW * BUFFER_MULT;
    const buf = ensureBuffer(viewW);
    buf.width = bw; buf.height = BUFFER_H; bufferWidthRef.current = bw;
    const bufCtx = buf.getContext("2d")!;
    bufCtx.fillStyle = "#080F18"; bufCtx.fillRect(0, 0, bw, BUFFER_H);
    const prefillCols = viewW;
    const rng = seededRandom(12345);
    let runningAvg: number[] | null = null;
    let lastInts: number[] = [];
    for (let col = 0; col < prefillCols; col++) {
      const { imgData, intensities } = computeColumnData(col, BUFFER_H, rng);
      if (imgData) bufCtx.putImageData(imgData, col, 0);
      lastInts = intensities;
      if (col >= prefillCols - 80) {
        if (!runningAvg) runningAvg = [...intensities];
        else for (let i = 0; i < BUFFER_H; i++) runningAvg[i] = runningAvg[i] * 0.95 + intensities[i] * 0.05;
      }
    }
    currentIntensitiesRef.current = lastInts;
    frozenAvgRef.current = runningAvg;
    writePosRef.current = prefillCols;
    colSeedRef.current = prefillCols;
    virtualHeadRef.current = prefillCols;
  }, [ensureBuffer]);

  /**
   * Generate columns in the buffer up to targetIntCol (integer column index).
   * Wraps the ring buffer when it gets full.
   * Buffer always uses BUFFER_H for column height.
   */
  const generateColumnsUpTo = useCallback((targetIntCol: number, viewW: number) => {
    const buf = bufferCanvasRef.current;
    if (!buf) return;
    const bufCtx = buf.getContext("2d")!;
    const bw = bufferWidthRef.current;
    while (writePosRef.current <= targetIntCol) {
      // Ring-buffer wrap: shift left half away
      if (writePosRef.current >= bw) {
        const keep = Math.floor(bw / 2);
        const img = bufCtx.getImageData(bw - keep, 0, keep, BUFFER_H);
        bufCtx.fillStyle = "#080F18"; bufCtx.fillRect(0, 0, bw, BUFFER_H);
        bufCtx.putImageData(img, 0, 0);
        writePosRef.current = keep;
      }
      const { imgData, intensities } = computeColumnData(colSeedRef.current, BUFFER_H);
      if (imgData) bufCtx.putImageData(imgData, writePosRef.current, 0);
      currentIntensitiesRef.current = intensities;
      writePosRef.current += 1;
      colSeedRef.current += 1;
    }
  }, []);

  /* ── draw: spectrogram waterfall (stretches buffer vertically to fill viewH) ── */
  const drawWaterfall = useCallback((ctx: CanvasRenderingContext2D, viewW: number, viewH: number, head: number) => {
    const buf = bufferCanvasRef.current;
    if (!buf) return;
    ctx.fillStyle = "#080F18";
    ctx.fillRect(0, 0, viewW, viewH);

    const wp = writePosRef.current;
    const pan = panOffsetRef.current;
    const intHead = Math.floor(head);
    const fracPx = pan === 0 ? (head - intHead) : 0;

    // Right edge of visible data in buffer = wp - pan
    const visibleRight = Math.max(0, wp - pan);
    const srcRight = visibleRight;
    const srcLeft = Math.max(0, visibleRight - viewW - 1);
    const srcW = srcRight - srcLeft;
    if (srcW <= 0) return;

    const dstRight = viewW;
    const dstLeft = dstRight - srcW;
    // Source from buffer at BUFFER_H, draw stretched to viewH
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(buf, srcLeft, 0, srcW, BUFFER_H, dstLeft - fracPx, 0, srcW, viewH);
  }, []);

  /* ── draw: timeline ── */
  const drawTimeline = useCallback((viewW: number) => {
    const tlCanvas = timelineCanvasRef.current;
    if (!tlCanvas) return;
    const dpr = window.devicePixelRatio || 1;
    tlCanvas.width = viewW * dpr; tlCanvas.height = TIMELINE_H * dpr;
    tlCanvas.style.width = `${viewW}px`; tlCanvas.style.height = `${TIMELINE_H}px`;
    const ctx = tlCanvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "rgba(8,15,24,1)"; ctx.fillRect(0, 0, viewW, TIMELINE_H);
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 0.5); ctx.lineTo(viewW, 0.5); ctx.stroke();

    // Account for panOffset: shift the effective "now" back by panOffset columns
    const panSec = (panOffsetRef.current * COL_INTERVAL_MS) / 1000;
    const nowSec = simTimeMsRef.current / 1000 - panSec;

    // Spacing: 5 labels must always be visible, so 1 label-interval = viewW / 5 pixels
    const spacingPx = viewW / 5;
    const pxPerSec = spacingPx / LABEL_INTERVAL_SEC;

    // Rightmost label = nowSec rounded down to LABEL_INTERVAL_SEC
    const firstLabelSec = Math.floor(nowSec / LABEL_INTERVAL_SEC) * LABEL_INTERVAL_SEC;
    // Fractional progress within the current 30-second window → smooth shift
    const fracSec = nowSec - firstLabelSec;
    const fracPx = fracSec * pxPerSec;

    const font = resolvedFontRef.current;
    ctx.font = `9px ${font}`;
    ctx.fillStyle = "rgba(191, 201, 212, 0.55)";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";

    // Draw 6 labels (5 visible + 1 entering/exiting for smooth transition)
    for (let i = 0; i < 6; i++) {
      const labelSec = firstLabelSec - i * LABEL_INTERVAL_SEC;
      if (labelSec < 0) break;
      // Rightmost label starts at viewW, shifts left by fracPx as time advances
      const x = viewW - fracPx - i * spacingPx;
      if (x < -spacingPx || x > viewW + spacingPx) continue;

      const date = new Date(labelSec * 1000);
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");

      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, 1); ctx.lineTo(x, 5); ctx.stroke();
      ctx.fillText(`${hh}:${mm}:${ss}`, x, 11);
    }
  }, []);

  /* ── draw: spectrum profile (unchanged) ── */
  const drawProfile = useCallback(() => {
    const canvas = profileCanvasRef.current;
    const container = profileContainerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const W = Math.floor(rect.width); const H = Math.floor(rect.height);
    if (W === 0 || H === 0) return;
    const fMax = freqMaxRef.current;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "rgba(8,15,24,1)"; ctx.fillRect(0, 0, W, H);

    const labelW = 36; const plotLeft = 2; const plotRight = W - labelW;
    const plotW = plotRight - plotLeft; const plotTop = 6;
    const plotBottom = H - COLORBAR_H - 4; const plotH = plotBottom - plotTop;
    if (plotW <= 0 || plotH <= 0) return;

    const gridStep = fMax <= 1.5 ? 0.25 : fMax <= 3 ? 0.5 : 1.0;
    ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 0.5;
    const font = resolvedFontRef.current;
    ctx.font = `9px ${font}`;
    ctx.fillStyle = "rgba(191, 201, 212, 0.55)";
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    for (let freq = 0; freq <= fMax + 0.001; freq += gridStep) {
      const yFrac = freq / fMax;
      const y = plotBottom - yFrac * plotH;
      if (y < plotTop - 5 || y > plotBottom + 5) continue;
      ctx.beginPath(); ctx.moveTo(plotLeft, y); ctx.lineTo(plotRight, y); ctx.stroke();
      const labelY = Math.max(plotTop + 2, Math.min(plotBottom - 2, y));
      ctx.fillText(freq.toFixed(2), plotRight + 3, labelY);
    }
    for (let a = 0; a <= 1; a += 0.25) {
      const x = plotLeft + a * plotW;
      ctx.beginPath(); ctx.moveTo(x, plotTop); ctx.lineTo(x, plotBottom); ctx.stroke();
    }

    const mapY = (ints: number[], i: number) => {
      const freq = (i / ints.length) * FREQ_MAX_DEFAULT;
      if (freq > fMax) return null;
      return plotBottom - (freq / fMax) * plotH;
    };

    const avg = frozenAvgRef.current;
    if (avg && avg.length > 0) {
      ctx.strokeStyle = "rgba(32, 158, 248, 0.8)"; ctx.lineWidth = 1.5; ctx.beginPath();
      let s = false;
      for (let i = 0; i < avg.length; i++) { const y = mapY(avg, i); if (y === null) break; const x = plotLeft + avg[i] * plotW; if (!s) { ctx.moveTo(x, y); s = true; } else ctx.lineTo(x, y); }
      ctx.stroke();
    }
    const cur = currentIntensitiesRef.current;
    if (cur && cur.length > 0) {
      ctx.strokeStyle = "rgba(196, 43, 28, 1)"; ctx.lineWidth = 1.2; ctx.beginPath();
      let s = false;
      for (let i = 0; i < cur.length; i++) { const y = mapY(cur, i); if (y === null) break; const x = plotLeft + cur[i] * plotW; if (!s) { ctx.moveTo(x, y); s = true; } else ctx.lineTo(x, y); }
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0.5, plotTop); ctx.lineTo(0.5, plotBottom); ctx.stroke();
    const cbTop = plotBottom + 2; const cbH = COLORBAR_H - 4;
    for (let x = plotLeft; x < plotRight; x++) {
      const tt = (x - plotLeft) / (plotRight - plotLeft);
      const [r, g, b] = spectrogramColor(tt);
      ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(x, cbTop, 1, cbH);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 0.5;
    ctx.strokeRect(plotLeft, cbTop, plotRight - plotLeft, cbH);
  }, []);

  /* ── full render helper ── */
  const renderFrame = useCallback((viewW: number, viewH: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewW * dpr; canvas.height = viewH * dpr;
    canvas.style.width = `${viewW}px`; canvas.style.height = `${viewH}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    drawWaterfall(ctx, viewW, viewH, virtualHeadRef.current);
    drawTimeline(viewW);
    drawProfile();
  }, [drawWaterfall, drawTimeline, drawProfile]);

  /* ── Static draw (paused / mount) ── */
  useEffect(() => {
    const { w: W, h: H } = containerSize;
    if (W === 0 || H === 0) return;
    prefillBuffer(W);
    if (isPlaying) return; // rAF handles it
    renderFrame(W, H);
  }, [containerSize, currentSimTimeMs, freqMax, isPlaying, prefillBuffer, renderFrame]);

  /* ── rAF animation loop — runs only while isPlaying ── */
  useEffect(() => {
    if (!isPlaying) return;
    const { w: W, h: H } = containerSize;
    if (W === 0 || H === 0) return;

    prefillBuffer(W);
    playStartTsRef.current = 0;
    headAtPlayStartRef.current = virtualHeadRef.current;

    let running = true;
    const animate = (ts: number) => {
      if (!running) return;
      if (playStartTsRef.current === 0) playStartTsRef.current = ts;

      const elapsedSec = (ts - playStartTsRef.current) / 1000;
      const newHead = headAtPlayStartRef.current + elapsedSec * COLS_PER_SECOND;
      virtualHeadRef.current = newHead;

      // Generate any missing columns in the buffer
      const targetInt = Math.floor(newHead);
      generateColumnsUpTo(targetInt, W);

      // Render
      renderFrame(W, H);

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, containerSize, prefillBuffer, generateColumnsUpTo, renderFrame]);

  /* Wheel on profile → zoom freq */
  useEffect(() => {
    const container = profileContainerRef.current;
    if (!container) return;
    const h = (e: WheelEvent) => { e.preventDefault(); setFreqMax(p => Math.max(0.5, Math.min(10, p * (e.deltaY > 0 ? 1.1 : 0.9)))); };
    container.addEventListener("wheel", h, { passive: false });
    return () => container.removeEventListener("wheel", h);
  }, []);

  /* ── Pan helper ── */
  const KEY_PAN_STEP = 20; // columns per Shift+Arrow keypress

  const applyPan = useCallback((delta: number) => {
    const maxPan = Math.max(0, writePosRef.current - (containerSize.w || 100));
    const newPan = Math.max(0, Math.min(maxPan, panOffsetRef.current + delta));
    panOffsetRef.current = newPan;
    setPanOffset(newPan);
    // Redraw immediately when paused
    if (!isPlaying) {
      const { w: W, h: H } = containerSize;
      if (W > 0 && H > 0) renderFrame(W, H);
    }
  }, [containerSize, isPlaying, renderFrame]);

  /* ── Keyboard: Shift + ArrowLeft/Right ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); applyPan(KEY_PAN_STEP); }
      else if (e.key === "ArrowRight") { e.preventDefault(); applyPan(-KEY_PAN_STEP); }
    };
    el.setAttribute("tabindex", "0");
    el.style.outline = "none";
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [applyPan]);

  /* ── Mouse drag to pan ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartPanRef.current = panOffsetRef.current;
      el.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = dragStartXRef.current - e.clientX; // drag left = positive delta (go back in time)
      const maxPan = Math.max(0, writePosRef.current - (containerSize.w || 100));
      const newPan = Math.max(0, Math.min(maxPan, dragStartPanRef.current + dx));
      panOffsetRef.current = newPan;
      setPanOffset(newPan);
      if (!isPlaying) {
        const { w: W, h: H } = containerSize;
        if (W > 0 && H > 0) renderFrame(W, H);
      }
    };

    const onMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        el.style.cursor = "grab";
      }
    };

    el.style.cursor = "grab";
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [containerSize, isPlaying, renderFrame]);

  const fmtMs = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="bg-background border border-border rounded-md overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-0.5 border-b border-border bg-card/50 shrink-0">
        <span className="mwd-header text-muted-foreground">
          {t("spectrogram_title")}
        </span>
        <span className="mwd-cell text-muted-foreground flex items-center gap-2">
          {fmtMs(currentSimTimeMs)}
          <button
            onClick={() => window.open(`${import.meta.env.BASE_URL}#/standalone/spectrogram`, "_blank", "width=800,height=400")}
            className="p-1 rounded hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            title="Open in separate window"
          >
            <ExternalLink size={14} />
          </button>
        </span>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Waterfall */}
        <div className="flex-1 flex flex-col min-w-0">
          <div ref={containerRef} className="relative flex-1 min-h-0 select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* Pan offset indicator / back-to-live badge */}
            {panOffset > 0 && (
              <button
                className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded border border-border bg-card/90 text-accent mwd-tiny hover:bg-accent/20 transition-colors"
                style={{ fontFamily: "var(--font-family-base)" }}
                onClick={() => { panOffsetRef.current = 0; setPanOffset(0); if (!isPlaying) { const { w: W, h: H } = containerSize; if (W > 0 && H > 0) renderFrame(W, H); } }}
              >
                LIVE
              </button>
            )}
          </div>
          <div className="shrink-0" style={{ height: TIMELINE_H }}>
            <canvas ref={timelineCanvasRef} className="block w-full" style={{ height: TIMELINE_H }} />
          </div>
        </div>

        {/* Spectrum Profile */}
        <div className="shrink-0 border-l border-border flex flex-col" style={{ width: PROFILE_W }}>
          <div ref={profileContainerRef} className="flex-1 min-h-0 relative">
            <canvas ref={profileCanvasRef} className="block w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}