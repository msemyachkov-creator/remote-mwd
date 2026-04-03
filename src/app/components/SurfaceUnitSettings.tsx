import React, { useState } from "react";
import { X, Plus, Pencil, Minus } from "lucide-react";
import { ConfigureConnectionsModal } from "./ConfigureConnectionsModal";
import { useI18n } from "./i18n";

interface SurfaceUnitSettingsProps {
  onClose?: () => void;
}

function SensorRow({
  label,
  value,
  onChange,
  unit,
  checked,
  onCheck,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  checked?: boolean;
  onCheck?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 py-[3px]" style={{ fontFamily: "var(--font-family-base)" }}>
      {/* Checkbox or spacer */}
      {onCheck !== undefined ? (
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="size-3.5 accent-primary shrink-0"
        />
      ) : (
        <span className="size-3.5 shrink-0" />
      )}
      {/* Label */}
      <span
        className="text-sm shrink-0"
        style={{
          width: "160px",
          color: onCheck !== undefined ? (checked ? "var(--foreground)" : "var(--foreground)") : "var(--foreground)",
          opacity: onCheck !== undefined ? (checked ? 1 : 0.55) : 0.6,
        }}
      >
        {label}
      </span>
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 px-2 bg-input-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
        style={{ width: "140px", fontFamily: "var(--font-family-mono)", borderRadius: "var(--radius)" }}
      />
      {/* Unit */}
      {unit && (
        <span className="text-sm text-foreground/45 shrink-0">{unit}</span>
      )}
    </div>
  );
}

type TabId = "port-selection" | "connect";

