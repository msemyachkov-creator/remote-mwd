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

const fontInter = "'Inter', sans-serif";

interface DecoderChartProps {
  isPlaying: boolean;
  activePressure: "p1" | "p2";
  mwdData: MWDPacket[];
  scrollOffset: number;
  onScroll: (offset: number) => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  currentSimTimeMs: number;
  filter: string;
  onFilterChange: (filter: string) => void;
}

export function DecoderChart({
  isPlaying,
  activePressure,
  mwdData,
  scrollOffset,
  onScroll,
  zoom,
  onZoomChange,
  currentSimTimeMs,
  filter,
  onFilterChange,
}: DecoderChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const isDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

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

    const chColors = getChannelColors(activePressure);

    // Extract selected FID number from filter
    const fidMatch = filter.match(/FID:(\d+)/);
    const selectedFidNum = fidMatch ? parseInt(fidMatch[1]) : 0; // Default to FID:0

    // Build a map: frame index -> SYNC packet
    const syncByFrame = new Map<number, MWDPacket>();
    let frameIdx = 0;
    for (const pkt of mwdData) {
      if (pkt.isSync) {
        syncByFrame.set(frameIdx, pkt);
        frameIdx++;
      }
    }

    // Helper to get frame index for any packet (returns index of last SYNC before it)
    const getFrameIndex = (pkt: MWDPacket): number => {
      let lastSyncIdx = -1;
      for (const p of mwdData) {
        if (p === pkt) break;
        if (p.isSync) lastSyncIdx++;
      }
      return lastSyncIdx;
    };

    // Right-align: when data is shorter than viewport, push it to the right edge
    const totalDataW = getTotalWidthPx(mwdData);
    const dataRightScreen = (totalDataW - scrollOffset) * zoom;
    const rightAlignPad = Math.max(0, W - dataRightScreen);

    const worldToScreen = (wpx: number) => (wpx - scrollOffset) * zoom + rightAlignPad;
    const screenToWorld = (sx: number) => scrollOffset + (sx - rightAlignPad) / zoom;

    // Layout regions
    const headerH = 40;
    const timelineH = 22;
    const bitCellH = 36;
    const chartTop = headerH;
    const chartBottom = H - bitCellH - timelineH;
    const chartH = chartBottom - chartTop;

    // Background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, W, H);

    // Header background
    ctx.fillStyle = COLORS.cardHalf;
    ctx.fillRect(0, 0, W, headerH);
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, headerH);
    ctx.lineTo(W, headerH);
    ctx.stroke();

    // Horizontal grid in chart area
    ctx.strokeStyle = COLORS.borderFaint;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = chartTop + (chartH / 4) * i;
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
      ctx.moveTo(x, chartTop);
      ctx.lineTo(x, chartBottom);
      ctx.stroke();
    }

    // --- Render each visible packet ---
    // No filtering - show all packets
    let overlayAttempts = 0;
    for (const pkt of mwdData) {
      const pktLeftS = worldToScreen(pkt.startPx);
      const pktRightS = worldToScreen(pkt.startPx + pkt.widthPx);
      const pktWidthS = pktRightS - pktLeftS;
      const bitCount = pkt.bits.length;
      const drawBitCount = pkt.revealedBits != null
        ? Math.min(pkt.revealedBits, bitCount)
        : bitCount;

      if (pktRightS < -20 || pktLeftS > W + 20) continue;
      
      // ---- Header block ----
      if (pkt.isFidSection) {
        // Individual FID section block — alternating background
        const isEven = (pkt.sectionIndex ?? 0) % 2 === 0;
        ctx.fillStyle = isEven ? COLORS.fidBg1 : COLORS.fidBg2;
        ctx.fillRect(pktLeftS, 0, pktWidthS, headerH);

        // Section borders
        ctx.strokeStyle = COLORS.fidBorder;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(pktLeftS, 0);
        ctx.lineTo(pktLeftS, headerH);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pktRightS, 0);
        ctx.lineTo(pktRightS, headerH);
        ctx.stroke();

        // Section label + decoded value (clipped)
        ctx.save();
        ctx.beginPath();
        ctx.rect(pktLeftS, 0, pktWidthS, headerH);
        ctx.clip();

        const secCenterX = pktLeftS + pktWidthS / 2;

        ctx.fillStyle = COLORS.fidLabel;
        ctx.font = `9px ${fontInter}`;
        ctx.textAlign = "center";
        ctx.fillText(pkt.name, secCenterX, 12);

        ctx.fillStyle = COLORS.foreground;
        ctx.font = `10px ${fontInter}`;
        ctx.fillText(pkt.decodedValue ?? "", secCenterX, 26);

        // Small label at bottom
        ctx.fillStyle = COLORS.mutedForeground;
        ctx.font = `8px ${fontInter}`;
        ctx.fillText(pkt.sectionLabel ?? "", secCenterX, 36);

        ctx.restore();
      } else {
        // Sync, FID header, or other simple packet
        ctx.fillStyle = pkt.isSync
          ? COLORS.greenBg
          : pkt.isFidHeader
          ? COLORS.fidHeaderBg
          : "rgba(255, 255, 255, 0.03)";
        ctx.fillRect(pktLeftS, 0, pktWidthS, headerH);

        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(pktRightS, 0);
        ctx.lineTo(pktRightS, headerH);
        ctx.stroke();

        // Left border for FID header
        if (pkt.isFidHeader) {
          ctx.strokeStyle = COLORS.fidHeaderDim;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(pktLeftS, 0);
          ctx.lineTo(pktLeftS, headerH);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(pktRightS, 0);
          ctx.lineTo(pktRightS, headerH);
          ctx.stroke();
        }

        // Packet name
        ctx.save();
        ctx.beginPath();
        ctx.rect(pktLeftS, 0, pktWidthS, headerH);
        ctx.clip();
        ctx.fillStyle = pkt.isSync
          ? COLORS.green
          : pkt.isFidHeader
          ? COLORS.fidHeader
          : COLORS.foregroundDim;
        ctx.font = `10px ${fontInter}`;
        ctx.textAlign = "center";
        const centerX = pktLeftS + pktWidthS / 2;
        ctx.fillText(pkt.name, centerX, 14);

        if (pkt.decodedValue) {
          ctx.fillStyle = COLORS.foreground;
          ctx.font = `11px ${fontInter}`;
          ctx.fillText(pkt.decodedValue, centerX, 30);
        } else if (pkt.isSync) {
          ctx.fillStyle = COLORS.greenDim;
          ctx.font = `9px ${fontInter}`;
          ctx.fillText("---", centerX, 28);
        } else if (pkt.isFidHeader) {
          ctx.fillStyle = COLORS.fidHeaderDim;
          ctx.font = `9px ${fontInter}`;
          ctx.fillText("32 bit", centerX, 28);
        }
        ctx.restore();
      }

      // ---- Vertical boundary lines through chart + bit cells ----
      const lineColor = pkt.isSync
        ? COLORS.greenDim
        : pkt.isFidHeader
        ? COLORS.fidHeaderDim
        : pkt.isFidSection
        ? COLORS.fidBorder
        : chColors.dim;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(pktLeftS, headerH);
      ctx.lineTo(pktLeftS, chartBottom + bitCellH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pktRightS, headerH);
      ctx.lineTo(pktRightS, chartBottom + bitCellH);
      ctx.stroke();

      // ---- Decoded waveform: SQUARE WAVE machine code (0 and 1) ----
      const pulseBaseY = chartBottom - 10;
      const pulseTopY = pulseBaseY - (chartBottom - chartTop - 20) * 0.75;

      // SYNC uses green, FID sections and others use channel colors
      const waveColor = pkt.isSync
        ? COLORS.green
        : pkt.isFidHeader
        ? COLORS.fidHeader
        : chColors.main;

      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const bitScreenW = pktWidthS / bitCount;

      // Start at baseline
      ctx.moveTo(pktLeftS, pulseBaseY);

      for (let b = 0; b < drawBitCount; b++) {
        const bitLeftS = pktLeftS + b * bitScreenW;
        const bitRightS = bitLeftS + bitScreenW;
        const bit = pkt.bits[b];

        if (bit === 1) {
          // Rise
          ctx.lineTo(bitLeftS, pulseTopY);
          // High level
          ctx.lineTo(bitRightS, pulseTopY);
          // Fall (if next bit is 0 or end of draw)
          if (b === drawBitCount - 1 || pkt.bits[b + 1] === 0) {
            ctx.lineTo(bitRightS, pulseBaseY);
          }
        } else {
          // Low level
          ctx.lineTo(bitRightS, pulseBaseY);
          // Rise (if next bit is 1)
          if (b < drawBitCount - 1 && pkt.bits[b + 1] === 1) {
            ctx.lineTo(bitRightS, pulseTopY);
          }
        }
      }
      ctx.stroke();

      // Fill under waveform
      if (drawBitCount > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pktLeftS, pulseBaseY);
        for (let b = 0; b < drawBitCount; b++) {
          const bitLeftS = pktLeftS + b * bitScreenW;
          const bitRightS = bitLeftS + bitScreenW;
          const bit = pkt.bits[b];
          if (bit === 1) {
            ctx.lineTo(bitLeftS, pulseTopY);
            ctx.lineTo(bitRightS, pulseTopY);
            if (b === drawBitCount - 1 || pkt.bits[b + 1] === 0) {
              ctx.lineTo(bitRightS, pulseBaseY);
            }
          } else {
            ctx.lineTo(bitRightS, pulseBaseY);
            if (b < drawBitCount - 1 && pkt.bits[b + 1] === 1) {
              ctx.lineTo(bitRightS, pulseTopY);
            }
          }
        }
        ctx.lineTo(pktLeftS + drawBitCount * bitScreenW, pulseBaseY);
        ctx.lineTo(pktLeftS, pulseBaseY);
        ctx.closePath();
        ctx.fillStyle = pkt.isSync ? COLORS.greenFaint : (activePressure === "p1" ? "rgba(34, 211, 238, 0.05)" : "rgba(236, 72, 153, 0.05)");
        ctx.fill();
        ctx.restore();
      }

      // ---- OVERLAY: Draw SYNC waveform on top of selected FID section ----
      if (
        pkt.isFidSection &&
        selectedFidNum !== null &&
        selectedFidNum !== 0 && // Don't overlay SYNC on FID:0
        pkt.name === `FID:${selectedFidNum}`
      ) {
        const fi = getFrameIndex(pkt);
        const syncPkt = syncByFrame.get(fi);
        
        if (syncPkt && syncPkt.bits.length > 0) {
          // Draw SYNC waveform as square wave over FID section
          const syncBitCount = syncPkt.bits.length;
          const syncDrawBitCount = syncPkt.revealedBits != null
            ? Math.min(syncPkt.revealedBits, syncBitCount)
            : syncBitCount;
          
          const syncBitScreenW = pktWidthS / syncBitCount;

          ctx.strokeStyle = "rgba(34, 197, 94, 0.8)"; // Semi-transparent green
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(pktLeftS, pulseBaseY);

          for (let b = 0; b < syncDrawBitCount; b++) {
            const bitLeftS = pktLeftS + b * syncBitScreenW;
            const bitRightS = bitLeftS + syncBitScreenW;
            const bit = syncPkt.bits[b];

            if (bit === 1) {
              ctx.lineTo(bitLeftS, pulseTopY);
              ctx.lineTo(bitRightS, pulseTopY);
              if (b === syncDrawBitCount - 1 || syncPkt.bits[b + 1] === 0) {
                ctx.lineTo(bitRightS, pulseBaseY);
              }
            } else {
              ctx.lineTo(bitRightS, pulseBaseY);
              if (b < syncDrawBitCount - 1 && syncPkt.bits[b + 1] === 1) {
                ctx.lineTo(bitRightS, pulseTopY);
              }
            }
          }
          ctx.stroke();
        }
      }

      // ---- Bit cells area ----
      const cellTop = chartBottom;

      ctx.strokeStyle = COLORS.border;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(pktLeftS, cellTop);
      ctx.lineTo(pktRightS, cellTop);
      ctx.stroke();

      for (let b = 0; b < drawBitCount; b++) {
        const bitLeftS = pktLeftS + b * bitScreenW;
        const bitCenterX = bitLeftS + bitScreenW / 2;
        const bit = pkt.bits[b];

        ctx.strokeStyle = COLORS.borderFaint;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(bitLeftS + bitScreenW, cellTop);
        ctx.lineTo(bitLeftS + bitScreenW, cellTop + bitCellH);
        ctx.stroke();

        if (bit === 1) {
          const peakH = bitCellH * 0.6;
          const peakTop = cellTop + (bitCellH - peakH) / 2;
          const peakBase = peakTop + peakH;
          const halfW = bitScreenW * 0.45;

          ctx.fillStyle = pkt.isSync
            ? COLORS.greenDim
            : pkt.isFidHeader
            ? COLORS.fidHeaderDim
            : chColors.dim;
          ctx.fillRect(bitCenterX - halfW, peakTop, halfW * 2, peakH);

          ctx.strokeStyle = pkt.isSync
            ? COLORS.green
            : pkt.isFidHeader
            ? COLORS.fidHeader
            : chColors.main;
          ctx.lineWidth = 1;
          ctx.strokeRect(bitCenterX - halfW, peakTop, halfW * 2, peakH);
        }
      }
    }

    // ---- Timeline ----
    const tlY = H - timelineH;

    // Y-axis background panel (left edge)
    const yAxisWidth = 44;
    ctx.fillStyle = "rgba(25, 40, 56, 0.85)";
    ctx.fillRect(0, chartTop, yAxisWidth, chartH);
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(yAxisWidth, chartTop);
    ctx.lineTo(yAxisWidth, chartBottom);
    ctx.stroke();

    // Y-axis pressure labels at left edge of chart area
    const yLabels = [191.43, 187.70, 183.97, 180.24, 176.51];
    ctx.font = `9px ${fontInter}`;
    ctx.fillStyle = COLORS.mutedForegroundBright;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (let i = 0; i < yLabels.length; i++) {
      const rawY = chartTop + (chartH / (yLabels.length - 1)) * i;
      const y = i === 0 ? rawY + 8 : i === yLabels.length - 1 ? rawY - 6 : rawY;
      ctx.fillText(yLabels[i].toFixed(2), 4, y);
    }

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, tlY, W, timelineH);
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, tlY);
    ctx.lineTo(W, tlY);
    ctx.stroke();

    ctx.fillStyle = COLORS.mutedForeground;
    ctx.font = `10px ${fontInter}`;
    ctx.textAlign = "center";

    for (let s = firstTickS; ; s += 30) {
      const x = worldToScreen(s * PIXELS_PER_SECOND);
      if (x > W) break;
      if (x < -50) continue;
      ctx.fillText(formatTime(s), x, tlY + 14);
      ctx.strokeStyle = COLORS.border;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, tlY);
      ctx.lineTo(x, tlY + 4);
      ctx.stroke();
    }

    // Current playback position indicator (pink line)
    const currentTimeS = currentSimTimeMs / 1000;
    const currentX = worldToScreen(currentTimeS * PIXELS_PER_SECOND);
    if (currentX >= 0 && currentX <= W) {
      ctx.strokeStyle = "#EC4899"; // Pink color
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentX, chartTop);
      ctx.lineTo(currentX, tlY);
      ctx.stroke();
    }

    // End of pressure curve indicator (pink line) - where the actual curve ends
    // Find the last revealed bit position across all packets
    let lastRevealedPx = 0;
    for (const pkt of mwdData) {
      const maxBits = pkt.revealedBits != null ? pkt.revealedBits : pkt.bits.length;
      const pktEndPx = pkt.startPx + maxBits * BIT_WIDTH_PX;
      if (pktEndPx > lastRevealedPx) {
        lastRevealedPx = pktEndPx;
      }
    }
    
    const curveEndX = worldToScreen(lastRevealedPx);
    if (curveEndX >= 0 && curveEndX <= W && lastRevealedPx > 0) {
      ctx.strokeStyle = "#EF4444"; // Red color
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(curveEndX, chartTop);
      ctx.lineTo(curveEndX, chartBottom);
      ctx.stroke();
    }
  }, [mwdData, scrollOffset, activePressure, zoom, filter, currentSimTimeMs]);

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

  const { t, lang } = useI18n();
  const pressureLabel =
    activePressure === "p1" ? t("pressure_p1") : t("pressure_p2");
  const pressureColor =
    activePressure === "p1" ? "var(--chart-1)" : "var(--chart-5)";

  const simTimeLabel = new Date(currentSimTimeMs).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* Title */}
      <div className="flex items-center justify-between px-3 py-1 border-b border-border bg-card/50 shrink-0">
        <span
          style={{
            fontFamily: fontInter,
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)" as any,
          }}
        >
          <span className="text-muted-foreground">{lang === "ru" ? "Декодирование: " : "Decoding: "}</span>
          <span style={{ color: pressureColor }}>{pressureLabel}</span>
        </span>
        <span
          className="text-muted-foreground flex items-center gap-2"
          style={{
            fontFamily: fontInter,
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)" as any,
          }}
        >
          {simTimeLabel}
          <button
            onClick={() => window.open("/standalone/decoder", "_blank", "width=1000,height=600")}
            className="p-1 rounded hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            title="Open in separate window"
          >
            <ExternalLink size={14} />
          </button>
        </span>
      </div>

      {/* Canvas — fills remaining */}
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