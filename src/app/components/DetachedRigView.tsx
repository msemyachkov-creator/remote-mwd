// ─── Detached Rig View ────────────────────────────────────────────────────────
//
// Opens in a new browser tab via /rig/:rigId
// Auto-selects the active run for the rig, then shows a full-page
// multi-tab layout (Summary / Decoder / Data / Depth / Configuration).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { ExternalLink, Circle, ChevronDown, ChevronRight, Check } from "lucide-react";
import { WellProvider, useWell } from "./WellContext";
import { I18nProvider, type Lang } from "./i18n";
import { ScaledContainer } from "./ViewportScale";
import { SummaryView } from "./SummaryView";
import { DataView } from "./DataView_new";
import { DepthView } from "./DepthView";
import { TelesystemConfig } from "./TelesystemConfig";
import { CompositesView } from "./CompositesView";
import { HeaderBar } from "./HeaderBar";
import { AlertPanel } from "./AlertPanel";
import { PlaybackToolbar } from "./PlaybackToolbar";
import { PressureChart } from "./PressureChart";
import { DecoderChart } from "./DecoderChart";
import { PacketLog } from "./PacketLog";
import { LASView } from "./LASView";
import {
  generateMWDData,
  STEPS_PER_FRAME,
  SIM_BASE_MS,
  PIXELS_PER_SECOND,
  STEPS_PER_FRAME as SPF,
} from "./mwd-data";

const BOX_STATUS_COLOR: Record<string, string> = {
  active:  "var(--accent)",
  paused:  "var(--chart-3)",
  offline: "var(--muted-foreground)",
};

const PLAY_SPEED = 0.1875;

const RUN_STATUS_COLOR: Record<string, string> = {
  active:  "var(--accent)",
  standby: "var(--chart-3)",
  off:     "var(--muted-foreground)",
};

