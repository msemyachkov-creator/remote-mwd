import React, { useState } from "react";
import { Settings, MoreHorizontal, ChevronDown, ExternalLink, Check, AlertTriangle, Play, Square, Wifi, WifiOff } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useI18n } from "./i18n";
import { SurfaceUnitSettings } from "./SurfaceUnitSettings";
import { useWitsmlStream } from "../services/witsml/useWitsmlStream";
import type { WitsmlServerConfig, WitsmlWellRef, StreamConfig } from "../services/witsml/types";

interface ModuleRow {
  id: number;
  module: string;
  input: string;
  meterActive: string;
  status: string;
  runtime: string;
  runtimeMinutes: string;
  state: string;
  stateColor: "green" | "yellow" | "red";
}

const moduleDataRU: ModuleRow[] = [
  {
    id: 1,
    module: "МП1",
    input: "HW48 v1.30.1",
    meterActive: "1",
    status: "Число включений: 1, Наработка: 15 минут",
    runtime: "Ok",
    runtimeMinutes: "Подключен",
    state: "Подключен",
    stateColor: "green",
  },
  {
    id: 2,
    module: "МПК",
    input: "HW22 v1.30.2",
    meterActive: "2",
    status: "Число включений: 1, Наработка: 15 минут",
    runtime: "Ok",
    runtimeMinutes: "Подключен",
    state: "Подключен",
    stateColor: "green",
  },
  {
    id: 3,
    module: "МИ",
    input: "HW42 v1.30.2",
    meterActive: "3",
    status: "Число включений: 1, Наработка: 15 минут",
    runtime: "Ok",
    runtimeMinutes: "Подключен",
    state: "Подключен",
    stateColor: "green",
  },
];

const moduleDataEN: ModuleRow[] = [
  {
    id: 1,
    module: "MP1",
    input: "HW48 v1.30.1",
    meterActive: "1",
    status: "Power on count: 1, Runtime: 15 minutes",
    runtime: "Ok",
    runtimeMinutes: "Connected",
    state: "Connected",
    stateColor: "green",
  },
  {
    id: 2,
    module: "MPK",
    input: "HW22 v1.30.2",
    meterActive: "2",
    status: "Power on count: 1, Runtime: 15 minutes",
    runtime: "Ok",
    runtimeMinutes: "Connected",
    state: "Connected",
    stateColor: "green",
  },
  {
    id: 3,
    module: "MI",
    input: "HW42 v1.30.2",
    meterActive: "3",
    status: "Power on count: 1, Runtime: 15 minutes",
    runtime: "Ok",
    runtimeMinutes: "Connected",
    state: "Connected",
    stateColor: "green",
  },
];

interface EventLogRow {
  id: number;
  timestamp: string;
  event: string;
}

const eventLogDataRU: EventLogRow[] = [
  { id: 1, timestamp: "14-11-2025 12:46:07", event: "Чтение пакета МИ сектор 25" },
  { id: 2, timestamp: "14-11-2025 12:46:07", event: "Чтение пакета МИ сектор 26" },
  { id: 3, timestamp: "14-11-2025 12:46:07", event: "Чтение пакета МИ сектор 27" },
  { id: 4, timestamp: "14-11-2025 12:46:07", event: "Чтение конфигурация пакетов МИ завершено" },
  { id: 5, timestamp: "14-11-2025 12:46:07", event: "Чтение конфигурация МПК" },
];

const eventLogDataEN: EventLogRow[] = [
  { id: 1, timestamp: "14-11-2025 12:46:07", event: "Reading MI packet sector 25" },
  { id: 2, timestamp: "14-11-2025 12:46:07", event: "Reading MI packet sector 26" },
  { id: 3, timestamp: "14-11-2025 12:46:07", event: "Reading MI packet sector 27" },
  { id: 4, timestamp: "14-11-2025 12:46:07", event: "Reading MI packet configuration completed" },
  { id: 5, timestamp: "14-11-2025 12:46:07", event: "Reading MPK configuration" },
];

// ─── EDR/HDR Input tab content ───────────────────────────────────────────────

const EDR_CHANNELS = [
  { id: 1,  mnemonic: "DEPTH",  description: "Bit Depth",           unit: "ft",      source: "EDR", rate: 1,  lastValue: "9 879.4",  ageSec: 1  },
  { id: 2,  mnemonic: "ROP",    description: "Rate of Penetration", unit: "ft/h",    source: "EDR", rate: 1,  lastValue: "34.2",     ageSec: 1  },
  { id: 3,  mnemonic: "WOB",    description: "Weight on Bit",       unit: "klbf",    source: "EDR", rate: 1,  lastValue: "18.5",     ageSec: 2  },
  { id: 4,  mnemonic: "TRQ",    description: "Surface Torque",      unit: "kft·lbf", source: "EDR", rate: 1,  lastValue: "12.1",     ageSec: 2  },
  { id: 5,  mnemonic: "RPM",    description: "Rotary Speed",        unit: "rpm",     source: "EDR", rate: 1,  lastValue: "120",      ageSec: 1  },
  { id: 6,  mnemonic: "SPP",    description: "Standpipe Pressure",  unit: "psi",     source: "EDR", rate: 1,  lastValue: "3 240",    ageSec: 1  },
  { id: 7,  mnemonic: "FLOWIN", description: "Flow Rate In",        unit: "gpm",     source: "EDR", rate: 1,  lastValue: "680",      ageSec: 3  },
  { id: 8,  mnemonic: "HKLD",   description: "Hook Load",           unit: "klbf",    source: "HDR", rate: 10, lastValue: "142.3",    ageSec: 0  },
  { id: 9,  mnemonic: "BPOS",   description: "Block Position",      unit: "ft",      source: "HDR", rate: 10, lastValue: "48.7",     ageSec: 0  },
  { id: 10, mnemonic: "MFI",    description: "Mud Flow In",         unit: "%",       source: "HDR", rate: 10, lastValue: "—",        ageSec: 45 },
  { id: 11, mnemonic: "CDENS",  description: "Mud Density In",      unit: "ppg",     source: "HDR", rate: 1,  lastValue: "—",        ageSec: 45 },
  { id: 12, mnemonic: "CTEMP",  description: "Mud Temperature In",  unit: "°F",      source: "HDR", rate: 1,  lastValue: "—",        ageSec: 45 },
];

type EdrSection = "connection" | "tcp-server" | "tcp-client" | "freshness";

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="mwd-cell text-muted-foreground w-44 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function InputField({ value, onChange, mono }: { value: string; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full h-7 px-2 bg-input-background border border-border rounded text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-shadow ${mono ? "font-mono" : ""}`}
      style={{ borderRadius: "var(--radius)" }}
    />
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-7 px-2 bg-card border border-border rounded text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
      style={{ borderRadius: "var(--radius)" }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-md bg-background overflow-hidden">
      <div className="px-3 py-2 border-b border-border bg-card/50 shrink-0">
        <span className="mwd-title text-muted-foreground">{title}</span>
      </div>
      <div className="p-3 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={`inline-block size-2 rounded-full mr-1.5 ${ok ? "bg-chart-2" : "bg-destructive"}`} />;
}

