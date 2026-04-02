import React from "react";
import { useI18n } from "./i18n";

export function SurveyAcceptanceCriteria() {
  const { t } = useI18n();

  const fields = [
    { label: t("tol_b"),         value: "300.00", unit: t("unit_nt") },
    { label: t("tol_g"),         value: "0.0025", unit: t("unit_g") },
    { label: t("tol_dip"),       value: "0.45",   unit: t("data_unit_deg") },
    { label: t("tol_md_diff"),   value: "9.0",    unit: t("unit_m") },
    { label: t("tol_incl_diff"), value: "4.0",    unit: t("data_unit_deg") },
    { label: t("tol_azi_diff"),  value: "5.0",    unit: t("data_unit_deg") },
  ];

  return (
    <div className="p-3 overflow-auto">
      <div className="border border-border rounded p-3 bg-secondary/5 flex flex-col gap-2.5">
        {fields.map((field, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-[11px] text-foreground/60">{field.label}</span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                defaultValue={field.value}
                className="w-32 h-7 px-2 bg-input-background border border-border rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--radius)" }}
              />
              <span className="text-xs text-foreground/50">{field.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