// ─── Well / Run selector dropdown ────────────────────────────────────────────
interface WellRunSelectorProps {
  rigId: string;
}
function WellRunSelector({ rigId }: WellRunSelectorProps) {
  const { wells, wellEntries, activeWellId, setActiveWellId } = useWell();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Group runs by well
  const wellsForRig = useMemo(
    () => wellEntries.filter((w) => w.rigId === rigId),
    [wellEntries, rigId]
  );
  const runsForWell = useCallback(
    (wellId: string) =>
      wells
        .filter((r) => r.wellId === wellId)
        .sort((a, b) => a.runNumber - b.runNumber),
    [wells]
  );

  const activeRun = wells.find((r) => r.id === activeWellId);
  const activeWellEntry = wellEntries.find((w) => w.id === activeRun?.wellId);
  const label = activeRun
    ? `${activeWellEntry?.name ?? "Well"} · Run ${activeRun.runNumber}`
    : "Select run";

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors ${
          open
            ? "border-primary/50 bg-primary/10 text-foreground"
            : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground"
        }`}
        style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-family-base)" }}
      >
        <span>{label}</span>
        <ChevronDown
          className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded shadow-xl overflow-hidden"
          style={{ minWidth: 220, borderRadius: "var(--radius)" }}
        >
          {wellsForRig.length === 0 ? (
            <div
              className="px-3 py-2 text-muted-foreground"
              style={{ fontSize: "var(--text-xs)" }}
            >
              No wells found
            </div>
          ) : (
            wellsForRig.map((well) => {
              const runs = runsForWell(well.id);
              if (runs.length === 0) return null;
              return (
                <div key={well.id}>
                  {/* Well header row */}
                  <div
                    className="px-3 pt-2 pb-0.5 text-muted-foreground/70 border-t border-border first:border-t-0"
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-family-base)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {well.name}
                  </div>

                  {/* Runs */}
                  {runs.map((run) => {
                    const isActive = run.id === activeWellId;
                    return (
                      <button
                        key={run.id}
                        onClick={() => { setActiveWellId(run.id); setOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors ${
                          isActive
                            ? "bg-primary/10 text-foreground"
                            : "hover:bg-secondary/60 text-foreground/80"
                        }`}
                      >
                        {/* Status dot */}
                        <Circle
                          className="size-2 shrink-0"
                          style={{
                            color: RUN_STATUS_COLOR[run.status] ?? RUN_STATUS_COLOR.off,
                            fill:  RUN_STATUS_COLOR[run.status] ?? RUN_STATUS_COLOR.off,
                          }}
                        />

                        {/* Run info */}
                        <div className="flex flex-col gap-0 flex-1 min-w-0">
                          <span
                            style={{
                              fontSize: "var(--text-xs)",
                              fontFamily: "var(--font-family-base)",
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            Run {run.runNumber}
                          </span>
                          <span
                            className="text-muted-foreground"
                            style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
                          >
                            {run.startDate}
                            {run.endDate ? ` → ${run.endDate}` : " → present"}
                          </span>
                        </div>

                        {/* Depth summary */}
                        <span
                          className="text-muted-foreground/70 shrink-0 tabular-nums"
                          style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
                        >
                          {run.bitDepth.toLocaleString()} {run.unit}
                        </span>

                        {/* Active check */}
                        {isActive && (
                          <Check className="size-3 text-primary shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function DetachedReportView() {
  const [activeTab, setActiveTab] = React.useState<"las" | "pdf">("las");
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center gap-0 border-b border-border shrink-0 px-2 bg-background">
        {(["las", "pdf"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "las" ? <LASView /> : <div className="flex-1 h-full bg-background" />}
      </div>
    </div>
  );
}

// ─── Inner content (has access to WellContext) ────────────────────────────────
function DetachedRigContent() {
  const { rigId } = useParams<{ rigId: string }>();
  const {
    wells, rigs, wellEntries,
    setActiveWellId, activeWell, activeWellId,
  } = useWell();

  const [activePage, setActivePage] = useState("summary");
  const [lang, setLang] = useState<Lang>("en");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePressure, setActivePressure] = useState<"p1" | "p2">("p1");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [decoderFilter, setDecoderFilter] = useState("SYNC");
  const [zoom, setZoom] = useState(1);

  const [revealProgress, setRevealProgress] = useState(STEPS_PER_FRAME);
  const [currentPlayTimeMs, setCurrentPlayTimeMs] = useState(SIM_BASE_MS);
  const isPlayingRef = useRef(false);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  const rig = rigs.find((r) => r.id === rigId);

  // ── Auto-select the active run for this rig on mount ───────────────────────
  useEffect(() => {
    if (!rigId) return;
    const rigRuns = wells.filter((r) => r.rigId === rigId);
    const best =
      rigRuns.find((r) => r.status === "active") ??
      rigRuns.reduce<(typeof rigRuns)[0] | null>(
        (b, r) => (!b || r.runNumber > b.runNumber ? r : b),
        null
      );
    if (best && best.id !== activeWellId) setActiveWellId(best.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rigId]);

  // ── Window title ───────────────────────────────────────────────────────────
  useEffect(() => {
    document.title = rig ? `${rig.name} — Remote MWD` : "Remote MWD";
  }, [rig]);

  // ── MWD data ───────────────────────────────────────────────────────────────
  const allDataP1 = useMemo(
    () => generateMWDData(25, activeWell.seed, 0.4),
    [activeWell.seed]
  );
  const allDataP2 = useMemo(
    () => generateMWDData(25, activeWell.seed + 1000, 0.6),
    [activeWell.seed]
  );
  const activeMwdData = activePressure === "p1" ? allDataP1 : allDataP2;
  const maxSteps = allDataP1.length;

  // Reset on well switch
  useEffect(() => {
    setRevealProgress(STEPS_PER_FRAME);
    setCurrentPlayTimeMs(SIM_BASE_MS);
    setScrollOffset(0);
  }, [activeWell.id]);

  // ── Playback RAF ───────────────────────────────────────────────────────────
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    let running = true;
    const animate = (ts: number) => {
      if (!running) return;
      if (lastTimeRef.current === 0) { lastTimeRef.current = ts; }
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;
      if (isPlayingRef.current) {
        const stepsPerSec = PLAY_SPEED * SPF;
        setRevealProgress((p) => {
          const next = Math.min(p + stepsPerSec * dt * SPF, maxSteps);
          return next;
        });
        setCurrentPlayTimeMs((t) => t + dt * 1000);
        setScrollOffset((prev) => prev + PIXELS_PER_SECOND * dt);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [maxSteps]);

  // ── Active run info ────────────────────────────────────────────────────────
  const activeRunInfo = useMemo(() => {
    const well = wellEntries.find((w) => w.id === activeWell.wellId);
    return { wellName: well?.name ?? "Well", runNumber: activeWell.runNumber };
  }, [activeWell, wellEntries]);

  const statusColor =
    BOX_STATUS_COLOR[rig?.boxStatus ?? "offline"] ?? BOX_STATUS_COLOR.offline;

  const currentSimTimeMs = currentPlayTimeMs;

  const handleManualScroll = (px: number) => setScrollOffset(px);

  // ── Render page content ────────────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case "summary":
        return <SummaryView mwdData={activeMwdData} />;
      case "data":
        return <DataView mwdData={activeMwdData} />;
      case "depth":
        return <DepthView />;
      case "composites":
        return <CompositesView />;
      case "config":
        return <TelesystemConfig />;
      case "report":
        return <DetachedReportView />;
      default:
        return (
          <>
            <div className="shrink-0">
              <PlaybackToolbar
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying((v) => !v)}
                decoderFilter={decoderFilter}
                onDecoderFilterChange={setDecoderFilter}
              />
            </div>
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 flex flex-col p-1.5 min-w-0 min-h-0 gap-0 overflow-hidden">
                <div className="shrink-0" style={{ height: 140 }}>
                  <PressureChart
                    isPlaying={isPlaying}
                    activeTab={activePressure}
                    onTabChange={setActivePressure}
                    mwdData={activeMwdData}
                    scrollOffset={scrollOffset}
                    onScroll={handleManualScroll}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    currentSimTimeMs={currentSimTimeMs}
                  />
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <DecoderChart
                    isPlaying={isPlaying}
                    activePressure={activePressure}
                    mwdData={activeMwdData}
                    scrollOffset={scrollOffset}
                    onScroll={handleManualScroll}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    currentSimTimeMs={currentSimTimeMs}
                    filter={decoderFilter}
                    onFilterChange={setDecoderFilter}
                  />
                </div>
              </div>
              <PacketLog
                mwdData={activeMwdData}
                onNavigateToFrame={handleManualScroll}
              />
            </div>
          </>
        );
    }
  };

  const isChartPage =
    activePage !== "summary" &&
    activePage !== "data" &&
    activePage !== "depth" &&
    activePage !== "composites" &&
    activePage !== "config" &&
    activePage !== "report";

  return (
    <ScaledContainer>
    <div className="flex flex-col w-full h-full overflow-hidden bg-background text-foreground">

      {/* ── Detached header bar ─────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center gap-2.5 px-3 border-b border-border bg-sidebar"
        style={{ height: 40 }}
      >
        {/* Logo */}
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M8 20 L14 4 L20 20" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M10.5 20 L14 10 L17.5 20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="14" cy="4" r="2" fill="var(--chart-3)" />
          <line x1="5" y1="20" x2="23" y2="20" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Status indicator */}
        <Circle
          className="size-2 shrink-0"
          style={{ color: statusColor, fill: statusColor }}
        />

        {/* Rig name */}
        <span
          className="text-foreground shrink-0"
          style={{
            fontSize: "var(--text-sm)",
            fontFamily: "var(--font-family-base)",
            fontWeight: "var(--font-weight-semibold)",
          }}
        >
          {rig?.name ?? rigId}
        </span>

        <span className="text-border shrink-0">·</span>

        {/* Well / Run selector */}
        {rigId && <WellRunSelector rigId={rigId} />}

        {/* Job ID */}
        {rig?.jobId && (
          <>
            <span className="text-border shrink-0">·</span>
            <span
              className="text-muted-foreground/60 truncate"
              style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
            >
              {rig.jobId}
            </span>
          </>
        )}

        <div className="flex-1" />

        {/* Bit / Hole depths */}
        <span
          className="text-muted-foreground shrink-0"
          style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
        >
          <span className="text-foreground/60">Bit</span>{" "}
          <span className="tabular-nums text-foreground/80">
            {activeWell.bitDepth.toLocaleString()}
          </span>{" "}
          <span className="text-foreground/40">{activeWell.unit}</span>
        </span>
        <span
          className="text-muted-foreground shrink-0"
          style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
        >
          <span className="text-foreground/60">Hole</span>{" "}
          <span className="tabular-nums text-foreground/80">
            {activeWell.holeDepth.toLocaleString()}
          </span>{" "}
          <span className="text-foreground/40">{activeWell.unit}</span>
        </span>

        {/* Detached badge */}
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-primary/30 bg-primary/10 shrink-0">
          <ExternalLink className="size-3 text-primary" />
          <span
            className="text-primary"
            style={{ fontSize: "10px", fontFamily: "var(--font-family-base)", fontWeight: 500 }}
          >
            Detached
          </span>
        </div>
      </div>

      {/* ── HeaderBar (nav tabs) ────────────────────────────────────────────── */}
      <div className="shrink-0">
        <HeaderBar
          lang={lang}
          onLangChange={setLang}
          activePage={activePage}
          onPageChange={setActivePage}
        />
      </div>

      {/* ── Alert panel ────────────────────────────────────────────────────── */}
      <div className="shrink-0">
        <AlertPanel />
      </div>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <div className={`${isChartPage ? "flex flex-col" : ""} flex-1 min-h-0 overflow-hidden`}>
        {renderPage()}
      </div>
    </div>
    </ScaledContainer>
  );
}

// ─── Root export (provides own WellContext + I18n) ────────────────────────────
export function DetachedRigView() {
  const [lang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("mwd_lang");
      return saved === "en" || saved === "ru" ? (saved as Lang) : ("en" as Lang);
    } catch {
      return "en" as Lang;
    }
  });

  return (
    <I18nProvider lang={lang}>
      <WellProvider>
        <DetachedRigContent />
      </WellProvider>
    </I18nProvider>
  );
}
