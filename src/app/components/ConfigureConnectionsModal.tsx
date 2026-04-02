import React, { useState } from "react";
import { X, HelpCircle } from "lucide-react";

interface ConfigureConnectionsModalProps {
  onClose: () => void;
}

export function ConfigureConnectionsModal({ onClose }: ConfigureConnectionsModalProps) {
  // Connector assignments
  const [connector1, setConnector1] = useState("Pressure №1");
  const [connector2, setConnector2] = useState("Pressure №2");
  const [connector3, setConnector3] = useState("Hook Load");
  const [connector4, setConnector4] = useState("Encoder");

  // Threshold values
  const [circulationSource, setCirculationSource] = useState("From Sensor");
  const [circulationValue, setCirculationValue] = useState("20.000");
  const [weightSource, setWeightSource] = useState("From Sensor");
  const [weightValue, setWeightValue] = useState("20.000");

  const sensorOptions = [
    "Pressure №1",
    "Pressure №2",
    "Hook Load",
    "Encoder",
    "Not Connected",
  ];

  const sourceOptions = ["From Sensor", "Manual"];

  const handleSetDefault = () => {
    setConnector1("Pressure №1");
    setConnector2("Pressure №2");
    setConnector3("Hook Load");
    setConnector4("Encoder");
    setCirculationValue("20.000");
    setWeightValue("20.000");
  };

  const handleSyncThresholds = () => {
    // Sync logic here
    console.log("Syncing thresholds...");
  };

  const handleRead = () => {
    console.log("Reading configuration...");
  };

  const handleWrite = () => {
    console.log("Writing configuration...");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-background border border-border rounded shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]"
        style={{
          borderRadius: "var(--radius)",
          boxShadow: "var(--elevation-lg)",
        }}
      >
        {/* Header */}
        <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <div className="size-6 flex items-center justify-center">
              <div
                className="size-5 rounded-sm bg-primary/20 border border-primary/40"
                style={{ borderRadius: "var(--radius-sm)" }}
              />
            </div>
            <span
              className="text-foreground"
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Connection Settings
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="size-6 flex items-center justify-center rounded hover:bg-secondary transition-colors"
              title="Help"
            >
              <HelpCircle className="size-4 text-foreground/60" />
            </button>
            <button
              onClick={onClose}
              className="size-6 flex items-center justify-center rounded hover:bg-secondary transition-colors"
              title="Close"
            >
              <X className="size-4 text-foreground/60" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-6">
            {/* Connections Section */}
            <div>
              <h3
                className="text-foreground mb-3"
                style={{
                  fontFamily: "var(--font-family-base)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Connections
              </h3>

              <div className="flex flex-col gap-2">
                {/* Connector 1 */}
                <div className="flex items-center gap-3">
                  <label
                    className="w-32 text-foreground/80"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                    }}
                  >
                    Connector №1
                  </label>
                  <select
                    value={connector1}
                    onChange={(e) => setConnector1(e.target.value)}
                    className="flex-1 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {sensorOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Connector 2 */}
                <div className="flex items-center gap-3">
                  <label
                    className="w-32 text-foreground/80"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                    }}
                  >
                    Connector №2
                  </label>
                  <select
                    value={connector2}
                    onChange={(e) => setConnector2(e.target.value)}
                    className="flex-1 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {sensorOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Connector 3 */}
                <div className="flex items-center gap-3">
                  <label
                    className="w-32 text-foreground/80"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                    }}
                  >
                    Connector №3
                  </label>
                  <select
                    value={connector3}
                    onChange={(e) => setConnector3(e.target.value)}
                    className="flex-1 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {sensorOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Connector 4 */}
                <div className="flex items-center gap-3">
                  <label
                    className="w-32 text-foreground/80"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                    }}
                  >
                    Connector №4
                  </label>
                  <select
                    value={connector4}
                    onChange={(e) => setConnector4(e.target.value)}
                    className="flex-1 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {sensorOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Indicator Thresholds Section */}
            <div>
              <h3
                className="text-foreground mb-3"
                style={{
                  fontFamily: "var(--font-family-base)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Indicator Thresholds
              </h3>

              <div
                className="border border-border rounded p-4 bg-secondary/5 flex flex-col gap-3"
                style={{ borderRadius: "var(--radius)" }}
              >
                {/* Circulation Detection Threshold */}
                <div className="flex items-center gap-3">
                  <label
                    className="w-48 text-foreground/80"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                    }}
                  >
                    Circulation Detection Threshold
                  </label>
                  <select
                    value={circulationSource}
                    onChange={(e) => setCirculationSource(e.target.value)}
                    className="w-40 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {sourceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={circulationValue}
                    onChange={(e) => setCirculationValue(e.target.value)}
                    className="w-28 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <span
                    className="text-foreground/60"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    mA
                  </span>
                </div>

                {/* Weight Detection Threshold */}
                <div className="flex items-center gap-3">
                  <label
                    className="w-48 text-foreground/80"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                    }}
                  >
                    Weight Detection Threshold
                  </label>
                  <select
                    value={weightSource}
                    onChange={(e) => setWeightSource(e.target.value)}
                    className="w-40 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {sourceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    className="w-28 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <span
                    className="text-foreground/60"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    mA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="h-14 shrink-0 flex items-center justify-between px-4 border-t border-border bg-secondary/20">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSetDefault}
              className="px-3 h-8 rounded text-foreground hover:bg-secondary/50 transition-colors"
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                borderRadius: "var(--radius)",
              }}
            >
              Default
            </button>
            <button
              onClick={handleSyncThresholds}
              className="px-3 h-8 rounded bg-primary text-white hover:bg-primary/90 transition-colors"
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                borderRadius: "var(--radius)",
              }}
            >
              Synchronize Thresholds
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRead}
              className="px-3 h-8 rounded bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors"
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                borderRadius: "var(--radius)",
              }}
            >
              Read
            </button>
            <button
              onClick={handleWrite}
              className="px-3 h-8 rounded bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors"
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                borderRadius: "var(--radius)",
              }}
            >
              Write
            </button>
            <button
              onClick={onClose}
              className="px-3 h-8 rounded bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors"
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                borderRadius: "var(--radius)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}