function EdrHdrInput({ lang }: { lang: string }) {
  const [section, setSection] = React.useState<EdrSection>("connection");

  // Connection settings state
  const [edrHost, setEdrHost]           = React.useState("192.168.1.100");
  const [edrPort, setEdrPort]           = React.useState("5000");
  const [edrProtocol, setEdrProtocol]   = React.useState("WITS Level 0");
  const [edrRate, setEdrRate]           = React.useState("1");
  const [hdrHost, setHdrHost]           = React.useState("192.168.1.101");
  const [hdrPort, setHdrPort]           = React.useState("5001");
  const [hdrProtocol, setHdrProtocol]   = React.useState("WITS Level 0");
  const [hdrRate, setHdrRate]           = React.useState("1");
  const [connTimeout, setConnTimeout]   = React.useState("5000");
  const [retryInterval, setRetryInterval] = React.useState("3");

  // TCP Server state
  const [srvEnabled, setSrvEnabled]     = React.useState(true);
  const [srvAddr, setSrvAddr]           = React.useState("0.0.0.0");
  const [srvPort, setSrvPort]           = React.useState("9000");
  const [srvMaxConn, setSrvMaxConn]     = React.useState("8");
  const [srvProtocol, setSrvProtocol]   = React.useState("WITS Level 0");
  const [srvAuth, setSrvAuth]           = React.useState(false);

  // TCP Client state
  const [cliEnabled, setCliEnabled]     = React.useState(false);
  const [cliHost, setCliHost]           = React.useState("10.0.0.50");
  const [cliPort, setCliPort]           = React.useState("9100");
  const [cliProtocol, setCliProtocol]   = React.useState("WITSML 2.0");
  const [cliUser, setCliUser]           = React.useState("admin");
  const [cliPass, setCliPass]           = React.useState("••••••••");
  const [cliReconnect, setCliReconnect] = React.useState(true);

  const NAV: { id: EdrSection; label: string; sublabel: string }[] = [
    { id: "connection", label: lang === "ru" ? "Настройки подключения" : "Connection Settings",   sublabel: `EDR ${edrHost}:${edrPort}` },
    { id: "tcp-server", label: "TCP Server",                                                       sublabel: srvEnabled ? (lang === "ru" ? `Слушает :${srvPort}` : `Listening :${srvPort}`) : (lang === "ru" ? "Выключен" : "Disabled") },
    { id: "tcp-client", label: "TCP Client",                                                       sublabel: cliEnabled ? `→ ${cliHost}:${cliPort}` : (lang === "ru" ? "Выключен" : "Disabled") },
    { id: "freshness",  label: lang === "ru" ? "Свежесть данных" : "Data Freshness",              sublabel: `${EDR_CHANNELS.filter(c => c.ageSec <= 5).length} / ${EDR_CHANNELS.length} fresh` },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left nav */}
      <div className="w-64 shrink-0 border-r border-border flex flex-col" style={{ backgroundColor: "var(--sidebar)" }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setSection(n.id)}
            className={`px-4 py-3 text-left border-b border-border border-l-2 flex flex-col gap-0.5 transition-colors ${
              section === n.id
                ? "bg-primary/10 border-l-primary"
                : "border-l-transparent text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
            }`}
            style={{ fontFamily: "var(--font-family-base)" }}
          >
            <span className={`text-xs font-medium ${section === n.id ? "text-primary" : "text-foreground/60"}`}>
              {n.label}
            </span>
            <span className={`text-sm font-semibold text-muted-foreground`}>{n.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Right content */}
      <div className="flex-1 min-w-0 overflow-auto p-4 flex flex-col gap-4 max-w-xl">

        {/* ── CONNECTION SETTINGS ── */}
        {section === "connection" && (<>
          <SectionCard title={lang === "ru" ? "EDR — Источник данных бурения" : "EDR — Drilling Data Source"}>
            <FieldRow label="Host / IP"><InputField value={edrHost} onChange={setEdrHost} mono /></FieldRow>
            <FieldRow label="Port"><InputField value={edrPort} onChange={setEdrPort} mono /></FieldRow>
            <FieldRow label="Protocol"><SelectField value={edrProtocol} onChange={setEdrProtocol} options={["WITS Level 0","WITS Level 1","WITSML 1.4","WITSML 2.0","OPC-UA"]} /></FieldRow>
            <FieldRow label={lang === "ru" ? "Интервал записи (сек)" : "Record rate (sec)"}><InputField value={edrRate} onChange={setEdrRate} mono /></FieldRow>
          </SectionCard>

          <SectionCard title={lang === "ru" ? "HDR — Источник данных высокого разрешения" : "HDR — High-Definition Data Source"}>
            <FieldRow label="Host / IP"><InputField value={hdrHost} onChange={setHdrHost} mono /></FieldRow>
            <FieldRow label="Port"><InputField value={hdrPort} onChange={setHdrPort} mono /></FieldRow>
            <FieldRow label="Protocol"><SelectField value={hdrProtocol} onChange={setHdrProtocol} options={["WITS Level 0","WITS Level 1","WITSML 1.4","WITSML 2.0","OPC-UA"]} /></FieldRow>
            <FieldRow label={lang === "ru" ? "Интервал записи (сек)" : "Record rate (sec)"}><InputField value={hdrRate} onChange={setHdrRate} mono /></FieldRow>
          </SectionCard>

          <SectionCard title={lang === "ru" ? "Общие параметры" : "General"}>
            <FieldRow label={lang === "ru" ? "Таймаут подключения (мс)" : "Connection timeout (ms)"}><InputField value={connTimeout} onChange={setConnTimeout} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Повтор через (сек)" : "Retry interval (sec)"}><InputField value={retryInterval} onChange={setRetryInterval} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Авто-переподключение" : "Auto-reconnect"}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Включено" : "Enabled"}</span>
              </label>
            </FieldRow>
          </SectionCard>
        </>)}

        {/* ── TCP SERVER ── */}
        {section === "tcp-server" && (<>
          <SectionCard title={lang === "ru" ? "Статус TCP-сервера" : "TCP Server Status"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot ok={srvEnabled} />
                <span className={`text-sm font-semibold ${srvEnabled ? "text-chart-2" : "text-muted-foreground"}`}>
                  {srvEnabled
                    ? (lang === "ru" ? `Слушает 0.0.0.0:${srvPort}` : `Listening on 0.0.0.0:${srvPort}`)
                    : (lang === "ru" ? "Остановлен" : "Stopped")}
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={srvEnabled} onChange={e => setSrvEnabled(e.target.checked)} className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Включить" : "Enable"}</span>
              </label>
            </div>
          </SectionCard>

          <SectionCard title={lang === "ru" ? "Настройки сервера" : "Server Settings"}>
            <FieldRow label={lang === "ru" ? "Адрес прослушивания" : "Listen address"}><InputField value={srvAddr} onChange={setSrvAddr} mono /></FieldRow>
            <FieldRow label="Port"><InputField value={srvPort} onChange={setSrvPort} mono /></FieldRow>
            <FieldRow label="Protocol"><SelectField value={srvProtocol} onChange={setSrvProtocol} options={["WITS Level 0","WITS Level 1","WITSML 2.0","Raw TCP","JSON Stream"]} /></FieldRow>
            <FieldRow label={lang === "ru" ? "Макс. подключений" : "Max connections"}><InputField value={srvMaxConn} onChange={setSrvMaxConn} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Аутентификация" : "Authentication"}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={srvAuth} onChange={e => setSrvAuth(e.target.checked)} className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Требовать логин/пароль" : "Require login / password"}</span>
              </label>
            </FieldRow>
          </SectionCard>

          <SectionCard title={lang === "ru" ? "Активные подключения" : "Active Connections"}>
            {srvEnabled ? (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left pb-1.5 font-medium">Client</th>
                    <th className="text-left pb-1.5 font-medium">Protocol</th>
                    <th className="text-left pb-1.5 font-medium">{lang === "ru" ? "Подключён" : "Connected"}</th>
                    <th className="text-left pb-1.5 font-medium">{lang === "ru" ? "Отправлено" : "Sent"}</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {[
                    { ip: "10.0.0.12:51234", proto: "WITS Level 0", since: "15:21:04", sent: "14 801" },
                    { ip: "10.0.0.17:49812", proto: "WITS Level 0", since: "15:28:47", sent: "4 203"  },
                  ].map((c, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-1.5 text-foreground">{c.ip}</td>
                      <td className="py-1.5 text-muted-foreground">{c.proto}</td>
                      <td className="py-1.5 text-chart-2">{c.since}</td>
                      <td className="py-1.5 text-foreground">{c.sent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="mwd-cell text-muted-foreground/50 italic">{lang === "ru" ? "Сервер остановлен" : "Server is stopped"}</span>
            )}
          </SectionCard>
        </>)}

        {/* ── TCP CLIENT ── */}
        {section === "tcp-client" && (<>
          <SectionCard title={lang === "ru" ? "Статус TCP-клиента" : "TCP Client Status"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot ok={cliEnabled} />
                <span className={`text-sm font-semibold ${cliEnabled ? "text-chart-2" : "text-muted-foreground"}`}>
                  {cliEnabled
                    ? (lang === "ru" ? `Подключён → ${cliHost}:${cliPort}` : `Connected → ${cliHost}:${cliPort}`)
                    : (lang === "ru" ? "Отключён" : "Disconnected")}
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={cliEnabled} onChange={e => setCliEnabled(e.target.checked)} className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Включить" : "Enable"}</span>
              </label>
            </div>
          </SectionCard>

          <SectionCard title={lang === "ru" ? "Настройки клиента" : "Client Settings"}>
            <FieldRow label={lang === "ru" ? "Удалённый хост" : "Remote host"}><InputField value={cliHost} onChange={setCliHost} mono /></FieldRow>
            <FieldRow label="Port"><InputField value={cliPort} onChange={setCliPort} mono /></FieldRow>
            <FieldRow label="Protocol"><SelectField value={cliProtocol} onChange={setCliProtocol} options={["WITS Level 0","WITS Level 1","WITSML 1.4","WITSML 2.0","OPC-UA","JSON Stream"]} /></FieldRow>
            <FieldRow label={lang === "ru" ? "Авто-переподключение" : "Auto-reconnect"}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={cliReconnect} onChange={e => setCliReconnect(e.target.checked)} className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Включено" : "Enabled"}</span>
              </label>
            </FieldRow>
          </SectionCard>

          <SectionCard title={lang === "ru" ? "Аутентификация" : "Authentication"}>
            <FieldRow label={lang === "ru" ? "Имя пользователя" : "Username"}><InputField value={cliUser} onChange={setCliUser} /></FieldRow>
            <FieldRow label={lang === "ru" ? "Пароль" : "Password"}>
              <input
                type="password"
                value={cliPass}
                onChange={e => setCliPass(e.target.value)}
                className="w-full h-7 px-2 bg-input-background border border-border rounded text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--radius)" }}
              />
            </FieldRow>
          </SectionCard>
        </>)}

        {/* ── DATA FRESHNESS ── */}
        {section === "freshness" && (<>
          <SectionCard title={lang === "ru" ? "Легенда" : "Legend"}>
            <div className="flex gap-4 flex-wrap">
              {[
                { color: "bg-chart-2",    label: lang === "ru" ? "Свежие (< 5 сек)"  : "Fresh (< 5 sec)"  },
                { color: "bg-yellow-500", label: lang === "ru" ? "Устаревшие (< 30 сек)" : "Stale (< 30 sec)"  },
                { color: "bg-destructive",label: lang === "ru" ? "Просрочены (> 30 сек)" : "Expired (> 30 sec)" },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`size-2.5 rounded-full shrink-0 ${l.color}`} />
                  <span className="mwd-cell text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="border border-border rounded-md bg-background overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="px-3 py-2 border-b border-border bg-card/50 shrink-0">
              <span className="mwd-title text-muted-foreground">{lang === "ru" ? "Каналы" : "Channels"}</span>
            </div>
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10" style={{ background: "var(--table-header-bg)" }}>
                  <tr className="border-b border-border">
                    <th className="mwd-header px-3 py-2 text-left text-muted-foreground w-6"></th>
                    <th className="mwd-header px-3 py-2 text-left text-muted-foreground">{lang === "ru" ? "Мнемоника" : "Mnemonic"}</th>
                    <th className="mwd-header px-3 py-2 text-left text-muted-foreground">{lang === "ru" ? "Описание" : "Description"}</th>
                    <th className="mwd-header px-3 py-2 text-left text-muted-foreground">{lang === "ru" ? "Источник" : "Source"}</th>
                    <th className="mwd-header px-3 py-2 text-right text-muted-foreground">{lang === "ru" ? "Последнее значение" : "Last value"}</th>
                    <th className="mwd-header px-3 py-2 text-right text-muted-foreground">{lang === "ru" ? "Возраст" : "Age"}</th>
                    <th className="mwd-header px-3 py-2 text-left text-muted-foreground">{lang === "ru" ? "Статус" : "Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  {EDR_CHANNELS.map(ch => {
                    const fresh   = ch.ageSec <= 5;
                    const stale   = ch.ageSec > 5 && ch.ageSec <= 30;
                    const expired = ch.ageSec > 30;
                    const dotColor   = fresh ? "bg-chart-2" : stale ? "bg-yellow-500" : "bg-destructive";
                    const labelColor = fresh ? "text-chart-2" : stale ? "text-yellow-500" : "text-destructive";
                    const statusText = fresh
                      ? (lang === "ru" ? "Свежие" : "Fresh")
                      : stale
                      ? (lang === "ru" ? "Устаревшие" : "Stale")
                      : (lang === "ru" ? "Просрочены" : "Expired");
                    return (
                      <tr key={ch.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                        <td className="px-3 py-2">
                          <span className={`size-2 rounded-full block ${dotColor}`} />
                        </td>
                        <td className="mwd-cell px-3 py-2 font-mono font-bold text-foreground">{ch.mnemonic}</td>
                        <td className="mwd-cell px-3 py-2 text-foreground">{ch.description}</td>
                        <td className="px-3 py-2">
                          <span className={`mwd-cell px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            ch.source === "EDR" ? "bg-primary/10 text-primary" : "bg-chart-5/15 text-chart-5"
                          }`}>{ch.source}</span>
                        </td>
                        <td className="mwd-cell px-3 py-2 text-right font-mono text-foreground">{ch.lastValue}</td>
                        <td className={`mwd-cell px-3 py-2 text-right font-mono ${labelColor}`}>
                          {ch.ageSec === 0 ? "< 1s" : `${ch.ageSec}s`}
                        </td>
                        <td className={`mwd-cell px-3 py-2 font-semibold ${labelColor}`}>{statusText}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>)}

      </div>
    </div>
  );
}

// ─── Output tab content ──────────────────────────────────────────────────────

type OutputSection = "witsml-server" | "survey" | "depth-rop" | "curves" | "decoded" | "run-meta";

function OutputTab({ lang }: { lang: string }) {
  const [section, setSection] = React.useState<OutputSection>("witsml-server");

  // ── Server config ──────────────────────────────────────────────────────────
  const [srvUrl,     setSrvUrl]     = React.useState("https://witsml.example.com/WMLS");
  const [srvVersion, setSrvVersion] = React.useState<"1.4.1.1">("1.4.1.1");
  const [srvUser,    setSrvUser]    = React.useState("mwd_user");
  const [srvPass,    setSrvPass]    = React.useState("");
  const [proxyUrl,   setProxyUrl]   = React.useState("");

  // ── Well / run metadata ────────────────────────────────────────────────────
  const [wellName,   setWellName]   = React.useState("Northern-3");
  const [wellUid,    setWellUid]    = React.useState("well-003-a");
  const [wboreUid,   setWboreUid]   = React.useState("wb-001");
  const [runNo,      setRunNo]      = React.useState("2");
  const [operator,   setOperator]   = React.useState("PetroNord");
  const [rigName,    setRigName]    = React.useState("Rig PD143");
  const [startDepth, setStartDepth] = React.useState("9650.0");
  const [startDate,  setStartDate]  = React.useState("2026-03-19T08:00:00Z");

  // ── Stream config ──────────────────────────────────────────────────────────
  const [surveyEnabled,  setSurveyEnabled]  = React.useState(true);
  const [surveyTrajUid,  setSurveyTrajUid]  = React.useState("traj-main");
  const [surveyAziRef,   setSurveyAziRef]   = React.useState("Grid North");

  const [depthEnabled,   setDepthEnabled]   = React.useState(true);
  const [depthLogUid,    setDepthLogUid]    = React.useState("log-depth-001");
  const [depthStep,      setDepthStep]      = React.useState("1");

  const [decodedEnabled, setDecodedEnabled] = React.useState(true);
  const [decodedLogUid,  setDecodedLogUid]  = React.useState("log-decoded-001");
  const [decodedMode,    setDecodedMode]    = React.useState("Real-time");
  const [decodedInterval,setDecodedInterval]= React.useState("10");

  const [curvesEnabled,  setCurvesEnabled]  = React.useState(false);
  const [curvesLogUid,   setCurvesLogUid]   = React.useState("log-curves-001");

  // ── Build typed config objects ─────────────────────────────────────────────
  const serverCfg: WitsmlServerConfig = React.useMemo(() => ({
    url: srvUrl, username: srvUser, password: srvPass,
    version: srvVersion, proxyUrl: proxyUrl || undefined,
  }), [srvUrl, srvUser, srvPass, srvVersion, proxyUrl]);

  const wellRef: WitsmlWellRef = React.useMemo(() => ({
    wellUid, wellName, wellboreUid: wboreUid, wellboreName: wellName,
    runNumber: parseInt(runNo, 10) || 1,
    operator, rigName,
    startDepthFt: parseFloat(startDepth) || 0,
    startDate,
  }), [wellUid, wellName, wboreUid, runNo, operator, rigName, startDepth, startDate]);

  const streamCfg: StreamConfig = React.useMemo(() => ({
    survey:  { enabled: surveyEnabled,  trajectoryUid: surveyTrajUid, aziRef: surveyAziRef },
    depth:   { enabled: depthEnabled,   logUid: depthLogUid, stepFt: parseFloat(depthStep) || 1 },
    decoded: { enabled: decodedEnabled, logUid: decodedLogUid, intervalSec: parseFloat(decodedInterval) || 10 },
    curves:  { enabled: curvesEnabled,  logUid: curvesLogUid },
  }), [surveyEnabled, surveyTrajUid, surveyAziRef, depthEnabled, depthLogUid, depthStep,
       decodedEnabled, decodedLogUid, decodedInterval, curvesEnabled, curvesLogUid]);

  // ── Live streaming hook ────────────────────────────────────────────────────
  const { state, start, stop, testConnection, isRunning } = useWitsmlStream({
    serverCfg, wellRef, streamCfg,
  });

  const [testMsg, setTestMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  async function handleTest() {
    setTestMsg(null);
    const r = await testConnection();
    setTestMsg({ ok: r.ok, text: r.message });
    setTimeout(() => setTestMsg(null), 5000);
  }

  // ── Nav ────────────────────────────────────────────────────────────────────
  const NAV: { id: OutputSection; label: string; sublabel: string; streamKey?: keyof typeof state.sentCounts }[] = [
    { id: "witsml-server", label: "WITSML Server",
      sublabel: state.connected ? (lang === "ru" ? "Подключён" : "Connected") : (lang === "ru" ? "Не подключён" : "Not connected") },
    { id: "survey",    label: "Survey",
      sublabel: surveyEnabled  ? `${state.sentCounts.survey} ${lang === "ru" ? "отправлено" : "sent"}` : (lang === "ru" ? "Выключено" : "Disabled"), streamKey: "survey" },
    { id: "depth-rop", label: lang === "ru" ? "Глубина и ROP" : "Depth & ROP",
      sublabel: depthEnabled   ? `${state.sentCounts.depth} ${lang === "ru" ? "отправлено" : "sent"}` : (lang === "ru" ? "Выключено" : "Disabled"), streamKey: "depth" },
    { id: "curves",    label: lang === "ru" ? "Кривые" : "Curves",
      sublabel: curvesEnabled  ? `${state.sentCounts.curves} ${lang === "ru" ? "отправлено" : "sent"}` : (lang === "ru" ? "Выключено" : "Disabled"), streamKey: "curves" },
    { id: "decoded",   label: lang === "ru" ? "Декодированные" : "Decoded Params",
      sublabel: decodedEnabled ? `${state.sentCounts.decoded} ${lang === "ru" ? "отправлено" : "sent"}` : (lang === "ru" ? "Выключено" : "Disabled"), streamKey: "decoded" },
    { id: "run-meta",  label: lang === "ru" ? "Run / Метаданные" : "Run / Metadata",
      sublabel: `${wellName} · Run ${runNo}` },
  ];

  function navColor(n: typeof NAV[0]): string {
    if (n.id === "witsml-server")
      return state.connected ? "text-chart-2" : "text-muted-foreground";
    if (!n.streamKey) return "text-muted-foreground";
    const enabled = n.streamKey === "survey" ? surveyEnabled
      : n.streamKey === "depth" ? depthEnabled
      : n.streamKey === "curves" ? curvesEnabled
      : decodedEnabled;
    if (!enabled) return "text-muted-foreground";
    return isRunning ? "text-chart-2" : "text-foreground/70";
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left nav */}
      <div className="w-64 shrink-0 border-r border-border flex flex-col" style={{ backgroundColor: "var(--sidebar)" }}>

        {/* Stream control bar */}
        <div className="px-3 py-2.5 border-b border-border flex items-center gap-2">
          <span className={`size-2 rounded-full shrink-0 ${
            isRunning ? "bg-chart-2 animate-pulse" : state.status === "error" ? "bg-destructive" : "bg-border"
          }`} />
          <span className={`text-xs font-semibold flex-1 ${isRunning ? "text-chart-2" : "text-foreground/50"}`}>
            {isRunning ? (lang === "ru" ? "Стриминг идёт" : "Streaming") : (lang === "ru" ? "Остановлен" : "Stopped")}
          </span>
          {isRunning ? (
            <button onClick={stop}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-xs font-semibold">
              <Square className="size-3" />Stop
            </button>
          ) : (
            <button onClick={start}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-chart-2/10 text-chart-2 hover:bg-chart-2/20 transition-colors text-xs font-semibold">
              <Play className="size-3" />Start
            </button>
          )}
        </div>

        {NAV.map(n => (
          <button key={n.id} onClick={() => setSection(n.id)}
            className={`px-4 py-3 text-left border-b border-border border-l-2 flex flex-col gap-0.5 transition-colors ${
              section === n.id ? "bg-primary/10 border-l-primary" : "border-l-transparent text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
            }`}
            style={{ fontFamily: "var(--font-family-base)" }}>
            <span className={`text-xs font-medium ${section === n.id ? "text-primary" : "text-foreground/60"}`}>{n.label}</span>
            <span className={`text-sm font-semibold ${navColor(n)}`}>{n.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Right content */}
      <div className="flex-1 min-w-0 overflow-auto p-4 flex flex-col gap-4 max-w-xl">

        {/* ── WITSML SERVER ── */}
        {section === "witsml-server" && (<>
          {/* Live status banner */}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded border ${
            state.connected ? "border-chart-2/30 bg-chart-2/8" : "border-border bg-secondary/30"
          }`} style={{ borderRadius: "var(--radius)" }}>
            {state.connected
              ? <Wifi className="size-4 text-chart-2 shrink-0" />
              : <WifiOff className="size-4 text-muted-foreground shrink-0" />}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${state.connected ? "text-chart-2" : "text-foreground/50"}`}>
                {state.connected ? (lang === "ru" ? "Подключён к WITSML-серверу" : "Connected to WITSML server") : (lang === "ru" ? "Нет подключения" : "Not connected")}
              </p>
              {isRunning && (
                <p className="text-xs text-muted-foreground">
                  {lang === "ru" ? "Стриминг активен · " : "Streaming · "}
                  Survey: {state.sentCounts.survey} · Depth: {state.sentCounts.depth} · Decoded: {state.sentCounts.decoded} · Curves: {state.sentCounts.curves}
                </p>
              )}
            </div>
            <button onClick={handleTest}
              className="px-3 h-7 rounded border border-border bg-secondary text-xs text-foreground hover:bg-secondary/80 transition-colors shrink-0"
              style={{ borderRadius: "var(--radius)" }}>
              {lang === "ru" ? "Тест связи" : "Test connection"}
            </button>
          </div>

          {testMsg && (
            <div className={`px-3 py-2 rounded border text-xs font-medium ${
              testMsg.ok ? "border-chart-2/30 bg-chart-2/8 text-chart-2" : "border-destructive/30 bg-destructive/8 text-destructive"
            }`} style={{ borderRadius: "var(--radius)" }}>
              {testMsg.text}
            </div>
          )}

          <SectionCard title={lang === "ru" ? "Параметры сервера" : "Server Settings"}>
            <FieldRow label="Server URL"><InputField value={srvUrl} onChange={setSrvUrl} mono /></FieldRow>
            <FieldRow label="Version">
              <SelectField value={srvVersion} onChange={() => {}} options={["1.4.1.1"]} />
            </FieldRow>
            <FieldRow label={lang === "ru" ? "Имя пользователя" : "Username"}><InputField value={srvUser} onChange={setSrvUser} /></FieldRow>
            <FieldRow label={lang === "ru" ? "Пароль" : "Password"}>
              <input type="password" value={srvPass} onChange={e => setSrvPass(e.target.value)}
                className="w-full h-7 px-2 bg-input-background border border-border rounded text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ borderRadius: "var(--radius)" }} />
            </FieldRow>
            <FieldRow label={lang === "ru" ? "CORS прокси (опционально)" : "CORS proxy (optional)"}>
              <InputField value={proxyUrl} onChange={setProxyUrl} mono />
            </FieldRow>
          </SectionCard>

          {/* Active streams overview */}
          <SectionCard title={lang === "ru" ? "Потоки данных" : "Data Streams"}>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left pb-1.5 font-medium">{lang === "ru" ? "Поток" : "Stream"}</th>
                  <th className="text-left pb-1.5 font-medium">{lang === "ru" ? "Тип" : "Type"}</th>
                  <th className="text-right pb-1.5 font-medium">{lang === "ru" ? "Отправлено" : "Sent"}</th>
                  <th className="text-left pb-1.5 font-medium pl-3">{lang === "ru" ? "Статус" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { name: "Survey",          type: "trajectory",  key: "survey"  as const, on: surveyEnabled  },
                  { name: "Depth & ROP",     type: "log/depth",   key: "depth"   as const, on: depthEnabled   },
                  { name: "Decoded Params",  type: "log/time",    key: "decoded" as const, on: decodedEnabled },
                  { name: "Curves",          type: "log/depth",   key: "curves"  as const, on: curvesEnabled  },
                ] as const).map((s, i) => {
                  const last = state.lastResults.find(r => r.stream === s.key);
                  const ok   = last?.ok ?? null;
                  return (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-1.5 text-foreground font-medium">{s.name}</td>
                      <td className="py-1.5 text-muted-foreground font-mono">{s.type}</td>
                      <td className="py-1.5 text-right font-mono text-foreground">{state.sentCounts[s.key]}</td>
                      <td className="py-1.5 pl-3">
                        {!s.on ? (
                          <span className="text-muted-foreground/40 text-[10px]">{lang === "ru" ? "Выключен" : "Disabled"}</span>
                        ) : ok === null ? (
                          <span className="text-muted-foreground/40 text-[10px]">{lang === "ru" ? "Ожидание" : "Waiting"}</span>
                        ) : ok ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-chart-2">
                            <span className="size-1.5 rounded-full bg-chart-2" />{lang === "ru" ? "OK" : "OK"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-destructive">
                            <span className="size-1.5 rounded-full bg-destructive" />{lang === "ru" ? "Ошибка" : "Error"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SectionCard>

          {/* Error log */}
          {state.errors.length > 0 && (
            <SectionCard title={lang === "ru" ? "Ошибки" : "Errors"}>
              <div className="flex flex-col gap-1 max-h-32 overflow-auto">
                {state.errors.map((e, i) => (
                  <p key={i} className="text-xs text-destructive font-mono">{e}</p>
                ))}
              </div>
            </SectionCard>
          )}
        </>)}

        {/* ── SURVEY ── */}
        {section === "survey" && (<>
          <SectionCard title="Survey → WITSML Trajectory">
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground flex-1">
                {lang === "ru" ? "Trajectory/survey data. Отправляется при каждом тике стримера." : "Trajectory/survey data. Sent on every streamer tick."}
              </span>
              <label className="flex items-center gap-2 cursor-pointer shrink-0 ml-3">
                <input type="checkbox" checked={surveyEnabled} onChange={e => setSurveyEnabled(e.target.checked)} className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Включить" : "Enable"}</span>
              </label>
            </div>
            {isRunning && surveyEnabled && (
              <div className="flex items-center gap-2 text-xs text-chart-2">
                <span className="size-1.5 rounded-full bg-chart-2 animate-pulse" />
                {lang === "ru" ? `Отправлено ${state.sentCounts.survey} station(s)` : `${state.sentCounts.survey} station(s) sent`}
              </div>
            )}
          </SectionCard>
          <SectionCard title={lang === "ru" ? "WITSML-адресация" : "WITSML Addressing"}>
            <FieldRow label="Trajectory UID"><InputField value={surveyTrajUid} onChange={setSurveyTrajUid} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Азимутальная привязка" : "Azimuth reference"}>
              <SelectField value={surveyAziRef} onChange={setSurveyAziRef} options={["Grid North","True North","Magnetic North"]} />
            </FieldRow>
          </SectionCard>
          <SectionCard title={lang === "ru" ? "Поля" : "Fields"}>
            {[
              { label: "MD",    desc: "Measured Depth",    on: true  },
              { label: "Incl",  desc: "Inclination",       on: true  },
              { label: "Azi",   desc: "Azimuth",           on: true  },
              { label: "TVD",   desc: "True Vertical Depth",on: true },
              { label: "DLS",   desc: "Dog Leg Severity",  on: true  },
              { label: "North", desc: "Northing",          on: true  },
              { label: "East",  desc: "Easting",           on: true  },
            ].map((f, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={f.on} className="accent-primary size-3.5" />
                <span className="mwd-cell font-mono font-bold text-foreground w-12">{f.label}</span>
                <span className="mwd-cell text-muted-foreground">{f.desc}</span>
              </label>
            ))}
          </SectionCard>
        </>)}

        {/* ── DEPTH & ROP ── */}
        {section === "depth-rop" && (<>
          <SectionCard title={lang === "ru" ? "Глубина и ROP → WITSML Log (depth)" : "Depth & ROP → WITSML Log (depth)"}>
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground flex-1">
                {lang === "ru" ? "DEPTH (bit), HDEP (hole), ROP. Часть данных из EDR." : "DEPTH (bit), HDEP (hole), ROP. Some sourced from EDR."}
              </span>
              <label className="flex items-center gap-2 cursor-pointer shrink-0 ml-3">
                <input type="checkbox" checked={depthEnabled} onChange={e => setDepthEnabled(e.target.checked)} className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Включить" : "Enable"}</span>
              </label>
            </div>
            {isRunning && depthEnabled && (
              <div className="flex items-center gap-2 text-xs text-chart-2">
                <span className="size-1.5 rounded-full bg-chart-2 animate-pulse" />
                {lang === "ru" ? `Отправлено ${state.sentCounts.depth} row(s)` : `${state.sentCounts.depth} row(s) sent`}
              </div>
            )}
          </SectionCard>
          <SectionCard title={lang === "ru" ? "Настройки" : "Settings"}>
            <FieldRow label="Log UID"><InputField value={depthLogUid} onChange={setDepthLogUid} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Шаг (ft)" : "Step (ft)"}><InputField value={depthStep} onChange={setDepthStep} mono /></FieldRow>
          </SectionCard>
          <SectionCard title={lang === "ru" ? "Каналы" : "Channels"}>
            {[
              { m: "DEPTH", desc: "Bit Depth",    src: "EDR",      on: true },
              { m: "HDEP",  desc: "Hole Depth",   src: "Internal", on: true },
              { m: "ROP",   desc: "Rate of Penetration", src: "EDR", on: true },
              { m: "ROPE",  desc: "ROP Averaged", src: "Internal", on: true },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="checkbox" defaultChecked={c.on} className="accent-primary size-3.5" />
                <span className="mwd-cell font-mono font-bold text-foreground w-14">{c.m}</span>
                <span className="mwd-cell text-muted-foreground flex-1">{c.desc}</span>
                <span className={`mwd-cell px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  c.src === "EDR" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}>{c.src}</span>
              </div>
            ))}
          </SectionCard>
        </>)}

        {/* ── CURVES ── */}
        {section === "curves" && (<>
          <SectionCard title={lang === "ru" ? "Кривые → WITSML Log (depth)" : "Curves → WITSML Log (depth)"}>
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground flex-1">
                {lang === "ru" ? "Gamma Ray и другие кривые. Каналы можно добавлять." : "Gamma Ray and other curves. Channels can be extended."}
              </span>
              <label className="flex items-center gap-2 cursor-pointer shrink-0 ml-3">
                <input type="checkbox" checked={curvesEnabled} onChange={e => setCurvesEnabled(e.target.checked)} className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Включить" : "Enable"}</span>
              </label>
            </div>
            {isRunning && curvesEnabled && (
              <div className="flex items-center gap-2 text-xs text-chart-2">
                <span className="size-1.5 rounded-full bg-chart-2 animate-pulse" />
                {`${state.sentCounts.curves} row(s) sent`}
              </div>
            )}
          </SectionCard>
          <SectionCard title={lang === "ru" ? "Настройки" : "Settings"}>
            <FieldRow label="Log UID"><InputField value={curvesLogUid} onChange={setCurvesLogUid} mono /></FieldRow>
          </SectionCard>
          <SectionCard title={lang === "ru" ? "Каналы" : "Channels"}>
            {[
              { m: "GR",   desc: "Gamma Ray",       unit: "gAPI", on: true,  future: false },
              { m: "NPHI", desc: "Neutron Porosity", unit: "%",    on: false, future: true  },
              { m: "RHOB", desc: "Bulk Density",     unit: "g/cc", on: false, future: true  },
            ].map((c, i) => (
              <label key={i} className={`flex items-center gap-3 cursor-pointer ${c.future ? "opacity-40" : ""}`}>
                <input type="checkbox" defaultChecked={c.on} disabled={c.future} className="accent-primary size-3.5" />
                <span className="mwd-cell font-mono font-bold text-foreground w-12">{c.m}</span>
                <span className="mwd-cell text-muted-foreground flex-1">{c.desc}</span>
                <span className="mwd-cell font-mono text-muted-foreground/60 w-12">{c.unit}</span>
                {c.future && <span className="text-[10px] text-muted-foreground/40 italic">future</span>}
              </label>
            ))}
          </SectionCard>
        </>)}

        {/* ── DECODED PARAMS ── */}
        {section === "decoded" && (<>
          <SectionCard title={lang === "ru" ? "Декодированные параметры → WITSML Log (time)" : "Decoded Params → WITSML Log (time)"}>
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground flex-1">
                {lang === "ru" ? "GTF, MTF, toolface, Inc, Azi — агрегированные значения." : "GTF, MTF, toolface, Inc, Azi — aggregated values."}
              </span>
              <label className="flex items-center gap-2 cursor-pointer shrink-0 ml-3">
                <input type="checkbox" checked={decodedEnabled} onChange={e => setDecodedEnabled(e.target.checked)} className="accent-primary size-3.5" />
                <span className="mwd-cell text-foreground/70">{lang === "ru" ? "Включить" : "Enable"}</span>
              </label>
            </div>
            {isRunning && decodedEnabled && (
              <div className="flex items-center gap-2 text-xs text-chart-2">
                <span className="size-1.5 rounded-full bg-chart-2 animate-pulse" />
                {`${state.sentCounts.decoded} row(s) sent`}
              </div>
            )}
          </SectionCard>
          <SectionCard title={lang === "ru" ? "Настройки" : "Settings"}>
            <FieldRow label="Log UID"><InputField value={decodedLogUid} onChange={setDecodedLogUid} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Режим" : "Mode"}>
              <SelectField value={decodedMode} onChange={setDecodedMode} options={["Real-time","Batch (per packet)","Batch (interval)"]} />
            </FieldRow>
            <FieldRow label={lang === "ru" ? "Интервал (сек)" : "Interval (sec)"}><InputField value={decodedInterval} onChange={setDecodedInterval} mono /></FieldRow>
          </SectionCard>
          <SectionCard title={lang === "ru" ? "Каналы (WITSML mnemonics)" : "Channels (WITSML mnemonics)"}>
            {[
              { m: "GTF",  desc: "Gravity Toolface",  on: true  },
              { m: "MTF",  desc: "Magnetic Toolface",  on: true  },
              { m: "TF",   desc: "Current Toolface",   on: true  },
              { m: "INC",  desc: lang === "ru" ? "Зенитный угол" : "Inclination", on: true  },
              { m: "AZI",  desc: lang === "ru" ? "Азимут"        : "Azimuth",     on: true  },
              { m: "PKT",  desc: lang === "ru" ? "Пакетов декодировано" : "Packets decoded", on: true },
            ].map((c, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={c.on} className="accent-primary size-3.5" />
                <span className="mwd-cell font-mono font-bold text-foreground w-12">{c.m}</span>
                <span className="mwd-cell text-muted-foreground">{c.desc}</span>
              </label>
            ))}
          </SectionCard>
        </>)}

        {/* ── RUN / METADATA ── */}
        {section === "run-meta" && (<>
          <SectionCard title={lang === "ru" ? "Идентификация скважины" : "Well Identification"}>
            <FieldRow label={lang === "ru" ? "Название" : "Well name"}><InputField value={wellName} onChange={setWellName} /></FieldRow>
            <FieldRow label="Well UID"><InputField value={wellUid} onChange={setWellUid} mono /></FieldRow>
            <FieldRow label="Wellbore UID"><InputField value={wboreUid} onChange={setWboreUid} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Оператор" : "Operator"}><InputField value={operator} onChange={setOperator} /></FieldRow>
            <FieldRow label={lang === "ru" ? "Буровая" : "Rig"}><InputField value={rigName} onChange={setRigName} /></FieldRow>
          </SectionCard>
          <SectionCard title="Run">
            <FieldRow label={lang === "ru" ? "Номер рейса" : "Run number"}><InputField value={runNo} onChange={setRunNo} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Нач. глубина (ft)" : "Start depth (ft)"}><InputField value={startDepth} onChange={setStartDepth} mono /></FieldRow>
            <FieldRow label={lang === "ru" ? "Дата начала" : "Start date"}><InputField value={startDate} onChange={setStartDate} mono /></FieldRow>
          </SectionCard>
          <SectionCard title={lang === "ru" ? "Используется во всех потоках" : "Applied to all streams"}>
            {[
              { label: "Well UID",     value: wellUid    },
              { label: "Wellbore UID", value: wboreUid   },
              { label: "Run",          value: `#${runNo}` },
              { label: "Operator",     value: operator   },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="mwd-cell text-muted-foreground">{r.label}</span>
                <span className="mwd-cell font-mono font-semibold text-foreground">{r.value}</span>
              </div>
            ))}
          </SectionCard>
        </>)}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function TelesystemConfig() {
  const { t, lang } = useI18n();

  const [activeTab, setActiveTab] = useState<"telesystem" | "surface" | "edr" | "output">("telesystem");

  const [echoLoggingDisabled, setEchoLoggingDisabled] = useState(true);
  const [configMatches, setConfigMatches] = useState(true);
  const [modulesConnected, setModulesConnected] = useState(true);
  const [verifyConnectivity, setVerifyConnectivity] = useState(true);
  const [allModuleStatus, setAllModuleStatus] = useState(true);
  const [batteryLoadLogging, setBatteryLoadLogging] = useState(false);
  const [verificationExpanded, setVerificationExpanded] = useState(true);

  const moduleData = lang === "ru" ? moduleDataRU : moduleDataEN;
  const eventLogData = lang === "ru" ? eventLogDataRU : eventLogDataEN;

  const [filterValue, setFilterValue] = useState("1000");
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [clearLog, setClearLog] = useState(false);
  const [downloadLog, setDownloadLog] = useState(false);
  const [historyEnabled, setHistoryEnabled] = useState(false);

  const [configStatus, setConfigStatus] = useState<"tested" | "modified">("tested");
  const testedAt = "14-11-2025 12:46";

  function markModified() { setConfigStatus("modified"); }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-border bg-background px-3 gap-1 pt-1">
        {([
          { id: "telesystem", label: lang === "ru" ? "Настройки телесистемы" : "Telesystem Settings" },
          { id: "surface",    label: "Surface Unit" },
          { id: "edr",        label: "EDR/HDR Input" },
          { id: "output",     label: "Output" },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
            style={{ fontFamily: "var(--font-family-base)" }}
          >
            {tab.label}
            {tab.id === "telesystem" && (
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                configStatus === "tested"
                  ? "bg-chart-2/15 text-chart-2"
                  : "bg-yellow-500/15 text-yellow-600"
              }`}>
                <span className={`size-1.5 rounded-full shrink-0 ${
                  configStatus === "tested" ? "bg-chart-2" : "bg-yellow-500"
                }`} />
                {configStatus === "tested"
                  ? (lang === "ru" ? "Протестировано" : "Tested")
                  : (lang === "ru" ? "Изменено" : "Modified")}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Output tab */}
      {activeTab === "output" && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <OutputTab lang={lang} />
        </div>
      )}

      {/* EDR/HDR Input tab */}
      {activeTab === "edr" && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <EdrHdrInput lang={lang} />
        </div>
      )}

      {/* Surface Unit tab */}
      {activeTab === "surface" && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <SurfaceUnitSettings onClose={() => setActiveTab("telesystem")} />
        </div>
      )}

      {/* Telesystem tab */}
      {activeTab === "telesystem" && (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Status banner */}
      {configStatus === "modified" ? (
        <div className="mx-3 mt-3 px-3 py-2 rounded border border-yellow-500/40 bg-yellow-500/10 flex items-center gap-2 shrink-0">
          <AlertTriangle className="size-4 text-yellow-500 shrink-0" />
          <span className="text-xs text-yellow-600 font-medium">
            {lang === "ru"
              ? "Конфигурация изменена — требуется повторное тестирование"
              : "Configuration modified — re-testing required"}
          </span>
          <button
            className="ml-auto text-[10px] font-semibold text-yellow-600 hover:text-yellow-700 underline"
            onClick={() => setConfigStatus("tested")}
          >
            {lang === "ru" ? "Отметить как протестировано" : "Mark as tested"}
          </button>
        </div>
      ) : (
        <div className="mx-3 mt-3 px-3 py-2 rounded border border-chart-2/30 bg-chart-2/8 flex items-center gap-2 shrink-0">
          <Check className="size-4 text-chart-2 shrink-0" strokeWidth={2.5} />
          <span className="text-xs text-chart-2 font-medium">
            {lang === "ru"
              ? `Протестировано · ${testedAt}`
              : `Tested · ${testedAt}`}
          </span>
        </div>
      )}
    <div className="flex flex-1 min-h-0 overflow-hidden p-3 gap-3">
      {/* Left sidebar - Full height */}
      <div className="flex flex-col gap-3" style={{ width: 360, flexShrink: 0 }}>
        {/* Status info block */}
        <div className="border border-border rounded-md bg-background overflow-hidden flex flex-col shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card/50 shrink-0">
            <span className="mwd-title text-muted-foreground">
              {lang === "ru" ? "Наземный блок" : "Ground Unit"}
            </span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground">
                {lang === "ru" ? "Назначение" : "Assignment"}
              </span>
              <span className="mwd-cell text-chart-2">
                {lang === "ru" ? "Подключен" : "Connected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground">
                {lang === "ru" ? "Версия прошивки" : "Firmware Version"}
              </span>
              <span className="mwd-cell text-chart-2">
                FW-23 v1.33
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground">
                {lang === "ru" ? "Статус" : "Status"}
              </span>
              <span className="mwd-cell text-chart-2">
                OK
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground">
                {lang === "ru" ? "Состояние" : "State"}
              </span>
              <span className="mwd-cell text-muted-foreground">
                {lang === "ru" ? "Опрос" : "Polling"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="mwd-cell text-muted-foreground">
                {lang === "ru" ? "Связка" : "Link"}
              </span>
              <span className="mwd-cell text-muted-foreground">
                {lang === "ru" ? "Не подключена" : "Not connected"}
              </span>
            </div>
          </div>
        </div>

        {/* Configuration steps */}
        <div className="flex-1 min-h-0 border border-border rounded-md bg-background overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card/50 shrink-0">
            <span className="mwd-title text-muted-foreground">
              {lang === "ru" ? "Этапы настройки" : "Configuration Steps"}
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-card/50 border border-border">
                <Check className="size-4 text-chart-2 shrink-0" strokeWidth={2.5} />
                <span className="mwd-cell text-foreground">
                  {lang === "ru" ? "1. Подключение" : "1. Connection"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded">
                <Check className="size-4 text-chart-2 shrink-0" strokeWidth={2.5} />
                <span className="mwd-cell text-foreground">
                  {lang === "ru" ? "2. Тестирование" : "2. Testing"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded">
                <Check className="size-4 text-chart-2 shrink-0" strokeWidth={2.5} />
                <span className="mwd-cell text-foreground">
                  {lang === "ru" ? "3. Конфигурация батарей" : "3. Battery Configuration"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded">
                <Check className="size-4 text-chart-2 shrink-0" strokeWidth={2.5} />
                <span className="mwd-cell text-foreground">
                  {lang === "ru" ? "4. Конфигурация гидроканала" : "4. Hydrocanal Configuration"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded">
                <Check className="size-4 text-chart-2 shrink-0" strokeWidth={2.5} />
                <span className="mwd-cell text-foreground">
                  {lang === "ru" ? "5. Настройка телесистемы" : "5. Telesystem Configuration"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right content area */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
      {/* Top section: Verification */}
      <div className="border border-border rounded-md bg-background overflow-hidden flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card/50 shrink-0">
          <span className="mwd-title text-muted-foreground">
            {lang === "ru" ? "Верификация" : "Verification"}
          </span>
          <button
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setVerificationExpanded(!verificationExpanded)}
          >
            <ChevronDown 
              className="size-3.5 transition-transform duration-200" 
              style={{ transform: verificationExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}
            />
          </button>
        </div>
        
        <div className="p-3" style={{ display: verificationExpanded ? "block" : "none" }}>
          <div className="flex flex-col gap-2">
            {[
              { state: modulesConnected,    set: setModulesConnected,    labelRU: "Выполнена команда \"Поиск модулей\"",       labelEN: "Command \"Find modules\" completed" },
              { state: configMatches,       set: setConfigMatches,       labelRU: "Конфигурация соответствует ожидаемой",      labelEN: "Configuration matches expected" },
              { state: modulesConnected,    set: setModulesConnected,    labelRU: "Все модули найдены и подключены",           labelEN: "All modules found and connected" },
              { state: echoLoggingDisabled, set: setEchoLoggingDisabled, labelRU: "Прошивки всех модулей совместимы",         labelEN: "All module firmwares are compatible" },
              { state: allModuleStatus,     set: setAllModuleStatus,     labelRU: "Статусы всех модулей валидны",             labelEN: "All module statuses are valid" },
              { state: verifyConnectivity,  set: setVerifyConnectivity,  labelRU: "Лимиты запаковки всех модулей валидны",    labelEN: "All module packing limits are valid" },
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={item.state}
                  onCheckedChange={(v) => { item.set(!!v); markModified(); }}
                />
                <span className={`mwd-cell ${item.state ? "text-foreground" : "text-muted-foreground line-through"}`}>
                  {lang === "ru" ? item.labelRU : item.labelEN}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Middle section: Modules Table */}
      <div className="flex-1 min-h-0 border border-border rounded-md bg-background overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card/50 shrink-0">
          <span className="mwd-title text-muted-foreground">
            {lang === "ru" ? "Модули" : "Modules"}
          </span>
          <div className="flex-1" />
          <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="size-3.5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10" style={{ background: "var(--table-header-bg)" }}>
              <tr className="border-b border-border">
                <th className="mwd-header px-3 py-2 text-left text-muted-foreground whitespace-nowrap">
                  {lang === "ru" ? "Модуль" : "Module"}
                </th>
                <th className="mwd-header px-3 py-2 text-left text-muted-foreground whitespace-nowrap">
                  {lang === "ru" ? "Версия" : "Version"}
                </th>
                <th className="mwd-header px-3 py-2 text-left text-muted-foreground whitespace-nowrap">
                  {lang === "ru" ? "Серийный номер" : "Serial Number"}
                </th>
                <th className="mwd-header px-3 py-2 text-left text-muted-foreground whitespace-nowrap">
                  {lang === "ru" ? "Наработка" : "Runtime"}
                </th>
                <th className="mwd-header px-3 py-2 text-left text-muted-foreground whitespace-nowrap">
                  {lang === "ru" ? "Лимиты упаковки" : "Packing Limits"}
                </th>
                <th className="mwd-header px-3 py-2 text-left text-muted-foreground whitespace-nowrap">
                  {lang === "ru" ? "Состояние" : "State"}
                </th>
              </tr>
            </thead>
            <tbody>
              {moduleData.map((row) => (
                <tr key={row.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="mwd-cell px-3 py-2 text-foreground">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            row.stateColor === "green"
                              ? "var(--chart-2)"
                              : row.stateColor === "yellow"
                              ? "var(--chart-5)"
                              : "var(--destructive)",
                        }}
                      />
                      {row.module}
                    </div>
                  </td>
                  <td className="mwd-cell px-3 py-2 text-foreground">{row.input}</td>
                  <td className="mwd-cell px-3 py-2 text-foreground">{row.meterActive}</td>
                  <td className="mwd-cell px-3 py-2 text-foreground">{row.status}</td>
                  <td className="mwd-cell px-3 py-2 text-foreground">{row.runtime}</td>
                  <td className="mwd-cell px-3 py-2 text-foreground">{row.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom section: Event Log */}
      <div className="border border-border rounded-md bg-background overflow-hidden flex flex-col" style={{ height: 220 }}>
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-card/50 shrink-0">
          <button className="mwd-btn px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            {lang === "ru" ? "Фильтр" : "Filter"}
          </button>

          <button className="p-1 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <ExternalLink className="size-3.5" />
          </button>

          <div className="flex-1" />

          <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
            <Checkbox
              checked={autoScrollEnabled}
              onCheckedChange={(v) => setAutoScrollEnabled(!!v)}
            />
            <span className="mwd-cell text-muted-foreground">
              {lang === "ru" ? "Автопрокрутка" : "Auto-scroll"}
            </span>
          </label>

          <button
            className="mwd-btn px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setClearLog(!clearLog)}
          >
            {lang === "ru" ? "Очистить" : "Clear"}
          </button>

          <button
            className="mwd-btn px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setDownloadLog(!downloadLog)}
          >
            {lang === "ru" ? "Загрузить" : "Download"}
          </button>

          <div className="w-px h-4 bg-border" />

          <span className="mwd-cell text-muted-foreground">
            {lang === "ru" ? "История" : "History"}
          </span>
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="mwd-cell bg-card border border-border rounded px-2 py-0.5 text-foreground cursor-pointer"
          >
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="all">{lang === "ru" ? "Все" : "All"}</option>
          </select>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10" style={{ background: "var(--table-header-bg)" }}>
              <tr className="border-b border-border">
                <th className="mwd-header px-3 py-2 text-left text-muted-foreground whitespace-nowrap w-48">
                  {lang === "ru" ? "Дата и время" : "Date and Time"}
                </th>
                <th className="mwd-header px-3 py-2 text-left text-muted-foreground">
                  {lang === "ru" ? "Сообщение" : "Message"}
                </th>
              </tr>
            </thead>
            <tbody>
              {eventLogData.map((row) => (
                <tr key={row.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="mwd-cell px-3 py-1 text-muted-foreground tabular-nums whitespace-nowrap">
                    {row.timestamp}
                  </td>
                  <td className="mwd-cell px-3 py-1 text-foreground">{row.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
    </div>
      )}
    </div>
  );
}