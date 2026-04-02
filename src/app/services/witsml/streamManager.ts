// ─── WITSML Stream Manager ────────────────────────────────────────────────────
//
// Orchestrates periodic transmission of all enabled data streams to the
// configured WITSML server. Each stream type has its own send logic and
// independent enable/disable toggle.
//
// Usage:
//   const mgr = new WitsmlStreamManager(serverConfig, wellRef, streamConfig);
//   mgr.onStateChange = (state) => setUiState(state);
//   mgr.start(() => getCurrentDataBundle());
//   // later:
//   mgr.stop();
// ─────────────────────────────────────────────────────────────────────────────

import { WitsmlSoapClient } from "./soapClient";
import {
  buildTrajectoryXml,
  buildDepthLogXml,
  buildDecodedLogXml,
  buildCurvesLogXml,
} from "./xmlBuilder";
import type {
  WitsmlServerConfig,
  WitsmlWellRef,
  StreamConfig,
  WitsmlDataBundle,
  WitsmlStreamState,
  StreamResult,
} from "./types";

type DataProvider = () => WitsmlDataBundle;

const DEFAULT_INTERVAL_MS = 10_000; // 10 s

export class WitsmlStreamManager {
  private client: WitsmlSoapClient;
  private timer: ReturnType<typeof setInterval> | null = null;
  private abortCtl: AbortController | null = null;

  /** Mutable state — call onStateChange after every mutation */
  private state: WitsmlStreamState = {
    status:     "idle",
    connected:  false,
    lastResults: [],
    sentCounts: { survey: 0, depth: 0, decoded: 0, curves: 0 },
    errors:     [],
  };

  /** Subscribe to state changes */
  onStateChange?: (state: Readonly<WitsmlStreamState>) => void;

  constructor(
    private serverCfg: WitsmlServerConfig,
    private wellRef: WitsmlWellRef,
    private streamCfg: StreamConfig
  ) {
    this.client = new WitsmlSoapClient(serverCfg);
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Update server / well / stream config at runtime (restarts if running) */
  configure(
    serverCfg: WitsmlServerConfig,
    wellRef: WitsmlWellRef,
    streamCfg: StreamConfig
  ) {
    const wasRunning = this.state.status === "running";
    if (wasRunning) this.stop();
    this.serverCfg = serverCfg;
    this.wellRef   = wellRef;
    this.streamCfg = streamCfg;
    this.client    = new WitsmlSoapClient(serverCfg);
    // don't auto-restart; caller decides
  }

  /** Test connectivity without starting streaming */
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    this.abortCtl = new AbortController();
    const result = await this.client.ping(this.abortCtl.signal);
    this.setState({ connected: result.ok });
    return {
      ok:      result.ok,
      message: result.ok
        ? "WITSML server responded successfully"
        : result.errorMessage ?? "Connection failed",
    };
  }

  /** Start the streaming loop */
  start(getDataBundle: DataProvider) {
    if (this.state.status === "running") return;
    this.setState({ status: "running", errors: [] });

    const intervalMs =
      (this.streamCfg.decoded.intervalSec ?? 10) * 1000 || DEFAULT_INTERVAL_MS;

    // Fire immediately, then on interval
    void this.tick(getDataBundle);
    this.timer = setInterval(() => void this.tick(getDataBundle), intervalMs);
  }

  /** Stop streaming */
  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.abortCtl?.abort();
    this.setState({ status: "stopped" });
  }

  getState(): Readonly<WitsmlStreamState> {
    return { ...this.state };
  }

  // ── Internal ────────────────────────────────────────────────────────────────

  private setState(patch: Partial<WitsmlStreamState>) {
    this.state = { ...this.state, ...patch };
    this.onStateChange?.(this.state);
  }

  private pushResult(result: StreamResult) {
    const lastResults = [result, ...this.state.lastResults].slice(0, 50);
    const sentCounts  = { ...this.state.sentCounts };
    if (result.ok) sentCounts[result.stream] = (sentCounts[result.stream] ?? 0) + 1;
    const errors = result.ok
      ? this.state.errors
      : [
          `[${new Date().toISOString()}] ${result.stream}: ${result.error}`,
          ...this.state.errors,
        ].slice(0, 20);
    this.setState({ lastResults, sentCounts, errors });
  }

  private async tick(getDataBundle: DataProvider) {
    this.abortCtl = new AbortController();
    const signal  = this.abortCtl.signal;
    const bundle  = getDataBundle();
    const now     = new Date().toISOString();
    const well    = this.wellRef;
    const cfg     = this.streamCfg;

    const tasks: Promise<void>[] = [];

    // ── Survey ──────────────────────────────────────────────────────────────
    if (cfg.survey.enabled && bundle.survey) {
      const s = bundle.survey;
      tasks.push(
        this.client
          .upsert(
            "trajectory",
            buildTrajectoryXml(
              well,
              cfg.survey.trajectoryUid,
              `Main Trajectory — Run ${well.runNumber}`,
              cfg.survey.aziRef,
              [s]
            ),
            signal
          )
          .then(r =>
            this.pushResult({
              stream:  "survey",
              ok:      r.ok,
              sentAt:  now,
              error:   r.errorMessage,
            })
          )
      );
    }

    // ── Depth & ROP ─────────────────────────────────────────────────────────
    if (cfg.depth.enabled && bundle.depth) {
      const d = bundle.depth;
      tasks.push(
        this.client
          .upsert(
            "log",
            buildDepthLogXml(well, cfg.depth.logUid, [d]),
            signal
          )
          .then(r =>
            this.pushResult({
              stream: "depth",
              ok:     r.ok,
              sentAt: now,
              error:  r.errorMessage,
            })
          )
      );
    }

    // ── Decoded params ───────────────────────────────────────────────────────
    if (cfg.decoded.enabled && bundle.decoded) {
      const dec = bundle.decoded;
      tasks.push(
        this.client
          .upsert(
            "log",
            buildDecodedLogXml(well, cfg.decoded.logUid, [dec]),
            signal
          )
          .then(r =>
            this.pushResult({
              stream: "decoded",
              ok:     r.ok,
              sentAt: now,
              error:  r.errorMessage,
            })
          )
      );
    }

    // ── Curves ──────────────────────────────────────────────────────────────
    if (cfg.curves.enabled && bundle.curves) {
      const c = bundle.curves;
      tasks.push(
        this.client
          .upsert(
            "log",
            buildCurvesLogXml(well, cfg.curves.logUid, [c]),
            signal
          )
          .then(r =>
            this.pushResult({
              stream: "curves",
              ok:     r.ok,
              sentAt: now,
              error:  r.errorMessage,
            })
          )
      );
    }

    await Promise.allSettled(tasks);
  }
}
