import React, { useRef, useEffect } from "react";
import { useI18n } from "../i18n";

// SYNC is 48 samples (2× wider), 4 FIDs split evenly across remaining 152
const PACKETS = [
  { label: "SYNC",  start: 0,   end: 48,  type: "sync" as const },
  { label: "FID:1", start: 48,  end: 86,  type: "fid"  as const, even: true  },
  { label: "FID:2", start: 86,  end: 124, type: "fid"  as const, even: false },
  { label: "FID:3", start: 124, end: 162, type: "fid"  as const, even: true  },
  { label: "FID:4", start: 162, end: 200, type: "fid"  as const, even: false },
];

// Pulse positions [start, width] — HIGH during these ranges
const PULSE_DIPS: Array<[number, number]> = [
  // SYNC: 4 evenly spaced peaks
  [4,  7],
  [16, 7],
  [28, 7],
  [40, 7],
  // FID:1
  [54, 4], [63, 4], [74, 4],
  // FID:2
  [91, 4], [100, 4], [111, 4],
  // FID:3
  [129, 4], [138, 4], [149, 4], [158, 4],
  // FID:4
  [167, 4], [179, 4],
];

function isHigh(i: number): boolean {
  return PULSE_DIPS.some(([s, w]) => i >= s && i < s + w);
}

const C = {
  bg:          "#111c27",
  headerBg:    "rgba(17,28,39,0.95)",
  syncBg:      "rgba(34, 197, 94, 0.10)",
  syncBorder:  "rgba(34, 197, 94, 0.30)",
  syncText:    "rgba(34, 197, 94, 1)",
  syncWave:    "rgba(34, 197, 94, 0.90)",
  syncFill:    "rgba(34, 197, 94, 0.07)",
  fidBg1:      "rgba(32, 158, 248, 0.08)",
  fidBg2:      "rgba(32, 158, 248, 0.04)",
  fidBorder:   "rgba(32, 158, 248, 0.20)",
  fidText:     "rgba(32, 158, 248, 0.85)",
  fidWave:     "rgba(32, 158, 248, 0.90)",
  fidFill1:    "rgba(32, 158, 248, 0.08)",
  fidFill2:    "rgba(32, 158, 248, 0.04)",
  divider:     "rgba(255,255,255,0.06)",
  headerLine:  "rgba(255,255,255,0.08)",
  grid:        "rgba(255,255,255,0.04)",
};

interface PulseViewProps {
  actions?: React.ReactNode;
}

export function PulseView({ actions }: PulseViewProps = {}) {
  const { t } = useI18n();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const W = rect.width;
      const H = rect.height;
      if (W === 0 || H === 0) return;

      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;

      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);

      const N       = 200;
      const headerH = 38;
      const pad     = 6;
      const chartH  = H - headerH;

      // Background
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle horizontal grid lines in chart area
      ctx.strokeStyle = C.grid;
      ctx.lineWidth   = 0.5;
      for (let i = 1; i < 4; i++) {
        const y = headerH + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      const toX = (i: number) => (i / (N - 1)) * W;

      // Square wave levels — same proportions as DecoderChart
      const baseY = headerH + chartH - pad;
      const topY  = headerH + pad + (chartH - pad * 2) * 0.25; // 75% wave height

      // Draw per-packet header block + square-wave waveform
      for (const pkt of PACKETS) {
        const x1 = (pkt.start / N) * W;
        const x2 = (pkt.end   / N) * W;
        const pw  = x2 - x1;

        const borderColor   = pkt.type === "sync" ? C.syncBorder : C.fidBorder;
        const textColor     = pkt.type === "sync" ? C.syncText   : C.fidText;
        const waveColor     = pkt.type === "sync" ? C.syncWave   : C.fidWave;
        const fillColor     = pkt.type === "sync"
          ? C.syncFill
          : pkt.even ? C.fidFill1 : C.fidFill2;
        const headerBgColor = pkt.type === "sync"
          ? C.syncBg
          : pkt.even ? C.fidBg1 : C.fidBg2;

        // ── Header block ──
        ctx.fillStyle = headerBgColor;
        ctx.fillRect(x1, 0, pw, headerH);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth   = 0.8;
        ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1, headerH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, 0); ctx.lineTo(x2, headerH); ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.rect(x1 + 1, 0, pw - 2, headerH);
        ctx.clip();
        ctx.fillStyle    = textColor;
        ctx.font         = `bold 10px Inter, sans-serif`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pkt.label, x1 + pw / 2, headerH / 2);
        ctx.restore();

        // ── Vertical dividers ──
        ctx.strokeStyle = borderColor;
        ctx.lineWidth   = 0.6;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(x1, headerH); ctx.lineTo(x1, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, headerH); ctx.lineTo(x2, H); ctx.stroke();
        ctx.setLineDash([]);

        // ── Square-wave waveform (clipped to packet) ──
        ctx.save();
        ctx.beginPath();
        ctx.rect(x1, headerH, pw, chartH);
        ctx.clip();

        const startI = pkt.start;
        const endI   = Math.min(pkt.end, N - 1);

        // Build square wave path
        const wavePath: Array<[number, number]> = [];
        let prev = isHigh(startI);
        wavePath.push([toX(startI), prev ? topY : baseY]);

        for (let i = startI + 1; i <= endI; i++) {
          const high = isHigh(i);
          const x    = toX(i);
          if (high !== prev) {
            // vertical transition: stay at current y, then jump
            wavePath.push([x, prev ? topY : baseY]);
            wavePath.push([x, high ? topY : baseY]);
            prev = high;
          } else {
            wavePath.push([x, high ? topY : baseY]);
          }
        }

        // Stroke
        ctx.beginPath();
        wavePath.forEach(([x, y], idx) => idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.strokeStyle = waveColor;
        ctx.lineWidth   = 2;
        ctx.stroke();

        // Fill under wave
        ctx.beginPath();
        wavePath.forEach(([x, y], idx) => idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.lineTo(toX(endI), baseY);
        ctx.lineTo(toX(startI), baseY);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.restore();
      }

      // Header separator line
      ctx.strokeStyle = C.headerLine;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(0, headerH);
      ctx.lineTo(W, headerH);
      ctx.stroke();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="h-64 border-t border-border bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-border bg-secondary/10 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
          {t("sum_pulse_view")}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-foreground/40">MIN: 141.2 bar</span>
          <span className="text-[10px] font-mono text-foreground/40">MAX: 148.4 bar</span>
          <span className="text-[10px] font-mono text-primary font-bold">AVG: 142.5 bar</span>
          {actions}
        </div>
      </div>
      {/* Canvas chart */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
