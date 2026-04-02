import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Edit3,
  RotateCcw,
  Settings,
  MoreHorizontal,
  Minus,
  Share2,
  PanelLeftOpen,
  FolderOpen,
  Save,
  MoveVertical,
  Copy,
  MoveHorizontal,
  Sigma,
  Grid2x2Plus,
  Ruler,
  X,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useI18n } from "./i18n";
import { type MWDPacket, SECTIONS_PER_FID, BIT_DURATION_S } from "./mwd-data";
import { buildRowsFromMwdData } from "./PacketLog";
import { PolarChartWidget } from "./PolarChartWidget";
import { ChannelPanel } from "./ChannelPanel";
import { VerticalLogTrack, generateBPOSData, generateHKLAData } from "./VerticalLogTrack";
import { TimeScale } from "./TimeScale";

/* ───── mock data ───── */
interface TrajectoryRow {
  id: number;
  type: string;
  md: number;
  incl: number;
  azim: number;
  pvd: number;
  ns: number;
  ew: number;
  dls: number;
  date: string;
}

const trajectoryDataRU: TrajectoryRow[] = [
  { id: 0, type: "ТП", md: 67.7, incl: 0.77, azim: 151.4, pvd: 67.6, ns: 0.4, ew: 0.2, dls: 1.1, date: "06.02.26 17:20" },
  { id: 1, type: "ТП", md: 76.9, incl: 2.98, azim: 121.6, pvd: 76.9, ns: -0.6, ew: 0.5, dls: 25.4, date: "06.02.26 17:21" },
  { id: 2, type: "ТП", md: 86.7, incl: 6.26, azim: 117.9, pvd: 86.6, ns: 0, ew: 1.1, dls: 33.7, date: "06.02.26 17:22" },
  { id: 3, type: "ТП", md: 96.5, incl: 10.15, azim: 118.9, pvd: 96.4, ns: 1.6, ew: 2.4, dls: 39.3, date: "06.02.26 17:23" },
  { id: 4, type: "ТП", md: 106.3, incl: 13.37, azim: 123, pvd: 105.9, ns: -2.7, ew: 4.1, dls: 34, date: "06.02.26 17:24" },
  { id: 5, type: "ТП", md: 115.6, incl: 16.27, azim: 129.3, pvd: 115, ns: -4.1, ew: 6, dls: 35.4, date: "06.02.26 17:25" },
  { id: 6, type: "ТП", md: 125.4, incl: 19.46, azim: 151.8, pvd: 124.3, ns: -6, ew: 8.3, dls: 33.5, date: "06.02.26 17:26" },
  { id: 7, type: "ТП", md: 134.9, incl: 22.26, azim: 130.5, pvd: 133.1, ns: -8.3, ew: 10.8, dls: 30, date: "06.02.26 17:27" },
  { id: 8, type: "ТП", md: 144.6, incl: 24.87, azim: 126.3, pvd: 142.1, ns: -10.7, ew: 13.9, dls: 32, date: "06.02.26 17:28" },
  { id: 9, type: "ТП", md: 154.5, incl: 27.69, azim: 123.1, pvd: 150.9, ns: -13.1, ew: 17.5, dls: 34, date: "06.02.26 17:29" },
  { id: 10, type: "ТП", md: 163.6, incl: 30.99, azim: 119.1, pvd: 158.9, ns: -15.4, ew: 21.3, dls: 39.8, date: "06.02.26 17:30" },
  { id: 11, type: "ТП", md: 173, incl: 34.17, azim: 116.7, pvd: 166.8, ns: -17.7, ew: 25.8, dls: 36.3, date: "06.02.26 17:31" },
  { id: 12, type: "ТП", md: 182.6, incl: 37.42, azim: 115.2, pvd: 174.5, ns: -20.2, ew: 30.8, dls: 35.4, date: "06.02.26 17:32" },
  { id: 13, type: "ТП", md: 192.2, incl: 40.73, azim: 113.9, pvd: 182, ns: -22.7, ew: 36.3, dls: 35.3, date: "06.02.26 17:33" },
];

