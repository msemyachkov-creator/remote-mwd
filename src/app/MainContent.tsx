import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { FileText, Download, X, Check, Loader2 } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { HeaderBar } from "./components/HeaderBar";
import { AlertPanel } from "./components/AlertPanel";
import { PlaybackToolbar } from "./components/PlaybackToolbar";
import { PressureChart } from "./components/PressureChart";
import { DecoderChart } from "./components/DecoderChart";
import { SpectrogramView } from "./components/SpectrogramView";
import { FilterPanel } from "./components/FilterPanel";
import { PacketLog } from "./components/PacketLog";
import { StatusFooter } from "./components/StatusFooter";
import { DataView } from "./components/DataView_new";
import { SummaryView } from "./components/SummaryView";
import { TelesystemConfig } from "./components/TelesystemConfig";
import { TelesystemMemory } from "./components/TelesystemMemory";
import { DepthView } from "./components/DepthView";
import { CompositesView } from "./components/CompositesView";
import { LASView } from "./components/LASView";
import { I18nProvider, type Lang } from "./components/i18n";
import { WellProvider, useWell } from "./components/WellContext";
import {
  generateMWDData,
  getTotalWidthPx,
  STEPS_PER_FRAME,
  PIXELS_PER_SECOND,
  SIM_BASE_MS,
  type MWDPacket,
} from "./components/mwd-data";

