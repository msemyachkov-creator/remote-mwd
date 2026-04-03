import React, { useState } from "react";
import { SummaryHeader } from "./summary/SummaryHeader";
import { ToolfaceWidget } from "./summary/ToolfaceWidget";
import { PulseView } from "./summary/PulseView";
import { SummarySidePanel } from "./summary/SummarySidePanel";
import { DetachableWidget } from "./DetachableWidget";
import { ExternalLink, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { MWDPacket } from "./mwd-data";

const MONITORING_ALERTS: { label: string; message: string; severity: "critical" | "warning" }[] = [
  { label: "Vibration",   message: "High Vibration Detected",    severity: "critical" },
  { label: "Toolface",    message: "Toolface Unstable",           severity: "warning"  },
  { label: "Signal",      message: "Signal Lost",                 severity: "critical" },
  { label: "Temperature", message: "High Downhole Temperature",   severity: "warning"  },
];

function MonitoringAlerts() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="shrink-0 border-b border-border bg-destructive/5">
      <div className="flex items-center gap-2 px-3 py-1">
        <AlertTriangle className="size-3.5 text-destructive shrink-0" />
        <span className="mwd-header text-destructive">
          {MONITORING_ALERTS.length} Active Alert{MONITORING_ALERTS.length !== 1 ? "s" : ""}
        </span>
        <span className="mwd-cell text-muted-foreground">·</span>
        {MONITORING_ALERTS.map((a, i) => (
          <span
            key={i}
            className="mwd-cell"
            style={{ color: a.severity === "critical" ? "var(--destructive)" : "#eab308" }}
          >
            {a.message}{i < MONITORING_ALERTS.length - 1 ? " ·" : ""}
          </span>
        ))}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="ml-auto flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
        </button>
      </div>
      {!collapsed && (
        <div className="px-3 pb-1.5 space-y-0.5">
          {MONITORING_ALERTS.map((a, i) => (
            <div key={i} className="flex items-center gap-2 py-0.5">
              <AlertTriangle
                className="size-3.5 shrink-0"
                style={{ color: a.severity === "critical" ? "var(--destructive)" : "#eab308" }}
              />
              <span
                className="mwd-cell"
                style={{ color: a.severity === "critical" ? "var(--destructive)" : "#eab308" }}
              >
                {a.message}
              </span>
              <span className="mwd-cell text-muted-foreground">— {a.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SummaryViewProps {
  mwdData: MWDPacket[];
}

function detachAction(widgetId: string, label: string) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const w = window.open(`${import.meta.env.BASE_URL}#/standalone/${widgetId}`, "_blank", "noopener,noreferrer");
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
      <MonitoringAlerts />
      <div className="flex-1 flex overflow-hidden">
        {/* Main Central View */}
        <div className="flex-1 flex flex-col border-r border-border min-w-0 overflow-hidden">
          <DetachableWidget
            widgetId="toolface"
            label="Toolface"
            className="flex-1 flex items-stretch overflow-hidden"
            alwaysVisible
          >
            <ToolfaceWidget />
          </DetachableWidget>

          <PulseView actions={detachAction("pulse", "Pulse View")} />
        </div>

        {/* Right Data Panel */}
        <SummarySidePanel actions={detachAction("side-panel", "Data Panel")} />
      </div>
    </div>
  );
}
