import React, { createContext, useContext, useState, useMemo } from "react";

export interface WellData {
  id: string;
  name: string;       // rig name, e.g. "Rig PD143"
  bitDepth: number;
  holeDepth: number;
  unit: string;
  gtf: number;
  inc: number;
  azm: number;
  pressure: number;
  status: "active" | "standby" | "off";
  seed: number;
  gamma: number;
  temp: number;
  // Hierarchy
  rigId: string;
  wellId: string;
  runNumber: number;
  // Run dates
  startDate: string;   // ISO date string, e.g. "2025-11-10"
  endDate?: string;    // undefined if run is still active
}

export interface WellEntry {
  id: string;
  name: string;   // e.g. "Well 1"
  rigId: string;
}

export interface RigEntry {
  id: string;
  name: string;          // e.g. "Rig PD143"
  unit: string;
  jobId: string;         // e.g. "PET 21 D12-23...HELLK 9-27-54-3"
  boxStatus: "active" | "offline" | "paused";
  currentLeg: number;    // current run/leg number
}

export const rigs: RigEntry[] = [
  { id: "rig1",  name: "Rig PD143", unit: "ft", jobId: "PET 21 D12-23 HELLK 9-27-54-3", boxStatus: "active",  currentLeg: 2 },
  { id: "rig2",  name: "Rig PD144", unit: "ft", jobId: "PET 21 D12-23 HELLK 9-27-54-3", boxStatus: "active",  currentLeg: 1 },
  { id: "rig3",  name: "Rig PD145", unit: "ft", jobId: "DRL 19 A04-22 NORSK 4-11-21-1", boxStatus: "paused",  currentLeg: 1 },
  { id: "rig4",  name: "Rig PD146", unit: "ft", jobId: "PET 21 D12-23 HELLK 9-27-54-3", boxStatus: "active",  currentLeg: 2 },
  { id: "rig5",  name: "Rig PD147", unit: "ft", jobId: "EXP 20 C08-21 ARCTIC 7-14-33-2", boxStatus: "offline", currentLeg: 1 },
  { id: "rig6",  name: "Rig PD148", unit: "ft", jobId: "DRL 22 B03-24 GULF 2-09-15-4",  boxStatus: "active",  currentLeg: 1 },
  { id: "rig7",  name: "Rig PD149", unit: "ft", jobId: "PET 21 D12-23 HELLK 9-27-54-3", boxStatus: "active",  currentLeg: 1 },
  { id: "rig8",  name: "Rig PD150", unit: "ft", jobId: "EXP 20 C08-21 ARCTIC 7-14-33-2", boxStatus: "paused",  currentLeg: 1 },
  { id: "rig9",  name: "Rig PD151", unit: "ft", jobId: "DRL 19 A04-22 NORSK 4-11-21-1", boxStatus: "offline", currentLeg: 1 },
  { id: "rig10", name: "Rig PD152", unit: "ft", jobId: "DRL 22 B03-24 GULF 2-09-15-4",  boxStatus: "active",  currentLeg: 1 },
];

export const wellEntries: WellEntry[] = [
  { id: "w1",  name: "Well 1", rigId: "rig1" },
  { id: "w1b", name: "Well 2", rigId: "rig1" },
  { id: "w1c", name: "Well 3", rigId: "rig1" },
  { id: "w2",  name: "Well 1", rigId: "rig2" },
  { id: "w3",  name: "Well 1", rigId: "rig3" },
  { id: "w4",  name: "Well 1", rigId: "rig4" },
  { id: "w5",  name: "Well 1", rigId: "rig5" },
  { id: "w6",  name: "Well 1", rigId: "rig6" },
  { id: "w7",  name: "Well 1", rigId: "rig7" },
  { id: "w8",  name: "Well 1", rigId: "rig8" },
  { id: "w9",  name: "Well 1", rigId: "rig9" },
  { id: "w10", name: "Well 1", rigId: "rig10" },
];