const trajectoryDataEN: TrajectoryRow[] = [
  { id: 0, type: "TP", md: 67.7, incl: 0.77, azim: 151.4, pvd: 67.6, ns: 0.4, ew: 0.2, dls: 1.1, date: "02/06/26 17:20" },
  { id: 1, type: "TP", md: 76.9, incl: 2.98, azim: 121.6, pvd: 76.9, ns: -0.6, ew: 0.5, dls: 25.4, date: "02/06/26 17:21" },
  { id: 2, type: "TP", md: 86.7, incl: 6.26, azim: 117.9, pvd: 86.6, ns: 0, ew: 1.1, dls: 33.7, date: "02/06/26 17:22" },
  { id: 3, type: "TP", md: 96.5, incl: 10.15, azim: 118.9, pvd: 96.4, ns: 1.6, ew: 2.4, dls: 39.3, date: "02/06/26 17:23" },
  { id: 4, type: "TP", md: 106.3, incl: 13.37, azim: 123, pvd: 105.9, ns: -2.7, ew: 4.1, dls: 34, date: "02/06/26 17:24" },
  { id: 5, type: "TP", md: 115.6, incl: 16.27, azim: 129.3, pvd: 115, ns: -4.1, ew: 6, dls: 35.4, date: "02/06/26 17:25" },
  { id: 6, type: "TP", md: 125.4, incl: 19.46, azim: 151.8, pvd: 124.3, ns: -6, ew: 8.3, dls: 33.5, date: "02/06/26 17:26" },
  { id: 7, type: "TP", md: 134.9, incl: 22.26, azim: 130.5, pvd: 133.1, ns: -8.3, ew: 10.8, dls: 30, date: "02/06/26 17:27" },
  { id: 8, type: "TP", md: 144.6, incl: 24.87, azim: 126.3, pvd: 142.1, ns: -10.7, ew: 13.9, dls: 32, date: "02/06/26 17:28" },
  { id: 9, type: "TP", md: 154.5, incl: 27.69, azim: 123.1, pvd: 150.9, ns: -13.1, ew: 17.5, dls: 34, date: "02/06/26 17:29" },
  { id: 10, type: "TP", md: 163.6, incl: 30.99, azim: 119.1, pvd: 158.9, ns: -15.4, ew: 21.3, dls: 39.8, date: "02/06/26 17:30" },
  { id: 11, type: "TP", md: 173, incl: 34.17, azim: 116.7, pvd: 166.8, ns: -17.7, ew: 25.8, dls: 36.3, date: "02/06/26 17:31" },
  { id: 12, type: "TP", md: 182.6, incl: 37.42, azim: 115.2, pvd: 174.5, ns: -20.2, ew: 30.8, dls: 35.4, date: "02/06/26 17:32" },
  { id: 13, type: "TP", md: 192.2, incl: 40.73, azim: 113.9, pvd: 182, ns: -22.7, ew: 36.3, dls: 35.3, date: "02/06/26 17:33" },
];

interface SurveyRow {
  id: number;
  type: string;
  surveyId: number;
  time: string;
  md: number;
  incl: number;
  azim: number;
  totalG: number;
  totalB: number;
  magDip: number;
  gx: number;
}

const surveyDataRU: SurveyRow[] = [
  { id: 1, type: "ПТ исп", surveyId: 1, time: "13 06.07 2021", md: 1.36, incl: 80.00, azim: 0.00, totalG: 1.0000, totalB: 100000.00000, magDip: 0.00, gx: 0 },
  { id: 2, type: "ПТ исп", surveyId: 1, time: "16 06.07 2021", md: 1.36, incl: 80.00, azim: 0.00, totalG: 1.0000, totalB: 100000.00000, magDip: 0.00, gx: 0 },
  { id: 3, type: "ПТ исп", surveyId: 1, time: "16 06.07 2021", md: 1.36, incl: 80.00, azim: 0.00, totalG: 1.0000, totalB: 100000.00000, magDip: 0.00, gx: 0 },
  { id: 4, type: "ПТ исп", surveyId: 1, time: "16 06.07 2021", md: 1.36, incl: 80.00, azim: 0.00, totalG: 1.0000, totalB: 100000.00000, magDip: 0.00, gx: 0 },
];

const surveyDataEN: SurveyRow[] = [
  { id: 1, type: "PT test", surveyId: 1, time: "13 07.06 2021", md: 1.36, incl: 80.00, azim: 0.00, totalG: 1.0000, totalB: 100000.00000, magDip: 0.00, gx: 0 },
  { id: 2, type: "PT test", surveyId: 1, time: "16 07.06 2021", md: 1.36, incl: 80.00, azim: 0.00, totalG: 1.0000, totalB: 100000.00000, magDip: 0.00, gx: 0 },
  { id: 3, type: "PT test", surveyId: 1, time: "16 07.06 2021", md: 1.36, incl: 80.00, azim: 0.00, totalG: 1.0000, totalB: 100000.00000, magDip: 0.00, gx: 0 },
  { id: 4, type: "PT test", surveyId: 1, time: "16 07.06 2021", md: 1.36, incl: 80.00, azim: 0.00, totalG: 1.0000, totalB: 100000.00000, magDip: 0.00, gx: 0 },
];

