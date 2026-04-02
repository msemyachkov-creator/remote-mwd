import React, { useState } from "react";
import { useI18n } from "./i18n";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-foreground/60">{label}</span>
      {children}
    </div>
  );
}

export function GeomagneticReference() {
  const { t } = useI18n();
  const [format, setFormat] = useState<"dms" | "decimal">("dms");

  return (
    <div className="p-3 flex flex-col gap-3 overflow-auto">
      {/* Calculator */}
      <div className="border border-border rounded p-3 bg-secondary/5 relative">
        <span className="absolute -top-2 left-3 bg-background px-1.5 text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
          {t("geo_calc_title")}
        </span>
        <div className="mt-1 flex flex-col gap-3">
          {/* Date + Elevation */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("geo_date")}>
              <input
                type="text"
                defaultValue="19.03.2026"
                className="h-7 px-2 bg-input-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--radius)" }}
              />
            </Field>
            <Field label={t("geo_elevation")}>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  defaultValue="0.00"
                  className="flex-1 h-7 px-2 bg-input-background border border-border rounded text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-primary"
                  style={{ borderRadius: "var(--radius)" }}
                />
                <span className="text-xs text-foreground/50">m</span>
              </div>
            </Field>
          </div>

          {/* Format */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-foreground/60">Format</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="geo_format" checked={format === "dms"} onChange={() => setFormat("dms")} className="size-3 accent-primary" />
              <span className="text-xs text-foreground/80">{t("geo_format_dms")}</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="geo_format" checked={format === "decimal"} onChange={() => setFormat("decimal")} className="size-3 accent-primary" />
              <span className="text-xs text-foreground/80">{t("geo_format_decimal")}</span>
            </label>
          </div>

          {/* Lat + Lng */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("geo_latitude")}>
              <input
                type="text"
                defaultValue={format === "dms" ? "00°00'0.000''N" : "0.000000"}
                className="h-7 px-2 bg-input-background border border-border rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--radius)" }}
              />
            </Field>
            <Field label={t("geo_longitude")}>
              <input
                type="text"
                defaultValue={format === "dms" ? "000°00'0.000''E" : "0.000000"}
                className="h-7 px-2 bg-input-background border border-border rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--radius)" }}
              />
            </Field>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button className="h-7 px-3 bg-secondary border border-border rounded text-[11px] font-medium hover:bg-secondary/80 transition-colors uppercase" style={{ borderRadius: "var(--radius)" }}>
              {t("geo_btn_location")}
            </button>
            <button className="h-7 px-3 bg-primary/20 border border-primary/30 text-primary rounded text-[11px] font-bold hover:bg-primary/30 transition-colors uppercase" style={{ borderRadius: "var(--radius)" }}>
              {t("geo_btn_calculate")}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="border border-border rounded p-3 bg-secondary/5 relative">
        <span className="absolute -top-2 left-3 bg-background px-1.5 text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
          Results
        </span>
        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {[
            { label: t("geo_dip"),         value: "0.0000", unit: "deg" },
            { label: t("geo_declination"), value: "0.0000", unit: "deg" },
            { label: t("geo_field_b"),     value: "0.00",   unit: "nT"  },
            { label: t("geo_field_g"),     value: "0.0000", unit: "g"   },
          ].map((item, idx) => (
            <Field key={idx} label={item.label}>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={item.value}
                  readOnly
                  className="flex-1 h-7 px-2 bg-secondary/20 border border-border rounded text-xs font-mono text-foreground/60 focus:outline-none"
                  style={{ borderRadius: "var(--radius)" }}
                />
                <span className="text-xs text-foreground/50 w-7 shrink-0">{item.unit}</span>
              </div>
            </Field>
          ))}
        </div>
      </div>
    </div>
  );
}
