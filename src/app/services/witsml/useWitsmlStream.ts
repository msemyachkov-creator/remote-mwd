// ─── React hook: useWitsmlStream ──────────────────────────────────────────────
//
// Bridges WellContext (live MWD data) → WitsmlStreamManager → UI state.
//
// Usage (in OutputTab or anywhere):
//   const { state, start, stop, testConnection } = useWitsmlStream(cfg);
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { useWell } from "../../components/WellContext";
import { WitsmlStreamManager } from "./streamManager";
import type {
  WitsmlServerConfig,
  WitsmlWellRef,
  StreamConfig,
  WitsmlStreamState,
  WitsmlDataBundle,
} from "./types";

export interface UseWitsmlStreamOptions {
  serverCfg:  WitsmlServerConfig;
  wellRef:    WitsmlWellRef;
  streamCfg:  StreamConfig;
}

export interface UseWitsmlStreamResult {
  state:          WitsmlStreamState;
  start:          () => void;
  stop:           () => void;
  testConnection: () => Promise<{ ok: boolean; message: string }>;
  isRunning:      boolean;
}

export function useWitsmlStream(opts: UseWitsmlStreamOptions): UseWitsmlStreamResult {
  const { activeWell } = useWell();

  const [state, setState] = useState<WitsmlStreamState>({
    status:      "idle",
    connected:   false,
    lastResults: [],
    sentCounts:  { survey: 0, depth: 0, decoded: 0, curves: 0 },
    errors:      [],
  });

  const mgrRef = useRef<WitsmlStreamManager | null>(null);

  // (re)create manager when config changes
  useEffect(() => {
    const mgr = new WitsmlStreamManager(opts.serverCfg, opts.wellRef, opts.streamCfg);
    mgr.onStateChange = (s) => setState({ ...s });
    mgrRef.current = mgr;

    return () => {
      mgr.stop();
      mgr.onStateChange = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    opts.serverCfg.url,
    opts.serverCfg.username,
    opts.serverCfg.password,
    opts.wellRef.wellUid,
    opts.wellRef.runNumber,
  ]);

  // ── Data provider — pulls live values from WellContext ─────────────────────

  const getBundle = useCallback((): WitsmlDataBundle => {
    const now = new Date().toISOString();
    const w   = activeWell;

    const survey: WitsmlDataBundle["survey"] = {
      timestamp:       now,
      mdFt:            w?.bitDepth  ?? 0,
      inclDeg:         w?.inc       ?? 0,
      aziDeg:          w?.azm       ?? 0,
      tvdFt:           (w?.bitDepth ?? 0) * 0.97,     // approx TVD
      nsFt:            (w?.bitDepth ?? 0) * 0.12,
      ewFt:            (w?.bitDepth ?? 0) * -0.04,
      dlsDegPer100ft:  0.8,
      totalG:          1.001,
      totalB:          w?.pressure  ?? 0,
      magDip:          70.2,
    };

    const depth: WitsmlDataBundle["depth"] = {
      timestamp:   now,
      bitDepthFt:  w?.bitDepth  ?? 0,
      holeDepthFt: w?.holeDepth ?? 0,
      ropFtPerHr:  32.4 + Math.random() * 4,
    };

    const decoded: WitsmlDataBundle["decoded"] = {
      timestamp:       now,
      gtfDeg:          w?.gtf ?? 0,
      mtfDeg:          ((w?.gtf ?? 0) + 1.5) % 360,
      toolfaceDeg:     w?.gtf ?? 0,
      inclDeg:         w?.inc ?? 0,
      aziDeg:          w?.azm ?? 0,
      packetsDecoded:  Math.floor(Math.random() * 5) + 10,
    };

    const curves: WitsmlDataBundle["curves"] = {
      timestamp: now,
      mdFt:      w?.bitDepth ?? 0,
      gammaCps:  (w?.gamma ?? 50) * 0.6 + Math.random() * 5,
    };

    return { survey, depth, decoded, curves };
  }, [activeWell]);

  // ── Public API ─────────────────────────────────────────────────────────────

  const start = useCallback(() => {
    mgrRef.current?.start(getBundle);
  }, [getBundle]);

  const stop = useCallback(() => {
    mgrRef.current?.stop();
  }, []);

  const testConnection = useCallback(async () => {
    if (!mgrRef.current) return { ok: false, message: "Manager not ready" };
    return mgrRef.current.testConnection();
  }, []);

  return { state, start, stop, testConnection, isRunning: state.status === "running" };
}
