import React, { useState, useMemo } from "react";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Share2,
  Settings as SettingsIcon,
  MoreHorizontal,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  type MWDPacket,
  SECTIONS_PER_FID,
  BIT_DURATION_S,
  formatTime,
  formatTimeWithDate,
  PIXELS_PER_SECOND,
} from "./mwd-data";
import { useI18n } from "./i18n";

/** FID channel definitions */
const FID_CHANNELS = [
  { idx: 1, mnem: "GX" },
  { idx: 2, mnem: "INC" },
  { idx: 3, mnem: "AZM" },
  { idx: 4, mnem: "SHK" },
  { idx: 5, mnem: "TMP" },
  { idx: 6, mnem: "BAT" },
  { idx: 7, mnem: "GX2" },
  { idx: 8, mnem: "INC2" },
  { idx: 9, mnem: "AZM2" },
  { idx: 10, mnem: "SHK2" },
  { idx: 11, mnem: "TMP2" },
];

const FID_DESCRIPTIONS = [
  "Static",
  "Slide low",
  "Rotor",
  "Static high",
  "Slide high",
  "Tech",
  "Static (aux)",
  "Slide low (aux)",
  "Rotor (aux)",
  "Static high (aux)",
  "Slide high (aux)",
];

interface PacketRow {
  id: string;
  num: string;
  time: string;
  mnem: string;
  value: string;
  received: boolean;
  type: "sync" | "fid-header" | "fid-channel";
}

interface NavRow {
  id: string;
  syncTime: string;
  fidNum: number;
  description: string;
  scrollPx: number;
}