const mockWells: WellData[] = [
  // Rig PD143 — Well 1: 2 runs (run 1 ended, run 2 active)
  { id: "1a", name: "Rig PD143", rigId: "rig1",  wellId: "w1",  runNumber: 1, bitDepth: 7200,  holeDepth: 18000, unit: "ft", gtf: 280.0, inc: 8.10,  azm: 270.00, pressure: 1100, status: "off",    seed: 100,  gamma: 40.0, temp: 80.0,  startDate: "2025-09-12", endDate: "2025-11-04" },
  { id: "1",  name: "Rig PD143", rigId: "rig1",  wellId: "w1",  runNumber: 2, bitDepth: 9879,  holeDepth: 23568, unit: "ft", gtf: 345.2, inc: 12.45, azm: 284.12, pressure: 1250, status: "active", seed: 101,  gamma: 45.2, temp: 85.4,  startDate: "2025-11-10" },
  // Rig PD143 — Well 2: 1 completed run
  { id: "1b", name: "Rig PD143", rigId: "rig1",  wellId: "w1b", runNumber: 1, bitDepth: 6540,  holeDepth: 16200, unit: "ft", gtf: 210.5, inc: 6.30,  azm: 255.00, pressure: 1050, status: "off",    seed: 110,  gamma: 38.0, temp: 79.0,  startDate: "2025-04-15", endDate: "2025-08-30" },
  // Rig PD143 — Well 3: 1 active run
  { id: "1c", name: "Rig PD143", rigId: "rig1",  wellId: "w1c", runNumber: 1, bitDepth: 11230, holeDepth: 25100, unit: "ft", gtf: 310.0, inc: 15.80, azm: 290.50, pressure: 1380, status: "active", seed: 120,  gamma: 50.5, temp: 91.0,  startDate: "2026-01-05" },
  // Rig PD144 — 1 active run
  { id: "2",  name: "Rig PD144", rigId: "rig2",  wellId: "w2",  runNumber: 1, bitDepth: 12450, holeDepth: 18920, unit: "ft", gtf: 45.8,  inc: 24.12, azm: 112.45, pressure: 1320, status: "active", seed: 202,  gamma: 32.8, temp: 92.1,  startDate: "2026-01-08" },
  // Rig PD145 — 1 standby run
  { id: "3",  name: "Rig PD145", rigId: "rig3",  wellId: "w3",  runNumber: 1, bitDepth: 8234,  holeDepth: 15678, unit: "ft", gtf: 182.1, inc: 4.56,  azm: 350.12, pressure: 980,  status: "standby",seed: 303,  gamma: 18.5, temp: 78.9,  startDate: "2025-12-20" },
  // Rig PD146 — 2 runs on Well 1 (run 1 ended, run 2 is active)
  { id: "4a", name: "Rig PD146", rigId: "rig4",  wellId: "w4",  runNumber: 1, bitDepth: 9000,  holeDepth: 20000, unit: "ft", gtf: 260.0, inc: 38.00, azm: 40.00,  pressure: 1300, status: "off",    seed: 400,  gamma: 55.0, temp: 98.0,  startDate: "2025-08-01", endDate: "2025-10-14" },
  { id: "4",  name: "Rig PD146", rigId: "rig4",  wellId: "w4",  runNumber: 2, bitDepth: 11567, holeDepth: 22340, unit: "ft", gtf: 270.5, inc: 45.67, azm: 45.23,  pressure: 1410, status: "active", seed: 404,  gamma: 62.1, temp: 105.3, startDate: "2025-10-19" },
  // Rig PD147 — 1 off run
  { id: "5",  name: "Rig PD147", rigId: "rig5",  wellId: "w5",  runNumber: 1, bitDepth: 9988,  holeDepth: 19450, unit: "ft", gtf: 12.3,  inc: 1.23,  azm: 190.45, pressure: 1100, status: "off",    seed: 505,  gamma: 12.4, temp: 82.0,  startDate: "2025-06-03", endDate: "2025-09-28" },
  // Rig PD148 — 1 active run
  { id: "6",  name: "Rig PD148", rigId: "rig6",  wellId: "w6",  runNumber: 1, bitDepth: 10234, holeDepth: 21890, unit: "ft", gtf: 95.6,  inc: 8.90,  azm: 215.67, pressure: 1280, status: "active", seed: 606,  gamma: 38.9, temp: 88.7,  startDate: "2026-02-14" },
  // Rig PD149 — 1 active run
  { id: "7",  name: "Rig PD149", rigId: "rig7",  wellId: "w7",  runNumber: 1, bitDepth: 8765,  holeDepth: 17234, unit: "ft", gtf: 312.4, inc: 18.23, azm: 12.34,  pressure: 1150, status: "active", seed: 707,  gamma: 51.4, temp: 96.2,  startDate: "2026-01-22" },
  // Rig PD150 — 1 active run
  { id: "8",  name: "Rig PD150", rigId: "rig8",  wellId: "w8",  runNumber: 1, bitDepth: 13456, holeDepth: 24567, unit: "ft", gtf: 22.1,  inc: 65.43, azm: 280.90, pressure: 1500, status: "active", seed: 808,  gamma: 75.8, temp: 112.5, startDate: "2025-11-30" },
  // Rig PD151 — 1 standby run
  { id: "9",  name: "Rig PD151", rigId: "rig9",  wellId: "w9",  runNumber: 1, bitDepth: 9123,  holeDepth: 20345, unit: "ft", gtf: 150.8, inc: 11.11, azm: 45.67,  pressure: 1050, status: "standby",seed: 909,  gamma: 24.6, temp: 84.3,  startDate: "2026-03-01" },
  // Rig PD152 — 1 active run
  { id: "10", name: "Rig PD152", rigId: "rig10", wellId: "w10", runNumber: 1, bitDepth: 11890, holeDepth: 23789, unit: "ft", gtf: 358.2, inc: 2.34,  azm: 185.23, pressure: 1350, status: "active", seed: 1010, gamma: 42.1, temp: 98.6,  startDate: "2026-02-05" },
];

