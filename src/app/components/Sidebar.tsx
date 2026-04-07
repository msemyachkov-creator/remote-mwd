import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Circle,
  Pencil,
  Trash2,
  TextCursorInput,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { useWell } from "./WellContext";
import { WorkSettings } from "./WorkSettings";
import { CurrentRunSettings } from "./CurrentRunSettings";
import { RigSettings } from "./RigSettings";

interface SidebarProps {
  activePage?: string;
  onPageChange?: (id: string) => void;
}

const RUN_STATUS_COLOR: Record<string, string> = {
  active:  "var(--accent)",
  standby: "var(--chart-3)",
  off:     "var(--muted-foreground)",
};

const BOX_STATUS_BORDER: Record<string, string> = {
  active:  "var(--accent)",
  paused:  "var(--chart-3)",
  offline: "var(--muted-foreground)",
};

// ─── Report status helpers ─────────────────────────────────────────────────
type ReportStatus = "sent" | "sending" | "not_sent" | "failed";

function getReportStatus(seed: number): ReportStatus {
  const statuses: ReportStatus[] = ["sent", "sending", "not_sent", "failed"];
  return statuses[seed % 4];
}

function getReportTime(seed: number): string {
  const mins = [2, 7, 14, 31, 58];
  const m = mins[seed % mins.length];
  return m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`;
}

const REPORT_STATUS_CFG: Record<ReportStatus, { label: string; color: string; dot?: string }> = {
  sent:     { label: "Sent",     color: "var(--chart-2)"         },
  sending:  { label: "Sending",  color: "#eab308",        dot: "animate-pulse" },
  not_sent: { label: "Not sent", color: "var(--muted-foreground)" },
  failed:   { label: "Failed",   color: "var(--destructive)"      },
};

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const { wells, activeWellId, setActiveWellId, rigs, wellEntries, renameRig } = useWell();
  const [searchQuery, setSearchQuery] = useState("");

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("sidebar-collapsed") === "true"; }
    catch { return false; }
  });

  const [expandedRig, setExpandedRig] = useState<string | null>(null);
  const [expandedWells, setExpandedWells] = useState<Set<string>>(() => new Set());
  const [editingWellId, setEditingWellId] = useState<string | null>(null);
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [rigModalOpen, setRigModalOpen] = useState(false);

  // Inline rename state for rig cards
  const [renamingRigId, setRenamingRigId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingRigId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingRigId]);

  const startRename = (rigId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingRigId(rigId);
    setRenameValue(currentName);
  };

  const commitRename = () => {
    if (renamingRigId && renameValue.trim()) {
      renameRig(renamingRigId, renameValue.trim());
    }
    setRenamingRigId(null);
  };

  const cancelRename = () => {
    setRenamingRigId(null);
  };

  const shouldHideSidebar =
    activePage === "work" || activePage === "surface" || activePage === "run";
  if (shouldHideSidebar) return null;

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem("sidebar-collapsed", String(next)); } catch {}
      return next;
    });
  };

  const toggleRig = (rigId: string) =>
    setExpandedRig((prev) => (prev === rigId ? null : rigId));

  const toggleWell = (wellId: string) =>
    setExpandedWells((prev) => { const s = new Set(prev); s.has(wellId) ? s.delete(wellId) : s.add(wellId); return s; });

  const query = searchQuery.toLowerCase();

  const runsForWell = (wellId: string) =>
    wells.filter((r) => r.wellId === wellId &&
      (!query || r.name.toLowerCase().includes(query) || `run ${r.runNumber}`.includes(query)));

  // Get the most recent (highest runNumber) run for a rig to show in the card
  const latestRunForRig = (rigId: string) => {
    const rigRuns = wells.filter((r) => r.rigId === rigId);
    return rigRuns.reduce<typeof rigRuns[0] | null>((best, r) =>
      !best || r.runNumber > best.runNumber ? r : best, null);
  };

  // Get the active or latest run + its well name for a rig
  const activeRunInfoForRig = (rigId: string) => {
    const rigRuns = wells.filter((r) => r.rigId === rigId);
    const run = rigRuns.find((r) => r.id === activeWellId)
      ?? rigRuns.reduce<typeof rigRuns[0] | null>((best, r) =>
        !best || r.runNumber > best.runNumber ? r : best, null);
    if (!run) return null;
    const well = wellEntries.find((w) => w.id === run.wellId);
    return { runNumber: run.runNumber, wellName: well?.name ?? "Well" };
  };

  const wellsForRig = (rigId: string) =>
    wellEntries.filter((w) => w.rigId === rigId &&
      (!query || runsForWell(w.id).length > 0));

  const visibleRigs = query
    ? rigs.filter((rig) => wellsForRig(rig.id).length > 0)
    : rigs;

  return (
    <div
      className="flex flex-col h-full border-r border-border bg-sidebar relative transition-all duration-300"
      style={{ width: isCollapsed ? 48 : 250 }}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center px-3 h-[40px] border-b border-border shrink-0 justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-5 shrink-0">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 20 L14 4 L20 20" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M10.5 20 L14 10 L17.5 20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="14" cy="4" r="2" fill="var(--chart-3)" />
                <line x1="5" y1="20" x2="23" y2="20" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="6" y1="23" x2="6" y2="20" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
                <line x1="10" y1="24" x2="10" y2="20" stroke="var(--chart-3)" strokeWidth="1" strokeLinecap="round" />
                <line x1="14" y1="23" x2="14" y2="20" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
                <line x1="18" y1="24" x2="18" y2="20" stroke="var(--chart-3)" strokeWidth="1" strokeLinecap="round" />
                <line x1="22" y1="23" x2="22" y2="20" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <p className="mwd-header text-sidebar-foreground leading-none">Remote MWD</p>
          </div>
        )}
        <button
          className="size-6 flex items-center justify-center text-foreground bg-secondary border border-border rounded transition-colors hover:bg-secondary/80 hover:border-foreground/20 shrink-0 mx-auto"
          style={isCollapsed ? {} : { marginLeft: "auto", marginRight: 0 }}
          onClick={toggleCollapsed}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="shrink-0 p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search wells..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-7 pl-8 pr-2 bg-input-background border border-border rounded text-foreground mwd-cell placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
              style={{ borderRadius: "var(--radius)" }}
            />
          </div>
        </div>
      )}

      {/* Tree */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
          {/* New Rig button */}
          <button
            onClick={() => setRigModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1.5 w-full text-left hover:bg-secondary/30 transition-colors rounded"
            style={{ borderRadius: "var(--radius)" }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-family-base)",
                color: "var(--muted-foreground)",
              }}
              className="hover:text-primary transition-colors"
            >
              + New Rig
            </span>
          </button>

          {visibleRigs.map((rig) => {
            const latest = latestRunForRig(rig.id);
            if (!latest) return null;
            const isRigExpanded = expandedRig === rig.id;
            const activeRunInfo = activeRunInfoForRig(rig.id);
            const activeInRig = wells.some((r) => r.rigId === rig.id && r.id === activeWellId);

            return (
              <div key={rig.id}>
                {/* Rig card — original WellWidget style, contains wells+runs when expanded */}
                <div
                  className={`group rounded border transition-all w-full relative ${
                    activeInRig
                      ? "bg-primary/10 border-primary/30 shadow-[0_0_10px_rgba(var(--color-primary),0.05)]"
                      : "bg-secondary/50 border-border"
                  }`}
                  style={{ borderRadius: "var(--radius)" }}
                >
                  {/* Header — clickable to toggle (disabled during rename) */}
                  <div
                    onClick={() => renamingRigId !== rig.id && toggleRig(rig.id)}
                    className={`flex items-stretch ${renamingRigId === rig.id ? "cursor-default" : "cursor-pointer"} ${
                      !activeInRig && renamingRigId !== rig.id ? "hover:bg-secondary/80" : ""
                    }`}
                    style={{ borderRadius: isRigExpanded ? `var(--radius) var(--radius) 0 0` : "var(--radius)" }}
                  >
                    {/* Left status strip — inside header only */}
                    <div className="flex items-center pl-[4px] py-[4px] shrink-0 self-stretch">
                      <div
                        className="w-[3px] h-full rounded-sm"
                        style={{ backgroundColor: BOX_STATUS_BORDER[rig.boxStatus] }}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 p-1.5 flex-1 min-w-0">
                    {/* Row 1: name + rename icon / rename input */}
                    <div className="flex items-center gap-1 w-full">
                      {renamingRigId === rig.id ? (
                        /* ── Inline rename mode ── */
                        <>
                          <input
                            ref={renameInputRef}
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename();
                              if (e.key === "Escape") cancelRename();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 min-w-0 h-5 px-1 bg-input-background border border-primary/50 rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontFamily: "var(--font-family-base)",
                              fontWeight: "var(--font-weight-medium)",
                              borderRadius: "3px",
                            }}
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); commitRename(); }}
                            className="flex items-center justify-center size-4 rounded hover:bg-primary/20 transition-colors shrink-0"
                            title="Confirm rename"
                          >
                            <Check className="size-3 text-primary" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); cancelRename(); }}
                            className="flex items-center justify-center size-4 rounded hover:bg-destructive/20 transition-colors shrink-0"
                            title="Cancel rename"
                          >
                            <X className="size-3 text-muted-foreground hover:text-destructive" />
                          </button>
                        </>
                      ) : (
                        /* ── Normal display mode ── */
                        <>
                          <span
                            className="flex-1 text-foreground truncate"
                            style={{
                              fontSize: "var(--text-sm)",
                              fontFamily: "var(--font-family-base)",
                              fontWeight: "var(--font-weight-medium)",
                              lineHeight: "16px",
                            }}
                          >
                            {rig.name}
                          </span>
                          {rig.boxStatus !== "active" && (
                            <span
                              className="shrink-0 capitalize text-muted-foreground"
                              style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
                            >
                              {rig.boxStatus}
                            </span>
                          )}
                          {/* Rename icon — visible on card hover */}
                          <button
                            onClick={(e) => startRename(rig.id, rig.name, e)}
                            className="opacity-0 group-hover:opacity-100 flex items-center justify-center size-4 rounded hover:bg-primary/20 transition-all shrink-0"
                            title="Rename"
                          >
                            <TextCursorInput className="size-3 text-muted-foreground hover:text-primary" />
                          </button>
                          {/* Detach — open in new tab */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const w = window.open(`${import.meta.env.BASE_URL}#/rig/${rig.id}`, "_blank", "noopener,noreferrer");
                              w?.focus();
                            }}
                            className="opacity-0 group-hover:opacity-100 flex items-center justify-center size-4 rounded hover:bg-primary/20 transition-all shrink-0"
                            title="Открепить в новой вкладке"
                          >
                            <ExternalLink className="size-3 text-muted-foreground hover:text-primary" />
                          </button>
                        </>
                      )}
                    </div>
                    {/* Row 2: Job ID */}
                    <span
                      className="truncate text-muted-foreground"
                      style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
                    >
                      {rig.jobId}
                    </span>
                    {/* Row 3: Active well + run */}
                    {activeRunInfo && (
                      <span
                        className="text-muted-foreground"
                        style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
                      >
                        ↳ {activeRunInfo.wellName} · Run {activeRunInfo.runNumber}
                      </span>
                    )}
                    {/* Row 4: MD · Inc · AZ on one line */}
                    <div
                      className="flex gap-2 flex-wrap"
                      style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
                    >
                      <span className="whitespace-nowrap">
                        <span className="text-muted-foreground" style={{ fontWeight: "var(--font-weight-medium)" }}>MD</span>
                        {" "}<span className="tabular-nums text-foreground/80">{latest.holeDepth.toLocaleString()}</span>
                        {" "}<span className="text-foreground/40">{latest.unit}</span>
                      </span>
                      <span className="whitespace-nowrap">
                        <span className="text-muted-foreground" style={{ fontWeight: "var(--font-weight-medium)" }}>Inc</span>
                        {" "}<span className="tabular-nums text-foreground/80">{latest.inc.toFixed(2)}</span>
                        <span className="text-foreground/40">°</span>
                      </span>
                      <span className="whitespace-nowrap">
                        <span className="text-muted-foreground" style={{ fontWeight: "var(--font-weight-medium)" }}>AZ</span>
                        {" "}<span className="tabular-nums text-foreground/80">{latest.azm.toFixed(2)}</span>
                        <span className="text-foreground/40">°</span>
                      </span>
                    </div>
                    {/* Row 5: Bit + Report status */}
                    {(() => {
                      const status = getReportStatus(latest.seed);
                      const cfg = REPORT_STATUS_CFG[status];
                      return (
                        <div
                          className="flex items-center justify-between gap-1"
                          style={{ fontSize: "10px", fontFamily: "var(--font-family-base)" }}
                        >
                          <span className="whitespace-nowrap">
                            <span className="text-muted-foreground" style={{ fontWeight: "var(--font-weight-medium)" }}>Bit</span>
                            {" "}<span className="tabular-nums text-foreground/80">{latest.bitDepth.toLocaleString()}</span>
                            {" "}<span className="text-foreground/40">{latest.unit}</span>
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <span
                              className={`inline-block size-1.5 rounded-full ${cfg.dot ?? ""}`}
                              style={{ backgroundColor: cfg.color }}
                            />
                            <span style={{ color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
                            {status === "sent" && (
                              <span className="text-foreground/30">{getReportTime(latest.seed)}</span>
                            )}
                          </span>
                        </div>
                      );
                    })()}
                    </div>{/* closes content flex col */}
                  </div>{/* closes header flex row */}

                  {/* Wells — expanded, inside the card border */}
                  {isRigExpanded && (
                    <div className="flex flex-col pb-1">
                      {wellsForRig(rig.id).map((well) => {
                        const runs = runsForWell(well.id);
                        if (runs.length === 0) return null;
                        const isWellExpanded = expandedWells.has(well.id);

                        return (
                          <div key={well.id}>

                            {/* Well row */}
                            <div className="group/well w-full flex items-center h-6 px-2 hover:bg-secondary/40 transition-colors">
                              <button
                                onClick={() => toggleWell(well.id)}
                                className="flex items-center gap-1 flex-1 min-w-0 text-left"
                              >
                                {isWellExpanded
                                  ? <ChevronDown className="size-3 text-muted-foreground shrink-0" />
                                  : <ChevronRightIcon className="size-3 text-muted-foreground shrink-0" />
                                }
                                <span
                                  className="flex-1 truncate text-foreground/70"
                                  style={{
                                    fontSize: "var(--text-xs)",
                                    fontFamily: "var(--font-family-base)",
                                    fontWeight: "var(--font-weight-medium)",
                                  }}
                                >
                                  {well.name}
                                </span>
                              </button>
                              {/* Edit / Delete — visible on hover */}
                              <div className="hidden group-hover/well:flex items-center gap-0.5 shrink-0 ml-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingWellId(well.id); }}
                                  className="flex items-center justify-center size-4 rounded hover:bg-primary/20 transition-colors"
                                  title="Edit well"
                                >
                                  <Pencil className="size-2.5 text-foreground/50 hover:text-primary" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="flex items-center justify-center size-4 rounded hover:bg-destructive/20 transition-colors"
                                  title="Delete well"
                                >
                                  <Trash2 className="size-2.5 text-foreground/50 hover:text-destructive" />
                                </button>
                              </div>
                            </div>

                            {/* Runs — expanded */}
                            {isWellExpanded && (
                              <div className="flex flex-col">
                                {runs.map((run) => {
                                  const isActive = run.id === activeWellId;
                                  return (
                                    <div
                                      key={run.id}
                                      className={`group/run w-full flex items-start gap-1 pr-2 py-1 transition-colors ${
                                        isActive
                                          ? "bg-primary/10 border-l-2 border-primary"
                                          : "hover:bg-secondary/30 border-l-2 border-transparent"
                                      }`}
                                    >
                                    <button
                                      onClick={() => setActiveWellId(run.id)}
                                      className="flex-1 flex flex-col gap-0.5 pl-6 text-left min-w-0"
                                    >
                                    <div className="flex items-center gap-1.5">
                                      <Circle
                                        className="size-2 shrink-0"
                                        style={{
                                          color: RUN_STATUS_COLOR[run.status],
                                          fill: RUN_STATUS_COLOR[run.status],
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: "var(--text-xs)",
                                          fontFamily: "var(--font-family-base)",
                                          fontWeight: isActive ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
                                          color: isActive ? "var(--primary)" : "var(--foreground)",
                                        }}
                                      >
                                        Run {run.runNumber}
                                      </span>
                                    </div>
                                    <div
                                      className="flex flex-col gap-0 pl-3.5"
                                      style={{
                                        fontSize: "10px",
                                        fontFamily: "var(--font-family-base)",
                                        color: "var(--muted-foreground)",
                                      }}
                                    >
                                      <span>Start <span style={{ color: "var(--foreground)", opacity: 0.6 }}>{run.startDate}</span></span>
                                      {run.endDate && (
                                        <span>End <span style={{ color: "var(--foreground)", opacity: 0.6 }}>{run.endDate}</span></span>
                                      )}
                                    </div>
                                    </button>
                                    {/* Edit / Delete — visible on hover */}
                                    <div className="hidden group-hover/run:flex flex-col gap-0.5 pt-1 shrink-0">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setRunModalOpen(true); }}
                                        className="flex items-center justify-center size-4 rounded hover:bg-primary/20 transition-colors"
                                        title="Edit run"
                                      >
                                        <Pencil className="size-2.5 text-foreground/50 hover:text-primary" />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); }}
                                        className="flex items-center justify-center size-4 rounded hover:bg-destructive/20 transition-colors"
                                        title="Delete run"
                                      >
                                        <Trash2 className="size-2.5 text-foreground/50 hover:text-destructive" />
                                      </button>
                                    </div>
                                    </div>
                                );
                              })}
                              {/* New Run button */}
                              <button
                                onClick={() => setRunModalOpen(true)}
                                className="flex items-center gap-1.5 pl-6 pr-2 py-1 w-full text-left hover:bg-secondary/30 transition-colors"
                              >
                                <ChevronRightIcon className="size-3 text-muted-foreground/40 shrink-0 opacity-0" />
                                <span
                                  style={{
                                    fontSize: "var(--text-xs)",
                                    fontFamily: "var(--font-family-base)",
                                    color: "var(--muted-foreground)",
                                  }}
                                  className="hover:text-primary transition-colors"
                                >
                                  + New Run
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                      {/* New Well button */}
                      <button
                        onClick={() => setEditingWellId("new")}
                        className="flex items-center gap-1.5 px-2 py-1 w-full text-left hover:bg-secondary/30 transition-colors"
                      >
                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            fontFamily: "var(--font-family-base)",
                            color: "var(--muted-foreground)",
                          }}
                          className="hover:text-primary transition-colors"
                        >
                          + New Well
                        </span>
                      </button>
                  </div>
                )}
            </div>{/* closes rig card */}
              </div>
            );
          })}
        </div>
      )}

      {/* Run Edit / New Run Modal */}
      {runModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setRunModalOpen(false)}
        >
          <div
            className="bg-background border border-border rounded shadow-xl flex flex-col overflow-hidden"
            style={{ width: 900, height: 620, borderRadius: "var(--radius)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <CurrentRunSettings onClose={() => setRunModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Rig Add Modal */}
      {rigModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setRigModalOpen(false)}
        >
          <div
            className="bg-background border border-border rounded shadow-xl flex flex-col overflow-hidden"
            style={{ width: 480, height: 500, borderRadius: "var(--radius)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <RigSettings onClose={() => setRigModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Well Edit Modal */}
      {editingWellId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setEditingWellId(null)}
        >
          <div
            className="bg-background border border-border rounded shadow-xl flex flex-col overflow-hidden"
            style={{ width: 760, height: 560, borderRadius: "var(--radius)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <WorkSettings onClose={() => setEditingWellId(null)} />
          </div>
        </div>
      )}

      {/* Collapsed: stacked rig initials */}
      {isCollapsed && (
        <div className="flex-1 overflow-y-auto p-2 flex flex-col items-center gap-1.5 pt-2">
          {rigs.map((rig) => {
            const match = rig.name.match(/PD(\d+)/);
            const num = match ? match[1] : rig.name;
            const activeInRig = wells.some((r) => r.rigId === rig.id && r.id === activeWellId);
            return (
              <div
                key={rig.id}
                className={`w-8 h-8 flex flex-col items-center justify-center rounded border ${
                  activeInRig
                    ? "bg-primary/15 border-primary/30"
                    : "bg-secondary border-border"
                }`}
                style={{ borderRadius: "var(--radius)" }}
                title={rig.name}
              >
                <span style={{ fontSize: "8px", fontFamily: "var(--font-family-base)", fontWeight: "700", color: "var(--foreground)" }}>PD</span>
                <span style={{ fontSize: "8px", fontFamily: "var(--font-family-base)", fontWeight: "400", color: "var(--foreground)" }}>{num}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
