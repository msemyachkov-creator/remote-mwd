import React, { useState } from "react";
import { useI18n } from "./i18n";
import { HelpCircle } from "lucide-react";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-foreground/60">{label}</span>
      {children}
    </div>
  );
}

export function AzimuthDirection() {
  const { t } = useI18n();
  const [selectedDirection, setSelectedDirection] = useState("mn");

  return (
    <div className="p-3 flex flex-col gap-3 overflow-auto">
      <div className="border border-border rounded p-3 bg-secondary/5 flex flex-col gap-3">

        {/* Direction select */}
        <Field label={t("azimuth_dir_label")}>
          <div className="flex items-center gap-2">
            <select
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
              className="flex-1 h-7 px-2 bg-input-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ borderRadius: "var(--radius)" }}
            >
              <option value="mn">{t("azimuth_mag_mn")}</option>
              <option value="gn">{t("azimuth_grid_gn")}</option>
              <option value="tn">{t("azimuth_true_tn")}</option>
            </select>
            <button className="size-7 flex items-center justify-center rounded border border-border hover:bg-secondary/50 transition-colors shrink-0">
              <HelpCircle className="size-3.5 text-foreground/40" />
            </button>
          </div>
        </Field>

        {/* Convergence */}
        <Field label={t("azimuth_convergence")}>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              defaultValue="0.0000"
              disabled
              className="flex-1 h-7 px-2 bg-secondary/20 border border-border rounded text-xs font-mono text-foreground/40 cursor-not-allowed"
              style={{ borderRadius: "var(--radius)" }}
            />
            <span className="text-xs text-foreground/50 w-6 shrink-0">{t("data_unit_deg")}</span>
          </div>
        </Field>

        {/* Declination info */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-foreground/60">
            {t("azimuth_declination_val")} = <span className="text-foreground font-mono">0.0000</span> {t("data_unit_deg")}
          </span>
          <button className="text-[11px] font-medium text-primary hover:underline transition-colors">
            {t("azimuth_enter_in_geo")}
          </button>
        </div>

        <div className="h-px bg-border/50" />

        {/* Total correction */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-foreground/60">{t("azimuth_total_corr")}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold font-mono text-primary">0.0000</span>
            <span className="text-xs text-foreground/50">{t("data_unit_deg")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
