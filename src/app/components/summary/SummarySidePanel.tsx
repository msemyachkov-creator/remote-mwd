import React, { useState, useMemo } from "react";
import { useI18n } from "../i18n";
import { useWell } from "../WellContext";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

type Tab = "decodes" | "surveys" | "log";

interface SummarySidePanelProps {
  actions?: React.ReactNode;
}

export function SummarySidePanel({ actions }: SummarySidePanelProps = {}) {
  const { t } = useI18n();
  const { activeWell } = useWell();
  const [activeTab, setActiveTab] = useState<Tab>("decodes");

  const decodes = useMemo(() => {
    const d = "2026/03/30";
    const w = activeWell;
    return [
      { mnemonic: "SYNC",  packet: "MP SYNC",                          datetime: `${d} 15:35:01`, secsAgo: 4,  conf: 100, O:  0, L: 14 },
      { mnemonic: "GTF",   packet: w.gtf.toFixed(2),                   datetime: `${d} 15:34:10`, secsAgo: 55, conf: 100, O: -5, L: 38 },
      { mnemonic: "INC",   packet: w.inc.toFixed(5),                   datetime: `${d} 15:34:09`, secsAgo: 56, conf: 100, O: -5, L: 38 },
      { mnemonic: "DIPW",  packet: "NOM",                              datetime: `${d} 15:34:01`, secsAgo: 64, conf: 100, O:  2, L: 34 },
      { mnemonic: "DIPA",  packet: w.azm.toFixed(1),                   datetime: `${d} 15:34:01`, secsAgo: 64, conf: 100, O:  2, L: 34 },
      { mnemonic: "AZM",   packet: w.azm.toFixed(2),                   datetime: `${d} 15:33:53`, secsAgo: 72, conf: 100, O:  0, L: 33 },
      { mnemonic: "MAGW",  packet: "NOM",                              datetime: `${d} 15:33:44`, secsAgo: 81, conf: 100, O: -7, L: 36 },
      { mnemonic: "MAGF",  packet: (0.48 + w.seed % 10 * 0.001).toFixed(5), datetime: `${d} 15:33:40`, secsAgo: 85, conf: 100, O: 0, L: 36 },
      { mnemonic: "GAMMA", packet: w.gamma.toFixed(1),                 datetime: `${d} 15:33:39`, secsAgo: 86, conf: 98,  O:  0, L: 14 },
      { mnemonic: "TEMP",  packet: w.temp.toFixed(2),                  datetime: `${d} 15:33:20`, secsAgo: 105, conf: 98, O:  1, L: 22 },
      { mnemonic: "SSN",   packet: String(1 + w.seed % 9),             datetime: `${d} 15:33:15`, secsAgo: 110, conf: 100, O: 0, L: 36 },
      { mnemonic: "SYNC",  packet: "MP SYNC",                          datetime: `${d} 15:33:14`, secsAgo: 111, conf: 100, O: 0, L: 14 },
      { mnemonic: "RPM",   packet: String(Math.round(80 + w.seed % 40)),         datetime: `${d} 15:33:08`, secsAgo: 117, conf: 98,  O:  0, L: 22 },
      { mnemonic: "WOB",   packet: (12 + w.seed % 8).toFixed(1),                 datetime: `${d} 15:32:55`, secsAgo: 130, conf: 97,  O:  1, L: 22 },
      { mnemonic: "TORQ",  packet: (8.4 + w.seed % 5 * 0.3).toFixed(2),         datetime: `${d} 15:32:44`, secsAgo: 141, conf: 97,  O:  0, L: 22 },
      { mnemonic: "HL",    packet: String(Math.round(180 + w.seed % 40)),         datetime: `${d} 15:32:31`, secsAgo: 154, conf: 98,  O:  0, L: 22 },
      { mnemonic: "ROP",   packet: (13.7 + w.seed % 3 * 0.1).toFixed(1),        datetime: `${d} 15:32:20`, secsAgo: 165, conf: 96,  O:  2, L: 22 },
      { mnemonic: "FLOW",  packet: String(Math.round(1200 + w.seed % 80)),        datetime: `${d} 15:32:09`, secsAgo: 176, conf: 98,  O:  0, L: 22 },
      { mnemonic: "SPP",   packet: w.pressure.toFixed(0),                         datetime: `${d} 15:31:58`, secsAgo: 187, conf: 99,  O:  0, L: 22 },
      { mnemonic: "BATT",  packet: (28.2 + w.seed % 4 * 0.1).toFixed(1),        datetime: `${d} 15:31:44`, secsAgo: 201, conf: 100, O:  0, L: 22 },
      { mnemonic: "SYNC",  packet: "MP SYNC",                                     datetime: `${d} 15:31:30`, secsAgo: 215, conf: 100, O:  0, L: 14 },
      { mnemonic: "GTF",   packet: ((w.gtf + 0.4) % 360).toFixed(2),            datetime: `${d} 15:30:39`, secsAgo: 266, conf: 100, O: -5, L: 38 },
      { mnemonic: "INC",   packet: (w.inc - 0.01).toFixed(5),                   datetime: `${d} 15:30:38`, secsAgo: 267, conf: 100, O: -5, L: 38 },
    ];
  }, [activeWell]);

  const surveys = useMemo(() => [
    { depth: (activeWell.holeDepth - 50).toFixed(1), inc: (activeWell.inc - 0.24).toFixed(2), azm: (activeWell.azm + 0.03).toFixed(2), t: "14:15" },
    { depth: (activeWell.holeDepth - 100).toFixed(1), inc: (activeWell.inc - 0.6).toFixed(2), azm: (activeWell.azm + 0.3).toFixed(2), t: "13:45" },
    { depth: (activeWell.holeDepth - 150).toFixed(1), inc: (activeWell.inc - 1.0).toFixed(2), azm: (activeWell.azm + 0.6).toFixed(2), t: "13:15" },
  ], [activeWell]);

  return (
    <div className="border-l border-border bg-background flex flex-col h-full shrink-0" style={{ width: "clamp(260px, 23vw, 440px)" }}>
      {/* Tabs */}
      <div className="flex border-b border-border bg-secondary/5 h-10">
        {[
          { id: "decodes", label: t("sum_tab_decodes") },
          { id: "surveys", label: t("sum_tab_surveys") },
          { id: "log",     label: t("sum_tab_log") },
        ].map((tab) => (
          <button
            key={`side-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 flex items-center justify-center font-bold tracking-tight transition-all relative ${
              activeTab === tab.id
                ? "text-primary bg-background"
                : "text-foreground/40 hover:text-foreground/70"
            }`}
            style={{ fontSize: "clamp(9px, 0.65vw, 12px)" }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
        {/* Slot for extra actions (e.g. detach button) */}
        {actions && (
          <div className="flex items-center px-2 shrink-0 border-l border-border/40">
            {actions}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "decodes" && (
          <div className="divide-y divide-border">
            {decodes.map((d, i) => (
              <div key={i} className="hover:bg-secondary/10 transition-colors flex items-center" style={{ padding: "clamp(4px, 0.5vh, 10px) clamp(8px, 0.8vw, 16px)", gap: "clamp(6px, 0.6vw, 12px)" }}>
                {/* Left: mnemonic + value + metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline" style={{ gap: "clamp(4px, 0.4vw, 8px)" }}>
                    <span className="font-bold font-mono text-foreground/40 uppercase tracking-wider shrink-0" style={{ fontSize: "clamp(9px, 0.68vw, 13px)" }}>
                      {d.mnemonic}
                    </span>
                    <span className="font-bold font-mono text-foreground truncate" style={{ fontSize: "clamp(11px, 0.88vw, 17px)" }}>
                      {d.packet}
                    </span>
                  </div>
                  <div className="flex items-center" style={{ gap: "clamp(4px, 0.5vw, 12px)", marginTop: "clamp(1px, 0.1vh, 2px)" }}>
                    <span className="font-mono text-foreground/30" style={{ fontSize: "clamp(8px, 0.62vw, 12px)" }}>{d.datetime}</span>
                    <span className="font-mono font-bold text-accent" style={{ fontSize: "clamp(8px, 0.62vw, 12px)" }}>CONF:{d.conf}</span>
                    <span className="font-mono text-foreground/40" style={{ fontSize: "clamp(8px, 0.62vw, 12px)" }}>O:{d.O}</span>
                    <span className="font-mono text-foreground/40" style={{ fontSize: "clamp(8px, 0.62vw, 12px)" }}>L:{d.L}</span>
                  </div>
                </div>
                {/* Right: time AGO — scales with panel width */}
                <span className="whitespace-nowrap shrink-0 tabular-nums leading-none flex items-baseline gap-1">
                  <span className="font-bold text-accent tabular-nums" style={{ fontSize: "clamp(10px, 0.87vw, 16px)" }}>
                    {d.secsAgo < 60
                      ? `${d.secsAgo}s`
                      : `${Math.floor(d.secsAgo / 60)}m ${d.secsAgo % 60}s`}
                  </span>
                  <span className="font-mono text-foreground/40" style={{ fontSize: "clamp(9px, 0.7vw, 13px)" }}>ago</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "surveys" && (
          <div className="p-0">
            <table className="w-full text-[14px] border-collapse">
              <thead className="bg-secondary/10 sticky top-0">
                <tr>
                  <th className="px-4 py-1.5 text-left text-[11px] text-foreground/50 border-b border-border">Depth</th>
                  <th className="px-4 py-1.5 text-center text-[11px] text-foreground/50 border-b border-border">INC</th>
                  <th className="px-4 py-1.5 text-center text-[11px] text-foreground/50 border-b border-border">AZM</th>
                  <th className="px-4 py-1.5 text-right text-[11px] text-foreground/50 border-b border-border">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {surveys.map((s, i) => (
                  <tr key={`${s.depth}-${i}`} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-1.5 font-mono font-bold text-primary">{s.depth}</td>
                    <td className="px-4 py-1.5 text-center font-mono">{s.inc}°</td>
                    <td className="px-4 py-1.5 text-center font-mono">{s.azm}°</td>
                    <td className="px-4 py-1.5 text-right text-[10px] text-foreground/40 font-mono">{s.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "log" && (
          <div className="p-4 space-y-4">
            <div className="flex gap-3">
              <div className="size-2 rounded-full bg-accent mt-1 shrink-0" />
              <div>
                <p className="text-[14px] text-foreground font-medium leading-relaxed">System online. All modules checked.</p>
                <span className="text-[10px] text-foreground/40 font-mono">15:00:01</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-2 rounded-full bg-primary mt-1 shrink-0" />
              <div>
                <p className="text-[14px] text-foreground font-medium leading-relaxed">Pumps on. Flow rate 1240 lpm.</p>
                <span className="text-[10px] text-foreground/40 font-mono">15:20:45</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
