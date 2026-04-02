import React from "react";
import { SummaryHeader } from "./summary/SummaryHeader";
import { ToolfaceWidget } from "./summary/ToolfaceWidget";
import { PulseView } from "./summary/PulseView";
import { SummarySidePanel } from "./summary/SummarySidePanel";
import { DetachableWidget } from "./DetachableWidget";
import { ExternalLink } from "lucide-react";
import type { MWDPacket } from "./mwd-data";

interface SummaryViewProps {
  mwdData: MWDPacket[];
}

function detachAction(widgetId: string, label: string) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const w = window.open(`/standalone/${widgetId}`, "_blank", "noopener,noreferrer");
        w?.focus();
      }}
      className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-primary/30 bg-background/80 backdrop-blur-sm transition-all hover:bg-primary/15 hover:border-primary/60"
      title={`Open ${label} in new tab`}
    >
      <ExternalLink className="size-3 text-primary" />
      <span
        className="text-primary"
        style={{ fontSize: "10px", fontFamily: "var(--font-family-base)", fontWeight: 500 }}
      >
        {label}
      </span>
    </button>
  );
}

export function SummaryView({ mwdData }: SummaryViewProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-500">
      <div className="flex-1 flex overflow-hidden">
        {/* Main Central View (Left 60-70%) */}
        <div className="flex-1 flex flex-col border-r border-border min-w-0 overflow-hidden">
          {/* Toolface area — detach button floats in top-right (open space) */}
          <DetachableWidget
            widgetId="toolface"
            label="Toolface"
            className="flex-1 flex items-stretch overflow-hidden"
            alwaysVisible
          >
            <ToolfaceWidget />
          </DetachableWidget>

          {/* Pulse View — detach button injected into its own header row */}
          <PulseView actions={detachAction("pulse", "Pulse View")} />
        </div>

        {/* Right Data Panel — detach button injected into its own tab bar */}
        <SummarySidePanel actions={detachAction("side-panel", "Data Panel")} />
      </div>
    </div>
  );
}