interface WellContextType {
  activeWellId: string;
  setActiveWellId: (id: string) => void;
  activeWell: WellData;
  wells: WellData[];
  rigs: RigEntry[];
  wellEntries: WellEntry[];
  addRig: (rig: Omit<RigEntry, "id">) => string;
  addWellEntry: (entry: Omit<WellEntry, "id">) => string;
  addRun: (run: Omit<WellData, "id">) => void;
  renameRig: (rigId: string, newName: string) => void;
}

const WellContext = createContext<WellContextType | undefined>(undefined);

export function WellProvider({ children }: { children: React.ReactNode }) {
  const [activeWellId, setActiveWellId] = useState<string>("1");
  const [rigsState, setRigsState] = useState<RigEntry[]>(rigs);
  const [wellEntriesState, setWellEntriesState] = useState<WellEntry[]>(wellEntries);
  const [runsState, setRunsState] = useState<WellData[]>(mockWells);

  const activeWell = useMemo(() => {
    return runsState.find((w) => w.id === activeWellId) || runsState[0];
  }, [activeWellId, runsState]);

  const addRig = (rig: Omit<RigEntry, "id">): string => {
    const id = `rig${Date.now()}`;
    setRigsState((prev) => [...prev, { ...rig, id }]);
    return id;
  };

  const addWellEntry = (entry: Omit<WellEntry, "id">): string => {
    const id = `w${Date.now()}`;
    setWellEntriesState((prev) => [...prev, { ...entry, id }]);
    return id;
  };

  const addRun = (run: Omit<WellData, "id">) => {
    const id = `run${Date.now()}`;
    setRunsState((prev) => [...prev, { ...run, id }]);
  };

  const renameRig = (rigId: string, newName: string) => {
    setRigsState((prev) =>
      prev.map((r) => (r.id === rigId ? { ...r, name: newName } : r))
    );
  };

  const value = {
    activeWellId,
    setActiveWellId,
    activeWell,
    wells: runsState,
    rigs: rigsState,
    wellEntries: wellEntriesState,
    addRig,
    addWellEntry,
    addRun,
    renameRig,
  };

  return <WellContext.Provider value={value}>{children}</WellContext.Provider>;
}

export function useWell() {
  const context = useContext(WellContext);
  if (!context) {
    throw new Error("useWell must be used within a WellProvider");
  }
  return context;
}
