import React from "react";
import { useI18n } from "../i18n";
import { useWell } from "../WellContext";

export function SummaryHeader() {
  const { t } = useI18n();
  const { activeWell } = useWell();

  const metrics = [
    { label: t("sum_hole_depth"), value: activeWell.holeDepth.toFixed(2), unit: activeWell.unit, color: "text-primary" },
    { label: t("sum_bit_depth"), value: activeWell.bitDepth.toFixed(2), unit: activeWell.unit },
    { label: t("sum_rop"), value: (12.4 + (Math.random() * 2)).toFixed(1), unit: "m/h", color: "text-accent" },
    { label: t("sum_spp"), value: activeWell.pressure.toFixed(1), unit: "bar" },
    { label: t("sum_hook_load"), value: "84.2", unit: "t" },
  ];

  return (
    <div className="flex items-center gap-px bg-border border-b border-border h-16 shrink-0">
      {metrics.map((m, idx) => (
        <div key={`metric-${idx}`} className="flex-1 bg-background flex flex-col justify-center px-4 h-full">
          <span className="mwd-tiny uppercase tracking-wider text-foreground/50 font-medium leading-tight">
            {m.label}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-mono font-bold leading-none ${m.color || "text-foreground"}`}>
              {m.value}
            </span>
            <span className="mwd-metric-unit text-foreground/40">{m.unit}</span>
          </div>
        </div>
      ))}
      <div className="flex-[0.5] bg-background flex flex-col justify-center px-4 h-full border-l border-border">
        <span className="mwd-tiny uppercase tracking-wider text-foreground/50 font-medium leading-tight">
          STATUS
        </span>
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full animate-pulse ${
            activeWell.status === "active" ? "bg-accent" : 
            activeWell.status === "standby" ? "bg-chart-3" : "bg-foreground/20"
          }`} />
          <span className={`text-sm font-bold ${
            activeWell.status === "active" ? "text-accent" : 
            activeWell.status === "standby" ? "text-chart-3" : "text-foreground/40"
          }`}>
            {activeWell.status === "active" ? t("sum_status_drilling") : 
             activeWell.status === "standby" ? "STANDBY" : "OFFLINE"}
          </span>
        </div>
      </div>
    </div>
  );
}
