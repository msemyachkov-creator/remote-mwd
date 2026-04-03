import React, { useState } from "react";
import { X, Info } from "lucide-react";
import { MapComponent } from "./MapComponent";

interface WorkSettingsProps {
  onClose?: () => void;
}

type TabId = "info" | "location" | "elevation" | "parameters" | "tie-in";

const tabs: { id: TabId; label: string }[] = [
  { id: "info", label: "Well Information" },
  { id: "location", label: "Location" },
  { id: "elevation", label: "Reference elevation" },
  { id: "parameters", label: "Gamma Calibration Factor" },
  { id: "tie-in", label: "Tie-In Point" },
];

export function WorkSettings({ onClose }: WorkSettingsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [formData, setFormData] = useState({
    company: "",
    well: "",
    field: "",
    county: "",
    state: "",
  });

  const [locationFormat, setLocationFormat] = useState<"dms" | "decimal">("dms");
  const [latitude, setLatitude] = useState("00°00'0.000''N");
  const [longitude, setLongitude] = useState("000°00'0.000''E");
  
  // Store numeric coordinates for the map
  const [mapLat, setMapLat] = useState<number>(0);
  const [mapLng, setMapLng] = useState<number>(0);

  // Elevation Reference state
  const [elevationReference, setElevationReference] = useState("Rotary Table");
  const [rotaryTableElevation, setRotaryTableElevation] = useState("5.00");
  const [groundLevelElevation, setGroundLevelElevation] = useState("10.00");

  // Calculation Parameters state  
  const [apiCorrection, setApiCorrection] = useState("0.00");
  const [showApiTooltip, setShowApiTooltip] = useState(false);

  // Tie-in Point state
  const [tieInMD, setTieInMD] = useState("0.00");
  const [tieInINCL, setTieInINCL] = useState("0.00");
  const [tieInAZIM, setTieInAZIM] = useState("0.00");
  const [tieInTVD, setTieInTVD] = useState("0.00");
  const [tieInNS, setTieInNS] = useState("0.00");
  const [tieInEW, setTieInEW] = useState("0.00");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    onClose?.();
  };

  // Update map coordinates when location changes
  const handleMapLocationChange = (newLat: number, newLng: number) => {
    setMapLat(newLat);
    setMapLng(newLng);
    
    // Update the text fields with formatted coordinates
    if (locationFormat === "dms") {
      setLatitude(formatDMS(newLat, true));
      setLongitude(formatDMS(newLng, false));
    } else {
      setLatitude(newLat.toFixed(6));
      setLongitude(newLng.toFixed(6));
    }
  };

  // Format decimal to DMS
  const formatDMS = (decimal: number, isLat: boolean): string => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = ((minutesFloat - minutes) * 60).toFixed(3);
    
    let direction = "";
    if (isLat) {
      direction = decimal >= 0 ? "N" : "S";
    } else {
      direction = decimal >= 0 ? "E" : "W";
    }
    
    return `${String(degrees).padStart(isLat ? 2 : 3, "0")}°${String(minutes).padStart(2, "0")}'${seconds}''${direction}`;
  };

  return (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
      {/* Header with title and close button */}
      <div className="h-10 shrink-0 flex items-center justify-between px-4 border-b border-border bg-secondary/30">
        <span
          className="text-foreground"
          style={{
            fontFamily: "var(--font-family-base)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Well Settings
        </span>
        <button
          onClick={handleClose}
          className="size-6 flex items-center justify-center rounded hover:bg-secondary transition-colors"
          title="Close"
        >
          <X className="size-4 text-foreground/60" />
        </button>
      </div>

      {/* Main content: sidebar + form */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left sidebar with tabs */}
        <div
          className="w-48 shrink-0 bg-secondary/20 border-r border-border flex flex-col"
          style={{ backgroundColor: "var(--sidebar)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-left transition-colors border-b border-border ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary"
                  : "text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
              }`}
              style={{
                fontFamily: "var(--font-family-base)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 min-h-0 overflow-auto">
          {activeTab === "info" && (
            <div className="p-6">
              <div className="max-w-sm flex flex-col gap-4">
                {[
                  { key: "company", label: "Company" },
                  { key: "well",    label: "Well" },
                  { key: "field",   label: "Field" },
                  { key: "county",  label: "County" },
                  { key: "state",   label: "State" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label
                      className="text-foreground/60"
                      style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)" }}
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formData[key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="h-8 w-full px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                      style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="p-6">
              <div className="max-w-5xl flex flex-col gap-6">
                {/* Format selection */}
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="locationFormat"
                      checked={locationFormat === "dms"}
                      onChange={() => setLocationFormat("dms")}
                      className="size-4 accent-primary"
                    />
                    <span
                      className="text-foreground"
                      style={{
                        fontFamily: "var(--font-family-base)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-normal)",
                      }}
                    >
                      Format (DMS)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="locationFormat"
                      checked={locationFormat === "decimal"}
                      onChange={() => setLocationFormat("decimal")}
                      className="size-4 accent-primary"
                    />
                    <span
                      className="text-foreground"
                      style={{
                        fontFamily: "var(--font-family-base)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-normal)",
                      }}
                    >
                      Decimal
                    </span>
                  </label>
                </div>

                {/* Latitude and Longitude inputs */}
                <div className="flex gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-foreground/60" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)" }}>
                      Latitude <span className="text-foreground/40">[D°MM'SS[N,S]]</span>
                    </label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-56 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                      style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-foreground/60" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)" }}>
                      Longitude <span className="text-foreground/40">[D°MM'SS[E,W]]</span>
                    </label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-56 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                      style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                    />
                  </div>
                </div>

                {/* World map */}
                <div className="relative w-full aspect-[16/9] bg-secondary/10 border border-border rounded overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                  <MapComponent
                    latitude={mapLat}
                    longitude={mapLng}
                    onLocationChange={handleMapLocationChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "elevation" && (
            <div className="p-6">
              <div className="max-w-xl flex flex-col gap-6">
                {/* Elevation Reference dropdown */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-foreground/60"
                    style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)" }}
                  >
                    Reference elevation
                  </label>
                  <select
                    value={elevationReference}
                    onChange={(e) => setElevationReference(e.target.value)}
                    className="w-64 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                  >
                    <option value="Rotary Table">Rotary Table</option>
                    <option value="Ground Level">Ground Level</option>
                    <option value="Kelly Bushing">Kelly Bushing</option>
                  </select>
                </div>

                {/* Elevation inputs */}
                <div className="flex flex-col gap-4">
                  {/* Rotary Table Elevation */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-foreground/60"
                      style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)" }}
                    >
                      Reference Point Rotary Table from Sea Level
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={rotaryTableElevation}
                        onChange={(e) => setRotaryTableElevation(e.target.value)}
                        className="w-32 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                        style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                      />
                      <span className="text-muted-foreground" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)" }}>m</span>
                    </div>
                  </div>

                  {/* Ground Level Elevation */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-foreground/60"
                      style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)" }}
                    >
                      Ground Level from Sea Level
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={groundLevelElevation}
                        onChange={(e) => setGroundLevelElevation(e.target.value)}
                        className="w-32 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                        style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                      />
                      <span className="text-muted-foreground" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)" }}>m</span>
                    </div>
                  </div>
                </div>

                {/* Summary text */}
                <div className="mt-2">
                  <p
                    className="text-foreground"
                    style={{
                      fontFamily: "var(--font-family-base)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    Reference Point {elevationReference}, Elevation = {rotaryTableElevation} m
                  </p>
                </div>

                {/* Elevation diagram */}
                <div className="relative w-full bg-secondary/5 border border-border rounded p-8 mt-4" style={{ borderRadius: "var(--radius)", minHeight: "400px" }}>
                  <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                    {/* Ground Level line (top) */}
                    <line
                      x1="100"
                      y1="80"
                      x2="700"
                      y2="80"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="8,4"
                    />
                    <text
                      x="710"
                      y="85"
                      fill="#3b82f6"
                      style={{
                        fontFamily: "var(--font-family-base)",
                        fontSize: "14px",
                      }}
                    >
                      Ground Level: {groundLevelElevation}m
                    </text>

                    {/* Rotary Table line (middle) */}
                    <line
                      x1="100"
                      y1="200"
                      x2="700"
                      y2="200"
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeDasharray="8,4"
                    />
                    <text
                      x="710"
                      y="205"
                      fill="#ec4899"
                      style={{
                        fontFamily: "var(--font-family-base)",
                        fontSize: "14px",
                      }}
                    >
                      {elevationReference}: {rotaryTableElevation}m
                    </text>

                    {/* Sea Level line (bottom) */}
                    <line
                      x1="100"
                      y1="320"
                      x2="700"
                      y2="320"
                      stroke="#1f2937"
                      strokeWidth="2"
                      strokeDasharray="8,4"
                    />
                    <text
                      x="710"
                      y="325"
                      fill="#9ca3af"
                      style={{
                        fontFamily: "var(--font-family-base)",
                        fontSize: "14px",
                      }}
                    >
                      Sea Level: 0.00m
                    </text>

                    {/* Vertical measurement line */}
                    <line
                      x1="400"
                      y1="200"
                      x2="400"
                      y2="320"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                    />

                    {/* Arrows at ends of vertical line */}
                    <polygon
                      points="400,200 395,210 405,210"
                      fill="#9ca3af"
                    />
                    <polygon
                      points="400,320 395,310 405,310"
                      fill="#9ca3af"
                    />

                    {/* Measurement label with background */}
                    <rect
                      x="360"
                      y="250"
                      width="80"
                      height="30"
                      fill="#a855f7"
                      rx="4"
                    />
                    <text
                      x="400"
                      y="270"
                      fill="white"
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-family-base)",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {rotaryTableElevation}m
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {activeTab === "parameters" && (
            <div className="p-6 h-full">
              <div className="max-w-xl flex flex-col gap-6">
                {/* Gamma Calibration Factor */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <label
                      className="text-foreground/60"
                      style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)" }}
                    >
                      Gamma Calibration Factor
                    </label>
                    {/* Info icon with tooltip */}
                    <div
                      className="relative"
                      onMouseEnter={() => setShowApiTooltip(true)}
                      onMouseLeave={() => setShowApiTooltip(false)}
                    >
                      <Info className="size-3.5 text-primary cursor-help" />
                      {showApiTooltip && (
                        <div
                          className="absolute left-5 top-0 bg-background border border-border rounded px-3 py-2 shadow-lg z-10 whitespace-nowrap"
                          style={{ borderRadius: "var(--radius)", minWidth: "300px" }}
                        >
                          <p className="text-foreground mb-1" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", lineHeight: "1.4" }}>
                            Coefficient by which gamma values are multiplied
                          </p>
                          <p className="text-foreground mb-1" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", lineHeight: "1.4" }}>
                            (specified in the device passport)
                          </p>
                          <p className="text-foreground" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", lineHeight: "1.4" }}>
                            min = 10
                          </p>
                          <p className="text-foreground" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", lineHeight: "1.4" }}>
                            max = 15
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={apiCorrection}
                    onChange={(e) => setApiCorrection(e.target.value)}
                    className="w-32 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "tie-in" && (
            <div className="p-6 h-full">
              <div className="max-w-xl flex flex-col gap-6">
                {/* Tie-in Point inputs — 2-column grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: "MD",   unit: "m",  value: tieInMD,   setter: setTieInMD },
                    { label: "TVD",  unit: "m",  value: tieInTVD,  setter: setTieInTVD },
                    { label: "INCL", unit: "°",  value: tieInINCL, setter: setTieInINCL },
                    { label: "NS",   unit: "m",  value: tieInNS,   setter: setTieInNS },
                    { label: "AZIM", unit: "°",  value: tieInAZIM, setter: setTieInAZIM },
                    { label: "EW",   unit: "m",  value: tieInEW,   setter: setTieInEW },
                  ].map(({ label, unit, value, setter }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <label
                        className="text-foreground/60"
                        style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)" }}
                      >
                        {label} <span className="text-foreground/40">[{unit}]</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          className="w-32 h-8 px-3 bg-input-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                          style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)", borderRadius: "var(--radius)" }}
                        />
                        <span className="text-muted-foreground" style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)" }}>{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab !== "info" && activeTab !== "location" && activeTab !== "elevation" && activeTab !== "parameters" && activeTab !== "tie-in" && (
            <div className="p-6 flex items-center justify-center h-full">
              <p
                className="text-muted-foreground"
                style={{
                  fontFamily: "var(--font-family-base)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {tabs.find((t) => t.id === activeTab)?.label} - Coming soon
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Close button */}
      <div className="h-12 shrink-0 flex items-center justify-end px-4 border-t border-border bg-secondary/20">
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
      </div>
    </div>
  );
}