import React, { useState, useMemo } from "react";
import { useI18n } from "./i18n";
import { useWell } from "./WellContext";
import { Calendar, Settings, ChevronDown, ChevronUp } from "lucide-react";

export function DepthView() {
  const { t } = useI18n();
  const { activeWell } = useWell();
  const [activeMenuItem, setActiveMenuItem] = useState<string>("correct_nizabur");
  const [isInstructionCollapsed, setIsInstructionCollapsed] = useState<boolean>(false);

  const menuItems = [
    { id: "correct_nizabur", label: t("depth_correct_nizabur") },
    { id: "shift_bit_hole", label: t("depth_shift_bit_hole") },
    { id: "stretch_bit", label: t("depth_stretch_bit") },
    { id: "new_record", label: t("depth_new_record") },
    { id: "import_depth", label: t("depth_import_depth") },
  ];

  // Mock data for history table - unique for each well
  const historyData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      datetime: `12-06-2025 14:${(53 - i).toString().padStart(2, '0')}:56:080`,
      depthBit: (activeWell.bitDepth - i * 0.1).toFixed(2),
      depthHole: (activeWell.holeDepth - i * 0.1).toFixed(2),
      corrDepthHole: (activeWell.holeDepth - i * 0.1).toFixed(2)
    }));
  }, [activeWell]);

  return (
    <div className="flex h-full w-full gap-1.5 p-1.5 bg-background overflow-hidden">
      {/* Left panel - Menu items */}
      <div className="flex flex-col w-[160px] shrink-0">
        <div className="bg-card border border-border rounded overflow-hidden">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenuItem(item.id)}
              className={`w-full px-3 py-2 text-center transition-colors border-b border-border last:border-b-0 ${
                activeMenuItem === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Middle panel - Main content */}
      <div className="flex flex-col flex-1 min-w-0 gap-1.5">
        {/* Block 1: Collapsible instruction */}
        <div className="bg-card border border-border rounded overflow-hidden">
          <button
            onClick={() => setIsInstructionCollapsed(!isInstructionCollapsed)}
            className="w-full px-3 py-1.5 border-b border-border bg-card/50 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <span className="mwd-cell text-foreground">{t("depth_correct_nizabur")}</span>
            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <span className="mwd-cell">
                {isInstructionCollapsed ? t("alert_expand") : t("alert_collapse")}
              </span>
              {isInstructionCollapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
            </div>
          </button>

          {!isInstructionCollapsed && (
            <div className="p-3 space-y-2">
              <p className="mwd-cell text-foreground text-sm">
                {t("depth_instruction_1")}
              </p>
              <p className="mwd-cell text-foreground text-sm">
                {t("depth_instruction_2")}
              </p>
              <p className="mwd-cell text-foreground text-sm">
                {t("depth_instruction_3")}
              </p>
              <p className="mwd-cell text-foreground text-sm">
                {t("depth_instruction_4")}
              </p>
              <p className="mwd-cell text-foreground text-sm">
                {t("depth_instruction_5")}
              </p>
              
              <ol className="list-decimal ml-5 space-y-1 mt-3">
                <li className="mwd-cell text-foreground text-sm">
                  {t("depth_instruction_steps")}
                </li>
                <li className="mwd-cell text-foreground text-sm">
                  {t("depth_instruction_step1")}
                  <ul className="list-disc ml-5 mt-1">
                    <li className="mwd-cell text-foreground text-sm">{t("depth_instruction_step2")}</li>
                    <li className="mwd-cell text-foreground text-sm">{t("depth_instruction_step3")}</li>
                  </ul>
                </li>
                <li className="mwd-cell text-foreground text-sm">
                  {t("depth_instruction_step4")}
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Block 2: Action form */}
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="p-3 space-y-2">
            {/* Action dropdown */}
            <div className="flex items-center gap-2">
              <label className="mwd-cell text-foreground w-32 shrink-0">{t("depth_action")}</label>
              <select 
                className="flex-1 px-2 py-1 pr-8 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
                style={{ 
                  fontFamily: "var(--font-family-base)",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E\")"
                }}
              >
                <option>{t("depth_trip")}1</option>
                <option>{t("depth_trip")}2</option>
                <option>{t("depth_trip")}3</option>
              </select>
            </div>

            {/* Start time */}
            <div className="flex items-center gap-2">
              <label className="mwd-cell text-foreground w-32 shrink-0">{t("depth_start_time")}</label>
              <input
                type="text"
                className="flex-1 px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue=""
                style={{ fontFamily: "var(--font-family-base)" }}
              />
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors">
                <Calendar className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* End time */}
            <div className="flex items-center gap-2">
              <label className="mwd-cell text-foreground w-32 shrink-0">{t("depth_end_time")}</label>
              <input
                type="text"
                className="flex-1 px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue=""
                style={{ fontFamily: "var(--font-family-base)" }}
              />
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors">
                <Calendar className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Shift */}
            <div className="flex items-center gap-2">
              <label className="mwd-cell text-foreground w-32 shrink-0">{t("depth_shift")}</label>
              <input
                type="text"
                className="flex-1 px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue=""
                style={{ fontFamily: "var(--font-family-base)" }}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <div className="w-32 shrink-0"></div>
              <div className="flex-1 flex gap-2">
                <button className="flex-1 px-4 py-1.5 bg-muted border border-border rounded hover:bg-muted/80 transition-colors mwd-btn text-foreground">
                  {t("depth_apply_correction")}
                </button>
                <button className="flex-1 px-4 py-1.5 bg-muted border border-border rounded hover:bg-muted/80 transition-colors mwd-btn text-foreground">
                  {t("depth_return_to")}
                </button>
              </div>
            </div>

            {/* Snapshot field */}
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center gap-2">
                <label className="mwd-cell text-foreground w-32 shrink-0">{t("depth_snapshot")}</label>
                <input
                  type="text"
                  className="flex-1 px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  defaultValue={t("depth_current")}
                  style={{ fontFamily: "var(--font-family-base)" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 shrink-0"></div>
                <button className="flex-1 px-3 py-1 bg-muted border border-border rounded hover:bg-muted/80 transition-colors mwd-btn text-foreground text-sm">
                  {t("depth_view_history")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Block 3: History table */}
        <div className="bg-card border border-border rounded overflow-hidden flex-1 min-h-0 flex flex-col">
          {/* Filter buttons */}
          <div className="px-3 py-2 border-b border-border bg-card/50 flex items-center gap-2">
            <span className="mwd-cell text-foreground text-sm">{t("filter_filters")}:</span>
            <button className="px-2 py-0.5 border border-border rounded hover:bg-secondary transition-colors mwd-cell text-foreground text-sm">
              {t("depth_filter_b")}
            </button>
            <button className="px-2 py-0.5 border border-border rounded hover:bg-secondary transition-colors mwd-cell text-foreground text-sm">
              {t("depth_filter_s")}
            </button>
            <button className="px-2 py-0.5 border border-border rounded hover:bg-secondary transition-colors mwd-cell text-foreground text-sm">
              {t("depth_filter_r")}
            </button>
            <button className="px-2 py-0.5 border border-border rounded hover:bg-secondary transition-colors mwd-cell text-foreground text-sm">
              {t("depth_filter_e")}
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-table-header-bg border-b border-border">
                <tr>
                  <th className="px-2 py-1.5 text-left mwd-cell text-foreground text-sm border-r border-border">&lt;&gt;</th>
                  <th className="px-2 py-1.5 text-left mwd-cell text-foreground text-sm border-r border-border">{t("depth_time")}</th>
                  <th className="px-2 py-1.5 text-left mwd-cell text-foreground text-sm border-r border-border">{t("depth_bit_depth")}</th>
                  <th className="px-2 py-1.5 text-left mwd-cell text-foreground text-sm border-r border-border">{t("depth_hole_depth")}</th>
                  <th className="px-2 py-1.5 text-left mwd-cell text-foreground text-sm border-r border-border">{t("depth_correction_bit")}</th>
                  <th className="px-2 py-1.5 text-left mwd-cell text-foreground text-sm">{t("depth_correction_hole")}</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border"></td>
                    <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">{row.datetime}</td>
                    <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">{row.depthBit}</td>
                    <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">{row.depthHole}</td>
                    <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">{row.depthBit}</td>
                    <td className="px-2 py-1 mwd-table-cell text-foreground">{row.corrDepthHole}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right panel - Chart */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="bg-card border border-border rounded overflow-hidden h-full flex flex-col">
          <div className="px-3 py-2 border-b border-border bg-card/50 flex items-center gap-2">
            <span className="mwd-cell text-foreground">{t("depth_scale")}</span>
            <select className="px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option>3 {t("depth_min")}</option>
              <option>5 {t("depth_min")}</option>
              <option>15 {t("depth_min")}</option>
              <option>30 {t("depth_min")}</option>
            </select>
            
            {/* History icon - circular arrow with dot in center */}
            <button className="p-1.5 border border-border rounded hover:bg-secondary transition-colors" title={t("depth_history_tooltip")}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C11.2091 15 13.1379 13.829 14.1304 12.087" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M15 15L15 12L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
              </svg>
            </button>
            
            {/* Navigation arrows */}
            <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">◀</button>
            <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">▶</button>
            
            {/* Record button with extra spacing */}
            <button className="px-3 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground ml-4">
              {t("depth_recording")}
            </button>
            
            <div className="flex gap-1 ml-4">
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">C</button>
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">Z</button>
            </div>

            <div className="flex gap-1 ml-4">
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">B</button>
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">S</button>
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">R</button>
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">Rem</button>
            </div>

            <div className="flex gap-1 ml-6">
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">HDEPTH</button>
              <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors mwd-btn text-foreground">TDF</button>
            </div>

            <button className="p-1.5 border border-border rounded hover:bg-secondary transition-colors ml-auto" title={t("depth_settings_tooltip")}>
              <Settings className="size-3.5 text-foreground" />
            </button>
          </div>

          {/* Chart area */}
          <div className="flex-1 p-4 relative overflow-hidden">
            <DepthChart />
          </div>

          {/* Bottom timeline */}
          <div className="border-t border-border">
            {/* Colored blocks */}
            <div className="h-6 flex px-4">
              <div className="flex-[1.75] bg-destructive/80 flex items-center justify-center">
                <span className="mwd-tiny text-destructive-foreground">Off bottom</span>
              </div>
              <div className="flex-[0.5] bg-accent/80 flex items-center justify-center">
                <span className="mwd-tiny text-white">On</span>
              </div>
              <div className="flex-[3.5] bg-destructive/80 flex items-center justify-center">
                <span className="mwd-tiny text-destructive-foreground">Off bottom</span>
              </div>
              <div className="flex-[1] bg-accent/80 flex items-center justify-center">
                <span className="mwd-tiny text-white">On</span>
              </div>
              <div className="flex-[7] bg-destructive/80 flex items-center justify-center">
                <span className="mwd-tiny text-destructive-foreground">Off bottom</span>
              </div>
              <div className="flex-[1] bg-accent/80 flex items-center justify-center">
                <span className="mwd-tiny text-white">On</span>
              </div>
              <div className="flex-[7] bg-destructive/80 flex items-center justify-center">
                <span className="mwd-tiny text-destructive-foreground">Off bottom</span>
              </div>
            </div>
            {/* Dates below */}
            <div className="h-8 flex px-4 border-t border-border">
              {/* Spacer for first Off bottom */}
              <div className="flex-[1.75]"></div>
              {/* Date under first On */}
              <div className="flex-[0.5] flex items-center">
                <span className="text-muted-foreground mwd-tiny whitespace-nowrap">14:18:00 12-06-2025</span>
              </div>
              {/* Spacer for second Off bottom */}
              <div className="flex-[3.5]"></div>
              {/* Date under second On */}
              <div className="flex-[1] flex items-center">
                <span className="text-muted-foreground mwd-tiny whitespace-nowrap">14:22:00 12-06-2025</span>
              </div>
              {/* Spacer for third Off bottom */}
              <div className="flex-[7]"></div>
              {/* Date under third On */}
              <div className="flex-[1] flex items-center">
                <span className="text-muted-foreground mwd-tiny whitespace-nowrap">14:28:00 12-06-2025</span>
              </div>
              {/* Spacer for last Off bottom */}
              <div className="flex-[7]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple chart component
function DepthChart() {
  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="300" fill="url(#grid)" />
        
        {/* Horizontal grid lines */}
        {[50, 110, 170, 230, 290].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="600"
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
        ))}

        {/* Chart line - cyan color, horizontal during "Off bottom", drops during "On" */}
        {/* Timeline proportions: 1.75 + 0.5 + 3.5 + 1 + 7 + 1 + 7 = 20.75 total */}
        {/* Segments: Off(1.75) On(0.5) Off(3.5) On(1) Off(7) On(1) Off(7) */}
        <path
          d="M 0 100 L 50.6 100 L 65.06 200 L 166.27 200 L 195.18 250 L 397.59 250 L 426.51 280 L 600 280"
          fill="none"
          stroke="rgba(32, 158, 248, 1)"
          strokeWidth="2"
        />

        {/* Green chart line - parallel below blue during "Off bottom", jumps up during "On" */}
        <path
          d="M 0 110 L 50.6 110 L 57.83 50 L 65.06 210 L 166.27 210 L 180.73 150 L 195.18 240 L 397.59 240 L 412.05 200 L 426.51 270 L 600 270"
          fill="none"
          stroke="rgba(34, 197, 94, 1)"
          strokeWidth="2"
        />
      </svg>

      {/* Y-axis labels - HTML overlay to prevent stretching */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Background for Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1e3a52] opacity-85"></div>
        
        <div className="absolute left-1 -translate-y-1/2" style={{ top: '96.67%' }}>
          <span className="text-[12pt] text-[rgba(191,201,212,0.5)]" style={{ fontFamily: 'var(--font-family-base)' }}>13</span>
        </div>
        <div className="absolute left-1 -translate-y-1/2" style={{ top: '76.67%' }}>
          <span className="text-[12pt] text-[rgba(191,201,212,0.5)]" style={{ fontFamily: 'var(--font-family-base)' }}>9</span>
        </div>
        <div className="absolute left-1 -translate-y-1/2" style={{ top: '56.67%' }}>
          <span className="text-[12pt] text-[rgba(191,201,212,0.5)]" style={{ fontFamily: 'var(--font-family-base)' }}>5</span>
        </div>
        <div className="absolute left-1 -translate-y-1/2" style={{ top: '36.67%' }}>
          <span className="text-[12pt] text-[rgba(191,201,212,0.5)]" style={{ fontFamily: 'var(--font-family-base)' }}>1</span>
        </div>
        <div className="absolute left-1 -translate-y-1/2" style={{ top: '16.67%' }}>
          <span className="text-[12pt] text-[rgba(191,201,212,0.5)]" style={{ fontFamily: 'var(--font-family-base)' }}>-3</span>
        </div>
      </div>
    </div>
  );
}