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
    ];
  }, [activeWell]);

  const surveys = useMemo(() => [
    { depth: (activeWell.holeDepth - 50).toFixed(1), inc: (activeWell.inc - 0.24).toFixed(2), azm: (activeWell.azm + 0.03).toFixed(2), t: "14:15" },
    { depth: (activeWell.holeDepth - 100).toFixed(1), inc: (activeWell.inc - 0.6).toFixed(2), azm: (activeWell.azm + 0.3).toFixed(2), t: "13:45" },
    { depth: (activeWell.holeDepth - 150).toFixed(1), inc: (activeWell.inc - 1.0).toFixed(2), azm: (activeWell.azm + 0.6).toFixed(2), t: "13:15" },
  ], [activeWell]);

  return (
    <div className="w-[380px] border-l border-border bg-background flex flex-col h-full shrink-0">
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
            className={`flex-1 flex items-center justify-center text-[12px] font-bold tracking-tight transition-all relative ${
              activeTab === tab.id
                ? "text-primary bg-background"
                : "text-foreground/40 hover:text-foreground/70"
            }`}
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
              <div key={i} className="px-4 py-1.5 hover:bg-secondary/10 transition-colors grid grid-cols-[56px_1fr_auto] gap-x-2 items-baseline">
                {/* Col 1: mnemonic */}
                <span className="text-[11px] font-bold font-mono text-foreground/40 uppercase tracking-wider">
                  {d.mnemonic}
                </span>
                {/* Col 2: value */}
                <span className="text-[14px] font-bold font-mono text-foreground truncate">
                  {d.packet}
                </span>
                {/* Col 3: seconds ago */}
                <span className="text-[11px] font-bold text-accent whitespace-nowrap">
                  {d.secsAgo}s AGO
                </span>
                {/* Row 2 spans all 3 cols */}
                <div className="col-span-3 flex items-center gap-3">
                  <span className="text-[10px] font-mono text-foreground/30">{d.datetime}</span>
                  <span className="text-[10px] font-mono font-bold text-accent">CONF:{d.conf}</span>
                  <span className="text-[10px] font-mono text-foreground/40">O:{d.O}</span>
                  <span className="text-[10px] font-mono text-foreground/40">L:{d.L}</span>
                </div>
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
