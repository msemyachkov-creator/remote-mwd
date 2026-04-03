import React, { useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "./i18n";

interface CurrentRunSettingsProps {
  onClose?: () => void;
}

export function CurrentRunSettings({ onClose }: CurrentRunSettingsProps) {
  const { t } = useI18n();

  const [startDate, setStartDate]       = useState("2026-03-30");
  const [startTime, setStartTime]       = useState("08:00");
  const [endDate, setEndDate]           = useState("");
  const [endTime, setEndTime]           = useState("");
  const [startDepth, setStartDepth]     = useState("2800");
  const [endDepth, setEndDepth]         = useState("");
  const [isCurrent, setIsCurrent]       = useState(true);

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-family-base)",
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--foreground)",
    opacity: 0.6,
  };

  const inputCls =
    "h-8 px-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
      {/* Header */}
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
        >
          <X className="size-4 text-foreground/60" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div className="max-w-lg flex flex-col gap-6">

          {/* Run Status */}
          <div className="flex flex-col gap-2">
            <span style={labelStyle}>Run Status</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCurrent(true)}
                className={`flex items-center gap-2 px-3 h-8 rounded border text-sm font-medium transition-colors ${
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground/60 hover:bg-secondary/50"
                }`}
                style={{ fontFamily: "var(--font-family-base)", fontSize: "12px" }}
              >
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: isCurrent ? "var(--chart-2)" : "var(--border)" }}
                />
                Current Run
              </button>
              <button
                onClick={() => setIsCurrent(false)}
                className={`flex items-center gap-2 px-3 h-8 rounded border text-sm font-medium transition-colors ${
                  !isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground/60 hover:bg-secondary/50"
                }`}
                style={{ fontFamily: "var(--font-family-base)", fontSize: "12px" }}
              >
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: !isCurrent ? "var(--muted-foreground)" : "var(--border)" }}
                />
                Completed
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Start Date & Time */}
          <div className="flex flex-col gap-3">
            <span style={{ ...labelStyle, opacity: 0.45, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Start
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label style={labelStyle}>Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputCls}
                  style={{ fontFamily: "var(--font-family-base)", fontSize: "13px", width: "100%" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label style={labelStyle}>Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={inputCls}
                  style={{ fontFamily: "var(--font-family-base)", fontSize: "13px", width: "100%" }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label style={labelStyle}>Depth <span style={{ opacity: 0.5 }}>[m]</span></label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={startDepth}
                  onChange={(e) => setStartDepth(e.target.value)}
                  placeholder="0"
                  className={inputCls}
                  style={{ fontFamily: "var(--font-family-mono)", fontSize: "13px", width: "160px" }}
                />
                <span style={{ ...labelStyle, opacity: 0.4, fontSize: "11px" }}>m</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* End Date & Time */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span style={{ ...labelStyle, opacity: 0.45, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                End
              </span>
              {isCurrent && (
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-family-base)",
                    color: "var(--chart-2)",
                    fontWeight: 600,
                    opacity: 0.8,
                  }}
                >
                  — Run in progress
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label style={labelStyle}>Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isCurrent}
                  placeholder="—"
                  className={`${inputCls} ${isCurrent ? "opacity-40 cursor-not-allowed" : ""}`}
                  style={{ fontFamily: "var(--font-family-base)", fontSize: "13px", width: "100%" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label style={labelStyle}>Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isCurrent}
                  className={`${inputCls} ${isCurrent ? "opacity-40 cursor-not-allowed" : ""}`}
                  style={{ fontFamily: "var(--font-family-base)", fontSize: "13px", width: "100%" }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label style={labelStyle}>Depth <span style={{ opacity: 0.5 }}>[m]</span></label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={endDepth}
                  onChange={(e) => setEndDepth(e.target.value)}
                  disabled={isCurrent}
                  placeholder={isCurrent ? "—" : "0"}
                  className={`${inputCls} ${isCurrent ? "opacity-40 cursor-not-allowed" : ""}`}
                  style={{ fontFamily: "var(--font-family-mono)", fontSize: "13px", width: "160px" }}
                />
                <span style={{ ...labelStyle, opacity: 0.4, fontSize: "11px" }}>m</span>
              </div>
            </div>
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
