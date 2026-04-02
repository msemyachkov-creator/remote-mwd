import React, { useState } from "react";
import { X, FolderOpen, ArrowUp } from "lucide-react";
import { useI18n, type TranslationKey } from "./i18n";
import { GeomagneticReference } from "./GeomagneticReference";
import { AzimuthDirection } from "./AzimuthDirection";
import { CalculationParameters } from "./CalculationParameters";
import { SurveyAcceptanceCriteria } from "./SurveyAcceptanceCriteria";
import { EnvironmentalParameters } from "./EnvironmentalParameters";

interface CurrentRunSettingsProps {
  onClose?: () => void;
}

type TabId = "geomagnetic" | "azimuth" | "calc" | "criteria" | "env";

export function CurrentRunSettings({ onClose }: CurrentRunSettingsProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabId>("geomagnetic");

  const tabs: { id: TabId; labelKey: TranslationKey }[] = [
    { id: "geomagnetic", labelKey: "run_tab_geomagnetic" },
    { id: "azimuth", labelKey: "run_tab_azimuth_dir" },
    { id: "calc", labelKey: "run_tab_calc_params" },
    { id: "criteria", labelKey: "run_tab_survey_criteria" },
    { id: "env", labelKey: "run_tab_env_params" },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
      {/* Header with title and close button */}
      <div className="h-10 shrink-0 flex items-center justify-between px-4 border-b border-border bg-secondary/30">
        <span
          className="text-foreground"
          style={{
            fontFamily: "var(--font-family-base)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          {t("header_current_run")}
        </span>
        <button
          onClick={onClose}
          className="size-6 flex items-center justify-center rounded hover:bg-secondary transition-colors"
          title="Close"
        >
          <X className="size-4 text-foreground/60" />
        </button>
      </div>

      {/* Main content: sidebar + empty content area */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left sidebar with tabs */}
        <div className="w-44 shrink-0 bg-sidebar border-r border-border flex flex-col">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-left transition-colors border-b border-border ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary"
                  : "text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
              }`}
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "12px",
                fontWeight: "var(--font-weight-normal)",
              }}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-auto bg-background">
            {activeTab === "geomagnetic" ? (
              <GeomagneticReference />
            ) : activeTab === "azimuth" ? (
              <AzimuthDirection />
            ) : activeTab === "calc" ? (
              <CalculationParameters />
            ) : activeTab === "criteria" ? (
              <SurveyAcceptanceCriteria />
            ) : activeTab === "env" ? (
              <EnvironmentalParameters />
            ) : null}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 shrink-0 flex items-center justify-end gap-3 px-4 border-t border-border bg-secondary/20">
        <button
          onClick={onClose}
          className="px-4 h-8 rounded bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors"
          style={{
            fontFamily: "var(--font-family-base)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            borderRadius: "var(--radius)",
          }}
        >
          {t("las_cancel")}
        </button>
        <button
          className="px-4 h-8 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          style={{
            fontFamily: "var(--font-family-base)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            borderRadius: "var(--radius)",
          }}
        >
          {t("las_save")}
        </button>
      </div>
    </div>
  );
}

