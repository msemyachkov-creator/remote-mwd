import React, { useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useWell } from "./WellContext";

interface RigSettingsProps {
  onClose: () => void;
}

export function RigSettings({ onClose }: RigSettingsProps) {
  const { addRig, addWellEntry, addRun } = useWell();

  // Rig fields
  const [name, setName] = useState("");
  const [petId, setPetId] = useState("");
  const [unit, setUnit] = useState<"ft" | "m">("ft");
  const [boxStatus, setBoxStatus] = useState<"active" | "offline" | "paused">("active");

  // Well section
  const [wellOpen, setWellOpen] = useState(false);
  const [wellName, setWellName] = useState("Well 1");

  // Run section
  const [runOpen, setRunOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSave = () => {
    if (!name.trim()) return;
    const rigId = addRig({ name: name.trim(), jobId: petId.trim(), unit, boxStatus, currentLeg: 1 });

    if (wellOpen && wellName.trim()) {
      const wellId = addWellEntry({ name: wellName.trim(), rigId });

      if (runOpen) {
        addRun({
          name: name.trim(),
          rigId,
          wellId,
          runNumber: 1,
          bitDepth: 0,
          holeDepth: 0,
          unit,
          gtf: 0,
          inc: 0,
          azm: 0,
          pressure: 0,
          status: "active",
          seed: Date.now() % 10000,
          gamma: 0,
          temp: 0,
          startDate,
        });
      }
    }

    onClose();
  };

  const fieldClass =
    "w-full h-8 px-2.5 bg-input-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-shadow";
  const selectClass = fieldClass + " cursor-pointer";
  const labelClass = "block text-xs text-foreground/60 mb-1 font-medium";
  const sectionHeaderClass =
    "flex items-center gap-2 w-full py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors select-none cursor-pointer";

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <h2 className="text-base font-semibold text-foreground">New Rig</h2>
        <button
          onClick={onClose}
          className="flex items-center justify-center size-7 rounded hover:bg-secondary/80 transition-colors"
        >
          <X className="size-4 text-foreground/60" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-5">
        <div className="flex flex-col gap-4">

          {/* Rig fields */}
          <div className="flex flex-col gap-3">
            <div>
              <label className={labelClass}>Rig Name</label>
              <input
                className={fieldClass}
                placeholder="e.g. Rig PD153"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ borderRadius: "var(--radius)" }}
              />
            </div>
            <div>
              <label className={labelClass}>PET ID</label>
              <input
                className={fieldClass}
                placeholder="e.g. PET 21 D12-23 HELLK 9-27-54-3"
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                style={{ borderRadius: "var(--radius)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Unit</label>
                <select className={selectClass} value={unit} onChange={(e) => setUnit(e.target.value as "ft" | "m")} style={{ borderRadius: "var(--radius)" }}>
                  <option value="ft">ft</option>
                  <option value="m">m</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select className={selectClass} value={boxStatus} onChange={(e) => setBoxStatus(e.target.value as "active" | "offline" | "paused")} style={{ borderRadius: "var(--radius)" }}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Well section */}
          <div>
            <button className={sectionHeaderClass} onClick={() => setWellOpen((v) => !v)}>
              {wellOpen ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
              Add Well
            </button>
            {wellOpen && (
              <div className="mt-2">
                <label className={labelClass}>Well Name</label>
                <input
                  className={fieldClass}
                  placeholder="e.g. Well 1"
                  value={wellName}
                  onChange={(e) => setWellName(e.target.value)}
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>
            )}
          </div>

          {/* Run section — only if well is open */}
          {wellOpen && (
            <div>
              <button className={sectionHeaderClass} onClick={() => setRunOpen((v) => !v)}>
                {runOpen ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
                Add Run
              </button>
              {runOpen && (
                <div className="mt-2">
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="date"
                    className={fieldClass}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ borderRadius: "var(--radius)" }}
                  />
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 flex justify-end gap-2 px-5 py-3 border-t border-border">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-sm text-foreground/60 border border-border rounded hover:bg-secondary/60 transition-colors"
          style={{ borderRadius: "var(--radius)" }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderRadius: "var(--radius)" }}
        >
          Add Rig
        </button>
      </div>
    </div>
  );
}
