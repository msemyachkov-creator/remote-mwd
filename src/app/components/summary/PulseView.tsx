import React, { useRef, useEffect, useState } from "react";
import { useI18n } from "../i18n";

type SignalLevel = "good" | "medium" | "poor";

const SIGNAL_CONFIG: Record<SignalLevel, { label: string; color: string; bars: number }> = {
  good:   { label: "Good",   color: "var(--chart-2)",    bars: 4 },
  medium: { label: "Medium", color: "#eab308",            bars: 2 },
  poor:   { label: "Poor",   color: "var(--destructive)", bars: 1 },
};

function SignalQualityBadge({ level = "good" }: { level?: SignalLevel }) {
  const { label, color, bars } = SIGNAL_CONFIG[level];
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: "10px", fontFamily: "var(--font-family-base)", color: "var(--foreground)", opacity: 0.45, fontWeight: 500 }}>
        Signal quality
      </span>
      <div className="flex items-end gap-[2px]" style={{ height: "12px" }}>
        {[3, 6, 9, 12].map((h, i) => (
          <div
            key={i}
            style={{
              width: "3px",
              height: `${h}px`,
              borderRadius: "1px",
              backgroundColor: i < bars ? color : "var(--border)",
              opacity: i < bars ? 1 : 0.4,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "10px", fontFamily: "var(--font-family-base)", color, fontWeight: 700 }}>
        {label}
      </span>
    </div>
  );
}

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
  [4,  7], [16, 7], [28, 7], [40, 7],
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

// Time labels at packet boundaries
const TIME_LABELS = [
  { i: 0,   label: "15:31:30" },
  { i: 86,  label: "15:31:58" },
  { i: 124, label: "15:32:09" },
  { i: 162, label: "15:32:20" },
  { i: 199, label: "15:32:31" },
];

// Report send markers — tied to rig report statuses
const REPORT_MARKERS: Array<{ i: number; status: "sent" | "sending" | "failed" | "not_sent"; label: string; time: string; pipe: string }> = [
  { i: 86,  status: "sent",    label: "R1", time: "15:31:58", pipe: "FID:1 — Pipe #14" },
  { i: 124, status: "sent",    label: "R2", time: "15:32:09", pipe: "FID:2 — Pipe #15" },
  { i: 162, status: "failed",  label: "R3", time: "15:32:20", pipe: "FID:3 — Pipe #16" },
  { i: 199, status: "sending", label: "R4", time: "15:32:31", pipe: "FID:4 — Pipe #17" },
];

const REPORT_STATUS_LABELS: Record<string, string> = {
  sent:     "Sent",
  sending:  "Sending…",
  not_sent: "Not sent",
  failed:   "Failed",
};

const REPORT_COLORS: Record<string, string> = {
  sent:     "rgba(34, 197, 94, 0.95)",
  sending:  "#eab308",
  not_sent: "rgba(150,150,150,0.5)",
  failed:   "rgba(239, 68, 68, 0.95)",
};

const C = {
  bg:          "#111c27",
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
  headerLine:  "rgba(255,255,255,0.08)",
  grid:        "rgba(255,255,255,0.04)",
  timeAxis:    "rgba(255,255,255,0.06)",
  timeText:    "rgba(255,255,255,0.28)",
  timeTick:    "rgba(255,255,255,0.15)",
};

interface PulseViewProps {
  actions?: React.ReactNode;
}

interface TooltipState {
  x: number;
  y: number;
  marker: typeof REPORT_MARKERS[number];
}

export function PulseView({ actions }: PulseViewProps = {}) {
  const { t } = useI18n();
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const dpr  = window.devicePixelRatio || 1;
      const W    = rect.width;
      const H    = rect.height;
      if (W === 0 || H === 0) return;

      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;

      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);

      const N          = 200;
      const headerH    = 38;
      const timeAxisH  = 18;
      const pad        = 6;
      const chartH     = H - headerH - timeAxisH;

      const toX = (i: number) => (i / (N - 1)) * W;

      const baseY = headerH + chartH - pad;
      const topY  = headerH + pad + (chartH - pad * 2) * 0.25;

      // ── Background ──
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);

      // ── Subtle horizontal grid lines ──
      ctx.strokeStyle = C.grid;
      ctx.lineWidth   = 0.5;
      for (let i = 1; i < 4; i++) {
        const y = headerH + (chartH / 4) * i;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── Per-packet header blocks + fills ──
      for (const pkt of PACKETS) {
        const x1 = (pkt.start / N) * W;
        const x2 = (pkt.end   / N) * W;
        const pw  = x2 - x1;

        const borderColor   = pkt.type === "sync" ? C.syncBorder : C.fidBorder;
        const textColor     = pkt.type === "sync" ? C.syncText   : C.fidText;
        const fillColor     = pkt.type === "sync" ? C.syncFill   : pkt.even ? C.fidFill1 : C.fidFill2;
        const headerBgColor = pkt.type === "sync" ? C.syncBg     : pkt.even ? C.fidBg1   : C.fidBg2;

        // Header bg
        ctx.fillStyle = headerBgColor;
        ctx.fillRect(x1, 0, pw, headerH);

        // Header vertical borders
        ctx.strokeStyle = borderColor;
        ctx.lineWidth   = 0.8;
        ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1, headerH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, 0); ctx.lineTo(x2, headerH); ctx.stroke();

        // Header label
        ctx.save();
        ctx.beginPath(); ctx.rect(x1 + 1, 0, pw - 2, headerH); ctx.clip();
        ctx.fillStyle    = textColor;
        ctx.font         = `bold 10px Inter, sans-serif`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pkt.label, x1 + pw / 2, headerH / 2);
        ctx.restore();

        // Vertical dividers (dashed)
        ctx.strokeStyle = borderColor;
        ctx.lineWidth   = 0.6;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(x1, headerH); ctx.lineTo(x1, headerH + chartH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, headerH); ctx.lineTo(x2, headerH + chartH); ctx.stroke();
        ctx.setLineDash([]);

        // Chart fill under wave (clipped to packet)
        ctx.save();
        ctx.beginPath(); ctx.rect(x1, headerH, pw, chartH); ctx.clip();

        const startI = pkt.start;
        const endI   = Math.min(pkt.end, N - 1);

        // Build fill path for this segment
        const fillPath: Array<[number, number]> = [];
        let prev = isHigh(startI);
        fillPath.push([toX(startI), prev ? topY : baseY]);
        for (let i = startI + 1; i <= endI; i++) {
          const high = isHigh(i);
          const x    = toX(i);
          if (high !== prev) {
            fillPath.push([x, prev ? topY : baseY]);
            fillPath.push([x, high ? topY : baseY]);
            prev = high;
          } else {
            fillPath.push([x, high ? topY : baseY]);
          }
        }

        ctx.beginPath();
        fillPath.forEach(([x, y], idx) => idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.lineTo(toX(endI), baseY);
        ctx.lineTo(toX(startI), baseY);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.restore();
      }

      // ── Continuous wave stroke — drawn ONCE per color to avoid breaks ──
      // Helper: build wave path from index a to index b
      const buildWavePath = (a: number, b: number): Array<[number, number]> => {
        const path: Array<[number, number]> = [];
        let prev = isHigh(a);
        path.push([toX(a), prev ? topY : baseY]);
        for (let i = a + 1; i <= b; i++) {
          const high = isHigh(i);
          const x    = toX(i);
          if (high !== prev) {
            path.push([x, prev ? topY : baseY]);
            path.push([x, high ? topY : baseY]);
            prev = high;
          } else {
            path.push([x, high ? topY : baseY]);
          }
        }
        return path;
      };

      const strokePath = (path: Array<[number, number]>, color: string) => {
        ctx.beginPath();
        path.forEach(([x, y], idx) => idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.strokeStyle = color;
        ctx.lineWidth   = 2;
        ctx.stroke();
      };

      // SYNC stroke (green, 0–48)
      strokePath(buildWavePath(0, 48), C.syncWave);
      // All FIDs as one continuous path (blue, 48–199) — no break between segments
      strokePath(buildWavePath(48, N - 1), C.fidWave);

      // ── Report markers ──
      const MARKER_R = 7; // radius
      for (const marker of REPORT_MARKERS) {
        const x     = toX(marker.i);
        const color = REPORT_COLORS[marker.status];
        const cy    = headerH + MARKER_R + 3;

        // Vertical line through chart area
        ctx.strokeStyle = color;
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(x, cy + MARKER_R);
        ctx.lineTo(x, headerH + chartH);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Glow halo
        const glow = ctx.createRadialGradient(x, cy, 0, x, cy, MARKER_R * 2.2);
        glow.addColorStop(0, color.replace("0.95", "0.25").replace("1)", "0.25)"));
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, cy, MARKER_R * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Circle with border
        ctx.beginPath();
        ctx.arc(x, cy, MARKER_R, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth   = 1;
        ctx.stroke();

        // "R" label
        ctx.fillStyle    = "#0a1520";
        ctx.font         = `bold 7px Inter, sans-serif`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("R", x, cy);
      }

      // ── Header separator ──
      ctx.strokeStyle = C.headerLine;
      ctx.lineWidth   = 1;
      ctx.beginPath(); ctx.moveTo(0, headerH); ctx.lineTo(W, headerH); ctx.stroke();

      // ── Time axis ──
      const timeY = headerH + chartH;

      // Time axis background
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, timeY, W, timeAxisH);

      // Time axis top line
      ctx.strokeStyle = C.timeAxis;
      ctx.lineWidth   = 1;
      ctx.beginPath(); ctx.moveTo(0, timeY); ctx.lineTo(W, timeY); ctx.stroke();

      // Time ticks + labels
      ctx.font         = `10px Inter, sans-serif`;
      ctx.textBaseline = "middle";

      for (const { i, label } of TIME_LABELS) {
        const x = toX(i);

        // Tick
        ctx.strokeStyle = C.timeTick;
        ctx.lineWidth   = 1;
        ctx.beginPath(); ctx.moveTo(x, timeY); ctx.lineTo(x, timeY + 4); ctx.stroke();

        // Label — clamp to avoid overflow at edges
        ctx.fillStyle = C.timeText;
        const measured = ctx.measureText(label).width;
        let lx = x;
        if (i === 0)         lx = measured / 2 + 2;
        else if (i >= N - 2) lx = W - measured / 2 - 2;
        ctx.textAlign = "center";
        ctx.fillText(label, lx, timeY + timeAxisH / 2 + 1);
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Tooltip: detect hover over markers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const W  = rect.width;
    const N  = 200;
    const MARKER_R = 7;
    const headerH  = 38;

    const hit = REPORT_MARKERS.find((m) => {
      const cx = (m.i / (N - 1)) * W;
      const cy = headerH + MARKER_R + 3;
      return Math.hypot(mx - cx, my - cy) <= MARKER_R + 5;
    });

    setTooltip(hit ? { x: mx, y: my, marker: hit } : null);
  };

  return (
    <div className="border-t border-border bg-background flex flex-col" style={{ height: "clamp(160px, 25vh, 320px)" }}>
      {/* Header bar */}
      <div className="px-4 py-2 border-b border-border bg-secondary/10 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
          {t("sum_pulse_view")}
        </span>
        <div className="flex items-center gap-4">
          <SignalQualityBadge level="good" />
          <div className="w-px h-3 bg-border/60" />
          <span className="text-[10px] font-mono text-foreground/40">MIN: 141.2 bar</span>
          <span className="text-[10px] font-mono text-foreground/40">MAX: 148.4 bar</span>
          <span className="text-[10px] font-mono text-primary font-bold">AVG: 142.5 bar</span>
          {actions}
        </div>
      </div>
      {/* Canvas chart */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Tooltip */}
        {tooltip && (() => {
          const { x, y, marker } = tooltip;
          const color  = REPORT_COLORS[marker.status];
          const label  = REPORT_STATUS_LABELS[marker.status];
          // Position: prefer right, flip left near right edge
          const tipW   = 160;
          const left   = x + 12 + tipW > (containerRef.current?.clientWidth ?? 9999)
            ? x - tipW - 12
            : x + 12;
          return (
            <div
              className="absolute z-50 pointer-events-none"
              style={{
                left,
                top: Math.max(4, y - 48),
                width: tipW,
                background: "rgba(10,18,28,0.96)",
                border: `1px solid ${color}40`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 6,
                padding: "7px 10px",
                boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px ${color}20`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="inline-block size-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span style={{ color, fontSize: 11, fontWeight: 700, fontFamily: "var(--font-family-base)" }}>
                  {label}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-family-base)", lineHeight: 1.6 }}>
                <div>{marker.pipe}</div>
                <div style={{ color: "rgba(255,255,255,0.4)" }}>{marker.time}</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
