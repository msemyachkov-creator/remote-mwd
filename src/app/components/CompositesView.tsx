import React, { useState } from "react";
import { useI18n } from "./i18n";
import { ChevronDown, ChevronUp, Table } from "lucide-react";

export function CompositesView() {
  const { t } = useI18n();
  const [expandedRuns, setExpandedRuns] = useState<string[]>(["run1"]);
  const [showDataTable, setShowDataTable] = useState(false);

  const toggleRun = (runId: string) => {
    setExpandedRuns((prev) =>
      prev.includes(runId) ? prev.filter((id) => id !== runId) : [...prev, runId]
    );
  };

  const toggleDataTable = () => {
    setShowDataTable((prev) => !prev);
  };

  return (
    <div className="flex h-full w-full gap-1.5 p-1.5 bg-background overflow-hidden">
      {/* Left panel - Settings and tables */}
      <div className="flex flex-col w-[480px] shrink-0 gap-1.5">
        {/* Top section - Composite and Channel selection */}
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <label className="mwd-cell text-foreground shrink-0 w-20">{t("comp_composite")}</label>
              <select 
                className="flex-1 px-2 py-1 pr-8 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
                style={{ 
                  fontFamily: "var(--font-family-base)",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E\")"
                }}
              >
                <option>DrillingComposite</option>
              </select>
              <button className="w-8 h-8 border border-border rounded hover:bg-secondary transition-colors flex items-center justify-center shrink-0">
                <span className="mwd-cell text-foreground">&lt;&gt;</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="mwd-cell text-foreground shrink-0 w-20">{t("comp_channel")}</label>
              <input
                type="text"
                className="flex-1 px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue="BPOS"
                style={{ fontFamily: "var(--font-family-base)" }}
              />
            </div>
          </div>
        </div>

        {/* Composite runs table */}
        <div className="bg-card border border-border rounded overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="px-3 py-2 border-b border-border bg-card/50">
            <h3 className="mwd-cell text-foreground">
              {t("comp_records_of")} 'DrillingComposite'
            </h3>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-table-header-bg border-b border-border">
                <tr>
                  <th className="px-1 py-1.5 text-center mwd-header text-foreground border-r border-border w-10"></th>
                  <th className="px-1 py-1.5 text-center mwd-header text-foreground border-r border-border w-10"></th>
                  <th className="px-2 py-1.5 text-left mwd-header text-foreground border-r border-border">{t("comp_trip")}</th>
                  <th className="px-2 py-1.5 text-left mwd-header text-foreground border-r border-border">{t("comp_record")}</th>
                  <th className="px-2 py-1.5 text-left mwd-header text-foreground border-r border-border">
                    {t("comp_start_depth")}<br />{t("comp_depth_m")}
                  </th>
                  <th className="px-2 py-1.5 text-left mwd-header text-foreground border-r border-border">
                    {t("comp_end_depth")}<br />{t("comp_depth_m")}
                  </th>
                  <th className="px-2 py-1.5 text-left mwd-header text-foreground">{t("comp_in")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-1 py-1 border-r border-border">
                    <div className="flex items-center justify-center gap-0.5">
                      <button className="p-0.5 hover:bg-secondary/50 rounded">
                        <div className="w-4 h-4 border border-border bg-muted flex items-center justify-center">
                          <span className="text-[8px] text-foreground">−</span>
                        </div>
                      </button>
                    </div>
                  </td>
                  <td className="px-1 py-1 border-r border-border">
                    <div className="flex flex-col items-center gap-1">
                      <button className="p-0.5 hover:bg-secondary/50 rounded">
                        <span className="text-xs text-foreground">▲</span>
                      </button>
                      <button className="p-0.5 hover:bg-secondary/50 rounded">
                        <span className="text-xs text-foreground">▼</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border bg-[#4a7ba7]">{t("comp_trip")}1</td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">{t("comp_drilling")}</td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">0.00</td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">96.60</td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground">05-09</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-1 py-1 border-r border-border">
                    <div className="flex items-center justify-center gap-0.5">
                      <button className="p-0.5 hover:bg-secondary/50 rounded">
                        <div className="w-4 h-4 border border-border bg-muted flex items-center justify-center">
                          <span className="text-[8px] text-foreground">−</span>
                        </div>
                      </button>
                    </div>
                  </td>
                  <td className="px-1 py-1 border-r border-border">
                    <div className="flex flex-col items-center gap-1">
                      <button className="p-0.5 hover:bg-secondary/50 rounded">
                        <span className="text-xs text-foreground">▲</span>
                      </button>
                      <button className="p-0.5 hover:bg-secondary/50 rounded">
                        <span className="text-xs text-foreground">▼</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">{t("comp_trip")}2</td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">{t("comp_drilling")}</td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">100.00</td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground border-r border-border">143.33</td>
                  <td className="px-2 py-1 mwd-table-cell text-foreground">15-09</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-border flex justify-start">
            <button className="w-5 h-5 border border-border rounded hover:bg-secondary transition-colors flex items-center justify-center">
              <span className="text-xs text-foreground">+</span>
            </button>
          </div>
        </div>

        {/* Edit intervals section */}
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-card/50">
            <h3 className="mwd-cell text-foreground">
              {t("comp_edit_intervals")} '{t("comp_trip")}1 : {t("comp_drilling")}'
            </h3>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-table-header-bg border-b border-border">
                <tr>
                  <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border w-16">{t("comp_number")}</th>
                  <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border">
                    {t("comp_start_depth")}<br />{t("comp_depth_m")}
                  </th>
                  <th className="px-3 py-2 text-left mwd-header text-foreground">
                    {t("comp_end_depth")}<br />{t("comp_depth_m")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border text-center">0</td>
                  <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border">0.00</td>
                  <td className="px-3 py-1.5 mwd-cell text-foreground">96.60</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-border flex justify-start">
            <button className="w-5 h-5 border border-border rounded hover:bg-secondary transition-colors flex items-center justify-center">
              <span className="text-xs text-foreground">+</span>
            </button>
          </div>
        </div>

        {/* Final intervals section */}
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-card/50">
            <h3 className="mwd-cell text-foreground">
              {t("comp_final_intervals")}
            </h3>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-table-header-bg border-b border-border">
                <tr>
                  <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border">{t("comp_trip")}</th>
                  <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border">{t("comp_record")}</th>
                  <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border">
                    {t("comp_start_depth")}<br />{t("comp_depth_m")}
                  </th>
                  <th className="px-3 py-2 text-left mwd-header text-foreground">
                    {t("comp_end_depth")}<br />{t("comp_depth_m")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border">{t("comp_trip")}1</td>
                  <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border">{t("comp_drilling")}</td>
                  <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border">0.00</td>
                  <td className="px-3 py-1.5 mwd-cell text-foreground">96.60</td>
                </tr>
                <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border">{t("comp_trip")}2</td>
                  <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border">{t("comp_drilling")}</td>
                  <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border">100.00</td>
                  <td className="px-3 py-1.5 mwd-cell text-foreground">143.33</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right panel - Depth charts */}
      <div className="flex-1 min-w-0 bg-card border border-border rounded overflow-hidden flex">
        {/* Chart toolbar */}
        <div className="flex flex-col w-full">
          <div className="px-3 py-2 border-b border-border bg-card/50">
            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 64px 1fr 1fr' }}>
              {/* Toolbar for Chart 1 */}
              <div className="flex items-center gap-3">
                <button 
                  className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors flex items-center justify-center"
                  onClick={toggleDataTable}
                  title={t("comp_show_hide_table")}
                >
                  <Table className="w-4 h-4 text-foreground" />
                </button>
                <div className="w-px h-4 bg-border"></div>
                <select 
                  className="px-2 py-1 pr-6 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[length:12px_12px] bg-[right_4px_center] bg-no-repeat hover:bg-secondary transition-colors"
                  style={{ 
                    fontFamily: "var(--font-family-base)",
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M3 5l3 3 3-3z'/%3E%3C/svg%3E\")"
                  }}
                >
                  <option>1:200</option>
                  <option>1:100</option>
                  <option>1:500</option>
                  <option>1:1000</option>
                </select>
                <div className="w-px h-4 bg-border"></div>
                <svg width="16" height="20" viewBox="0 0 16 20" className="shrink-0">
                  <path
                    d="M 4 0 L 4 4 L 12 4 L 12 6 L 6 6 L 6 8 L 10 8 L 10 12 L 4 12 L 4 14 L 12 14 L 12 16 L 6 16 L 6 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinejoin="round"
                    className="text-foreground"
                  />
                </svg>
              </div>

              {/* Empty space for MD scale */}
              <div></div>

              {/* Toolbar for Chart 2 */}
              <div className="flex items-center gap-3">
                <button 
                  className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors flex items-center justify-center"
                  title={t("comp_table")}
                >
                  <Table className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Empty space for Chart 3 */}
              <div></div>
            </div>
          </div>

          {/* Charts container */}
          <div className="flex-1 overflow-hidden p-2">
            <div className="grid gap-2 h-full" style={{ gridTemplateColumns: '1fr 64px 1fr 1fr' }}>
              {/* Chart 1 */}
              <div className="flex-1 border-2 border-border rounded overflow-hidden flex flex-col">
                <div className="px-2 py-1 bg-card/50 border-b border-border flex items-center justify-center">
                  <span className="mwd-cell text-foreground">DrillingComposite</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border flex items-center justify-center mwd-tiny text-muted-foreground">
                  <span>&nbsp;</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border flex items-center justify-center mwd-tiny text-muted-foreground">
                  <span>DrillingComposite:BPOS</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border grid grid-cols-3 items-center mwd-tiny text-muted-foreground">
                  <span className="text-left">0.0</span>
                  <span className="text-center">{t("comp_meter")}</span>
                  <span className="text-right">100.0</span>
                </div>
                <div className="flex-1 relative">
                  <DepthChartColumn 
                    color="green" 
                    startDepth={0} 
                    endDepth={88.8} 
                    highlightStart={50} 
                    highlightEnd={69.4}
                    secondaryHighlightStart={72}
                    secondaryHighlightEnd={130}
                    secondaryColor="blue"
                    showCurve={true}
                  />
                </div>
              </div>

              {/* MD Depth Scale */}
              <div className="w-16 shrink-0 flex flex-col">
                <div className="px-2 py-1 bg-card/50 border-b border-border flex items-center justify-center h-[33px]">
                  <span className="mwd-cell text-foreground font-medium">MD</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border h-[27px]">
                  <span>&nbsp;</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border h-[27px]">
                  <span>&nbsp;</span>
                </div>
                <div className="flex-1 relative">
                  <DepthScale />
                </div>
              </div>

              {/* Chart 2 */}
              <div className="flex-1 border-2 border-border rounded overflow-hidden flex flex-col">
                <div className="px-2 py-1 bg-card/50 border-b border-border flex items-center justify-center">
                  <span className="mwd-cell text-foreground">{t("comp_trip")}1: {t("comp_drilling")}</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border flex items-center justify-center mwd-tiny text-muted-foreground">
                  <span>0.0 - 100.0</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border flex items-center justify-center mwd-tiny text-muted-foreground">
                  <span>{t("comp_trip")}1 - {t("comp_drilling")}: BPOS</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border grid grid-cols-3 items-center mwd-tiny text-muted-foreground">
                  <span className="text-left">0.0</span>
                  <span className="text-center">{t("comp_meter")}</span>
                  <span className="text-right">100.0</span>
                </div>
                <div className="flex-1 relative">
                  <DepthChartColumn 
                    color="green" 
                    startDepth={0} 
                    endDepth={88.8} 
                    highlightStart={50} 
                    highlightEnd={69.4}
                    showCurve={true}
                    clipCurveToHighlight={true}
                  />
                </div>
              </div>

              {/* Chart 3 */}
              <div className="flex-1 border-2 border-border rounded overflow-hidden flex flex-col">
                <div className="px-2 py-1 bg-card/50 border-b border-border flex items-center justify-center">
                  <span className="mwd-cell text-foreground">{t("comp_trip")}2 - {t("comp_drilling")}</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border flex items-center justify-center mwd-tiny text-muted-foreground">
                  <span>100.00 - 143.33</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border flex items-center justify-center mwd-tiny text-muted-foreground">
                  <span>{t("comp_trip")}2 - {t("comp_drilling")}: BPOS</span>
                </div>
                <div className="px-2 py-1 bg-card/30 border-b border-border grid grid-cols-3 items-center mwd-tiny text-muted-foreground">
                  <span className="text-left">0.0</span>
                  <span className="text-center">{t("comp_meter")}</span>
                  <span className="text-right">100.0</span>
                </div>
                <div className="flex-1 relative">
                  <DepthChartColumn 
                    color="cyan" 
                    startDepth={100} 
                    endDepth={143.33} 
                    highlightStart={100} 
                    highlightEnd={143.33}
                    showCurve={true}
                    clipCurveToSecondary={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Depth chart column component
function DepthChartColumn({
  color,
  startDepth,
  endDepth,
  highlightStart,
  highlightEnd,
  secondaryHighlightStart,
  secondaryHighlightEnd,
  secondaryColor,
  showCurve = false,
  clipCurveToHighlight = false,
  clipCurveToSecondary = false,
}: {
  color: "green" | "cyan";
  startDepth: number;
  endDepth: number;
  highlightStart: number;
  highlightEnd: number;
  secondaryHighlightStart?: number;
  secondaryHighlightEnd?: number;
  secondaryColor?: "blue";
  showCurve?: boolean;
  clipCurveToHighlight?: boolean;
  clipCurveToSecondary?: boolean;
}) {
  const fillColor = color === "green" ? "rgba(37, 189, 89, 0.3)" : "rgba(32, 158, 248, 0.3)";
  
  // Calculate total range for scaling
  const minDepth = 50;
  const maxDepth = 130;
  const range = maxDepth - minDepth;
  
  // Convert depths to percentages
  const highlightStartPercent = ((highlightStart - minDepth) / range) * 100;
  const highlightEndPercent = ((highlightEnd - minDepth) / range) * 100;

  // Generate curve path data - vertical curve that doesn't exceed 10% width
  const generateCurvePath = () => {
    const points: string[] = [];
    const numPoints = 40;
    
    for (let i = 0; i <= numPoints; i++) {
      const y = (i / numPoints) * 400;
      // Create sharp peaks - starts at 2 (2% offset), with occasional sharp peaks up to 12 units (10% width)
      let x = 2; // Offset by 2%
      const peakInterval = 8; // Peak every 8 points
      
      const pointInCycle = i % peakInterval;
      if (pointInCycle === 0) {
        x = 2; // Base at 2
      } else if (pointInCycle === 1) {
        x = 12; // Sharp rise to peak (2 + 10)
      } else if (pointInCycle === 2) {
        x = 8.67; // Gradual drop - 1/3 (2 + 6.67)
      } else if (pointInCycle === 3) {
        x = 5.33; // Gradual drop - 2/3 (2 + 3.33)
      } else if (pointInCycle === 4) {
        x = 2; // Back to 2
      } else {
        x = 2; // Stay at 2
      }
      
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    
    return points.join(' ');
  };

  return (
    <svg className="w-full h-full" viewBox="0 0 100 400" preserveAspectRatio="none">
      {/* Grid pattern */}
      <defs>
        <pattern id={`grid-${color}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
        </pattern>
        {clipCurveToHighlight && (
          <clipPath id={`clip-${color}-${highlightStart}-${highlightEnd}`}>
            <rect
              x="0"
              y={(highlightStartPercent / 100) * 400}
              width="100"
              height={((highlightEndPercent - highlightStartPercent) / 100) * 400}
            />
          </clipPath>
        )}
        {clipCurveToSecondary && secondaryHighlightStart !== undefined && secondaryHighlightEnd !== undefined && (
          <clipPath id={`clip-${color}-${secondaryHighlightStart}-${secondaryHighlightEnd}`}>
            <rect
              x="0"
              y={((secondaryHighlightStart - minDepth) / range) * 400}
              width="100"
              height={((secondaryHighlightEnd - secondaryHighlightStart) / range) * 400}
            />
          </clipPath>
        )}
      </defs>
      <rect width="100" height="400" fill={`url(#grid-${color})`} />
      
      {/* Horizontal grid lines */}
      {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="100"
          y2={y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
        />
      ))}

      {/* Vertical grid lines */}
      {[0, 20, 40, 60, 80, 100].map((x) => (
        <line
          key={x}
          x1={x}
          y1="0"
          x2={x}
          y2="400"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
        />
      ))}

      {/* Highlighted depth interval */}
      <rect
        x="0"
        y={(highlightStartPercent / 100) * 400}
        width="100"
        height={((highlightEndPercent - highlightStartPercent) / 100) * 400}
        fill={fillColor}
      />

      {/* Border lines at highlight positions */}
      <line
        x1="0"
        y1={(highlightStartPercent / 100) * 400}
        x2="100"
        y2={(highlightStartPercent / 100) * 400}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      <line
        x1="0"
        y1={(highlightEndPercent / 100) * 400}
        x2="100"
        y2={(highlightEndPercent / 100) * 400}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />

      {/* Secondary highlight interval */}
      {secondaryHighlightStart !== undefined && secondaryHighlightEnd !== undefined && (
        <rect
          x="0"
          y={((secondaryHighlightStart - minDepth) / range) * 400}
          width="100"
          height={((secondaryHighlightEnd - secondaryHighlightStart) / range) * 400}
          fill={`rgba(0, 0, 255, 0.3)`}
        />
      )}

      {/* Vertical curve - max 10% width */}
      {showCurve && (
        <path
          d={generateCurvePath()}
          stroke="rgba(239, 68, 68, 1)"
          strokeWidth="1"
          fill="none"
          clipPath={clipCurveToHighlight ? `url(#clip-${color}-${highlightStart}-${highlightEnd})` : clipCurveToSecondary ? `url(#clip-${color}-${secondaryHighlightStart}-${secondaryHighlightEnd})` : undefined}
        />
      )}
    </svg>
  );
}

// Depth scale component
function DepthScale() {
  // Scale values shifted down: two empty slots, then 90, 95, 100, 105, 110, 115, 120, 125
  const depthValues = [null, null, 90, 95, 100, 105, 110, 115, 120, 125];

  return (
    <div className="w-full h-full flex flex-col justify-between py-2" style={{ paddingTop: '5px', paddingBottom: '5px' }}>
      {depthValues.map((depth, index) => (
        <div
          key={index}
          className="flex items-center justify-center"
          style={{ fontFamily: "var(--font-family-base)" }}
        >
          {depth !== null ? (
            <span className="text-[10px] text-muted-foreground">{depth.toFixed(1)}</span>
          ) : (
            <span className="text-[10px]">&nbsp;</span>
          )}
        </div>
      ))}
    </div>
  );
}