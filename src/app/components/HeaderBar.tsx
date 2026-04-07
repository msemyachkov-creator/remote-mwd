import React, { useState, useRef, useEffect } from "react";
import { WifiOff, ChevronDown, FolderOpen, MessageSquare, ArrowDown, FileText } from "lucide-react";
import { useI18n, type Lang } from "./i18n";
import { useWell } from "./WellContext";

const jobs = [
  { id: "job2", ru: "Job2 — Тест", en: "Job2 — Test" },
  { id: "job3", ru: "Job3 — Бурение", en: "Job3 — Drilling" },
  { id: "job4", ru: "Job4 — Промывка", en: "Job4 — Flushing" },
];

interface HeaderBarProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  activePage?: string;
  onPageChange?: (id: string) => void;
  onMakeReport?: () => void;
}

export function HeaderBar({ lang, onLangChange, activePage, onPageChange, onMakeReport }: HeaderBarProps) {
  const { t } = useI18n();
  const { activeWell } = useWell();
  const [ribbonCollapsed, setRibbonCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState("job2");
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const topTabs: { id: string; label: string }[] = [];

  const navItems = [
    { id: "summary", label: t("sidebar_summary") },
    { id: "config", label: t("sidebar_config") },
    { id: "memory", label: t("sidebar_memory") },
    { id: "decoder", label: t("sidebar_decoder") },
    { id: "data", label: t("sidebar_data") },
    { id: "depth", label: t("sidebar_depth") },
    { id: "components", label: t("sidebar_composites") },
    { id: "report", label: "Report" },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setJobDropdownOpen(false);
      }
    }
    if (jobDropdownOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [jobDropdownOpen]);

  const getJobLabel = (job: typeof jobs[number]) => {
    if ("label" in job && job.label) return job.label;
    return (job as any)[lang] || job.id;
  };

  const currentJob = jobs.find((j) => j.id === activeJob) || jobs[0];

  return (
    <div className="flex flex-col" style={{ boxShadow: "var(--elevation-sm)" }}>
      {/* ─── Ribbon row ─── */}
      {!ribbonCollapsed && (
        <div
          className="flex items-center bg-card border-b border-border ribbon-scroll"
          style={{ minHeight: 40 }}
        >
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">{t("header_surface_unit")}</span>
            <div className="flex items-center gap-1">
              <WifiOff className="size-2.5 text-destructive" />
              <span className="mwd-ribbon-value text-destructive">{t("header_disconnected")}</span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">{t("header_azimuth")}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value text-foreground tabular-nums">{activeWell.azm.toFixed(2)}</span>
              <span className="mwd-metric-unit text-muted-foreground">°</span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">INC</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value text-foreground tabular-nums">{activeWell.inc.toFixed(2)}</span>
              <span className="mwd-metric-unit text-muted-foreground">°</span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">TEMP</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value text-foreground tabular-nums">{activeWell.temp.toFixed(1)}</span>
              <span className="mwd-metric-unit text-muted-foreground">°C</span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">RAC</span>
            <span
              className="mwd-ribbon-value"
              style={{ color: activeWell.status === "active" ? "var(--accent)" : "var(--muted-foreground)" }}
            >
              {activeWell.status === "active" ? "Rotating" : "In Slips"}
            </span>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">DRLP</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value tabular-nums" style={{ color: "var(--chart-2)" }}>{activeWell.pressure.toLocaleString()}</span>
              <span className="mwd-metric-unit" style={{ color: "var(--chart-2)", opacity: 0.6 }}>psi</span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">ANNP</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value tabular-nums" style={{ color: "var(--chart-2)" }}>
                {Math.round(activeWell.pressure * 0.62 + activeWell.seed % 80).toLocaleString()}
              </span>
              <span className="mwd-metric-unit" style={{ color: "var(--chart-2)", opacity: 0.6 }}>psi</span>
            </div>
          </Cell>
          <Cell highlight>
            <span className="mwd-ribbon-label text-foreground/70">{t("header_decoder")}</span>
            <span className="mwd-ribbon-value" style={{ color: "var(--accent)" }}>{t("header_enabled")}</span>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">{t("header_recording")}</span>
            <span className="mwd-ribbon-value" style={{ color: "var(--destructive)" }}>{t("header_off")}</span>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">{t("header_pulse_mode")}</span>
            <span className="mwd-ribbon-value" style={{ color: "var(--accent)" }}>{t("header_auto")}</span>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">VIB</span>
            <div className="flex items-baseline gap-0.5">
              <span
                className="mwd-ribbon-value tabular-nums"
                style={{
                  color: (activeWell.seed % 30) > 20
                    ? "var(--destructive)"
                    : (activeWell.seed % 30) > 10
                      ? "#eab308"
                      : "var(--chart-2)",
                }}
              >
                {activeWell.seed % 30}
              </span>
              <span
                className="mwd-metric-unit"
                style={{
                  color: (activeWell.seed % 30) > 20
                    ? "var(--destructive)"
                    : (activeWell.seed % 30) > 10
                      ? "#eab308"
                      : "var(--chart-2)",
                  opacity: 0.7,
                }}
              >
                g
              </span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">TEMP</span>
            <div className="flex items-baseline gap-0.5">
              <span
                className="mwd-ribbon-value tabular-nums"
                style={{
                  color: activeWell.temp > 130
                    ? "var(--destructive)"
                    : activeWell.temp > 100
                      ? "#eab308"
                      : "var(--chart-2)",
                }}
              >
                {activeWell.temp.toFixed(1)}
              </span>
              <span
                className="mwd-metric-unit"
                style={{
                  color: activeWell.temp > 130
                    ? "var(--destructive)"
                    : activeWell.temp > 100
                      ? "#eab308"
                      : "var(--chart-2)",
                  opacity: 0.7,
                }}
              >
                °C
              </span>
            </div>
          </Cell>

          {/* Depth values */}
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">HOLE DEPTH</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value text-foreground tabular-nums">{activeWell.holeDepth.toLocaleString()}</span>
              <span className="mwd-metric-unit text-muted-foreground">{activeWell.unit}</span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">BIT DEPTH</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value text-foreground tabular-nums">{activeWell.bitDepth.toLocaleString()}</span>
              <span className="mwd-metric-unit text-muted-foreground">{activeWell.unit}</span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">KELLY DOWN</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value text-foreground tabular-nums">{(activeWell.holeDepth - activeWell.bitDepth).toLocaleString()}</span>
              <span className="mwd-metric-unit text-muted-foreground">{activeWell.unit}</span>
            </div>
          </Cell>
          <Cell>
            <span className="mwd-ribbon-label text-foreground/70">BPOS</span>
            <div className="flex items-baseline gap-0.5">
              <span className="mwd-ribbon-value text-foreground tabular-nums">{(activeWell.holeDepth - activeWell.bitDepth + 12).toLocaleString()}</span>
              <span className="mwd-metric-unit text-muted-foreground">{activeWell.unit}</span>
            </div>
          </Cell>

          <div className="flex-1 min-w-1" />
        </div>
      )}

      {/* Collapsed: expand button */}
      {ribbonCollapsed && (
        <button
          onClick={() => setRibbonCollapsed(false)}
          className="flex items-center justify-end gap-1 h-[16px] px-2 bg-card border-b border-border cursor-pointer hover:bg-secondary/30 transition-colors"
        >
          <span className="mwd-metric-unit text-muted-foreground">
            {t("header_expand")}
          </span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      )}

      {/* ─── Nav bar: Navigation items on left, top tabs on right ─── */}
      <div className="flex items-center h-[40px] bg-background border-b border-border px-2 py-2">
        {/* Left: Navigation items */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange?.(item.id)}
            className={`mwd-btn relative flex items-center px-2.5 h-[24px] rounded transition-colors mr-1 ${
              activePage === item.id
                ? "text-primary bg-primary/10"
                : item.id === "summary"
                  ? "text-primary/70 border border-primary/30 hover:border-primary/50 hover:text-primary"
                  : "text-foreground bg-secondary/50 hover:bg-secondary hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Make a Report button */}
        <button
          onClick={onMakeReport}
          className="flex items-center gap-1.5 px-2.5 h-[24px] rounded transition-colors shrink-0 mr-1 bg-primary text-primary-foreground hover:bg-primary/90"
          style={{ fontSize: "11px", fontWeight: 600 }}
        >
          <FileText className="size-3" />
          Make a Report
        </button>

        {/* Divider before Work */}
        <div className="w-px h-[14px] bg-border shrink-0 mx-1" />

        {/* Top tabs */}
        {topTabs.map((tab) => (
          <button
            key={tab.id}
            className="mwd-btn relative flex items-center px-2.5 h-full transition-colors text-foreground/60 hover:text-foreground"
            onClick={() => onPageChange?.(tab.id)}
          >
            {tab.label}
          </button>
        ))}

        {/* Language toggle — RU / ENG — TEMPORARILY HIDDEN */}
        <div className="hidden flex items-center shrink-0 mr-1">
          <button
            onClick={() => onLangChange(lang === "ru" ? "en" : "ru")}
            className="mwd-btn-active px-1.5 py-0.5 text-white hover:text-white/80 transition-colors"
          >
            {lang === "ru" ? "RU" : "ENG"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Cell ─── */
function Cell({
  children,
  borderColor,
  highlight,
  last,
}: {
  children: React.ReactNode;
  borderColor?: string;
  highlight?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className="flex flex-col justify-center px-2 py-0.5 shrink-0"
      style={{
        borderRight: last ? "none" : "1px solid var(--border)",
        borderLeft: borderColor ? `2px solid ${borderColor}` : undefined,
        background: highlight ? "rgba(255, 219, 29, 0.06)" : undefined,
      }}
    >
      {children}
    </div>
  );
}