export function SurfaceUnitSettings({ onClose }: SurfaceUnitSettingsProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabId>("port-selection");
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Ground Unit state
  const [port, setPort] = useState("COM5");
  const [isConnected, setIsConnected] = useState(true);
  const [firmwareVersion, setFirmwareVersion] = useState("FW:23 v1.33");
  const [status, setStatus] = useState("OK");
  const [state, setState] = useState("Polling ..");
  const [linkStatus, setLinkStatus] = useState("Connected");
  const [time, setTime] = useState("19-03-2026 15:29:06");

  // Depth Algorithm state
  const [slipsWeight, setSlipsWeight] = useState("35.00");
  const [outSlipsWeight, setOutSlipsWeight] = useState("80.00");
  const [pressureExit, setPressureExit] = useState("no");
  const [circThreshold, setCircThreshold] = useState("10.000");

  // Sensor data state
  const [encoderEnabled, setEncoderEnabled] = useState(false);
  const [encoderValue, setEncoderValue] = useState("10000");
  const [hookLoadEnabled, setHookLoadEnabled] = useState(false);
  const [hookLoadValue, setHookLoadValue] = useState("4.1");
  const [pressure1Enabled, setPressure1Enabled] = useState(false);
  const [pressure1Value, setPressure1Value] = useState("4");
  const [pressure2Enabled, setPressure2Enabled] = useState(false);
  const [pressure2Value, setPressure2Value] = useState("4");
  const [pump1StrokesEnabled, setPump1StrokesEnabled] = useState(false);
  const [pump1StrokesValue, setPump1StrokesValue] = useState("0.0");
  const [pump2StrokesEnabled, setPump2StrokesEnabled] = useState(false);
  const [pump2StrokesValue, setPump2StrokesValue] = useState("0.0");
  const [pump1CountValue, setPump1CountValue] = useState("0");
  const [pump2CountValue, setPump2CountValue] = useState("0");

  // Sensor Calibration state
  type CalibrationTab = "encoder" | "hook-load" | "pressure";
  const [calibrationTab, setCalibrationTab] = useState<CalibrationTab>("encoder");
  const [calibrationHeight, setCalibrationHeight] = useState("0.00");
  const [calibrationCounts, setCalibrationCounts] = useState("10000");
  const [calibrationPoints, setCalibrationPoints] = useState([
    { id: 1, counts: "10000", height: "0" },
    { id: 2, counts: "10000", height: "0" },
    { id: 3, counts: "10000", height: "5" },
  ]);

  // Hook Load Calibration state
  const [hookLoadWeight, setHookLoadWeight] = useState("0.00");
  const [hookLoadWeightUnit, setHookLoadWeightUnit] = useState("tons");
  const [hookLoadCurrent, setHookLoadCurrent] = useState("4.1");
  const [hookLoadCalibrationPoints, setHookLoadCalibrationPoints] = useState([
    { id: 1, current: "4.1", weight: "0.00", checked: false },
    { id: 2, current: "4.1", weight: "0.00", checked: false },
  ]);

  // Pressure Calibration state
  const [pressure1CalPressure, setPressure1CalPressure] = useState("1.01");
  const [pressure1CalUnit, setPressure1CalUnit] = useState("bar");
  const [pressure1CalCurrent, setPressure1CalCurrent] = useState("4.0");
  const [pressure1MaxPressure, setPressure1MaxPressure] = useState("1000.000");
  const [pressure1CalibrationEnabled, setPressure1CalibrationEnabled] = useState(false);
  
  const [pressure2CalPressure, setPressure2CalPressure] = useState("1.01");
  const [pressure2CalUnit, setPressure2CalUnit] = useState("bar");
  const [pressure2CalCurrent, setPressure2CalCurrent] = useState("4.0");
  const [pressure2MaxPressure, setPressure2MaxPressure] = useState("1000.000");
  const [pressure2CalibrationEnabled, setPressure2CalibrationEnabled] = useState(false);

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
      {/* Main content: sidebar + form */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left sidebar with tabs */}
        <div
          className="w-64 shrink-0 border-r border-border flex flex-col"
          style={{ backgroundColor: "var(--sidebar)" }}
        >
          {([
            { id: "port-selection" as TabId, label: "Port Selection",       value: port,                                       valueColor: "text-primary" },
            { id: "connect"        as TabId, label: "Connect / Disconnect", value: isConnected ? "Connected" : "Disconnected", valueColor: isConnected ? "text-chart-2" : "text-destructive" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-left transition-colors border-b border-border flex flex-col gap-0.5 ${
                activeTab === tab.id
                  ? "bg-primary/10 border-l-2 border-l-primary"
                  : "border-l-2 border-l-transparent text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
              }`}
              style={{ fontFamily: "var(--font-family-base)" }}
            >
              <span className={`text-xs font-medium ${activeTab === tab.id ? "text-primary" : "text-foreground/60"}`}>
                {tab.label}
              </span>
              <span className={`text-sm font-semibold ${tab.valueColor}`}>
                {tab.value}
              </span>
            </button>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 min-h-0 overflow-auto">

          {/* ── PORT SELECTION ── */}
          {activeTab === "port-selection" && (
            <div className="p-6 flex flex-col gap-5 max-w-xl">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Port Selection</span>
                  <span className="text-sm text-foreground/70">Select the serial port for Ground Unit communication.</span>
                </div>
                <button className="px-3 h-7 rounded border border-border bg-secondary text-xs text-foreground hover:bg-secondary/80 transition-colors" style={{ borderRadius: "var(--radius)" }}>
                  Refresh
                </button>
              </div>

              <div className="border border-border rounded bg-secondary/5" style={{ borderRadius: "var(--radius)" }}>
                {[
                  { name: "COM3", type: "USB Serial",    desc: "USB-SERIAL CH340"   },
                  { name: "COM4", type: "USB Serial",    desc: "USB-SERIAL FTDI"    },
                  { name: "COM5", type: "Native Serial", desc: "Ground Unit MWD"    },
                  { name: "COM6", type: "USB Serial",    desc: "USB-SERIAL CP210x"  },
                  { name: "COM7", type: "USB Serial",    desc: "Bluetooth COM Port" },
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setPort(p.name)}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between border-b border-border last:border-0 transition-colors ${
                      port === p.name ? "bg-primary/10" : "hover:bg-secondary/40"
                    }`}
                    style={{ fontFamily: "var(--font-family-base)" }}
                  >
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${port === p.name ? "text-primary" : "text-foreground/80"}`}>{p.name}</span>
                      <span className="text-xs text-foreground/40">{p.desc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground/40 font-mono">{p.type}</span>
                      {port === p.name && <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-1.5 py-0.5 bg-primary/10 rounded">Active</span>}
                    </div>
                  </button>
                ))}
              </div>

            </div>
          )}

          {/* ── CONNECT / DISCONNECT ── */}
          {activeTab === "connect" && (
            <div className="p-6 flex flex-col gap-5 max-w-xl">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Connect / Disconnect</span>
                <span className="text-sm text-foreground/70">Manage Ground Unit connection on port <span className="font-semibold text-primary">{port}</span>.</span>
              </div>

              <div className={`border rounded p-4 flex items-center gap-3 ${isConnected ? "border-chart-2/40 bg-chart-2/8" : "border-destructive/40 bg-destructive/8"}`} style={{ borderRadius: "var(--radius)" }}>
                <span className={`size-3 rounded-full shrink-0 ${isConnected ? "bg-chart-2" : "bg-destructive"}`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isConnected ? "text-chart-2" : "text-destructive"}`}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </p>
                  <p className="text-xs text-foreground/50" style={{ fontFamily: "var(--font-family-base)" }}>
                    {isConnected ? `Port: ${port} · Last sync: ${time}` : "No active connection"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsConnected(true)}
                  disabled={isConnected}
                  className={`px-4 h-8 rounded text-sm font-medium transition-colors ${
                    isConnected
                      ? "bg-secondary/30 border border-border text-foreground/30 cursor-not-allowed"
                      : "bg-chart-2 text-white hover:bg-chart-2/90"
                  }`}
                  style={{ fontFamily: "var(--font-family-base)", borderRadius: "var(--radius)" }}
                >
                  Connect to {port}
                </button>
                <button
                  onClick={() => setIsConnected(false)}
                  disabled={!isConnected}
                  className={`px-4 h-8 rounded text-sm font-medium transition-colors ${
                    !isConnected
                      ? "bg-secondary/30 border border-border text-foreground/30 cursor-not-allowed"
                      : "bg-destructive text-white hover:bg-destructive/90"
                  }`}
                  style={{ fontFamily: "var(--font-family-base)", borderRadius: "var(--radius)" }}
                >
                  Disconnect
                </button>
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="px-3 h-8 rounded bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors text-sm"
                  style={{ fontFamily: "var(--font-family-base)", borderRadius: "var(--radius)" }}
                >
                  Configure
                </button>
              </div>

              <div className="border border-border rounded p-4 bg-secondary/5 flex flex-col gap-3" style={{ borderRadius: "var(--radius)" }}>
                <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Auto-reconnect</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="size-4 accent-primary" />
                  <span className="text-sm text-foreground/70" style={{ fontFamily: "var(--font-family-base)" }}>Enable auto-reconnect on signal loss</span>
                </label>
                {[
                  { label: "Reconnect interval", value: "5", unit: "sec" },
                  { label: "Max retry attempts", value: "10", unit: "" },
                  { label: "Heartbeat interval", value: "1000", unit: "ms" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-foreground/60 w-44" style={{ fontFamily: "var(--font-family-base)" }}>{r.label}</span>
                    <input
                      type="text"
                      defaultValue={r.value}
                      className="w-24 h-7 px-2 bg-input-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      style={{ borderRadius: "var(--radius)" }}
                    />
                    {r.unit && <span className="text-sm text-foreground/40">{r.unit}</span>}
                  </div>
                ))}
              </div>

              {/* Status info */}
              <div className="border border-border rounded p-4 bg-secondary/5" style={{ borderRadius: "var(--radius)" }}>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                  {[
                    { label: "Port",           value: port,                                              color: "text-primary" },
                    { label: "Ground Unit",    value: isConnected ? "Connected" : "Disconnected",        color: isConnected ? "text-chart-2" : "text-destructive" },
                    { label: "Status",         value: status,                                            color: "text-chart-2" },
                    { label: "State",          value: state,                                             color: "text-foreground/70" },
                    { label: "Link",           value: linkStatus,                                        color: "text-chart-2" },
                    { label: "Uptime",         value: "4h 23m",                                         color: "text-foreground/70" },
                    { label: "Temperature",    value: "42 °C",                                          color: "text-foreground/70" },
                    { label: "Supply Voltage", value: "12.1 V",                                         color: "text-chart-2" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-foreground/60 w-36" style={{ fontFamily: "var(--font-family-base)" }}>{r.label}</span>
                      <span className={`text-sm font-semibold ${r.color}`} style={{ fontFamily: "var(--font-family-base)" }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-foreground/60 w-32" style={{ fontFamily: "var(--font-family-base)" }}>Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-64 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                />
              </div>

              {/* Firmware Version */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-foreground/60 w-32" style={{ fontFamily: "var(--font-family-base)" }}>Firmware Version</label>
                <span className="text-sm font-mono font-semibold text-foreground/80">{firmwareVersion}</span>
              </div>
            </div>
          )}

          {/* ── FIRMWARE VERSION (removed, kept for reference) ── */}
          {false && (
            <div className="p-6 flex flex-col gap-5 max-w-2xl">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Firmware Version</span>
                  <span className="text-sm text-foreground/70">Installed firmware, calibration and depth algorithm parameters.</span>
                </div>
                <button className="px-3 h-7 rounded border border-border bg-secondary text-xs text-foreground hover:bg-secondary/80 transition-colors" style={{ borderRadius: "var(--radius)" }}>
                  Check for updates
                </button>
              </div>

              <div className="border border-border rounded p-4 bg-secondary/5 flex flex-col gap-2.5" style={{ borderRadius: "var(--radius)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Installed Versions</span>
                  <span className="text-[10px] text-chart-2 font-semibold uppercase tracking-widest">Up to date</span>
                </div>
                {[
                  { label: "Ground Unit",    value: firmwareVersion, ok: true,  latest: "FW-23 v1.33" },
                  { label: "MP1 Module",     value: "HW48 v1.30.1",  ok: true,  latest: "HW48 v1.30.1" },
                  { label: "MPK Module",     value: "HW22 v1.30.2",  ok: true,  latest: "HW22 v1.30.2" },
                  { label: "MI Module",      value: "HW42 v1.30.2",  ok: true,  latest: "HW42 v1.30.2" },
                  { label: "Bootloader",     value: "BL v2.1.0",     ok: true,  latest: "BL v2.1.0" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full shrink-0" style={{ background: r.ok ? "var(--chart-2)" : "var(--destructive)" }} />
                    <span className="text-sm text-foreground/60 w-36" style={{ fontFamily: "var(--font-family-base)" }}>{r.label}</span>
                    <span className="text-sm font-mono font-semibold text-foreground flex-1">{r.value}</span>
                    {r.value !== r.latest && (
                      <span className="text-xs text-yellow-500 font-mono">→ {r.latest}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="border border-border rounded p-4 bg-secondary/5 flex flex-col gap-3" style={{ borderRadius: "var(--radius)" }}>
                <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Sensor Calibration</span>
                {[
                  { label: "Encoder",          lastCal: "14-11-2025", counts: calibrationCounts, setCounts: setCalibrationCounts, unit: "counts" },
                  { label: "Hook Load",         lastCal: "14-11-2025", counts: hookLoadCurrent,   setCounts: setHookLoadCurrent,   unit: "mA" },
                  { label: "Pressure №1",       lastCal: "14-11-2025", counts: pressure1CalCurrent, setCounts: setPressure1CalCurrent, unit: "mA" },
                  { label: "Pressure №2",       lastCal: "14-11-2025", counts: pressure2CalCurrent, setCounts: setPressure2CalCurrent, unit: "mA" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-foreground/60 w-36" style={{ fontFamily: "var(--font-family-base)" }}>{c.label}</span>
                    <input
                      type="text"
                      value={c.counts}
                      onChange={(e) => c.setCounts(e.target.value)}
                      className="w-24 h-7 px-2 bg-input-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      style={{ borderRadius: "var(--radius)" }}
                    />
                    <span className="text-xs text-foreground/40 w-12">{c.unit}</span>
                    <span className="text-xs text-foreground/30 font-mono ml-auto">Cal: {c.lastCal}</span>
                  </div>
                ))}
              </div>

              <div className="border border-border rounded p-4 bg-secondary/5 flex flex-col gap-3" style={{ borderRadius: "var(--radius)" }}>
                <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">Depth Algorithm Parameters</span>
                {[
                  { label: t("depth_algo_slips_weight"),     value: slipsWeight,     setValue: setSlipsWeight,     unit: t("unit_tons") },
                  { label: t("depth_algo_out_slips_weight"), value: outSlipsWeight,  setValue: setOutSlipsWeight,  unit: t("unit_tons") },
                  { label: t("depth_algo_threshold"),        value: circThreshold,   setValue: setCircThreshold,   unit: t("unit_bar")  },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <label className="text-sm text-foreground/60 w-56" style={{ fontFamily: "var(--font-family-base)" }}>{r.label}</label>
                    <input
                      type="text"
                      value={r.value}
                      onChange={(e) => r.setValue(e.target.value)}
                      className="w-32 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                      style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                    />
                    <span className="text-sm text-foreground/50 w-12" style={{ fontFamily: "var(--font-family-base)" }}>{r.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer with buttons */}
      <div className="h-12 shrink-0 flex items-center border-t border-border bg-secondary/20">
        {/* Spacer matching left sidebar width */}
        <div className="w-64 shrink-0 border-r border-border h-full" />
        {/* Aligned to max-w-xl content block above */}
        <div className="flex-1 flex items-center justify-end gap-3 px-6">
          <button
            onClick={handleClose}
            className="px-4 h-8 rounded bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors"
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)",
              borderRadius: "var(--radius)",
            }}
          >
            Close
          </button>
          {activeTab !== "port-selection" && (
            <button
              className="px-4 h-8 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                borderRadius: "var(--radius)",
              }}
            >
              {t("btn_create_work")}
            </button>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <ConfigureConnectionsModal onClose={() => setShowConfigModal(false)} />
      )}
    </div>
  );
}