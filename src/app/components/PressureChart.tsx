import React, { useRef, useEffect, useCallback } from "react";
import { ExternalLink } from "lucide-react";
import {
  type MWDPacket,
  PIXELS_PER_SECOND,
  BIT_WIDTH_PX,
  COLORS,
  getChannelColors,
  deterministicNoise,
  formatTime,
  getTotalWidthPx,
} from "./mwd-data";
import { useI18n } from "./i18n";

type Tab = "p1" | "p2";
const fontInter = "'Inter', sans-serif";

interface PressureChartProps {
  isPlaying: boolean;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  mwdData: MWDPacket[];
  scrollOffset: number;
  onScroll: (offset: number) => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  currentSimTimeMs: number;
}

export function PressureChart({
  isPlaying,
  activeTab,
  onTabChange,
  mwdData,
  scrollOffset,
  onScroll,
  zoom,
  onZoomChange,
  currentSimTimeMs,
}: PressureChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const isDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  const { t } = useI18n();

  const tabs: { key: Tab; label: string; color: string }[] = [
    { key: "p1", label: t("pressure_p1"), color: "var(--chart-1)" },
    { key: "p2", label: t("pressure_p2"), color: "var(--chart-5)" },
  ];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const W = rect.width;
    const H = rect.height;
    if (W === 0 || H === 0) return;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const chartH = H;
    const chColors = getChannelColors(activeTab);

    // Right-align: when data is shorter than viewport, push to right edge
    const totalDataW = getTotalWidthPx(mwdData);
    const dataRightScreen = (totalDataW - scrollOffset) * zoom;
    const rightAlignPad = Math.max(0, W - dataRightScreen);

    const screenToWorld = (sx: number) => scrollOffset + (sx - rightAlignPad) / zoom;
    const worldToScreen = (wpx: number) => (wpx - scrollOffset) * zoom + rightAlignPad;

    // Background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, W, H);

    // Horizontal grid
    ctx.strokeStyle = COLORS.borderFaint;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Vertical grid every 30 seconds
    const firstTickS =
      Math.ceil(screenToWorld(0) / PIXELS_PER_SECOND / 30) * 30;
    for (let s = firstTickS; ; s += 30) {
      const x = worldToScreen(s * PIXELS_PER_SECOND);
      if (x > W) break;
      if (x < 0) continue;
      ctx.strokeStyle = COLORS.borderFaint;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartH);
      ctx.stroke();
    }

    // --- Square-topped noisy pressure waveform ---
    const baselineY = chartH * 0.78;
    const highY = chartH * 0.18;

    ctx.beginPath();
    ctx.strokeStyle = chColors.main;
    ctx.lineWidth = 1.0;

    for (let x = 0; x <= W; x++) {
      const worldPx = screenToWorld(x);

      let inPacket = false;
      let bitVal = 0;

      for (const pkt of mwdData) {
        if (
          worldPx >= pkt.startPx &&
          worldPx < pkt.startPx + pkt.bits.length * BIT_WIDTH_PX
        ) {
          const localPx = worldPx - pkt.startPx;
          const bitIdx = Math.floor(localPx / BIT_WIDTH_PX);
          const maxBits = pkt.revealedBits != null ? pkt.revealedBits : pkt.bits.length;
          if (bitIdx >= 0 && bitIdx < maxBits) {
            inPacket = true;
            bitVal = pkt.bits[bitIdx];
          }
          break;
        }
      }

      const noise =
        deterministicNoise(worldPx * 1.3) * chartH * 0.028 +
        deterministicNoise(worldPx * 3.9) * chartH * 0.014 +
        deterministicNoise(worldPx * 9.1) * chartH * 0.008;

      let y: number;
      if (!inPacket) {
        y = baselineY + noise * 0.4;
      } else if (bitVal === 1) {
        y = highY + noise;
      } else {
        y = baselineY + noise;
      }

      y = Math.max(2, Math.min(chartH - 2, y));

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Y-axis background panel (left edge)
    const yAxisWidth = 44;
    ctx.fillStyle = "rgba(25, 40, 56, 0.85)";
    ctx.fillRect(0, 0, yAxisWidth, chartH);
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(yAxisWidth, 0);
    ctx.lineTo(yAxisWidth, chartH);
    ctx.stroke();

    // Y-axis pressure labels at left edge
    const yLabels = [191.43, 187.70, 183.97, 180.24, 176.51];
    ctx.font = `9px ${fontInter}`;
    ctx.fillStyle = COLORS.mutedForegroundBright;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (let i = 0; i < yLabels.length; i++) {
      const rawY = (chartH / (yLabels.length - 1)) * i;
      const y = i === 0 ? rawY + 8 : i === yLabels.length - 1 ? rawY - 6 : rawY;
      ctx.fillText(yLabels[i].toFixed(2), 4, y);
    }
  }, [mwdData, scrollOffset, activeTab, zoom]);

  // Render loop
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  // Wheel → zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const W = rect.width;

      // Account for right-alignment padding
      const totalDataW = getTotalWidthPx(mwdData);
      const dataRightScreen = (totalDataW - scrollOffset) * zoom;
      const pad = Math.max(0, W - dataRightScreen);

      const worldPx = scrollOffset + (mouseX - pad) / zoom;
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const newZoom = Math.max(0.3, Math.min(6, zoom * factor));
      const newScroll = worldPx - (mouseX - pad) / newZoom;
      onZoomChange(newZoom);
      onScroll(Math.max(0, newScroll));
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [scrollOffset, zoom, onScroll, onZoomChange, mwdData]);

  // Mouse drag → pan
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onDown = (e: MouseEvent) => {
      isDragRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartScrollRef.current = scrollOffset;
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      onScroll(Math.max(0, dragStartScrollRef.current - dx / zoom));
    };
    const onUp = () => {
      isDragRef.current = false;
    };
    container.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      container.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [scrollOffset, zoom, onScroll]);

  const simTimeLabel = new Date(currentSimTimeMs).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* Tabs header */}
      <div className="flex items-center gap-0 px-0 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border-r border-border transition-colors relative ${
                  isActive
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
                style={{
                  fontFamily: fontInter,
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive
                    ? "var(--font-weight-medium)"
                    : ("var(--font-weight-normal)" as any),
                }}
              >
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: tab.color }}
                />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
                )}
              </button>
            );
          })}
        </div>
        <span
          className="ml-auto px-3 text-muted-foreground flex items-center gap-2"
          style={{
            fontFamily: fontInter,
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)" as any,
          }}
        >
          {simTimeLabel}
          <button
            onClick={() => window.open("/standalone/pressure", "_blank", "width=1000,height=500")}
            className="p-1 rounded hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            title="Open in separate window"
          >
            <ExternalLink size={14} />
          </button>
        </span>
      </div>

      {/* Canvas — fills remaining height */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 cursor-grab active:cursor-grabbing select-none"
        style={{ overflow: "hidden" }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </div>
  );
}