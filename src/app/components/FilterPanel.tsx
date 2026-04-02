import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useI18n } from "./i18n";

interface FilterRow {
  id: string;
  enabled: boolean;
  typeKey: "filter_lowpass" | "filter_highpass" | "filter_bandpass";
  freq1: string;
  freq2: string;
  order: string;
}

const initialFilters: FilterRow[] = [
  { id: "1", enabled: true, typeKey: "filter_lowpass", freq1: "0.63", freq2: "—", order: "5" },
  { id: "2", enabled: false, typeKey: "filter_highpass", freq1: "2.50", freq2: "—", order: "3" },
  { id: "3", enabled: false, typeKey: "filter_bandpass", freq1: "0.50", freq2: "1.80", order: "4" },
];

const eventKeys: { time: string; type: string; msgKey: "filter_evt_sync" | "filter_evt_weak" | "filter_evt_start" | "filter_evt_loaded" }[] = [
  { time: "06.02.2026 17:25:42", type: "INFO", msgKey: "filter_evt_sync" },
  { time: "06.02.2026 17:24:18", type: "WARN", msgKey: "filter_evt_weak" },
  { time: "06.02.2026 17:22:57", type: "INFO", msgKey: "filter_evt_start" },
  { time: "06.02.2026 17:20:05", type: "INFO", msgKey: "filter_evt_loaded" },
];

export function FilterPanel() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"events" | "filters">("filters");
  const [filters, setFilters] = useState(initialFilters);

  const toggleFilter = (id: string) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const enableAll = () => setFilters((prev) => prev.map((f) => ({ ...f, enabled: true })));
  const disableAll = () => setFilters((prev) => prev.map((f) => ({ ...f, enabled: false })));

  return (
    <div className="bg-background border border-border rounded-md overflow-hidden flex flex-col h-full">
      <div className="flex items-center border-b border-border bg-card/50 shrink-0">
        {(["events", "filters"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-0.5 transition-colors border-b-2 ${
                isActive
                  ? "mwd-btn-active border-primary text-primary"
                  : "mwd-btn border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "events" ? t("filter_events") : t("filter_filters")}
            </button>
          );
        })}

        <div className="flex-1" />

        {activeTab === "filters" && (
          <div className="flex items-center gap-0 pr-1">
            {filters.some((f) => f.enabled) ? (
              <button
                onClick={disableAll}
                className="mwd-cell px-2 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("filter_disable_all")}
              </button>
            ) : (
              <button
                onClick={enableAll}
                className="mwd-cell px-2 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("filter_enable_all")}
              </button>
            )}
            <button
              onClick={() => window.open(`${import.meta.env.BASE_URL}#/standalone/filters`, "_blank", "width=600,height=500")}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors cursor-pointer"
              title="Open in separate window"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "filters" ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="mwd-header px-1.5 py-0.5 text-left w-6">
                  <span className="text-muted-foreground">✓</span>
                </th>
                <th className="mwd-header px-1.5 py-0.5 text-left text-muted-foreground">
                  {t("filter_type")}
                </th>
                <th className="mwd-header px-1.5 py-0.5 text-right text-muted-foreground">
                  {t("filter_freq1")}
                </th>
                <th className="mwd-header px-1.5 py-0.5 text-right text-muted-foreground">
                  {t("filter_freq2")}
                </th>
                <th className="mwd-header px-1.5 py-0.5 text-right text-muted-foreground">
                  {t("filter_order")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filters.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-1.5 py-0.5">
                    <Checkbox
                      checked={f.enabled}
                      onCheckedChange={() => toggleFilter(f.id)}
                    />
                  </td>
                  <td className="mwd-table-cell px-1.5 py-0.5 text-foreground">
                    {t(f.typeKey)}
                  </td>
                  <td className="mwd-table-cell px-1.5 py-0.5 text-right text-foreground tabular-nums">
                    {f.freq1}
                  </td>
                  <td className="mwd-table-cell px-1.5 py-0.5 text-right text-muted-foreground tabular-nums">
                    {f.freq2}
                  </td>
                  <td className="mwd-table-cell px-1.5 py-0.5 text-right text-foreground tabular-nums">
                    {f.order}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="mwd-header px-1.5 py-0.5 text-left text-muted-foreground">
                  {t("filter_time")}
                </th>
                <th className="mwd-header px-1.5 py-0.5 text-left text-muted-foreground">
                  {t("filter_event_type")}
                </th>
                <th className="mwd-header px-1.5 py-0.5 text-left text-muted-foreground">
                  {t("filter_message")}
                </th>
              </tr>
            </thead>
            <tbody>
              {eventKeys.map((e, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                >
                  <td className="mwd-table-cell px-1.5 py-0.5 text-muted-foreground tabular-nums">
                    {e.time}
                  </td>
                  <td className="mwd-table-cell px-1.5 py-0.5">
                    <span className={e.type === "WARN" ? "text-chart-3" : "text-chart-1"}>
                      {e.type}
                    </span>
                  </td>
                  <td className="mwd-table-cell px-1.5 py-0.5 text-foreground">
                    {t(e.msgKey)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}