import React, { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { PressureChart } from "./PressureChart";
import { DecoderChart } from "./DecoderChart";
import { SpectrogramView } from "./SpectrogramView";
import { FilterPanel } from "./FilterPanel";
import { PacketLog } from "./PacketLog";
import { ToolfaceWidget } from "./summary/ToolfaceWidget";
import { PulseView } from "./summary/PulseView";
import { SummarySidePanel } from "./summary/SummarySidePanel";
import { I18nProvider, type Lang } from "./i18n";
import { WellProvider, useWell } from "./WellContext";
import { generateMWDData, STEPS_PER_FRAME, SIM_BASE_MS } from "./mwd-data";

function WidgetLoader() {
  const { widgetId } = useParams<{ widgetId: string }>();
  const { activeWell } = useWell();
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [activePressure, setActivePressure] = useState<"p1" | "p2">("p1");

  // Mock data for standalone view
  const allDataP1 = useMemo(() => generateMWDData(25, activeWell.seed, 0.4), [activeWell.seed]);
  const allDataP2 = useMemo(() => generateMWDData(25, activeWell.seed + 1000, 0.6), [activeWell.seed]);
  const activeMwdData = activePressure === "p1" ? allDataP1 : allDataP2;

  // Simple reveal progress
  const [revealProgress, setRevealProgress] = useState(STEPS_PER_FRAME * 2);

  // Time mock
  const currentSimTimeMs = SIM_BASE_MS + (revealProgress * 1000);

  const renderWidget = () => {
    switch (widgetId) {
      case "pressure":
        return (
          <PressureChart
            isPlaying={isPlaying}
            activeTab={activePressure}
            onTabChange={setActivePressure}
            mwdData={activeMwdData}
            scrollOffset={scrollOffset}
            onScroll={setScrollOffset}
            zoom={zoom}
            onZoomChange={setZoom}
            currentSimTimeMs={currentSimTimeMs}
          />
        );
      case "decoder":
        return (
          <DecoderChart
            isPlaying={isPlaying}
            activePressure={activePressure}
            mwdData={activeMwdData}
            scrollOffset={scrollOffset}
            onScroll={setScrollOffset}
            zoom={zoom}
            onZoomChange={setZoom}
            currentSimTimeMs={currentSimTimeMs}
            filter="SYNC"
            onFilterChange={() => {}}
          />
        );
      case "spectrogram":
        return (
          <SpectrogramView
            isPlaying={isPlaying}
            currentSimTimeMs={currentSimTimeMs}
            scrollOffset={scrollOffset}
            zoom={zoom}
            onScroll={setScrollOffset}
          />
        );
      case "filters":
        return <FilterPanel />;
      case "log":
        return <PacketLog mwdData={activeMwdData} />;

      // ── Summary widgets ────────────────────────────────────────────────────
      case "toolface":
        return (
          <div className="w-full h-full flex">
            <ToolfaceWidget />
          </div>
        );
      case "pulse":
        return (
          <div className="w-full h-full flex flex-col justify-end">
            <PulseView />
          </div>
        );
      case "side-panel":
        return (
          <div className="w-full h-full flex">
            <div className="flex-1">
              <SummarySidePanel />
            </div>
          </div>
        );

      default:
        return <div className="p-4 text-foreground">Widget not found: {widgetId}</div>;
    }
  };

  return (
    <div className="w-screen h-screen bg-background overflow-hidden p-2">
      {renderWidget()}
    </div>
  );
}

export function StandaloneWidget() {
  const [lang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("mwd_lang");
      return (saved === "en" || saved === "ru") ? (saved as Lang) : ("en" as Lang);
    } catch {
      return "en" as Lang;
    }
  });

  return (
    <I18nProvider lang={lang}>
      <WellProvider>
        <WidgetLoader />
      </WellProvider>
    </I18nProvider>
  );
}
