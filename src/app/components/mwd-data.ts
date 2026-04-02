// MWD (Measurement While Drilling) mud pulse telemetry data model

export const BIT_DURATION_S = 1.5;
export const BITS_PER_PACKET = 16; // default for Sync
export const GAP_DURATION_S = 0;
export const PIXELS_PER_SECOND = 10;

export const BIT_WIDTH_PX = BIT_DURATION_S * PIXELS_PER_SECOND; // 15px
export const PACKET_WIDTH_PX = BITS_PER_PACKET * BIT_WIDTH_PX;  // 240px (sync default)
export const GAP_WIDTH_PX = 0;
export const PACKET_TOTAL_PX = PACKET_WIDTH_PX;
export const SYNC_INTERVAL_S = 120;
export const SIM_BASE_MS = new Date("2026-02-06T17:20:00").getTime();

/** Sub-section within a FID packet (kept for reference/compatibility) */
export interface FIDSection {
  name: string;
  label: string;
  startBit: number;
  bitCount: number;
  decodedValue: string;
}

export interface MWDPacket {
  name: string;
  bits: number[];
  isSync: boolean;
  isFid: boolean;
  /** FID header/preamble block (32 bits, purple) */
  isFidHeader: boolean;
  /** Individual FID sensor section block */
  isFidSection: boolean;
  /** Sensor label for FID section packets (e.g. "Гамма") */
  sectionLabel?: string;
  /** Index within the FID frame (0–5) for alternating backgrounds */
  sectionIndex?: number;
  /** Legacy composite FID sections — no longer used, kept for type compat */
  fidSections?: FIDSection[];
  decodedValue: string | null;
  startPx: number;
  /** Pixel width of this packet (bits.length * BIT_WIDTH_PX) */
  widthPx: number;
  /** When set, only this many bits are drawn in waveform (smooth reveal). */
  revealedBits?: number;
  /** Snapped to section boundaries — used by DecoderChart so blocks appear instantly */
  revealedBitsSnapped?: number;
}

export const COLORS = {
  background: "rgba(8, 15, 24, 1)",
  foreground: "rgba(232, 235, 240, 1)",
  foregroundDim: "rgba(232, 235, 240, 0.6)",
  mutedForeground: "rgba(191, 201, 212, 0.35)",
  mutedForegroundBright: "rgba(191, 201, 212, 0.55)",
  border: "rgba(255, 255, 255, 0.12)",
  borderFaint: "rgba(255, 255, 255, 0.06)",
  card: "rgba(25, 40, 56, 1)",
  cardHalf: "rgba(25, 40, 56, 0.5)",
  chart1: "rgba(32, 158, 248, 1)",
  chart1Dim: "rgba(32, 158, 248, 0.5)",
  chart1Faint: "rgba(32, 158, 248, 0.15)",
  chart5: "rgba(143, 117, 255, 1)",
  chart5Dim: "rgba(143, 117, 255, 0.5)",
  chart5Faint: "rgba(143, 117, 255, 0.15)",
  // FID header pink/rose colors (distinct from chart-5 purple)
  fidHeader: "rgba(230, 150, 255, 1)",
  fidHeaderDim: "rgba(230, 150, 255, 0.55)",
  fidHeaderBg: "rgba(230, 150, 255, 0.12)",
  fidHeaderFaint: "rgba(230, 150, 255, 0.15)",
  green: "rgba(37, 189, 89, 1)",
  greenDim: "rgba(37, 189, 89, 0.7)",
  greenFaint: "rgba(37, 189, 89, 0.15)",
  greenBg: "rgba(37, 189, 89, 0.12)",
  // FID section colors
  fidBg1: "rgba(32, 158, 248, 0.06)",
  fidBg2: "rgba(32, 158, 248, 0.03)",
  fidBorder: "rgba(32, 158, 248, 0.2)",
  fidLabel: "rgba(191, 201, 212, 0.55)",
};

export function getChannelColors(ch: "p1" | "p2") {
  return ch === "p1"
    ? { main: COLORS.chart1, dim: COLORS.chart1Dim, faint: COLORS.chart1Faint }
    : { main: COLORS.chart5, dim: COLORS.chart5Dim, faint: COLORS.chart5Faint };
}

/** FID sub-section sensor definitions */
const FID_SENSOR_DEFS = [
  { name: "FID:0",  label: "Static",   bits: 16, gen: () => (20 + Math.random() * 30).toFixed(1) },
  { name: "FID:1",  label: "Slide low",   bits: 16, gen: () => (0.5 + Math.random() * 30).toFixed(1) },
  { name: "FID:2",  label: "Rotor",  bits: 16, gen: () => (50 + Math.random() * 300).toFixed(1) },
  { name: "FID:3",   label: "Static high",    bits: 16, gen: () => (Math.random() * 3).toFixed(1) },
  { name: "FID:4",  label: "Slide high",   bits: 16, gen: () => (80 + Math.random() * 20).toFixed(1) },
  { name: "FID:5",   label: "Tech", bits: 16, gen: () => (12 + Math.random() * 4).toFixed(1) },
  { name: "FID:6",  label: "Static (aux)",   bits: 16, gen: () => (25 + Math.random() * 35).toFixed(1) },
  { name: "FID:7",  label: "Slide low (aux)",   bits: 16, gen: () => (1 + Math.random() * 28).toFixed(1) },
  { name: "FID:8",  label: "Rotor (aux)",  bits: 16, gen: () => (60 + Math.random() * 280).toFixed(1) },
  { name: "FID:9",   label: "Static high (aux)",    bits: 16, gen: () => (Math.random() * 3.5).toFixed(1) },
  { name: "FID:10",  label: "Slide high (aux)",   bits: 16, gen: () => (85 + Math.random() * 18).toFixed(1) },
];