interface AcceptRow {
  labelKey: string;
  md: string;
  incl: string;
  azim: string;
  totalG: string;
  totalB: string;
  isHeader?: boolean;
}

const acceptRows: AcceptRow[] = [
  { labelKey: "data_current", md: "", incl: "", azim: "", totalG: "", totalB: "", isHeader: true },
  { labelKey: "data_prev_accepted", md: "0.00", incl: "0.00", azim: "0.00", totalG: "0.00003", totalB: "0.00000" },
  { labelKey: "data_diff_current", md: "", incl: "", azim: "", totalG: "", totalB: "" },
  { labelKey: "data_corrected", md: "", incl: "", azim: "", totalG: "", totalB: "", isHeader: true },
  { labelKey: "data_prev_accepted", md: "0.00", incl: "0.00", azim: "0.00", totalG: "0.00003", totalB: "0.00000" },
  { labelKey: "data_diff_correction", md: "", incl: "", azim: "", totalG: "", totalB: "" },
  { labelKey: "data_criteria", md: "> 9.00", incl: "< 4.200", azim: "< 5.00", totalG: "< 0.0025", totalB: "< 300.00000" },
];

const FID_DESCRIPTIONS = [
  "Static",
  "Slide low",
  "Rotor",
  "Static high",
  "Slide high",
];

const logGammaData = [
  { id: 1, md: 136, gamma: 58.5613 },
  { id: 2, md: 136.2, gamma: 70.6266 },
  { id: 3, md: 136.4, gamma: 78.6555 },
  { id: 4, md: 136.6, gamma: 77.4111 },
  { id: 5, md: 136.8, gamma: 71.6867 },
  { id: 6, md: 137, gamma: 70.818 },
  { id: 7, md: 137.2, gamma: 72.3567 },
  { id: 8, md: 137.4, gamma: 71.5118 },
  { id: 9, md: 137.6, gamma: 83.1449 },
  { id: 10, md: 137.8, gamma: 91.1121 },
  { id: 11, md: 138, gamma: 50.9789 },
  { id: 12, md: 138.2, gamma: 59.5576 },
  { id: 13, md: 138.4, gamma: 66.6432 },
  { id: 14, md: 138.6, gamma: 74.6267 },
  { id: 15, md: 138.8, gamma: 73.0907 },
  { id: 16, md: 139, gamma: 62.741 },
  { id: 17, md: 139.2, gamma: 58.5778 },
  { id: 18, md: 139.4, gamma: 58.9301 },
  { id: 19, md: 139.6, gamma: 67.9965 },
];

/* ───── Resizable divider ───── */
function useResizable(
  key: string,
  defaultValue: number,
  min: number,
  max: number,
  direction: "horizontal" | "vertical"
) {
  const [size, setSize] = useState(() => {
    const s = localStorage.getItem(key);
    return s ? Number(s) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, String(size));
  }, [key, size]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startPos = direction === "horizontal" ? e.clientY : e.clientX;
      const startSize = size;
      const onMove = (ev: MouseEvent) => {
        const delta =
          direction === "horizontal"
            ? ev.clientY - startPos
            : ev.clientX - startPos;
        setSize(Math.max(min, Math.min(max, startSize + delta)));
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [size, min, max, direction]
  );

  return { size, onMouseDown };
}

/* ───── DataView ─────  */
interface DataViewProps {
  mwdData?: MWDPacket[];
}

