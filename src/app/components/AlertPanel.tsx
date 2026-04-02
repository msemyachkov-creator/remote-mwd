import React, { useState } from "react";
import { XCircle, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";
import { useI18n, type TranslationKey } from "./i18n";

const alertKeys: { type: "error" | "warning"; key: TranslationKey }[] = [
  { type: "error", key: "alert_surface_disconnected" },
  { type: "error", key: "alert_telesystem_not_configured" },
  { type: "warning", key: "alert_decoder_config_file" },
  { type: "warning", key: "alert_decoder_script_imported" },
];

export function AlertPanel() {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(true);

  const errorCount = alertKeys.filter((a) => a.type === "error").length;
  const warnCount = alertKeys.filter((a) => a.type === "warning").length;

  return (
    <div className="border-b border-border bg-card/50">
      <div className="flex items-center gap-2 px-3 py-1">
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <span className="mwd-header flex items-center gap-1 text-destructive">
              <XCircle className="size-3.5" />
              {errorCount}
            </span>
          )}
          {warnCount > 0 && (
            <span className="mwd-header flex items-center gap-1 text-chart-3">
              <AlertTriangle className="size-3.5" />
              {warnCount}
            </span>
          )}
          <span className="mwd-cell text-muted-foreground">
            {t("alert_verification")}
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="mwd-cell">
            {collapsed ? t("alert_expand") : t("alert_collapse")}
          </span>
          {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
        </button>
      </div>
      {!collapsed && (
        <div className="px-3 pb-1.5 space-y-0.5">
          {alertKeys.map((alert, idx) => (
            <div key={idx} className="flex items-center gap-2 py-0.5">
              {alert.type === "error" ? (
                <XCircle className="size-3.5 text-destructive shrink-0" />
              ) : (
                <AlertTriangle className="size-3.5 text-chart-3 shrink-0" />
              )}
              <span
                className={`mwd-cell ${alert.type === "error" ? "text-destructive" : "text-chart-3"}`}
              >
                {t(alert.key)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
