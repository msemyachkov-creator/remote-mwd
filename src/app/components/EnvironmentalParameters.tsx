import React from "react";
import { useI18n } from "./i18n";
import { Plus, Pencil, Minus, Share2 } from "lucide-react";

export function EnvironmentalParameters() {
  const { t } = useI18n();

  const data = [
    { time: "19-03-2026 15:26:08", type: t("env_type_water"), density: "0.10", potassium: "0.00", resistivity: "0.00" },
    { time: "19-03-2026 15:26:15", type: t("env_type_oil"),   density: "0.10", potassium: "0.00", resistivity: "0.00" },
    { time: "19-03-2026 15:26:19", type: t("env_type_gas"),   density: "0.10", potassium: "0.00", resistivity: "0.00" },
  ];

  return (
    <div className="p-3 flex flex-col gap-3 overflow-auto">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border border-border p-0.5 bg-secondary/10 w-fit rounded">
        {[Plus, Pencil, Minus].map((Icon, idx) => (
          <button key={idx} className="size-6 flex items-center justify-center hover:bg-secondary/30 transition-colors rounded">
            <Icon className="size-3.5 text-foreground/70" />
          </button>
        ))}
        <div className="w-px h-3.5 bg-border mx-0.5" />
        <button className="size-6 flex items-center justify-center hover:bg-secondary/30 transition-colors rounded">
          <Share2 className="size-3.5 text-foreground/70" />
        </button>
      </div>

      {/* Table */}
      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/20 border-b border-border">
              <th className="px-2 py-1.5 border-r border-border text-[10px] font-medium text-foreground/60">{t("env_time")}</th>
              <th className="px-2 py-1.5 border-r border-border text-[10px] font-medium text-foreground/60">{t("env_type")}</th>
              <th className="px-2 py-1.5 border-r border-border text-[10px] font-medium text-foreground/60 text-right">{t("env_density")}</th>
              <th className="px-2 py-1.5 border-r border-border text-[10px] font-medium text-foreground/60 text-right">{t("env_potassium")}</th>
              <th className="px-2 py-1.5 text-[10px] font-medium text-foreground/60 text-right">{t("env_resistivity")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-border last:border-b-0 hover:bg-primary/5 transition-colors ${idx === 2 ? "bg-primary/10" : ""}`}
              >
                <td className="px-2 py-1.5 border-r border-border text-xs font-mono text-foreground/70">{row.time}</td>
                <td className="px-2 py-1.5 border-r border-border text-xs">{row.type}</td>
                <td className="px-2 py-1.5 border-r border-border text-xs font-mono text-right">{row.density}</td>
                <td className="px-2 py-1.5 border-r border-border text-xs font-mono text-right">{row.potassium}</td>
                <td className="px-2 py-1.5 text-xs font-mono text-right">{row.resistivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