export function DataView({ mwdData = [] }: DataViewProps) {
  const { t, lang } = useI18n();

  const surveyTabs = [
    { key: "queue", label: t("data_queue") },
    { key: "all", label: t("data_all") },
    { key: "accepted", label: t("data_accepted") },
    { key: "rejected", label: t("data_rejected_tab") },
  ];

  const trajectoryData = lang === "ru" ? trajectoryDataRU : trajectoryDataEN;

  const [activeSurveyTab, setActiveSurveyTab] = useState("queue");
  const [activeTabletTab, setActiveTabletTab] = useState("tablet1");
  const [tabletTimeInterval, setTabletTimeInterval] = useState("10");
  const [showQuality, setShowQuality] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [showSurveyTime, setShowSurveyTime] = useState(false);
  const [sigmaActive, setSigmaActive] = useState(false);
  const [panelLeftActive, setPanelLeftActive] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  // Resizable dividers
  const trajectorySurveys = useResizable("dv_trajectorySurveys", 350, 150, 600, "horizontal");
  const surveysAccept = useResizable("dv_surveysAccept", 250, 80, 500, "horizontal");
  const leftRight = useResizable("dv_leftRight", 320, 200, 600, "vertical");
  const tabletLastPkt = useResizable("dv_tabletLastPkt", 300, 150, 600, "horizontal");
  const polarTrajectory = useResizable("dv_polarTrajectory", 240, 180, 400, "vertical");
  const channelSurveys = useResizable("dv_channelSurveys", 240, 180, 400, "vertical");

  // Last Packet widget tab state
  const [activeLastPktTab, setActiveLastPktTab] = useState<"lastPacket" | "events">("lastPacket");

  // Synced data from mwdData via buildRowsFromMwdData
  const { rows: currentRows, fidNumber } = useMemo(
    () => buildRowsFromMwdData(mwdData),
    [mwdData]
  );

  const receivedCount = currentRows.filter(
    (r) => r.type === "fid-channel" && r.received
  ).length;
  const totalChannels = SECTIONS_PER_FID;

  const remainingSec = (totalChannels - receivedCount) * 16 * BIT_DURATION_S;
  const remainMin = Math.floor(remainingSec / 60);
  const remainSec = Math.floor(remainingSec % 60);
  const remainStr = `${String(remainMin).padStart(2, "0")}:${String(remainSec).padStart(2, "0")}:00`;

  const fidDesc = useMemo(() => {
    const fidNum = fidNumber !== "—" ? Number(fidNumber) : 0;
    return FID_DESCRIPTIONS[fidNum % FID_DESCRIPTIONS.length];
  }, [fidNumber]);

  return (
    <div className="flex flex-col h-full overflow-hidden p-1.5 gap-0">
      {/* Main layout: Left (Trajectory + Surveys + Accept/Reject) | Right (Tablet + Last Packet) */}
      <div className="flex-1 min-h-0 flex gap-0">
        
        {/* ═══════ LEFT COLUMN ═══════ */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden gap-0 ml-1.5">
          
          {/* ─── TOP ROW: Polar Chart | Trajectory Table ─── */}
          <div className="flex my-1.5 overflow-hidden gap-0" style={{ height: trajectorySurveys.size }}>
            
            {/* Polar diagram */}
            <div
              className="relative border border-border rounded-md bg-background overflow-hidden py-8 px-3 shrink-0"
              style={{ width: polarTrajectory.size }}
            >
              <PolarChartWidget gtfAngle={45} gtfValue={45.0} timestamp="00:56" />
            </div>

            {/* Vertical divider: polar ↔ trajectory */}
            <div
              className="shrink-0 cursor-col-resize flex items-center justify-center group"
              style={{ width: 6 }}
              onMouseDown={polarTrajectory.onMouseDown}
            >
              <div className="h-10 w-[2px] rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
            </div>

            {/* Trajectory Table */}
            <div className="flex-1 min-w-0 flex flex-col border border-border rounded-md bg-background overflow-hidden">
              <div className="flex items-center gap-2 px-2 py-1 border-b border-border bg-card/50 shrink-0">
                <span className="mwd-title text-muted-foreground">{t("data_trajectory")}</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1">
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Plus className="size-3.5" /></button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Minus className="size-3.5" /></button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Edit3 className="size-3.5" /></button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Share2 className="size-3.5" /></button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Settings className="size-3.5" /></button>
                  <button className="mwd-btn px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">TVD</button>
                  <button className="mwd-btn px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">{t("data_recalculate")}</button>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10" style={{ background: "var(--table-header-bg)" }}>
                    <tr className="border-b border-border">
                      {[
                        { key: "type", label: lang === "ru" ? "Тип" : "Type" },
                        { key: "md", label: "MD" },
                        { key: "incl", label: "INCL" },
                        { key: "azim", label: "AZIM" },
                        { key: "pvd", label: "TVD" },
                        { key: "ns", label: "N/S" },
                        { key: "ew", label: "E/W" },
                        { key: "dls", label: "DLS" },
                        { key: "date", label: lang === "ru" ? "Дата" : "Date" },
                      ].map((col) => (
                        <th key={col.key} className="mwd-header px-1.5 py-1 text-left text-muted-foreground whitespace-nowrap">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trajectoryData.map((row) => (
                      <tr key={row.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground">{row.type}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.md.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.incl.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.azim.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.pvd.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.ns.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.ew.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.dls.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-muted-foreground whitespace-nowrap">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Horizontal divider: trajectory ↔ surveys */}
          <div
            className="shrink-0 cursor-row-resize flex items-center justify-center group"
            style={{ height: 6 }}
            onMouseDown={trajectorySurveys.onMouseDown}
          >
            <div className="w-10 h-[2px] rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
          </div>

          {/* ─── MIDDLE ROW: Channel Panel | Surveys Table ─── */}
          <div className="flex overflow-hidden gap-0" style={{ height: surveysAccept.size }}>
            
            {/* Channel Panel */}
            <div
              className="shrink-0 border border-border rounded-md bg-background overflow-hidden"
              style={{ width: channelSurveys.size }}
            >
              <ChannelPanel />
            </div>

            {/* Vertical divider: channel ↔ surveys */}
            <div
              className="shrink-0 cursor-col-resize flex items-center justify-center group"
              style={{ width: 6 }}
              onMouseDown={channelSurveys.onMouseDown}
            >
              <div className="h-10 w-[2px] rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
            </div>

            {/* Surveys Table */}
            <div className="flex-1 min-w-0 border border-border rounded-md bg-background overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-2 py-1 border-b border-border bg-card/50 shrink-0">
                <span className="mwd-title text-muted-foreground">{t("data_surveys")}</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1">
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Share2 className="size-3.5" /></button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Plus className="size-3.5" /></button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Minus className="size-3.5" /></button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Edit3 className="size-3.5" /></button>
                  <button className="mwd-btn px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">{t("data_reopen")}</button>
                  <button className="mwd-btn px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">{t("data_reopen_all")}</button>
                  <button className="mwd-btn px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">{t("data_reject_btn")}</button>
                  <button className="mwd-btn px-1.5 py-0.5 rounded border border-border text-muted-foreground hover:bg-secondary transition-colors">MSA</button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><RotateCcw className="size-3.5" /></button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Settings className="size-3.5" /></button>
                </div>
              </div>

              <div className="flex items-center border-b border-border bg-card/50 shrink-0 overflow-x-auto">
                {surveyTabs.map((tab) => {
                  const isActive = activeSurveyTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveSurveyTab(tab.key)}
                      className={`px-2.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                        isActive
                          ? "mwd-btn-active border-primary text-primary"
                          : "mwd-btn border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
                <div className="w-px h-4 bg-border mx-1.5 shrink-0" />
                <label className="flex items-center gap-1 px-1.5 py-1 cursor-pointer whitespace-nowrap">
                  <Checkbox checked={showQuality} onCheckedChange={(v) => setShowQuality(!!v)} />
                  <span className="mwd-cell text-muted-foreground">{t("data_quality")}</span>
                </label>
                <label className="flex items-center gap-1 px-1.5 py-1 cursor-pointer whitespace-nowrap">
                  <Checkbox checked={showRawData} onCheckedChange={(v) => setShowRawData(!!v)} />
                  <span className="mwd-cell text-muted-foreground">{t("data_raw_data")}</span>
                </label>
                <label className="flex items-center gap-1 px-1.5 py-1 cursor-pointer whitespace-nowrap">
                  <Checkbox checked={showSurveyTime} onCheckedChange={(v) => setShowSurveyTime(!!v)} />
                  <span className="mwd-cell text-muted-foreground">{t("data_survey_time")}</span>
                </label>
              </div>

              <div className="flex-1 min-h-0 overflow-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10" style={{ background: "var(--table-header-bg)" }}>
                    <tr className="border-b border-border">
                      {[
                        { key: "type", label: lang === "ru" ? "Тип" : "Type" },
                        { key: "id", label: "ID" },
                        { key: "time", label: lang === "ru" ? "Время" : "Time" },
                        { key: "md", label: lang === "ru" ? "MD [м]" : "MD [m]" },
                        { key: "incl", label: "Incl [" + (lang === "ru" ? "град" : "deg") + "]" },
                        { key: "azim", label: "Azim [" + (lang === "ru" ? "град" : "deg") + "]" },
                        { key: "totalG", label: "TotalG [g]" },
                        { key: "totalB", label: lang === "ru" ? "TotalB [нТ]" : "TotalB [nT]" },
                        { key: "magDip", label: lang === "ru" ? "Mag Dip [град]" : "Mag Dip [deg]" },
                        { key: "gx", label: "Gx [g]" },
                      ].map((col) => (
                        <th key={col.key} className="mwd-header px-1.5 py-1 text-left text-muted-foreground whitespace-nowrap">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(lang === "ru" ? surveyDataRU : surveyDataEN).map((row) => (
                      <tr key={row.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground">{row.type}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.surveyId}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.time}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.md.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.incl.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.azim.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.totalG.toFixed(4)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.totalB.toFixed(5)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.magDip.toFixed(2)}</td>
                        <td className="mwd-table-cell px-1.5 py-0.5 text-foreground tabular-nums">{row.gx.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Horizontal divider: surveys ↔ accept/reject */}
          <div
            className="shrink-0 cursor-row-resize flex items-center justify-center group"
            style={{ height: 6 }}
            onMouseDown={surveysAccept.onMouseDown}
          >
            <div className="w-10 h-[2px] rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
          </div>

          {/* ─── Accept/Reject ─── */}
          <div className="flex-1 min-w-0 flex flex-col mb-1.5 border border-border rounded-md bg-background overflow-hidden">
            <div className="flex items-center gap-2 px-2 py-1 border-b border-border bg-card/50 shrink-0 overflow-x-auto">
              <span className="mwd-header text-muted-foreground whitespace-nowrap shrink-0">{t("data_accept_reject_title")}</span>
              <label className="flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap">
                <Checkbox id="corr" />
                <span className="mwd-cell text-muted-foreground">{t("data_correction")}</span>
              </label>
              <span className="mwd-cell text-muted-foreground whitespace-nowrap shrink-0">MD</span>
              <select className="mwd-cell bg-card border border-border rounded px-1 py-0.5 text-foreground cursor-pointer shrink-0">
                <option value="m">{t("data_md_unit_m")}</option>
                <option value="ft">ft</option>
              </select>
              <label className="flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap">
                <Checkbox id="sag" />
                <span className="mwd-cell text-muted-foreground">SAG</span>
              </label>
              <select className="mwd-cell bg-card border border-border rounded px-1 py-0.5 text-foreground cursor-pointer shrink-0">
                <option value="deg">{t("data_unit_deg")}</option>
                <option value="rad">rad</option>
              </select>
              <label className="flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap">
                <Checkbox id="short-collar" />
                <span className="mwd-cell text-muted-foreground">{t("data_short_collar")}</span>
              </label>
              <div className="flex-1" />
              <div className="flex items-center gap-1 shrink-0">
                <button className="mwd-btn-active px-2 py-0.5 rounded bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">{t("data_accept")}</button>
                <button className="mwd-btn px-2 py-0.5 rounded bg-secondary text-foreground hover:bg-secondary/80 transition-colors border border-border">{t("data_reject")}</button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10" style={{ background: "var(--table-header-bg)" }}>
                  <tr className="border-b border-border">
                    <th className="mwd-header px-1.5 py-1 text-left text-muted-foreground"></th>
                    <th className="mwd-header px-1.5 py-1 text-right text-muted-foreground">MD</th>
                    <th className="mwd-header px-1.5 py-1 text-right text-muted-foreground">INCL</th>
                    <th className="mwd-header px-1.5 py-1 text-right text-muted-foreground">AZIM</th>
                    <th className="mwd-header px-1.5 py-1 text-right text-muted-foreground">Total G</th>
                    <th className="mwd-header px-1.5 py-1 text-right text-muted-foreground">Total B</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-border/30 ${row.isHeader ? "bg-card/30" : "hover:bg-secondary/30"} transition-colors`}
                    >
                      <td className={`px-1.5 py-0.5 ${row.isHeader ? "mwd-header text-foreground" : "mwd-cell text-muted-foreground"}`}>
                        {t(row.labelKey as any)}
                      </td>
                      <td className="mwd-table-cell px-1.5 py-0.5 text-right text-foreground tabular-nums">{row.md}</td>
                      <td className="mwd-table-cell px-1.5 py-0.5 text-right text-foreground tabular-nums">{row.incl}</td>
                      <td className="mwd-table-cell px-1.5 py-0.5 text-right text-foreground tabular-nums">{row.azim}</td>
                      <td className="mwd-table-cell px-1.5 py-0.5 text-right text-foreground tabular-nums">{row.totalG}</td>
                      <td className="mwd-table-cell px-1.5 py-0.5 text-right text-foreground tabular-nums">{row.totalB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Vertical divider: left ↔ right */}
        <div
          className="shrink-0 cursor-col-resize flex items-center justify-center group"
          style={{ width: 6 }}
          onMouseDown={leftRight.onMouseDown}
        >
          <div className="h-10 w-[2px] rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
        </div>

        {/* ═══════ RIGHT COLUMN: Tablet (top) + Last Packet (bottom) ═══════ */}
        <div
          className="flex flex-col my-1.5 mr-1.5 overflow-hidden gap-0"
          style={{ width: leftRight.size }}
        >
          {/* ─── Tablet panel (graphs) ─── */}
          <div className="flex-1 min-h-0 flex flex-col border border-border rounded-md bg-background overflow-hidden">
            <div className="flex items-center border-b border-border bg-card/50 shrink-0">
              {([
                { key: "tablet1", label: t("data_tablet1") },
                { key: "tablet2", label: t("data_tablet2") },
                { key: "tablet3", label: t("data_tablet3") },
              ] as const).map((tab) => {
                const isActive = activeTabletTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTabletTab(tab.key)}
                    className={`px-2.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                      isActive
                        ? "mwd-btn-active border-primary text-primary"
                        : "mwd-btn border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1 px-1.5 py-1 border-b border-border bg-card/50 shrink-0 overflow-x-auto">
              <button
                className={`p-1 transition-colors ${
                  panelLeftActive
                    ? "text-primary bg-primary/10 rounded"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setPanelLeftActive(!panelLeftActive);
                  setShowLogModal(true);
                }}
              >
                <PanelLeftOpen className="size-3.5" />
              </button>
              <span className="mwd-cell text-muted-foreground whitespace-nowrap">{t("data_time")}</span>
              <select
                value={tabletTimeInterval}
                onChange={(e) => setTabletTimeInterval(e.target.value)}
                className="mwd-cell bg-card border border-border rounded px-1 py-0.5 text-foreground cursor-pointer"
              >
                <option value="1">{lang === "ru" ? "1 сек" : "1 sec"}</option>
                <option value="5">{lang === "ru" ? "5 сек" : "5 sec"}</option>
                <option value="10">{lang === "ru" ? "10 сек" : "10 sec"}</option>
                <option value="30">{lang === "ru" ? "30 сек" : "30 sec"}</option>
                <option value="60">{lang === "ru" ? "60 сек" : "60 sec"}</option>
              </select>
              <button
                className={`p-1 transition-colors ${
                  sigmaActive
                    ? "text-primary bg-primary/10 rounded"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setSigmaActive(!sigmaActive)}
              >
                <Sigma className="size-3.5" />
              </button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><FolderOpen className="size-3.5" /></button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Save className="size-3.5" /></button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><MoveVertical className="size-3.5" /></button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Grid2x2Plus className="size-3.5" /></button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Ruler className="size-3.5" /></button>
              <button className="mwd-btn-active px-1 py-0.5 text-muted-foreground hover:text-foreground transition-colors">+A</button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Copy className="size-3.5" /></button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><MoveHorizontal className="size-3.5" /></button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Settings className="size-3.5" /></button>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal className="size-3.5" /></button>
            </div>

            {/* Log tracks area */}
            <div className="flex-1 min-h-0 flex">
              <div className="flex-1 min-w-0 border-r border-border">
                <VerticalLogTrack
                  wellName="WELL2"
                  tracks={[
                    {
                      name: "Track 1",
                      minValue: 0.0,
                      maxValue: 10.0,
                      currentValue: 4.56,
                      color: "#d32f2f",
                      data: generateBPOSData(2000, 0.0, 10.0),
                      scaleLabel: "м",
                      scaleMin: 0.0,
                      scaleMax: 10,
                    },
                  ]}
                />
              </div>

              <div className="shrink-0 border-r border-border" style={{ width: 80 }}>
                <TimeScale />
              </div>

              <div className="flex-1 min-w-0">
                <VerticalLogTrack
                  wellName="WELL3"
                  tracks={[
                    {
                      name: "Track 3",
                      minValue: 0.0,
                      maxValue: 100.0,
                      currentValue: 2.34,
                      color: "#68696a",
                      data: generateHKLAData(2000, 0.0, 100.0),
                      scaleLabel: "тонн",
                      scaleMin: 0.0,
                      scaleMax: 100.0,
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Horizontal divider: tablet ↔ last packet */}
          <div
            className="shrink-0 cursor-row-resize flex items-center justify-center group"
            style={{ height: 6 }}
            onMouseDown={tabletLastPkt.onMouseDown}
          >
            <div className="w-10 h-[2px] rounded-full bg-border group-hover:bg-primary/60 transition-colors" />
          </div>

          {/* ─── Last Packet / Events widget ─── */}
          <div
            className="shrink-0 flex flex-col border border-border rounded-md bg-background overflow-hidden mb-1.5"
            style={{ height: tabletLastPkt.size }}
          >
            <div className="flex items-center border-b border-border bg-card/50 shrink-0">
              <button
                onClick={() => setActiveLastPktTab("lastPacket")}
                className={`px-2.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                  activeLastPktTab === "lastPacket"
                    ? "mwd-btn-active border-primary text-primary"
                    : "mwd-btn border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("data_last_packet")}
              </button>
              <button
                onClick={() => setActiveLastPktTab("events")}
                className={`px-2.5 py-1 whitespace-nowrap transition-colors border-b-2 ${
                  activeLastPktTab === "events"
                    ? "mwd-btn-active border-primary text-primary"
                    : "mwd-btn border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("data_events")}
              </button>
              <div className="flex-1" />
              <button className="p-1 mr-1 text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal className="size-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-2 py-1 border-b border-border bg-card/30 shrink-0">
              <div className="flex items-center gap-1">
                <span className="mwd-cell text-muted-foreground">FID:</span>
                <span className="mwd-cell text-foreground tabular-nums">{fidNumber}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="mwd-cell text-muted-foreground">{t("data_remaining")}:</span>
                <span className="mwd-cell text-foreground tabular-nums">{remainStr} ({receivedCount}/{totalChannels})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="mwd-cell text-muted-foreground">{t("data_description")}:</span>
                <span className="mwd-cell text-foreground">{fidDesc}</span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              {activeLastPktTab === "lastPacket" ? (
                <table className="w-full">
                  <thead className="sticky top-0 z-10" style={{ background: "var(--table-header-bg)" }}>
                    <tr className="border-b border-border">
                      <th className="mwd-header px-1.5 py-1 text-left text-muted-foreground whitespace-nowrap">{t("data_num")}</th>
                      <th className="mwd-header px-1.5 py-1 text-left text-muted-foreground whitespace-nowrap">{t("data_lp_time")}</th>
                      <th className="mwd-header px-1.5 py-1 text-left text-muted-foreground whitespace-nowrap">{t("data_lp_mnem")}</th>
                      <th className="mwd-header px-1.5 py-1 text-right text-muted-foreground whitespace-nowrap">{t("data_lp_value")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((row) => {
                      const isPending = row.type === "fid-channel" && !row.received;
                      const isSync = row.type === "sync";
                      const isFidHeader = row.type === "fid-header";

                      return (
                        <tr
                          key={row.id}
                          className={`border-b border-border/30 transition-colors ${
                            isPending ? "hover:bg-secondary/20" : "hover:bg-secondary/30"
                          }`}
                        >
                          <td className={`mwd-table-cell px-1.5 py-0.5 tabular-nums ${isPending ? "text-muted-foreground" : "text-foreground"}`}>
                            {row.num}
                          </td>
                          <td className={`mwd-table-cell px-1.5 py-0.5 tabular-nums whitespace-nowrap ${isPending ? "text-muted-foreground" : "text-foreground"}`}>
                            {row.time}
                          </td>
                          <td className="mwd-table-cell px-1.5 py-0.5">
                            <span className={isSync ? "text-accent" : isFidHeader ? "text-chart-6" : isPending ? "text-muted-foreground" : "text-foreground"}>
                              {row.mnem}
                            </span>
                          </td>
                          <td className={`mwd-table-cell px-1.5 py-0.5 text-right tabular-nums ${isPending ? "text-muted-foreground" : isFidHeader ? "text-chart-6" : "text-foreground"}`}>
                            {row.value}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="mwd-cell text-muted-foreground">{t("data_events")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Log - Well1 - Gamma */}
      {showLogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowLogModal(false)}
        >
          <div
            className="w-[600px] max-h-[80vh] flex flex-col border border-border rounded bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card/50 shrink-0">
              <span className="text-xs" style={{ color: "#f59e0b" }}>⭐</span>
              <span className="mwd-title text-foreground">Log - Well1 - Gamma</span>
              <div className="flex-1" />
              <button
                onClick={() => setShowLogModal(false)}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-card">
                  <tr className="border-b border-border">
                    <th className="mwd-header px-3 py-2 text-left text-muted-foreground"></th>
                    <th className="mwd-header px-3 py-2 text-left text-muted-foreground">MD</th>
                    <th className="mwd-header px-3 py-2 text-left text-muted-foreground">Gamma</th>
                  </tr>
                </thead>
                <tbody>
                  {logGammaData.map((row) => (
                    <tr key={row.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="mwd-table-cell px-3 py-1.5 text-foreground">{row.id}</td>
                      <td className="mwd-table-cell px-3 py-1.5 text-foreground tabular-nums">{row.md}</td>
                      <td className="mwd-table-cell px-3 py-1.5 text-foreground tabular-nums">{row.gamma.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-border bg-card/50 shrink-0">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/80 transition-colors mwd-btn"
              >
                OK
              </button>
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-1.5 rounded bg-secondary text-foreground hover:bg-secondary/80 transition-colors border border-border mwd-btn"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}