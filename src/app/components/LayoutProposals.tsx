import React, { useState } from "react";

/* ─── Shared mock data ─── */
const MOCK = {
  holDepth: "23,568 ft",
  bitDepth: "9,879 ft",
  rop: "13.7 m/h",
  spp: "1,250 PSI",
  rpm: "82 RPM",
  pw: "0.375",
  gtf: "345.2°",
  mtf: "122.2°",
  azm: "284.12°",
  inc: "12.45°",
  gr: "45.2 API",
  temp: "85.4 °C",
  syncStatus: "SYNC ACQUIRED",
  pumpStatus: "PUMPS ON",
  circTime: "0:01:42",
  lastPkt: "4 sec ago",
};

const DECODES = [
  { id: "#1101", dt: "2026-03-30 15:26:08", mnemonic: "GTF",   value: "345.28°",  conf: 100, amp: 32 },
  { id: "#1101", dt: "2026-03-30 15:26:08", mnemonic: "INC",   value: "12.45°",   conf: 100, amp: 32 },
  { id: "#1101", dt: "2026-03-30 15:26:08", mnemonic: "AZM",   value: "284.12°",  conf: 100, amp: 32 },
  { id: "#1102", dt: "2026-03-30 15:28:15", mnemonic: "GAMMA", value: "45.2 API", conf: 98,  amp: 29 },
  { id: "#1102", dt: "2026-03-30 15:28:15", mnemonic: "TEMP",  value: "85.4 °C",  conf: 98,  amp: 29 },
];

/* ─── Reusable mini components for proposals ─── */

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold tracking-widest uppercase"
      style={{ borderColor: color, color }}>
      <span className="size-1.5 rounded-full animate-pulse inline-block" style={{ background: color }} />
      {label}
    </span>
  );
}