function ReportModal({ onClose }: { onClose: () => void }) {
  const [formats, setFormats] = useState({ las: true, pdf: false });
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");

  const toggle = (key: "las" | "pdf") =>
    setStatus("idle") || setFormats((f) => ({ ...f, [key]: !f[key] }));

  const generate = () => {
    if (!formats.las && !formats.pdf) return;
    setStatus("generating");
    setTimeout(() => setStatus("done"), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background border border-border rounded-xl shadow-2xl w-[400px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Make a Report</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Select export format</p>
            <div className="flex gap-3">
              {(["las", "pdf"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => toggle(fmt)}
                  disabled={status === "generating"}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    formats[fmt]
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  <div
                    className={`size-4 rounded border flex items-center justify-center transition-colors ${
                      formats[fmt] ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`}
                  >
                    {formats[fmt] && <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />}
                  </div>
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {status === "done" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">Report ready — download below</p>
              {formats.las && (
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary/30 hover:bg-secondary transition-colors text-sm text-foreground">
                  <Download className="size-3.5 text-primary" />
                  <span>well_report.las</span>
                </button>
              )}
              {formats.pdf && (
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary/30 hover:bg-secondary transition-colors text-sm text-foreground">
                  <Download className="size-3.5 text-primary" />
                  <span>well_report.pdf</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-secondary/10">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          {status !== "done" ? (
            <button
              onClick={generate}
              disabled={(!formats.las && !formats.pdf) || status === "generating"}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "generating" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <FileText className="size-3.5" />
                  Generate
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Check className="size-3.5" />
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportView() {
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

/** Play speed: steps per second (each step = one complete block) */
const PLAY_SPEED = 0.1875;

/** Arrow key scroll step in world pixels */
const ARROW_SCROLL_STEP = 80;

/** Smooth scroll lerp factor per frame (~60fps → converges in ~1s) */
const SCROLL_LERP = 0.06;

/* ─── Error Boundary ─── */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 32,
            color: "var(--foreground)",
            background: "var(--background)",
            fontFamily: "var(--font-family-base)",
            minHeight: "100vh",
          }}
        >
          <h2 style={{ color: "var(--destructive)", marginBottom: 12 }}>
            Runtime Error
          </h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              color: "var(--chart-3)",
              fontSize: "var(--text-sm)",
            }}
          >
            {this.state.error.message}
          </pre>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              color: "var(--muted-foreground)",
              fontSize: "var(--text-xs)",
              marginTop: 8,
            }}
          >
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Main App Content ─── */
function MWDAppContent({ lang, onLangChange }: { lang: Lang; onLangChange: (l: Lang) => void }) {
  const { activeWell } = useWell();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePressure, setActivePressure] = useState<"p1" | "p2">("p1");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activePage, setActivePage] = useState("summary");
  const [showReportModal, setShowReportModal] = useState(false);
  const [decoderFilter, setDecoderFilter] = useState<string>("SYNC");

  /* Zoom — persisted */
  const [zoom, setZoom] = useState(() => {
    try {
      const saved = localStorage.getItem("mwd_zoom");
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });
  useEffect(() => {
    localStorage.setItem("mwd_zoom", String(zoom));
  }, [zoom]);

  /* Step-based reveal — first frame fully visible on load */
  const [revealProgress, setRevealProgress] = useState(STEPS_PER_FRAME);
  const [currentPlayTimeMs, setCurrentPlayTimeMs] = useState(SIM_BASE_MS);
  const isPlayingRef = useRef(false);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const chartColumnRef = useRef<HTMLDivElement>(null);

  /* Smooth scroll state */
  const targetScrollRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const isSmoothingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) {
      isSmoothingRef.current = true;
    }
  }, [isPlaying]);

  /* Resizable panel heights — persisted */
  const [pressureHeight, setPressureHeight] = useState(() => {
    try {
      const saved = localStorage.getItem("mwd_pressureHeight");
      return saved ? Number(saved) : 140;
    } catch {
      return 140;
    }
  });
  const [bottomHeight, setBottomHeight] = useState(() => {
    try {
      const saved = localStorage.getItem("mwd_bottomHeight");
      return saved ? Number(saved) : 132;
    } catch {
      return 132;
    }
  });

  useEffect(() => {
    localStorage.setItem("mwd_pressureHeight", String(pressureHeight));
  }, [pressureHeight]);
  useEffect(() => {
    localStorage.setItem("mwd_bottomHeight", String(bottomHeight));
  }, [bottomHeight]);

  /* Generate full data — unique for each well */
  const allDataP1 = useMemo(() => generateMWDData(25, activeWell.seed, 0.4), [activeWell.seed]);
  const allDataP2 = useMemo(() => generateMWDData(25, activeWell.seed + 1000, 0.6), [activeWell.seed]);

  const maxSteps = allDataP1.length;

  // Reset progress when switching wells
  useEffect(() => {
    setRevealProgress(STEPS_PER_FRAME);
    setCurrentPlayTimeMs(SIM_BASE_MS);
    setScrollOffset(0);
    smoothScrollRef.current = 0;
    targetScrollRef.current = 0;
    isSmoothingRef.current = false;
  }, [activeWell.id]);

  /* Play animation + smooth scroll via requestAnimationFrame */
  useEffect(() => {
    let running = true;

    const animate = (timestamp: number) => {
      if (!running) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (isPlayingRef.current) {
        setRevealProgress((prev) => Math.min(prev + PLAY_SPEED * dt, maxSteps));
        setCurrentPlayTimeMs((prev) => prev + dt * 1000);
      }

      if (isSmoothingRef.current) {
        const target = targetScrollRef.current;
        const current = smoothScrollRef.current;
        const diff = target - current;

        if (Math.abs(diff) < 0.5) {
          smoothScrollRef.current = target;
          if (!isPlayingRef.current) {
            isSmoothingRef.current = false;
          }
        } else {
          smoothScrollRef.current = current + diff * SCROLL_LERP;
        }

        setScrollOffset(smoothScrollRef.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [maxSteps]);

  /* Compute visible MWD data */
  const activeMwdData = useMemo(() => {
    if (revealProgress <= 0) return [];

    const all = activePressure === "p1" ? allDataP1 : allDataP2;
    const fullPackets = Math.min(Math.floor(revealProgress), all.length);
    const fraction = revealProgress - Math.floor(revealProgress);

    const result: MWDPacket[] = [];

    for (let i = 0; i < fullPackets; i++) {
      result.push(all[i]);
    }

    if (fullPackets < all.length && fraction > 0) {
      const pkt = all[fullPackets];
      const bitsToReveal = Math.max(1, Math.floor(fraction * pkt.bits.length));
      result.push({
        ...pkt,
        revealedBits: bitsToReveal,
      });
    }

    return result;
  }, [revealProgress, activePressure, allDataP1, allDataP2]);

  /* Current simulated time in ms */
  const currentSimTimeMs = useMemo(() => {
    const totalW = getTotalWidthPx(activeMwdData);
    const seconds = totalW / PIXELS_PER_SECOND;
    return SIM_BASE_MS + seconds * 1000;
  }, [activeMwdData]);

  /* Update smooth scroll target when data grows during play */
  const prevProgressRef = useRef(revealProgress);
  useEffect(() => {
    if (isPlaying && revealProgress > prevProgressRef.current) {
      const totalW = getTotalWidthPx(activeMwdData);
      const containerW = chartColumnRef.current
        ? chartColumnRef.current.getBoundingClientRect().width
        : 700;
      const visibleW = containerW / zoom;
      const target = Math.max(0, totalW - visibleW);

      targetScrollRef.current = target;
      isSmoothingRef.current = true;
    }
    prevProgressRef.current = revealProgress;
  }, [revealProgress, isPlaying, activeMwdData, zoom]);

  /* Manual scroll handler */
  const handleManualScroll = useCallback((offset: number) => {
    const clamped = Math.max(0, offset);
    setScrollOffset(clamped);
    smoothScrollRef.current = clamped;
    targetScrollRef.current = clamped;
    isSmoothingRef.current = false;
  }, []);

  /* Keyboard arrows */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setScrollOffset((prev) => {
          const next = Math.max(0, prev - ARROW_SCROLL_STEP / zoom);
          smoothScrollRef.current = next;
          targetScrollRef.current = next;
          return next;
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setScrollOffset((prev) => {
          const next = prev + ARROW_SCROLL_STEP / zoom;
          smoothScrollRef.current = next;
          targetScrollRef.current = next;
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoom]);

  const handleTabChange = (tab: "p1" | "p2") => {
    setActivePressure(tab);
    handleManualScroll(0);
  };

  const isChartAnimating = isPlaying;

  /* Resize handles */
  const handlePressureResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startH = pressureHeight;
      const onMove = (ev: MouseEvent) => {
        setPressureHeight(Math.max(60, Math.min(400, startH + (ev.clientY - startY))));
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [pressureHeight],
  );

  const handleBottomResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startH = bottomHeight;
      const onMove = (ev: MouseEvent) => {
        setBottomHeight(Math.max(60, Math.min(250, startH - (ev.clientY - startY))));
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [bottomHeight],
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="flex flex-1 min-h-0">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />

        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <div className="shrink-0">
            <HeaderBar
              lang={lang}
              onLangChange={onLangChange}
              activePage={activePage}
              onPageChange={setActivePage}
              onMakeReport={() => setShowReportModal(true)}
            />
          </div>
          {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
          {activePage !== "summary" && (
            <div className="shrink-0">
              <AlertPanel />
            </div>
          )}

          {activePage === "data" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <DataView mwdData={activeMwdData} />
            </div>
          ) : activePage === "summary" ? (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="flex flex-col" style={{ minHeight: 640, height: "100%" }}>
                <SummaryView mwdData={activeMwdData} />
              </div>
            </div>
          ) : activePage === "config" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <TelesystemConfig />
            </div>
          ) : activePage === "memory" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <TelesystemMemory />
            </div>
          ) : activePage === "depth" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <DepthView />
            </div>
          ) : activePage === "components" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <CompositesView />
            </div>
          ) : activePage === "report" ? (
            <ReportView />
          ) : (
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
                <div
                  className="flex-1 flex flex-col p-1.5 min-w-0 min-h-0 gap-0 overflow-hidden"
                  ref={chartColumnRef}
                >
                  <div className="shrink-0" style={{ height: pressureHeight }}>
                    <PressureChart
                      isPlaying={isPlaying}
                      activeTab={activePressure}
                      onTabChange={handleTabChange}
                      mwdData={activeMwdData}
                      scrollOffset={scrollOffset}
                      onScroll={handleManualScroll}
                      zoom={zoom}
                      onZoomChange={setZoom}
                      currentSimTimeMs={currentSimTimeMs}
                    />
                  </div>

                  <div
                    className="shrink-0 cursor-row-resize flex items-center justify-center group"
                    style={{ height: 6 }}
                    onMouseDown={handlePressureResize}
                  >
                    <div className="w-10 h-[2px] rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
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

                  <div
                    className="shrink-0 cursor-row-resize flex items-center justify-center group"
                    style={{ height: 6 }}
                    onMouseDown={handleBottomResize}
                  >
                    <div className="w-10 h-[2px] rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
                  </div>

                  <div
                    className="flex gap-1.5 shrink-0 overflow-hidden"
                    style={{ height: bottomHeight }}
                  >
                    <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
                      <SpectrogramView
                        isPlaying={isChartAnimating}
                        currentSimTimeMs={currentSimTimeMs}
                        scrollOffset={scrollOffset}
                        zoom={zoom}
                        onScroll={handleManualScroll}
                      />
                    </div>
                    <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
                      <FilterPanel />
                    </div>
                  </div>
                </div>

                <PacketLog
                  mwdData={activeMwdData}
                  onNavigateToFrame={(scrollPx) => {
                    handleManualScroll(scrollPx);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

export function MainContent() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    localStorage.setItem("mwd_lang", lang);
  }, [lang]);

  return (
    <ErrorBoundary>
      <I18nProvider lang={lang}>
        <WellProvider>
          <MWDAppContent lang={lang} onLangChange={setLang} />
        </WellProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
