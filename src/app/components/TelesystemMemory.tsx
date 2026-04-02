import React, { useState } from "react";
import { Settings, ExternalLink, Check, AlertTriangle, Download, History, Trash2, CornerUpRight, Share, ChevronDown } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useI18n } from "./i18n";

interface ModuleData {
  id: string;
  name: string;
  source: string;
  version: string;
  referenceNum: string;
  startTime: string;
  endTime: string;
  size: string;
  progress: number;
  status: "active" | "idle" | "error";
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export function TelesystemMemory() {
  const { t, lang } = useI18n();
  const [hideModulesWithoutData, setHideModulesWithoutData] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [verificationExpanded, setVerificationExpanded] = useState(true);

  // Mock data for modules
  const modules: ModuleData[] = [
    {
      id: "mp",
      name: "MP",
      source: "",
      version: "PW.46 v1.25.1",
      referenceNum: "1",
      startTime: "30-06-2021 13:38:47",
      endTime: "25-11-2025 13:10:36",
      size: lang === "ru" ? "0 МБ" : "0 MB",
      progress: 0,
      status: "active",
    },
    {
      id: "mgk",
      name: "MGK",
      source: "",
      version: "PW22 v1.25.3",
      referenceNum: "2",
      startTime: "30-06-2021 13:38:47",
      endTime: "25-11-2025 13:10:36",
      size: lang === "ru" ? "0.5 МБ" : "0.5 MB",
      progress: 0,
      status: "active",
    },
    {
      id: "mi",
      name: "MI",
      source: "",
      version: "PW.42 v1.25.2",
      referenceNum: "3",
      startTime: "30-06-2021 13:38:38",
      endTime: "25-11-2025 13:09:38",
      size: lang === "ru" ? "2.4 МБ" : "2.4 MB",
      progress: 0,
      status: "active",
    },
  ];

  // Mock data for log entries
  const logEntries: LogEntry[] = lang === "ru" ? [
    { id: "1", timestamp: "25-11-2025 13:16:17", message: "Подтверждено: скачано и сохранено" },
    { id: "2", timestamp: "25-11-2025 13:16:32", message: "Посылаем команду передаем настройству RS-485" },
    { id: "3", timestamp: "25-11-2025 13:17:22", message: "Посылаем команду операция настройства RS-485" },
    { id: "4", timestamp: "25-11-2025 13:18:17", message: "Посылаем команду операция настройства RS-485" },
  ] : [
    { id: "1", timestamp: "25-11-2025 13:16:17", message: "Confirmed: downloaded and saved" },
    { id: "2", timestamp: "25-11-2025 13:16:32", message: "Sending command: transmit RS-485 settings" },
    { id: "3", timestamp: "25-11-2025 13:17:22", message: "Sending command: RS-485 configuration operation" },
    { id: "4", timestamp: "25-11-2025 13:18:17", message: "Sending command: RS-485 configuration operation" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full space-y-4">
          {/* Ground Unit Block */}
          <div className="border border-border rounded-md bg-background overflow-hidden flex flex-col shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card/50 shrink-0">
              <span className="mwd-title text-muted-foreground">{t("mem_ground_unit")}</span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="mwd-cell text-muted-foreground w-[140px]">{t("mem_assignment")}</span>
                <span className="mwd-cell text-chart-2">{t("mem_connected")}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="mwd-cell text-muted-foreground w-[140px]">{t("mem_firmware_version")}</span>
                <span className="mwd-cell text-chart-2">FW-23 v1.33</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="mwd-cell text-muted-foreground w-[140px]">{t("mem_status")}</span>
                <span className="mwd-cell text-chart-2">OK</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="mwd-cell text-muted-foreground w-[140px]">{t("mem_state")}</span>
                <span className="mwd-cell text-foreground">{t("mem_polling")}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="mwd-cell text-muted-foreground w-[140px]">{t("mem_link")}</span>
                <span className="mwd-cell text-foreground">{t("mem_not_connected")}</span>
              </div>
            </div>
          </div>

          {/* Combined Widget: Battery Reserve + Verification + Modules Table */}
          <div className="border border-border rounded bg-card overflow-hidden p-4 space-y-3">
            {/* Battery Reserve */}
            <div className="border border-border rounded bg-background overflow-hidden">
              <div className="border-b border-border px-4 py-2.5 bg-muted/30">
                <h3 className="text-sm font-medium text-foreground">{t("mem_battery_reserve")}</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <span className="text-muted-foreground">{t("mem_battery")} №1:</span>
                      <span className="text-foreground">0.9 %</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-muted-foreground">{t("mem_battery")} №2:</span>
                      <span className="text-foreground">5.4 %</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-muted-foreground">{t("mem_battery")} №3:</span>
                      <span className="text-foreground">2.5 %</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <span className="text-muted-foreground w-[180px]">{t("mem_time_diff")}</span>
                      <span className="text-foreground">1</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-muted-foreground w-[180px]">{t("mem_circulation")}</span>
                      <span className="text-foreground">1.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="border border-border rounded bg-background overflow-hidden">
              <button 
                className="w-full border-b border-border px-4 py-2.5 bg-muted/30 flex items-center gap-2 hover:bg-muted/40 transition-colors"
                onClick={() => setVerificationExpanded(!verificationExpanded)}
              >
                <h3 className="text-sm font-medium text-foreground">{t("mem_verification")}</h3>
                <ChevronDown 
                  className={`size-4 text-muted-foreground transition-transform ${verificationExpanded ? '' : '-rotate-90'}`}
                />
              </button>
              {verificationExpanded && (
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-4 text-[#d4a017] shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <span className="text-xs text-destructive">{t("mem_telesystem_sleep")}</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="size-4 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{t("mem_find_modules_completed")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modules Table */}
            <div className="border border-border rounded bg-background overflow-hidden">
              <div className="border-b border-border px-4 py-2.5 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hide-modules"
                    checked={hideModulesWithoutData}
                    onCheckedChange={(checked) => setHideModulesWithoutData(checked === true)}
                  />
                  <label htmlFor="hide-modules" className="text-xs text-foreground cursor-pointer">
                    {t("mem_hide_modules")}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 bg-primary" />
                  <span className="text-xs text-foreground">
                    DEPTH: 12-03-2026 — 20:43:54 — 2-03-2026 — 21:48:24
                  </span>
                  <div className="size-3 bg-accent ml-4" />
                  <span className="text-xs text-foreground">Memory</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_module")}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_source")}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_version")}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_serial_number")}</th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground" style={{ minWidth: 200 }}>
                        {t("mem_time")}
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_start_time")}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_end_time")}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_size")}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_completed")}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_time_shift")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty separator row with time slider */}
                    <tr className="border-b border-border">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">- 1 hour</span>
                          <div className="flex-1 h-6 bg-muted rounded overflow-hidden relative" style={{ minWidth: 120 }}>
                            <div className="absolute inset-0 bg-primary/60" style={{ width: "75%" }} />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">+ 1 hour</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                    </tr>
                    {modules.map((module) => (
                      <tr key={module.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`size-2 rounded-full ${module.status === "active" ? "bg-accent" : "bg-muted-foreground"}`} />
                            <span className="text-foreground font-medium">{module.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{module.source || "—"}</td>
                        <td className="px-4 py-3 text-accent">{module.version}</td>
                        <td className="px-4 py-3 text-muted-foreground">{module.referenceNum || "—"}</td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-foreground text-xs whitespace-nowrap">{module.startTime}</td>
                        <td className="px-4 py-3 text-foreground text-xs whitespace-nowrap">{module.endTime}</td>
                        <td className="px-4 py-3 text-foreground">{module.size}</td>
                        <td className="px-4 py-3 text-foreground">{module.progress} %</td>
                        <td className="px-4 py-3 text-muted-foreground">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div className="border border-border rounded bg-card overflow-hidden">
            <div className="border-b border-border px-4 py-2.5 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                  {t("filter_filters")}
                </button>
                <button className="p-1.5 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                  <ExternalLink className="size-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="auto-scroll"
                    checked={autoScroll}
                    onCheckedChange={(checked) => setAutoScroll(checked === true)}
                  />
                  <label htmlFor="auto-scroll" className="text-xs text-foreground cursor-pointer">
                    {t("mem_auto_scroll")}
                  </label>
                </div>
                <button className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                  {t("mem_clear")}
                </button>
                <button className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                  {t("mem_download")}
                </button>
                <span className="text-xs text-muted-foreground">
                  {t("mem_history")}
                </span>
                <select className="px-2 py-1 text-xs bg-background border border-border rounded text-foreground">
                  <option>1000</option>
                  <option>500</option>
                  <option>100</option>
                </select>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground" style={{ width: "200px" }}>{t("mem_date_time")}</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("mem_message")}</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {logEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{entry.timestamp}</td>
                      <td className="px-4 py-3 text-foreground">{entry.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}