function MetricCell({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: boolean }) {
  return (
    <div className="flex flex-col px-4 py-2 border-r border-border/40 last:border-r-0">
      <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-base font-mono font-bold ${accent ? "text-accent" : "text-foreground"}`}>{value}</span>
        {unit && <span className="text-[9px] text-foreground/40">{unit}</span>}
      </div>
    </div>
  );
}

function NumCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 bg-secondary/30 border border-border/30 rounded min-w-[120px]">
      <div className="flex items-baseline gap-1.5">
        <span className="text-foreground/70 text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-xs">{unit}</span>
      </div>
      <span className="font-mono font-bold text-accent leading-none" style={{ fontSize: "22px" }}>{value}</span>
    </div>
  );
}

function GaugePlaceholder({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-full border-2 border-border/20 bg-secondary/5"
      style={{ width: 220, height: 220 }}>
      <span className="text-3xl font-mono font-bold text-foreground">{value}</span>
      <span className="text-[10px] font-bold tracking-widest uppercase mt-1" style={{ color }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════
   OPTION A — Compact Top Strip
   ═══════════════════════════════════════ */
function OptionA() {
  return (
    <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden">
      <div className="bg-primary/10 border-b border-primary/30 px-3 py-1.5 text-[11px] font-bold text-primary tracking-wide">
        OPTION A — Compact top strip with key metrics
      </div>

      {/* Top metrics strip */}
      <div className="flex items-stretch bg-card border-b border-border shrink-0" style={{ minHeight: 48 }}>
        <MetricCell label="Hole Depth" value="23,568" unit="ft" accent />
        <MetricCell label="Bit Depth"  value="9,879"  unit="ft" />
        <MetricCell label="ROP"        value="13.7"   unit="m/h" accent />
        <MetricCell label="SPP"        value="1,250"  unit="PSI" />
        <MetricCell label="RPM"        value="82"     unit="rpm" />
        <div className="flex items-center gap-3 px-4 ml-auto">
          <Badge label="SYNC ACQUIRED" color="var(--accent)" />
          <Badge label="PUMPS ON" color="var(--chart-3)" />
          <span className="text-[10px] text-foreground/40 font-mono">Last: {MOCK.lastPkt}</span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left numerals */}
        <div className="flex flex-col gap-3 p-4 justify-center">
          <NumCard label="ROP" value="13.7" unit="m/h" />
          <NumCard label="GR"  value="45.2" unit="API" />
          <div className="flex items-center gap-2 px-3 py-2 border border-border/20 bg-background/60 rounded-md self-start">
            <div className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-foreground/50 tracking-widest uppercase">DRILLING</span>
          </div>
        </div>

        {/* Gauges */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <GaugePlaceholder label="GTF" value="345.2°" color="var(--primary)" />
          <GaugePlaceholder label="MTF" value="122.2°" color="var(--accent)" />
        </div>

        {/* Right numerals */}
        <div className="flex flex-col gap-3 p-4 justify-center">
          <NumCard label="AZM" value="284.12" unit="°" />
          <NumCard label="INC" value="12.45"  unit="°" />
          <div className="flex items-center gap-2 px-3 py-2 border border-border/20 bg-background/60 rounded-md self-start">
            <div className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-foreground/50 tracking-widest uppercase">REAL-TIME</span>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-[300px] border-l border-border flex flex-col">
          <div className="flex border-b border-border bg-secondary/5 h-9">
            {["Decodes", "Surveys", "Log"].map((t, i) => (
              <button key={t} className={`flex-1 text-[10px] font-bold ${i === 0 ? "text-primary border-b-2 border-primary bg-background" : "text-foreground/40"}`}>{t}</button>
            ))}
          </div>
          <table className="w-full text-[10px]">
            <thead className="bg-secondary/10">
              <tr>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">№</th>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Date / Time</th>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Mnemonic</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Value</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Conf</th>
              </tr>
            </thead>
            <tbody>
              {DECODES.map((d, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="p-1.5 font-mono text-foreground/30">{d.id}</td>
                  <td className="p-1.5 font-mono text-foreground/50 whitespace-nowrap">{d.dt.split(" ")[1]}</td>
                  <td className="p-1.5 font-bold text-foreground">{d.mnemonic}</td>
                  <td className="p-1.5 font-mono text-accent text-right">{d.value}</td>
                  <td className="p-1.5 text-right">
                    <span className={`font-bold ${d.conf >= 99 ? "text-accent" : "text-chart-3"}`}>{d.conf}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   OPTION B — Status sidebar on the left
   ═══════════════════════════════════════ */
function OptionB() {
  return (
    <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden">
      <div className="bg-accent/10 border-b border-accent/30 px-3 py-1.5 text-[11px] font-bold text-accent tracking-wide">
        OPTION B — Status + depth in an extended left panel
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Extended left panel: status + metrics + numerals */}
        <div className="flex flex-col border-r border-border bg-secondary/5" style={{ width: 180 }}>
          {/* Sync + pump status */}
          <div className="p-3 border-b border-border space-y-2">
            <Badge label="SYNC ACQUIRED" color="var(--accent)" />
            <Badge label="PUMPS ON" color="var(--chart-3)" />
            <div className="text-[9px] text-foreground/40 font-mono">Circ: {MOCK.circTime}</div>
            <div className="text-[9px] text-foreground/40 font-mono">Last pkt: {MOCK.lastPkt}</div>
          </div>
          {/* Depths */}
          <div className="p-3 border-b border-border">
            <div className="text-[9px] font-bold text-foreground/40 uppercase mb-2">Depths</div>
            <div className="space-y-2">
              <div>
                <div className="text-[9px] text-foreground/40">Hole</div>
                <div className="text-sm font-mono font-bold text-accent">23,568 ft</div>
              </div>
              <div>
                <div className="text-[9px] text-foreground/40">Bit</div>
                <div className="text-sm font-mono font-bold text-foreground">9,879 ft</div>
              </div>
            </div>
          </div>
          {/* Numerals */}
          <div className="flex flex-col gap-2 p-3">
            {[
              { l: "ROP",  v: "13.7",  u: "m/h" },
              { l: "GR",   v: "45.2",  u: "API" },
              { l: "SPP",  v: "1,250", u: "PSI" },
              { l: "TEMP", v: "85.4",  u: "°C" },
              { l: "PW",   v: "0.375", u: "" },
            ].map(({ l, v, u }) => (
              <div key={l} className="flex justify-between items-baseline border-b border-border/20 pb-1">
                <span className="text-[9px] text-foreground/40 font-bold uppercase">{l}</span>
                <span className="text-xs font-mono font-bold text-foreground">{v} <span className="text-foreground/30 text-[9px]">{u}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Center gauges */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <GaugePlaceholder label="GTF" value="345.2°" color="var(--primary)" />
          <GaugePlaceholder label="MTF" value="122.2°" color="var(--accent)" />
        </div>

        {/* Right panel: AZM/INC + Decodes */}
        <div className="w-[300px] border-l border-border flex flex-col">
          <div className="flex gap-3 p-3 border-b border-border">
            <NumCard label="AZM" value="284.12" unit="°" />
            <NumCard label="INC" value="12.45"  unit="°" />
          </div>
          <div className="flex border-b border-border bg-secondary/5 h-9">
            {["Decodes", "Surveys", "Log"].map((t, i) => (
              <button key={t} className={`flex-1 text-[10px] font-bold ${i === 0 ? "text-primary border-b-2 border-primary bg-background" : "text-foreground/40"}`}>{t}</button>
            ))}
          </div>
          <table className="w-full text-[10px]">
            <thead className="bg-secondary/10">
              <tr>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Date/Time</th>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Mnemonic</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Value</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Conf</th>
              </tr>
            </thead>
            <tbody>
              {DECODES.map((d, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="p-1.5 font-mono text-foreground/50 whitespace-nowrap">{d.dt.split(" ")[1]}</td>
                  <td className="p-1.5 font-bold text-foreground">{d.mnemonic}</td>
                  <td className="p-1.5 font-mono text-accent text-right">{d.value}</td>
                  <td className="p-1.5 text-right font-bold text-accent">{d.conf}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   OPTION C — Floating status bar + enhanced right panel
   ═══════════════════════════════════════ */
function OptionC() {
  return (
    <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden">
      <div className="bg-chart-3/10 border-b border-chart-3/30 px-3 py-1.5 text-[11px] font-bold text-chart-3 tracking-wide">
        OPTION C — Floating status overlay + enhanced right panel with live values
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left numerals */}
        <div className="flex flex-col gap-3 p-4 justify-center">
          <NumCard label="ROP" value="13.7" unit="m/h" />
          <NumCard label="GR"  value="45.2" unit="API" />
          <div className="flex items-center gap-2 px-3 py-2 border border-border/20 bg-background/60 rounded-md self-start">
            <div className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-foreground/50 tracking-widest uppercase">DRILLING</span>
          </div>
        </div>

        {/* Center — gauges + floating overlay */}
        <div className="flex-1 relative flex items-center justify-center gap-8">
          <GaugePlaceholder label="GTF" value="345.2°" color="var(--primary)" />
          <GaugePlaceholder label="MTF" value="122.2°" color="var(--accent)" />

          {/* Floating status overlay (top-center) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-background/80 border border-border/40 rounded-full backdrop-blur-sm shadow-lg">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-accent tracking-widest uppercase">SYNC ACQUIRED</span>
            <div className="w-px h-3 bg-border/60" />
            <span className="text-[10px] font-bold text-chart-3 tracking-widest uppercase">PUMPS ON</span>
            <div className="w-px h-3 bg-border/60" />
            <span className="text-[9px] text-foreground/40 font-mono">0:01:42</span>
            <div className="w-px h-3 bg-border/60" />
            <span className="text-[9px] text-foreground/40 font-mono">Last: 4s</span>
          </div>

          {/* Floating depth overlay (bottom-center) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-0 bg-background/80 border border-border/40 rounded-lg backdrop-blur-sm overflow-hidden">
            <div className="px-4 py-2 border-r border-border/40">
              <div className="text-[8px] text-foreground/40 uppercase tracking-wider">Hole</div>
              <div className="text-sm font-mono font-bold text-accent">23,568 ft</div>
            </div>
            <div className="px-4 py-2 border-r border-border/40">
              <div className="text-[8px] text-foreground/40 uppercase tracking-wider">Bit</div>
              <div className="text-sm font-mono font-bold text-foreground">9,879 ft</div>
            </div>
            <div className="px-4 py-2 border-r border-border/40">
              <div className="text-[8px] text-foreground/40 uppercase tracking-wider">SPP</div>
              <div className="text-sm font-mono font-bold text-foreground">1,250 PSI</div>
            </div>
            <div className="px-4 py-2">
              <div className="text-[8px] text-foreground/40 uppercase tracking-wider">PW</div>
              <div className="text-sm font-mono font-bold text-foreground">0.375</div>
            </div>
          </div>
        </div>

        {/* Right panel: live values grid + Decodes */}
        <div className="w-[320px] border-l border-border flex flex-col">
          {/* Live values grid */}
          <div className="grid grid-cols-2 gap-0 border-b border-border">
            {[
              { l: "AZM",  v: "284.12°", accent: true },
              { l: "INC",  v: "12.45°",  accent: true },
              { l: "TEMP", v: "85.4 °C", accent: false },
              { l: "RPM",  v: "82",      accent: false },
            ].map(({ l, v, accent }, i) => (
              <div key={l} className={`flex flex-col px-3 py-2 ${i % 2 === 0 ? "border-r border-border/40" : ""} ${i < 2 ? "border-b border-border/40" : ""}`}>
                <span className="text-[9px] text-foreground/40 font-bold uppercase">{l}</span>
                <span className={`text-base font-mono font-bold ${accent ? "text-accent" : "text-foreground"}`}>{v}</span>
              </div>
            ))}
          </div>

          {/* Decodes table */}
          <div className="flex border-b border-border bg-secondary/5 h-9">
            {["Decodes", "Surveys", "Log"].map((tab, i) => (
              <button key={tab} className={`flex-1 text-[10px] font-bold ${i === 0 ? "text-primary border-b-2 border-primary bg-background" : "text-foreground/40"}`}>{tab}</button>
            ))}
          </div>
          <table className="w-full text-[10px]">
            <thead className="bg-secondary/10">
              <tr>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Time</th>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Mnemonic</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Value</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Conf%</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Amp</th>
              </tr>
            </thead>
            <tbody>
              {DECODES.map((d, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="p-1.5 font-mono text-foreground/50 whitespace-nowrap">{d.dt.split(" ")[1]}</td>
                  <td className="p-1.5 font-bold text-foreground">{d.mnemonic}</td>
                  <td className="p-1.5 font-mono text-accent text-right">{d.value}</td>
                  <td className="p-1.5 text-right font-bold text-accent">{d.conf}%</td>
                  <td className="p-1.5 text-right font-mono text-foreground/50">{d.amp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   OPTION D — Status badges inside the gauge block (above gauges)
              + Extra numeral widgets in left/right columns
   ═══════════════════════════════════════ */
function OptionD() {
  return (
    <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden">
      <div className="bg-primary/10 border-b border-primary/30 px-3 py-1.5 text-[11px] font-bold text-primary tracking-wide">
        OPTION D — Status badges above the gauges + extra numerals in side columns
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left column: ROP, GR, SPP, TEMP */}
        <div className="flex flex-col gap-3 p-4 justify-center shrink-0">
          <NumCard label="ROP"  value="13.7"   unit="m/h" />
          <NumCard label="GR"   value="45.2"   unit="API" />
          <NumCard label="SPP"  value="1,250"  unit="PSI" />
          <NumCard label="TEMP" value="85.4"   unit="°C"  />
          <div className="flex items-center gap-2 px-3 py-2 border border-border/20 bg-background/60 rounded-md self-start">
            <div className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-foreground/50 tracking-widest uppercase">DRILLING</span>
          </div>
        </div>

        {/* Center: status row + two gauges */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          {/* Status badges row — uses the empty space above gauges */}
          <div className="flex items-center gap-3">
            <Badge label="SYNC ACQUIRED" color="var(--accent)" />
            <Badge label="PUMPS ON"      color="var(--chart-3)" />
            <span className="text-[10px] font-mono text-foreground/40 border border-border/30 px-2 py-1 rounded">Circ: 0:01:42</span>
            <span className="text-[10px] font-mono text-foreground/40 border border-border/30 px-2 py-1 rounded">Last pkt: 4s ago</span>
            <span className="text-[10px] font-mono text-foreground/40 border border-border/30 px-2 py-1 rounded">PW: 0.375</span>
          </div>
          {/* Two gauges side by side */}
          <div className="flex items-center gap-8">
            <GaugePlaceholder label="GTF" value="345.2°" color="var(--primary)" />
            <GaugePlaceholder label="MTF" value="122.2°" color="var(--accent)" />
          </div>
        </div>

        {/* Right column: AZM, INC, extra */}
        <div className="flex flex-col gap-3 p-4 justify-center shrink-0">
          <NumCard label="AZM" value="284.12" unit="°" />
          <NumCard label="INC" value="12.45"  unit="°" />
          <div className="flex items-center gap-2 px-3 py-2 border border-border/20 bg-background/60 rounded-md self-start">
            <div className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-foreground/50 tracking-widest uppercase">REAL-TIME</span>
          </div>
        </div>

        {/* Side panel with enhanced Decodes */}
        <div className="w-[300px] border-l border-border flex flex-col">
          <div className="flex border-b border-border bg-secondary/5 h-9">
            {["Decodes", "Surveys", "Log"].map((t, i) => (
              <button key={t} className={`flex-1 text-[10px] font-bold ${i === 0 ? "text-primary border-b-2 border-primary bg-background" : "text-foreground/40"}`}>{t}</button>
            ))}
          </div>
          <table className="w-full text-[10px]">
            <thead className="bg-secondary/10">
              <tr>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Time</th>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Mnemonic</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Value</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Conf%</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Amp</th>
              </tr>
            </thead>
            <tbody>
              {DECODES.map((d, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="p-1.5 font-mono text-foreground/50 whitespace-nowrap">{d.dt.split(" ")[1]}</td>
                  <td className="p-1.5 font-bold text-foreground">{d.mnemonic}</td>
                  <td className="p-1.5 font-mono text-accent text-right">{d.value}</td>
                  <td className="p-1.5 text-right font-bold text-accent">{d.conf}%</td>
                  <td className="p-1.5 text-right font-mono text-foreground/40">{d.amp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   OPTION E — Horizontal status strip below the gauges
              Uses the empty lower space
   ═══════════════════════════════════════ */
function OptionE() {
  return (
    <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden">
      <div className="bg-accent/10 border-b border-accent/30 px-3 py-1.5 text-[11px] font-bold text-accent tracking-wide">
        OPTION E — Horizontal info strip below gauges (uses empty lower space)
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left column: ROP, GR */}
        <div className="flex flex-col gap-3 p-4 justify-center shrink-0">
          <NumCard label="ROP" value="13.7" unit="m/h" />
          <NumCard label="GR"  value="45.2" unit="API" />
          <div className="flex items-center gap-2 px-3 py-2 border border-border/20 bg-background/60 rounded-md self-start">
            <div className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-foreground/50 tracking-widest uppercase">DRILLING</span>
          </div>
        </div>

        {/* Center: gauges + status strip below */}
        <div className="flex-1 flex flex-col items-center justify-center gap-0 px-4">
          {/* Gauges */}
          <div className="flex items-center gap-8 flex-1 justify-center">
            <GaugePlaceholder label="GTF" value="345.2°" color="var(--primary)" />
            <GaugePlaceholder label="MTF" value="122.2°" color="var(--accent)" />
          </div>

          {/* Horizontal info strip — sits in the space below gauges */}
          <div className="flex items-stretch w-full border border-border/30 rounded-lg overflow-hidden bg-secondary/5 mb-4 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 border-r border-border/30">
              <div className="size-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase">SYNC ACQUIRED</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 border-r border-border/30">
              <div className="size-1.5 rounded-full bg-chart-3 animate-pulse" />
              <span className="text-[10px] font-bold text-chart-3 tracking-widest uppercase">PUMPS ON</span>
            </div>
            <MetricCell label="Circ Time" value="0:01:42" />
            <MetricCell label="Last Pkt"  value="4s ago"  />
            <MetricCell label="SPP"       value="1,250" unit="PSI" accent />
            <MetricCell label="TEMP"      value="85.4"  unit="°C"  />
            <MetricCell label="PW"        value="0.375"            />
          </div>
        </div>

        {/* Right column: AZM, INC */}
        <div className="flex flex-col gap-3 p-4 justify-center shrink-0">
          <NumCard label="AZM" value="284.12" unit="°" />
          <NumCard label="INC" value="12.45"  unit="°" />
          <div className="flex items-center gap-2 px-3 py-2 border border-border/20 bg-background/60 rounded-md self-start">
            <div className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-foreground/50 tracking-widest uppercase">REAL-TIME</span>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-[300px] border-l border-border flex flex-col">
          <div className="flex border-b border-border bg-secondary/5 h-9">
            {["Decodes", "Surveys", "Log"].map((t, i) => (
              <button key={t} className={`flex-1 text-[10px] font-bold ${i === 0 ? "text-primary border-b-2 border-primary bg-background" : "text-foreground/40"}`}>{t}</button>
            ))}
          </div>
          <table className="w-full text-[10px]">
            <thead className="bg-secondary/10">
              <tr>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Time</th>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Mnemonic</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Value</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Conf%</th>
              </tr>
            </thead>
            <tbody>
              {DECODES.map((d, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="p-1.5 font-mono text-foreground/50 whitespace-nowrap">{d.dt.split(" ")[1]}</td>
                  <td className="p-1.5 font-bold text-foreground">{d.mnemonic}</td>
                  <td className="p-1.5 font-mono text-accent text-right">{d.value}</td>
                  <td className="p-1.5 text-right font-bold text-accent">{d.conf}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   OPTION F — Stacked 2×2 numeral grid in each column
              + compact sync/pump inline with DRILLING badge
   ═══════════════════════════════════════ */
function OptionF() {
  return (
    <div className="flex flex-col h-full border border-border/40 rounded-lg overflow-hidden">
      <div className="bg-chart-3/10 border-b border-chart-3/30 px-3 py-1.5 text-[11px] font-bold text-chart-3 tracking-wide">
        OPTION F — 2×2 numeral grid per side, status inline with existing badges
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left column: 2×2 grid of numerals */}
        <div className="flex flex-col gap-3 p-4 justify-center shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <NumCard label="ROP"  value="13.7"  unit="m/h" />
            <NumCard label="GR"   value="45.2"  unit="API" />
            <NumCard label="SPP"  value="1,250" unit="PSI" />
            <NumCard label="TEMP" value="85.4"  unit="°C"  />
          </div>
          {/* Status badges stacked — replaces DRILLING badge */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border/20 bg-background/60 rounded-md self-start">
              <div className="size-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase">SYNC ACQUIRED</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border/20 bg-background/60 rounded-md self-start">
              <div className="size-1.5 rounded-full bg-chart-3 animate-pulse" />
              <span className="text-[10px] font-bold text-chart-3 tracking-widest uppercase">PUMPS ON  •  0:01:42</span>
            </div>
          </div>
        </div>

        {/* Center: two gauges */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <GaugePlaceholder label="GTF" value="345.2°" color="var(--primary)" />
          <GaugePlaceholder label="MTF" value="122.2°" color="var(--accent)" />
        </div>

        {/* Right column: 2×2 grid */}
        <div className="flex flex-col gap-3 p-4 justify-center shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <NumCard label="AZM" value="284.12" unit="°" />
            <NumCard label="INC" value="12.45"  unit="°" />
            <NumCard label="PW"  value="0.375"  unit=""  />
            <NumCard label="RPM" value="82"     unit="rpm"/>
          </div>
          {/* Last pkt + REAL-TIME */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border/20 bg-background/60 rounded-md self-start">
              <div className="size-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold text-foreground/50 tracking-widest uppercase">REAL-TIME  •  Last: 4s</span>
            </div>
          </div>
        </div>

        {/* Side panel: Decodes with Conf + Amp */}
        <div className="w-[300px] border-l border-border flex flex-col">
          <div className="flex border-b border-border bg-secondary/5 h-9">
            {["Decodes", "Surveys", "Log"].map((t, i) => (
              <button key={t} className={`flex-1 text-[10px] font-bold ${i === 0 ? "text-primary border-b-2 border-primary bg-background" : "text-foreground/40"}`}>{t}</button>
            ))}
          </div>
          <table className="w-full text-[10px]">
            <thead className="bg-secondary/10">
              <tr>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Time</th>
                <th className="p-1.5 text-left text-foreground/40 border-b border-border">Mnemonic</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Value</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Conf%</th>
                <th className="p-1.5 text-right text-foreground/40 border-b border-border">Amp</th>
              </tr>
            </thead>
            <tbody>
              {DECODES.map((d, i) => (
                <tr key={i} className="border-b border-border/40">
                  <td className="p-1.5 font-mono text-foreground/50 whitespace-nowrap">{d.dt.split(" ")[1]}</td>
                  <td className="p-1.5 font-bold text-foreground">{d.mnemonic}</td>
                  <td className="p-1.5 font-mono text-accent text-right">{d.value}</td>
                  <td className="p-1.5 text-right font-bold text-accent">{d.conf}%</td>
                  <td className="p-1.5 text-right font-mono text-foreground/40">{d.amp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Main proposals page
   ═══════════════════════════════════════ */
export function LayoutProposals() {
  const [active, setActive] = useState<"D" | "E" | "F">("D");

  const options = [
    { id: "D" as const, desc: "Status badges above gauges + extra numerals in side columns" },
    { id: "E" as const, desc: "Horizontal info strip below gauges — uses the empty lower space" },
    { id: "F" as const, desc: "2×2 numeral grids per side + status inline with badges" },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden" style={{ fontFamily: "var(--font-family-base)" }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card shrink-0">
        <span className="text-xs font-bold text-foreground/50 mr-2 uppercase tracking-wider">Layout Proposals v2 — Summary Page</span>
        {options.map(({ id }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`px-4 py-1.5 text-xs font-bold rounded transition-all border ${
              active === id
                ? "bg-primary text-primary-foreground border-primary shadow"
                : "bg-secondary/30 text-foreground/60 border-border hover:bg-secondary/60"
            }`}
          >
            Option {id}
          </button>
        ))}
        <div className="ml-4 text-[10px] text-foreground/30 border-l border-border pl-4">
          {options.find(o => o.id === active)?.desc}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        {active === "D" && <OptionD />}
        {active === "E" && <OptionE />}
        {active === "F" && <OptionF />}
      </div>
    </div>
  );
}