function buildRowsFromMwdData(mwdData: MWDPacket[]): {
  rows: PacketRow[];
  fidNumber: string;
} {
  if (mwdData.length === 0) return { rows: [], fidNumber: "—" };

  let lastSyncIdx = -1;
  for (let i = mwdData.length - 1; i >= 0; i--) {
    if (mwdData[i].isSync) {
      lastSyncIdx = i;
      break;
    }
  }
  if (lastSyncIdx === -1) return { rows: [], fidNumber: "—" };

  const rows: PacketRow[] = [];
  const syncPkt = mwdData[lastSyncIdx];

  const pktTime = (pkt: MWDPacket) => {
    const seconds = pkt.startPx / PIXELS_PER_SECOND;
    return formatTimeWithDate(seconds);
  };

  let fidNumber = "—";

  const isPartial = syncPkt.revealedBits != null;
  rows.push({
    id: "sync",
    num: "",
    time: pktTime(syncPkt),
    mnem: "SYNC",
    value: "",
    received: !isPartial,
    type: "sync",
  });

  const fidHeaderIdx = lastSyncIdx + 1;
  const hasFidHeader =
    fidHeaderIdx < mwdData.length && mwdData[fidHeaderIdx].isFidHeader;
  if (hasFidHeader) {
    const fidPkt = mwdData[fidHeaderIdx];
    const fidPartial = fidPkt.revealedBits != null;
    const match = fidPkt.name.match(/#(\d+)/);
    fidNumber = match ? match[1] : "—";
    rows.push({
      id: "fid-header",
      num: "",
      time: pktTime(fidPkt),
      mnem: "FID",
      value: fidNumber,
      received: !fidPartial,
      type: "fid-header",
    });
  } else {
    rows.push({
      id: "fid-header",
      num: "",
      time: "",
      mnem: "FID",
      value: "",
      received: false,
      type: "fid-header",
    });
  }

  const sectionStartIdx = lastSyncIdx + 2;
  for (let si = 0; si < SECTIONS_PER_FID; si++) {
    const ch = FID_CHANNELS[si];
    const pktIdx = sectionStartIdx + si;
    const exists =
      pktIdx < mwdData.length && mwdData[pktIdx].isFidSection;

    if (exists) {
      const pkt = mwdData[pktIdx];
      const isPartialPkt = pkt.revealedBits != null;
      rows.push({
        id: `ch-${ch.idx}`,
        num: String(ch.idx),
        time: pktTime(pkt),
        mnem: ch.mnem,
        value: isPartialPkt ? "" : (pkt.decodedValue ?? ""),
        received: !isPartialPkt,
        type: "fid-channel",
      });
    } else {
      rows.push({
        id: `ch-${ch.idx}`,
        num: String(ch.idx),
        time: "",
        mnem: ch.mnem,
        value: "",
        received: false,
        type: "fid-channel",
      });
    }
  }

  return { rows, fidNumber };
}

function buildNavRows(mwdData: MWDPacket[]): NavRow[] {
  const rows: NavRow[] = [];

  for (let i = 0; i < mwdData.length; i++) {
    const pkt = mwdData[i];
    if (!pkt.isSync) continue;
    if (pkt.revealedBits != null) continue;

    const fidIdx = i + 1;
    if (fidIdx >= mwdData.length || !mwdData[fidIdx].isFidHeader) continue;
    if (mwdData[fidIdx].revealedBits != null) continue;

    const fidPkt = mwdData[fidIdx];
    const match = fidPkt.name.match(/#(\d+)/);
    const fidNum = match ? Number(match[1]) : 0;

    const syncSeconds = pkt.startPx / PIXELS_PER_SECOND;
    const syncTime = formatTimeWithDate(syncSeconds);
    const description = FID_DESCRIPTIONS[fidNum % FID_DESCRIPTIONS.length];

    rows.push({
      id: `nav-${fidNum}`,
      syncTime,
      fidNum,
      description,
      scrollPx: pkt.startPx,
    });
  }

  return rows;
}

interface LogEntry {
  id: string;
  date: string;
  datetime: string;
  type: string;
  content: string;
  value: string;
  description: string;
}

function buildLogFromMwdData(mwdData: MWDPacket[], packetLabel: string): LogEntry[] {
  const entries: LogEntry[] = [];
  let entryId = 0;

  for (let i = 0; i < mwdData.length; i++) {
    const pkt = mwdData[i];
    if (pkt.revealedBits != null) continue;

    const seconds = pkt.startPx / PIXELS_PER_SECOND;
    const base = new Date("2026-02-06T17:20:00");
    const t = new Date(base.getTime() + seconds * 1000);
    const date = t.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const time = t.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (pkt.isSync) {
      entries.push({
        id: `log-${entryId++}`,
        date: date,
        datetime: time,
        type: packetLabel,
        content: packetLabel,
        value: "SYNC",
        description: "",
      });
    } else if (pkt.isFidHeader) {
      const fidMatch = pkt.name.match(/#(\d+)/);
      const fidNum = fidMatch ? fidMatch[1] : "?";
      let sectionCount = 0;
      for (
        let j = i + 1;
        j < mwdData.length && j <= i + SECTIONS_PER_FID;
        j++
      ) {
        if (mwdData[j].isFidSection && mwdData[j].revealedBits == null) {
          sectionCount++;
        } else {
          break;
        }
      }
      const totalBits = 32 + sectionCount * 16;
      const maxBits = 32 + SECTIONS_PER_FID * 16;
      entries.push({
        id: `log-${entryId++}`,
        date: date,
        datetime: time,
        type: packetLabel,
        content: packetLabel,
        value: `FID:${fidNum} (${totalBits}/${maxBits})`,
        description: `FID${fidNum}`,
      });
    }
  }

  return entries;
}

const fontInter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

const headerStyle: React.CSSProperties = {
  ...fontInter,
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-medium)" as any,
};

const cellStyle: React.CSSProperties = {
  ...fontInter,
  fontSize: "var(--text-xs)",
  fontWeight: "var(--font-weight-normal)" as any,
};

interface PacketLogProps {
  mwdData: MWDPacket[];
  onNavigateToFrame?: (scrollPx: number) => void;
}

export function PacketLog({ mwdData, onNavigateToFrame }: PacketLogProps) {
  const { t } = useI18n();
  const [autoScroll, setAutoScroll] = useState(true);
  const [autoScrollLog, setAutoScrollLog] = useState(true);
  const [activeTab, setActiveTab] = useState<"last" | "navigator">("last");
  const [hoveredNavRow, setHoveredNavRow] = useState<string | null>(null);
  const [selectedNavRow, setSelectedNavRow] = useState<string | null>(null);

  const { rows: currentRows, fidNumber } = useMemo(
    () => buildRowsFromMwdData(mwdData),
    [mwdData]
  );
  const packetLabel = t("pktlog_packet");
  const logEntries = useMemo(() => buildLogFromMwdData(mwdData, packetLabel), [mwdData, packetLabel]);
  const navRows = useMemo(() => buildNavRows(mwdData), [mwdData]);

  const receivedCount = currentRows.filter(
    (r) => r.type === "fid-channel" && r.received
  ).length;
  const totalChannels = SECTIONS_PER_FID;

  const remainingSec = (totalChannels - receivedCount) * 16 * BIT_DURATION_S;
  const remainMin = Math.floor(remainingSec / 60);
  const remainSec = Math.floor(remainingSec % 60);
  const remainStr = `${String(remainMin).padStart(2, "0")}:${String(
    remainSec
  ).padStart(2, "0")}:00`;

  const nextChannelMnem = FID_CHANNELS[receivedCount]?.mnem ?? "FID";

  const handleNavigate = (row: NavRow) => {
    setSelectedNavRow(row.id);
    setAutoScroll(false);
    onNavigateToFrame?.(row.scrollPx);
  };

  return (
    <div
      className="flex flex-col h-full border-l border-border bg-card/30"
      style={{ width: 380 }}
    >
      {/* Tab bar */}
      <div className="border-b border-border">
        <div className="flex items-center">
          {(["last", "navigator"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{
                ...fontInter,
                fontSize: "var(--text-sm)",
                fontWeight:
                  activeTab === tab
                    ? ("var(--font-weight-medium)" as any)
                    : ("var(--font-weight-normal)" as any),
              }}
            >
              {tab === "last" ? t("pktlog_last_packet") : t("pktlog_fid_navigator")}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => window.open(`${import.meta.env.BASE_URL}#/standalone/log`, "_blank", "width=450,height=800")}
            className="p-1.5 mr-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors cursor-pointer"
            title="Open in separate window"
          >
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Summary row */}
        {(activeTab === "last" || activeTab === "navigator") && (
          <div className="px-2 py-1 border-b border-border bg-card/50 space-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground" style={{ ...fontInter, fontSize: 10 }}>
                  FID:
                </span>
                <Badge
                  variant="outline"
                  className="text-chart-1 border-chart-1/30 bg-chart-1/10"
                  style={{ ...fontInter, fontSize: 10 }}
                >
                  {activeTab === "navigator"
                    ? navRows.length > 0
                      ? navRows[navRows.length - 1].fidNum
                      : "—"
                    : fidNumber}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id={`autoscroll-${activeTab}`}
                    checked={autoScroll}
                    onCheckedChange={(v) => setAutoScroll(!!v)}
                  />
                  <label
                    htmlFor={`autoscroll-${activeTab}`}
                    className="text-foreground cursor-pointer"
                    style={{
                      ...fontInter,
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)" as any,
                    }}
                  >
                    {t("pktlog_autoscroll")}
                  </label>
                </div>
                <button className="flex items-center justify-center size-[24px] rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <MoreHorizontal className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground" style={{ ...fontInter, fontSize: 10 }}>
                {t("pktlog_remaining")}
              </span>
              <span
                className="text-foreground tabular-nums"
                style={{
                  ...fontInter,
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)" as any,
                }}
              >
                {remainStr} ({receivedCount}/{totalChannels})
              </span>
              <span className="text-muted-foreground" style={{ ...fontInter, fontSize: 10 }}>
                {t("pktlog_description")}
              </span>
              <span
                className="text-foreground"
                style={{
                  ...fontInter,
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-normal)" as any,
                }}
              >
                {activeTab === "navigator"
                  ? navRows.length > 0
                    ? navRows[navRows.length - 1].description
                    : "—"
                  : "Static high"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ===== Tab content ===== */}
      {activeTab === "last" ? (
        <>
          {/* Current packet detail table */}
          <div className="flex-1 min-h-0 overflow-hidden border-b border-border">
            <ScrollArea className="h-full">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-card/30">
                  <tr className="border-b border-border">
                    <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                      {t("pktlog_packet")}
                    </th>
                    <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                      {t("pktlog_time")}
                    </th>
                    <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                      {t("pktlog_mnem")}
                    </th>
                    <th className="px-2 py-1 text-right text-muted-foreground" style={headerStyle}>
                      {t("pktlog_value")}
                    </th>
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
                        <td
                          className={`px-2 py-1 tabular-nums ${
                            isPending ? "text-muted-foreground" : "text-foreground"
                          }`}
                          style={cellStyle}
                        >
                          {row.num}
                        </td>
                        <td
                          className={`px-2 py-1 tabular-nums whitespace-nowrap ${
                            isPending ? "text-muted-foreground" : "text-foreground"
                          }`}
                          style={cellStyle}
                        >
                          {row.time}
                        </td>
                        <td className="px-2 py-1" style={cellStyle}>
                          <span
                            className={
                              isSync
                                ? "text-accent"
                                : isFidHeader
                                ? "text-chart-6"
                                : isPending
                                ? "text-muted-foreground"
                                : "text-foreground"
                            }
                          >
                            {row.mnem}
                          </span>
                        </td>
                        <td
                          className={`px-2 py-1 text-right tabular-nums ${
                            isPending
                              ? "text-muted-foreground"
                              : isFidHeader
                              ? "text-chart-6"
                              : "text-foreground"
                          }`}
                          style={cellStyle}
                        >
                          {row.value}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          {/* ===== Log Panel ===== */}
          <div className="flex flex-col" style={{ height: "45%" }}>
            <div className="flex items-center justify-between px-2 py-1 border-b border-border bg-card/50">
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Share2 className="size-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="autoscroll-log"
                    checked={autoScrollLog}
                    onCheckedChange={(v) => setAutoScrollLog(!!v)}
                  />
                  <label
                    htmlFor="autoscroll-log"
                    className="text-foreground cursor-pointer"
                    style={{
                      ...fontInter,
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)" as any,
                    }}
                  >
                    {t("pktlog_autoscroll")}
                  </label>
                </div>
                <button className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <SettingsIcon className="size-3.5" />
                </button>
                <button className="flex items-center justify-center size-[24px] rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <MoreHorizontal className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card/30 z-10">
                    <tr className="border-b border-border">
                      <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                        {t("pktlog_date")}
                      </th>
                      <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                        {t("pktlog_time")}
                      </th>
                      <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                        {t("pktlog_content")}
                      </th>
                      <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                        {t("pktlog_value")}
                      </th>
                      <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                        {t("pktlog_desc")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...logEntries].reverse().map((entry) => {
                      const isSyncRow = entry.value === "SYNC";
                      const isFid = entry.description.startsWith("FID");

                      return (
                        <tr
                          key={entry.id}
                          className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-2 py-1 text-muted-foreground tabular-nums whitespace-nowrap" style={cellStyle}>
                            {entry.date}
                          </td>
                          <td className="px-2 py-1 text-foreground tabular-nums whitespace-nowrap" style={cellStyle}>
                            {entry.datetime}
                          </td>
                          <td className="px-2 py-1 text-foreground" style={cellStyle}>
                            {entry.content}
                          </td>
                          <td className="px-2 py-1 tabular-nums" style={cellStyle}>
                            <span className={isSyncRow ? "text-accent" : isFid ? "text-chart-6" : "text-foreground"}>
                              {entry.value}
                            </span>
                          </td>
                          <td className="px-2 py-1" style={cellStyle}>
                            <span className={isFid ? "text-chart-6" : "text-muted-foreground"}>
                              {entry.description}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </ScrollArea>
            </div>

            {/* Log footer */}
            <div className="border-t border-border px-3 py-1.5 flex items-center">
              <div className="flex items-center gap-1.5">
                {receivedCount < totalChannels ? (
                  <>
                    <span className="size-2 rounded-full bg-chart-3 animate-pulse" />
                    <span
                      className="text-chart-3"
                      style={{ ...fontInter, fontSize: "var(--text-sm)" }}
                    >
                      {t("pktlog_waiting")} {nextChannelMnem} ({receivedCount + 1}/
                      {totalChannels})
                    </span>
                  </>
                ) : (
                  <>
                    <span className="size-2 rounded-full bg-accent" />
                    <span
                      className="text-accent"
                      style={{ ...fontInter, fontSize: "var(--text-sm)" }}
                    >
                      {t("pktlog_received")} ({totalChannels}/{totalChannels})
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ===== FID Navigator tab ===== */
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 min-h-0">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-card/30">
                <tr className="border-b border-border">
                  <th className="px-2 py-1 text-center text-muted-foreground" style={{ ...headerStyle, width: 36 }}>
                    {"<>"}
                  </th>
                  <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                    {t("pktlog_sync_time")}
                  </th>
                  <th className="px-2 py-1 text-left text-muted-foreground" style={{ ...headerStyle, width: 52 }}>
                    FID
                  </th>
                  <th className="px-2 py-1 text-left text-muted-foreground" style={headerStyle}>
                    {t("pktlog_fid_desc")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...navRows].reverse().map((row) => {
                  const isHovered = hoveredNavRow === row.id;
                  const isSelected = selectedNavRow === row.id;

                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-border/30 transition-colors cursor-pointer ${
                        isSelected ? "bg-primary/10" : "hover:bg-secondary/30"
                      }`}
                      onMouseEnter={() => setHoveredNavRow(row.id)}
                      onMouseLeave={() => setHoveredNavRow(null)}
                      onClick={() => setSelectedNavRow(row.id)}
                    >
                      <td className="px-1 py-1 text-center" style={cellStyle}>
                        {(isHovered || isSelected) && (
                          <button
                            className="inline-flex items-center justify-center size-[22px] rounded border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            title={t("pktlog_find_decoder")}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigate(row);
                            }}
                          >
                            <Search className="size-3" />
                          </button>
                        )}
                      </td>
                      <td className="px-2 py-1 tabular-nums whitespace-nowrap text-foreground" style={cellStyle}>
                        {row.syncTime}
                      </td>
                      <td className="px-2 py-1 tabular-nums text-chart-5" style={cellStyle}>
                        {row.fidNum}
                      </td>
                      <td className="px-2 py-1 text-foreground" style={cellStyle}>
                        {row.description}
                      </td>
                    </tr>
                  );
                })}

                {navRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-muted-foreground"
                      style={cellStyle}
                    >
                      {t("pktlog_no_fid")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>

          {/* Navigator footer */}
          <div className="border-t border-border px-3 py-1.5 flex items-center">
            <div className="flex items-center gap-1.5">
              <span
                className="text-muted-foreground"
                style={{ ...fontInter, fontSize: "var(--text-sm)" }}
              >
                {t("pktlog_total_fid")} {navRows.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { PacketRow };
export { buildRowsFromMwdData };