/** Number of sensor sub-sections in each FID packet */
export const SECTIONS_PER_FID = FID_SENSOR_DEFS.length; // 11

/** Bits in the FID header preamble (2× Sync = 32 bits) */
export const FID_HEADER_BITS = 32;

/** Packets per frame: Sync + FidHeader + 11 individual section packets */
export const PACKETS_PER_FRAME = 2 + SECTIONS_PER_FID; // 13

/** Steps per frame: 1 step per packet */
export const STEPS_PER_FRAME = PACKETS_PER_FRAME; // 13

const SYNC_BITS = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >> 16) / 32768;
  };
}

export function generateMWDData(frameCount: number, seed: number, bitThreshold = 0.4): MWDPacket[] {
  const rng = seededRandom(seed);
  const packets: MWDPacket[] = [];
  let currentPx = 0;

  for (let f = 0; f < frameCount; f++) {
    // 1) Sync packet (16 bits)
    const syncW = SYNC_BITS.length * BIT_WIDTH_PX;
    packets.push({
      name: "Sync",
      bits: [...SYNC_BITS],
      isSync: true,
      isFid: false,
      isFidHeader: false,
      isFidSection: false,
      decodedValue: null,
      startPx: currentPx,
      widthPx: syncW,
    });
    currentPx += syncW;

    // 2) FID header packet (32 bits, purple preamble — 2× Sync)
    const fidHeaderBits = Array.from({ length: FID_HEADER_BITS }, () =>
      rng() > bitThreshold ? 1 : 0
    );
    const fidHeaderW = fidHeaderBits.length * BIT_WIDTH_PX;
    packets.push({
      name: `FID #${f + 1}`,
      bits: fidHeaderBits,
      isSync: false,
      isFid: false,
      isFidHeader: true,
      isFidSection: false,
      decodedValue: null,
      startPx: currentPx,
      widthPx: fidHeaderW,
    });
    currentPx += fidHeaderW;

    // 3) Individual FID section packets — one per sensor
    for (let si = 0; si < FID_SENSOR_DEFS.length; si++) {
      const sensor = FID_SENSOR_DEFS[si];
      const sectionBits = Array.from({ length: sensor.bits }, () =>
        rng() > bitThreshold ? 1 : 0
      );
      const sectionW = sectionBits.length * BIT_WIDTH_PX;

      packets.push({
        name: sensor.name,
        bits: sectionBits,
        isSync: false,
        isFid: false,
        isFidHeader: false,
        isFidSection: true,
        sectionLabel: sensor.label,
        sectionIndex: si,
        decodedValue: sensor.gen(),
        startPx: currentPx,
        widthPx: sectionW,
      });
      currentPx += sectionW;
    }

    // Pad to sync interval (~2 min)
    const targetPx = (f + 1) * SYNC_INTERVAL_S * PIXELS_PER_SECOND;
    if (currentPx < targetPx) {
      currentPx = targetPx;
    }
  }

  return packets;
}

export function getTotalWidthPx(packets: MWDPacket[]): number {
  if (packets.length === 0) return 0;
  const last = packets[packets.length - 1];
  return last.startPx + last.widthPx + 40;
}

/** Deterministic layered noise */
export function deterministicNoise(px: number): number {
  return (
    Math.sin(px * 0.73) * 0.08 +
    Math.sin(px * 1.37) * 0.055 +
    Math.sin(px * 3.71) * 0.035 +
    Math.sin(px * 7.13) * 0.02 +
    Math.sin(px * 13.37) * 0.015 +
    Math.sin(px * 23.1) * 0.01
  );
}

/** Sharp/angular noise — produces jagged signal for pressure chart */
export function sharpNoise(px: number): number {
  const a = Math.sin(px * 0.67) * (Math.sin(px * 2.3) > 0 ? 1.2 : 0.6);
  const b = Math.sin(px * 1.41 + 0.5);
  const c = Math.sin(px * 3.91);
  const d = Math.sin(px * 8.3) > 0.4 ? 0.15 : -0.1;
  const e = Math.sin(px * 17.7) * 0.4;
  return a * 0.07 + b * 0.05 + c * 0.035 + d * 0.06 + e * 0.02;
}

/** Find which packet & bit a pixel position falls in */
export function getBitAtPx(
  packets: MWDPacket[],
  px: number
): { bit: number; inPacket: boolean; packet: MWDPacket | null; bitIdx: number } {
  for (const p of packets) {
    if (px >= p.startPx && px < p.startPx + p.widthPx) {
      const bitIdx = Math.floor((px - p.startPx) / BIT_WIDTH_PX);
      if (bitIdx >= 0 && bitIdx < p.bits.length) {
        return { bit: p.bits[bitIdx], inPacket: true, packet: p, bitIdx };
      }
    }
  }
  return { bit: 0, inPacket: false, packet: null, bitIdx: -1 };
}

/** Format time offset to HH:MM:SS */
export function formatTime(secondsFromStart: number): string {
  const base = new Date("2026-02-06T17:20:00");
  const t = new Date(base.getTime() + secondsFromStart * 1000);
  return t.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Format time offset with date DD.MM.YYYY HH:MM:SS */
export function formatTimeWithDate(secondsFromStart: number): string {
  const base = new Date("2026-02-06T17:20:00");
  const t = new Date(base.getTime() + secondsFromStart * 1000);
  const date = t.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = t.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date} ${time}`;
}