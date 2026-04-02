// ─── WITSML Service — Types ───────────────────────────────────────────────────

export interface WitsmlServerConfig {
  url: string;           // e.g. "https://witsml.example.com/WMLS"
  username: string;
  password: string;
  version: "1.4.1.1";
  proxyUrl?: string;     // optional CORS proxy prefix
}

export interface WitsmlWellRef {
  wellUid: string;
  wellName: string;
  wellboreUid: string;
  wellboreName: string;
  runNumber: number;
  operator: string;
  rigName: string;
  startDepthFt: number;
  startDate: string;     // ISO-8601
}

// ─── Data snapshots passed to the stream manager ─────────────────────────────

export interface SurveySnapshot {
  timestamp: string;     // ISO-8601
  mdFt: number;
  inclDeg: number;
  aziDeg: number;
  tvdFt: number;
  nsFt: number;
  ewFt: number;
  dlsDegPer100ft: number;
  totalG: number;
  totalB: number;
  magDip: number;
}

export interface DepthSnapshot {
  timestamp: string;
  bitDepthFt: number;
  holeDepthFt: number;
  ropFtPerHr: number;
}

export interface DecodedSnapshot {
  timestamp: string;
  gtfDeg: number;
  mtfDeg: number;
  toolfaceDeg: number;
  inclDeg: number;
  aziDeg: number;
  packetsDecoded: number;
}

export interface CurvesSnapshot {
  timestamp: string;
  mdFt: number;
  gammaCps: number;       // raw gamma ray counts per second
}

export interface WitsmlDataBundle {
  survey?: SurveySnapshot;
  depth?: DepthSnapshot;
  decoded?: DecodedSnapshot;
  curves?: CurvesSnapshot;
}

// ─── Stream config ────────────────────────────────────────────────────────────

export interface StreamConfig {
  survey:   { enabled: boolean; trajectoryUid: string; aziRef: string };
  depth:    { enabled: boolean; logUid: string; stepFt: number };
  decoded:  { enabled: boolean; logUid: string; intervalSec: number };
  curves:   { enabled: boolean; logUid: string };
}

// ─── Result / status ──────────────────────────────────────────────────────────

export type StreamStatus = "idle" | "running" | "error" | "stopped";

export interface StreamResult {
  stream: keyof StreamConfig;
  ok: boolean;
  sentAt: string;
  error?: string;
}

export interface WitsmlStreamState {
  status: StreamStatus;
  connected: boolean;
  lastResults: StreamResult[];
  sentCounts: Record<keyof StreamConfig, number>;
  errors: string[];
}
