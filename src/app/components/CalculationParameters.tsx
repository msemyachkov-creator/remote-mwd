import React from "react";
import { useI18n } from "./i18n";

export function CalculationParameters() {
  const { t } = useI18n();

  const fields = [
    { label: t("calc_tfc_offset"),       value: "0.00",   unit: t("data_unit_deg") },
    { label: t("calc_bit_diameter"),     value: "130.00", unit: "mm" },
    { label: t("calc_well_diameter"),    value: "130.00", unit: "mm" },
    { label: t("calc_id_collar_gamma"),  value: "50.00",  unit: "mm" },
    { label: t("calc_od_collar_gamma"),  value: "89.00",  unit: "mm" },
    { label: t("calc_mud_resistivity"),  value: "0.01",   unit: t("unit_ohm_m") },
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
