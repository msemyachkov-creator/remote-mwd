import React from "react";
import { useI18n } from "../i18n";
import { useWell } from "../WellContext";
import { useFluid } from "../ViewportScale";
import { PolarChartWidget } from "../PolarChartWidget";

interface GaugeCircleProps {
  label: string;
  value: number;
  unit?: string;
  max?: number;
  colorClass?: string;
  size?: number;
}

// ─── Figma asset URLs (grid + dots) ─────────────────────────────────────────
const GRID_WITH_LINE      = "https://www.figma.com/api/mcp/asset/eaf924e2-2fd9-4d1d-87f9-fa2eee51fd86";
const GRID_WITH_LINE_AXIS = "https://www.figma.com/api/mcp/asset/e9987083-e05d-43cc-baa2-cd992500a805";
const GRID_NO_LINE        = "https://www.figma.com/api/mcp/asset/07c5a9d3-a747-4920-95e0-f59939475f8e";
// Dot images: index 0 = largest (ring 1), index 3 = smallest (ring 4)
const DOT_IMGS = [
  "https://www.figma.com/api/mcp/asset/9310e577-9c83-4ee5-bc34-ac93ae98ad77", // 10px – bright blue
  "https://www.figma.com/api/mcp/asset/e9dd0cb7-d119-4172-a05f-8bf07a628372", // 8px
  "https://www.figma.com/api/mcp/asset/ee6d03e5-e044-4b84-a2b3-0ca6817a9870", // 6px
  "https://www.figma.com/api/mcp/asset/36d375dd-fb77-40b9-945a-4c6a3838b0df", // 4px
];

// Minor tick angles (5° step, skip every 30°)
const MINOR_ANGLES = [
  5,10,20,25,35,40,50,55,65,70,80,85,
  95,100,110,115,125,130,140,145,155,160,170,175,
  -165,-135,-105,-75,-45,-15,
];

// Major grid lines with axis/degree labels (from Figma 5-dot variant)
// topLabel = label at the "top" of the element (before rotation is applied)
// After rotate(0°):   top = 12 o'clock (HS), bottom = 6 o'clock (LS)
// After rotate(90°):  top → 3 o'clock (90R),  bottom → 9 o'clock (90L)
// After rotate(-60°): top → ~10 o'clock (-60°), bottom → ~4 o'clock (120°)
const MAJOR_LINE_DATA = [
  { deg: -60, topLabel: "-60",  botLabel: "120",  isAxis: false },
  { deg: -30, topLabel: "-30",  botLabel: "150",  isAxis: false },
  { deg:   0, topLabel: "HS",   botLabel: "LS",   isAxis: true  },
  { deg:  30, topLabel: "30",   botLabel: "-150", isAxis: false },
  { deg:  60, topLabel: "60",   botLabel: "-120", isAxis: false },
  { deg:  90, topLabel: "90R",  botLabel: "90L",  isAxis: true  },
];

function GaugeCircle({ label, value, unit = "°", max = 360, colorClass = "bg-primary", size = 360 }: GaugeCircleProps) {
  const s = size / 184; // scale from Figma base 184px
  const borderPx = Math.round(8 * s / 3);
  // Dot starts at 9-o'clock. +90° maps 0° (North) → 12-o'clock.
  const angle = (value / max) * 360;
  const rot0 = angle + 90;   // ring 1 base rotation

  // Inner dark circle touches the inner end of the axis lines (= inner label chip edge).
  // The 3 indicator rings are evenly spaced inside it.
  // Gap: dark_edge→ring0 = ring0→ring1 = ring1→ring2 = ring2→center = d
  const lhPxNonAxis = Math.round(14 * size / 256);
  const rInnerLabel = size / 2 - borderPx - lhPxNonAxis - 2;
  const d = rInnerLabel / 4;
  // Rendered in DOM order (first = behind): dark bg circle first, then indicator rings on top
  const rings = [
    { radius: rInnerLabel, dotSize:  4, dotImgIdx: 3, isBlue: false, offset: 13, bg: "#1f2d3d"     },
    { radius: 3 * d,       dotSize: 10, dotImgIdx: 0, isBlue: true,  offset:  0, bg: "transparent" },
    { radius: 2 * d,       dotSize:  8, dotImgIdx: 1, isBlue: false, offset: 15, bg: "transparent" },
    { radius: 1 * d,       dotSize:  6, dotImgIdx: 2, isBlue: false, offset:  8, bg: "transparent" },
  ];

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: size, height: size,
        borderRadius: "50%",
        backgroundColor: "#192838",
        border: `${borderPx}px solid #1f2d3d`,
        flexShrink: 0,
      }}
    >
      {/* ── GRID: 6 labeled major lines every 30° ── */}
      {MAJOR_LINE_DATA.map(({ deg, topLabel, botLabel, isAxis }) => {
        const img      = isAxis ? GRID_WITH_LINE_AXIS : GRID_WITH_LINE;
        const ref      = 256; // Figma 5-dot reference circle size
        const fontSz   = Math.round((isAxis ? 12 : 10) * size / ref);
        const lhPx     = Math.round((isAxis ? 16 : 14) * size / ref);
        const gapPx    = (isAxis ? 2 : 3) * size / ref;
        const padX     = 2 * size / ref;
        const lW       = (isAxis ? 40 : 36) * size / ref;
        const lineH    = 216 * size / ref;
        const color    = isAxis ? "#E8EBF0" : "rgba(191,201,212,0.7)";
        const totalH   = 2 * lhPx + lineH + 2 * gapPx;

        const absRad = Math.abs(deg) * Math.PI / 180;
        const sinA   = Math.abs(Math.sin(absRad));
        const cosA   = Math.abs(Math.cos(absRad));
        const boxW   = Math.max(totalH * sinA + lW * cosA, 1);
        const boxH   = Math.max(totalH * cosA + lW * sinA, 1);

        // Label chip positions: 2px inset from inner edge of the border
        const chipR = size / 2 - borderPx - lhPx / 2 - 2;
        const degRad = deg * Math.PI / 180;
        const xTop =  chipR * Math.sin(degRad);
        const yTop = -chipR * Math.cos(degRad);
        const xBot = -chipR * Math.sin(degRad);
        const yBot =  chipR * Math.cos(degRad);

        const chipStyle = (x: number, y: number): React.CSSProperties => ({
          position: "absolute",
          left: "50%", top: "50%",
          marginLeft: x - lW / 2,
          marginTop: y - lhPx / 2,
          width: lW, height: lhPx,
          background: "#1f2d3d",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `rotate(${deg}deg)`,
          padding: `0 ${padX}px`,
          zIndex: 20,
        });

        return (
          <React.Fragment key={deg}>
            {/* Line image only (no label chips here — chips rendered at front below) */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: boxW, height: boxH,
              marginLeft: -boxW / 2, marginTop: -boxH / 2,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ transform: `rotate(${deg}deg)`, flexShrink: 0 }}>
                <div style={{ position: "relative", width: 0, height: `${lineH}px`, flexShrink: 0 }}>
                  <div style={{ position: "absolute", inset: "0 -0.5px" }}>
                    <img src={img} alt="" style={{ display: "block", width: "100%", height: "100%", maxWidth: "none" }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Label chips rendered separately so they can be layered above dots */}
            <div style={chipStyle(xTop, yTop)}>
              <span style={{ fontSize: fontSz, color, lineHeight: `${lhPx}px`, fontFamily: "var(--font-family-base)", whiteSpace: "nowrap" }}>
                {topLabel}
              </span>
            </div>
            <div style={chipStyle(xBot, yBot)}>
              <span style={{ fontSize: fontSz, color, lineHeight: `${lhPx}px`, fontFamily: "var(--font-family-base)", whiteSpace: "nowrap" }}>
                {botLabel}
              </span>
            </div>
          </React.Fragment>
        );
      })}

      {/* ── GRID: minor ticks every 5° ── */}
      {MINOR_ANGLES.map((deg) => {
        const rad = Math.abs(deg) * Math.PI / 180;
        const boxW = size * Math.abs(Math.sin(rad)) || 1;
        const boxH = size * Math.abs(Math.cos(rad)) || size;
        return (
          <div key={deg} style={{
            position: "absolute", top: "50%", left: "50%",
            width: Math.max(boxW, 1), height: boxH,
            marginLeft: -Math.max(boxW, 1) / 2,
            marginTop:  -boxH / 2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ transform: `rotate(${deg}deg)`, flexShrink: 0 }}>
              <div style={{ position: "relative", width: 0, height: size }}>
                <div style={{ position: "absolute", inset: "0 -0.5px" }}>
                  <img src={GRID_NO_LINE} alt="" style={{ display: "block", width: "100%", height: "100%", maxWidth: "none" }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── DOTS: 4 concentric rings ── */}
      {rings.map((ring, i) => {
        const rPx  = ring.radius * 2;   // diameter in px (already at actual widget scale)
        const dPx  = ring.dotSize / 2 * s;
        const cPx  = 12 * s;       // dot container (Figma: 12px)
        const lPx  = -6.5 * s;    // Figma: left-[-6.5px]
        const rot  = rot0 + ring.offset;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: rPx, height: rPx,
              top: "50%", left: "50%",
              marginTop: -rPx / 2, marginLeft: -rPx / 2,
              borderRadius: "50%",
              border: "0.25px solid rgba(255,255,255,0.12)",
              backgroundColor: ring.bg,
              transform: `rotate(${rot}deg)`,
              transition: "transform 0.7s ease-out",
            }}
          >
            {/* Dot container: size-[12px], left-[-6.5px], top-1/2, -translate-y-1/2 */}
            <div style={{
              position: "absolute",
              width: cPx, height: cPx,
              left: lPx, top: "50%",
              transform: "translateY(-50%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ position: "relative", width: dPx, height: dPx, flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: `${-(ring.isBlue ? 10 : 5)/dPx * 100}%` }}>
                  <img src={DOT_IMGS[ring.dotImgIdx]} alt="" style={{ display: "block", width: "100%", height: "100%", maxWidth: "none" }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── CENTER VALUE ── */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          zIndex: 10,
          paddingBottom: Math.round(2 * s),
          width: Math.round(84 * s),
        }}
      >
        <p style={{ fontSize: Math.round(9 * s), color: "#E8EBF0", lineHeight: `${Math.round(12 * s)}px`, fontFamily: "var(--font-family-base)", fontWeight: 400, margin: 0 }}>
          {label}
        </p>
        <p style={{ fontSize: Math.round(10.5 * s), color: "#209EF8", fontWeight: 600, lineHeight: `${Math.round(15 * s)}px`, fontFamily: "var(--font-family-base)", margin: 0 }}>
          {value.toFixed(1)}<span style={{ fontWeight: 400 }}>{unit}</span>
        </p>
        <p style={{ fontSize: Math.round(7.5 * s), color: "rgba(191,201,212,0.55)", lineHeight: `${Math.round(10.5 * s)}px`, fontFamily: "var(--font-family-base)", margin: 0 }}>
          00:56
        </p>
      </div>
    </div>
  );
}

// fluid() is now context-aware via useFluid():
//   • main view  → clamp(px, vw%, max)   — grows with viewport
//   • standalone → returns fixed px       — CSS transform handles scaling

interface NumeralWidgetProps {
  label: string;
  value: number;
  unit: string;
  decimals?: number;
}

// ─── Featured widget for AZM / INC ───────────────────────────────────────────
function FeaturedNumeralWidget({ label, value, unit }: { label: string; value: string; unit: string }) {
  const fluid = useFluid();
  return (
    <div
      className="shrink-0 flex flex-col justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), color-mix(in srgb, var(--primary) 4%, transparent))",
        border: "1px solid color-mix(in srgb, var(--primary) 35%, transparent)",
        borderLeft: `${fluid(3)} solid var(--primary)`,
        borderRadius: "var(--radius)",
        padding: `${fluid(8)} ${fluid(12)}`,
        gap: fluid(2),
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 20% 50%, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 70%)" }}
      />
      <span
        className="uppercase tracking-widest text-foreground/50 z-10"
        style={{ fontSize: fluid(15), fontFamily: "var(--font-family-base)", fontWeight: 700 }}
      >
        {label}
      </span>
      <div className="flex items-baseline z-10" style={{ gap: fluid(3) }}>
        <span
          className="font-mono font-bold leading-none tabular-nums"
          style={{ fontSize: fluid(37), color: "var(--primary)", letterSpacing: "-0.02em" }}
        >
          {value}
        </span>
        <span
          className="font-mono"
          style={{ fontSize: fluid(19), color: "color-mix(in srgb, var(--primary) 55%, transparent)" }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

function NumeralWidget({ label, value, unit, decimals = 2 }: NumeralWidgetProps) {
  const fluid = useFluid();
  return (
    <div
      className="flex-1 flex items-center bg-secondary/30 border border-border/30 rounded"
      style={{
        borderRadius: "var(--radius)",
        gap: fluid(8),
        padding: `${fluid(7)} ${fluid(14)}`,
      }}
    >
      <span
        className="text-foreground/70 shrink-0"
        style={{ fontSize: fluid(12), fontFamily: "var(--font-family-base)", fontWeight: "var(--font-weight-medium)" }}
      >
        {label}
      </span>
      <span
        className="font-mono font-bold text-foreground/90 leading-none tabular-nums"
        style={{ fontSize: fluid(22) }}
      >
        {value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      </span>
      <span
        className="text-muted-foreground shrink-0"
        style={{ fontSize: fluid(11), fontFamily: "var(--font-family-base)" }}
      >
        {unit}
      </span>
    </div>
  );
}

function StatusBadge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-2 border rounded shrink-0"
      style={{ borderColor: color ? `${color}40` : "var(--border)", borderRadius: "var(--radius)" }}
    >
      {children}
    </div>
  );
}

// Fixed design width of the inner layout (px at 1920px viewport).
// fluid() minimums don't shrink below 1920px, so we scale via CSS transform.
const TOOLFACE_BASE_W = 1218;

export function ToolfaceWidget() {
  const fluid = useFluid();
  const { t } = useI18n();
  const { activeWell } = useWell();
  const [activeGauge, setActiveGauge] = React.useState<"gtf" | "mtf">("gtf");
  const [gaugeSize, setGaugeSize] = React.useState(300);
  const [scale, setScale] = React.useState(1);
  const outerRef = React.useRef<HTMLDivElement>(null);
  const gaugeWrapRef = React.useRef<HTMLDivElement>(null);

  // Scale inner content when outer container is narrower than base design width
  React.useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / TOOLFACE_BASE_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // gaugeSize = min(flex-1 wrapper width, height) — square fits without overflow
  React.useEffect(() => {
    const el = gaugeWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setGaugeSize(Math.min(width, height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { gtf: gtfValue, inc: incValue, azm: azmValue, gamma: grValue, pressure: sppValue, temp: tempValue } = activeWell;
  const mtfValue = parseFloat(((gtfValue + 137) % 360).toFixed(1));
  const ropValue = 13.7;
  const syncAcquired = true;
  const pumpsOn = activeWell.status === "active";
  const onBottom = true;
  const witsStatus: "connected" | "warning" | "disconnected" = "connected";
  const circTime = "0:01:42";
  const lastPkt = "4s ago";
  const pw = 0.375;

  const witsDotCls  = witsStatus === "connected" ? "bg-chart-2 animate-pulse" : witsStatus === "warning" ? "" : "bg-destructive";
  const witsDotStyle = witsStatus === "warning" ? { backgroundColor: "#eab308" } : {};
  const witsTextCls  = witsStatus === "connected" ? "border-chart-2/40 text-chart-2" : witsStatus === "warning" ? "" : "border-destructive/40 text-destructive";
  const witsTextStyle = witsStatus === "warning" ? { borderColor: "#eab30840", color: "#eab308" } : {};

  const gaugeAngle = activeGauge === "gtf" ? gtfValue : mtfValue;
  const gaugeLabel = activeGauge === "gtf" ? t("sum_gtf") : t("sum_mtf");

  const bField = (52000 + (activeWell.seed % 100) * 10).toFixed(0);
  const dip    = (64 + (activeWell.seed % 50) / 10).toFixed(1);
  const gField = "1.000";
  const envTemp = activeWell.temp.toFixed(1);

  const tabBase = "px-[18px] py-[6px] text-[15px] font-bold tracking-widest uppercase transition-colors";
  const tabActive = "bg-primary/25 text-primary";
  const tabInactive = "text-primary/40 hover:bg-primary/10 hover:text-primary/60";

  return (
    // Outer: measures available width, clips overflow
    <div ref={outerRef} className="flex-1 relative overflow-hidden bg-background select-none">
    {/* Inner: fixed design width, scaled down when container is narrower */}
    <div
      className="flex flex-col px-3 pt-1.5 pb-1 gap-0.5 relative"
      style={{
        width: TOOLFACE_BASE_W,
        height: scale < 1 ? `${100 / scale}%` : "100%",
        transform: scale < 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
      }}
    >
      <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--color-primary)_0%,_transparent_70%] opacity-[0.02] pointer-events-none" />

      {/* TOP ROW — status badges + numerals */}
      <div className="shrink-0 flex items-stretch z-10" style={{ gap: fluid(8) }}>
        {/* DRILLING */}
        <div
          className="flex items-center border border-border/20 bg-background/60 rounded shrink-0"
          style={{ gap: fluid(6), padding: `${fluid(7)} ${fluid(12)}`, borderRadius: "var(--radius)" }}
        >
          <div className={`size-1.5 rounded-full animate-pulse ${activeWell.status === "active" ? "bg-accent" : activeWell.status === "standby" ? "bg-chart-3" : "bg-foreground/20"}`} />
          <span className="font-bold text-foreground/50 tracking-widest uppercase" style={{ fontSize: fluid(9) }}>
            {activeWell.status === "active" ? "DRILLING" : activeWell.status === "standby" ? "STANDBY" : "OFFLINE"}
          </span>
        </div>
        {/* REAL-TIME */}
        <div
          className="flex items-center border border-border/20 bg-background/60 rounded shrink-0"
          style={{ gap: fluid(6), padding: `${fluid(7)} ${fluid(12)}`, borderRadius: "var(--radius)" }}
        >
          <div className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-bold text-foreground/50 tracking-widest uppercase" style={{ fontSize: fluid(9) }}>REAL-TIME</span>
        </div>
        <NumeralWidget label="ROP" value={ropValue} unit="m/h" decimals={1} />
        <NumeralWidget label="GR"  value={grValue}  unit="API" decimals={1} />
        <NumeralWidget label="SPP" value={sppValue} unit="PSI" decimals={0} />
      </div>

      {/* MIDDLE — flex row: data card | left col | gap | gauge | gap | right col */}
      <div className="flex-1 flex items-center min-h-0 relative">

        {/* Summary data card — left vertical panel */}
        <div
          className="flex flex-col shrink-0 border-r border-border/20 overflow-y-auto"
          style={{ width: fluid(185), alignSelf: "stretch", paddingTop: fluid(20) }}
        >
          {[
            {
              title: "DEPTH",
              rows: [
                { label: "Hole Depth", value: activeWell.holeDepth.toFixed(1), unit: "m" },
                { label: "Bit Depth",  value: activeWell.bitDepth.toFixed(1),  unit: "m" },
                { label: "Kelly Down", value: Math.max(0, activeWell.holeDepth - activeWell.bitDepth).toFixed(2), unit: "m" },
              ],
            },
            {
              title: "DIRECTIONAL",
              rows: [
                { label: "INC", value: incValue.toFixed(2), unit: "°" },
                { label: "AZM", value: azmValue.toFixed(2), unit: "°" },
                { label: "GTF", value: gtfValue.toFixed(1), unit: "°" },
                { label: "MTF", value: mtfValue.toFixed(1), unit: "°" },
              ],
            },
            {
              title: "MAGNETIC",
              rows: [
                { label: "B Field", value: bField,   unit: "nT" },
                { label: "Dip",     value: dip,      unit: "°"  },
                { label: "G Field", value: gField,   unit: "G"  },
              ],
            },
            {
              title: "DRILLING",
              rows: [
                { label: "GR",   value: grValue.toFixed(1),  unit: "API" },
                { label: "Temp", value: envTemp,              unit: "°C"  },
                { label: "SPP",  value: sppValue.toFixed(0),  unit: "PSI" },
              ],
            },
          ].map((group) => (
            <div key={group.title}>
              <div
                style={{
                  padding: `${fluid(3)} ${fluid(10)} ${fluid(1)}`,
                  fontSize: fluid(8),
                  fontFamily: "var(--font-family-base)",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  opacity: 0.3,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {group.title}
              </div>
              {group.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between border-t border-border/10"
                  style={{ padding: `${fluid(3)} ${fluid(10)}` }}
                >
                  <span
                    style={{
                      fontSize: fluid(10),
                      fontFamily: "var(--font-family-base)",
                      color: "var(--foreground)",
                      opacity: 0.45,
                    }}
                  >
                    {row.label}
                  </span>
                  <div className="flex items-baseline" style={{ gap: fluid(2) }}>
                    <span
                      style={{
                        fontSize: fluid(12),
                        fontFamily: "var(--font-family-mono)",
                        fontWeight: 600,
                        color: "var(--foreground)",
                      }}
                    >
                      {row.value}
                    </span>
                    <span
                      style={{ fontSize: fluid(9), color: "var(--muted-foreground)" }}
                    >
                      {row.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Status badges — left column */}
        <div
          className="flex flex-col shrink-0 ml-2 z-10"
          style={{ gap: fluid(5), width: fluid(140) }}
        >
          {/* SYNC */}
          <div
            className={`flex items-center border rounded font-bold tracking-widest uppercase w-full ${syncAcquired ? "border-accent/40 text-accent" : "border-destructive/40 text-destructive"}`}
            style={{ gap: fluid(6), padding: `${fluid(4)} ${fluid(10)}`, fontSize: fluid(11), borderRadius: "var(--radius)" }}
          >
            <span className={`rounded-full shrink-0 ${syncAcquired ? "bg-accent animate-pulse" : "bg-destructive"}`} style={{ width: fluid(7), height: fluid(7) }} />
            {syncAcquired ? "SYNC ACQUIRED" : "NO SYNC"}
          </div>

          {/* PUMPS */}
          <div
            className={`flex items-center border rounded font-bold tracking-widest uppercase w-full ${pumpsOn ? "border-chart-3/40 text-chart-3" : "border-border/40 text-foreground/40"}`}
            style={{ gap: fluid(6), padding: `${fluid(4)} ${fluid(10)}`, fontSize: fluid(11), borderRadius: "var(--radius)" }}
          >
            <span className={`rounded-full shrink-0 ${pumpsOn ? "bg-chart-3 animate-pulse" : "bg-foreground/20"}`} style={{ width: fluid(7), height: fluid(7) }} />
            {pumpsOn ? "PUMPS ON" : "PUMPS OFF"}
          </div>

          {/* WITS */}
          <div
            className={`flex items-center border rounded font-bold tracking-widest uppercase w-full ${witsTextCls}`}
            style={{ gap: fluid(6), padding: `${fluid(4)} ${fluid(10)}`, fontSize: fluid(11), borderRadius: "var(--radius)", ...witsTextStyle }}
          >
            <span className={`rounded-full shrink-0 ${witsDotCls}`} style={{ width: fluid(7), height: fluid(7), ...witsDotStyle }} />
            WITS
          </div>

          {/* ON / OFF BOTTOM */}
          <div
            className={`flex items-center border rounded font-bold tracking-widest uppercase w-full ${onBottom ? "border-chart-2/40 text-chart-2" : "border-border/40 text-foreground/40"}`}
            style={{ gap: fluid(6), padding: `${fluid(4)} ${fluid(10)}`, fontSize: fluid(11), borderRadius: "var(--radius)" }}
          >
            <span className={`rounded-full shrink-0 ${onBottom ? "bg-chart-2 animate-pulse" : "bg-foreground/20"}`} style={{ width: fluid(7), height: fluid(7) }} />
            {onBottom ? "ON BOTTOM" : "OFF BOTTOM"}
          </div>
          {[
            `Circ: ${circTime}`,
            `Last synch: ${lastPkt}`,
            `PW: ${pw}`,
          ].map((text) => (
            <div
              key={text}
              className="flex items-center border border-border/20 rounded font-mono text-foreground/40 w-full"
              style={{ gap: fluid(6), padding: `${fluid(4)} ${fluid(10)}`, fontSize: fluid(11), borderRadius: "var(--radius)" }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* fluid gap left */}
        <div style={{ width: fluid(2), flexShrink: 0 }} />

        {/* Gauge — flex-1 flex wrapper, measures min(width,height) for square */}
        <div ref={gaugeWrapRef} className="flex-1 self-stretch flex items-center justify-center min-w-0 overflow-hidden">
          <div className="relative shrink-0" style={{ width: gaugeSize, height: gaugeSize }}>
            <div className="absolute inset-0">
              <PolarChartWidget label={gaugeLabel} gtfAngle={gaugeAngle} gtfValue={gaugeAngle} timestamp="00:56" />
            </div>
          </div>
        </div>

        {/* fluid gap right */}
        <div style={{ width: fluid(2), flexShrink: 0 }} />

        {/* Right column: GTF/MTF toggle + AZM + INC featured + env widgets
            height = gaugeSize so column scales 1:1 with the circular gauge */}
        <div
          className="flex flex-col shrink-0 mr-2 z-10 overflow-hidden"
          style={{ width: fluid(245), height: gaugeSize, paddingTop: fluid(8) }}
        >
          {/* GTF/MTF switcher — pinned to top with gap from DRILLING row above */}
          <div className="flex justify-end shrink-0">
            <div className="flex border border-primary/30 rounded overflow-hidden bg-primary/5">
              <button className={`${tabBase} ${activeGauge === "gtf" ? tabActive : tabInactive}`} onClick={() => setActiveGauge("gtf")}>GTF</button>
              <div className="w-px bg-primary/20 self-stretch" />
              <button className={`${tabBase} ${activeGauge === "mtf" ? tabActive : tabInactive}`} onClick={() => setActiveGauge("mtf")}>MTF</button>
            </div>
          </div>

          {/* AZM + INC + env — centered in remaining space */}
          <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden" style={{ gap: fluid(6) }}>
            <FeaturedNumeralWidget label={t("sum_azm")} value={azmValue.toFixed(2)} unit="°" />
            <FeaturedNumeralWidget label={t("sum_inc")} value={incValue.toFixed(2)} unit="°" />

          <div className="flex flex-col" style={{ gap: fluid(3) }}>
            {[
              { label: "B Field",    value: bField,                                                      unit: "nT"   },
              { label: "Dip",        value: dip,                                                         unit: "°"    },
              { label: "G Field",    value: gField,                                                      unit: "G"    },
              { label: "Temp",       value: envTemp,                                                     unit: "°C"   },
              { label: "WOB",        value: (12 + activeWell.seed % 8).toFixed(1),                      unit: "klbf" },
              { label: "Hook Load",  value: (180 + activeWell.seed % 40).toFixed(0),                    unit: "klbf" },
            ].map(({ label, value, unit }) => (
              <div
                key={label}
                className="flex items-center bg-secondary/20 border border-border/20 rounded"
                style={{
                  gap: fluid(8),
                  padding: `${fluid(4)} ${fluid(10)}`,
                  borderRadius: "var(--radius)",
                }}
              >
                <span
                  className="text-foreground/50 shrink-0"
                  style={{ fontSize: fluid(10), fontFamily: "var(--font-family-base)", fontWeight: 500, minWidth: fluid(52) }}
                >
                  {label}
                </span>
                <span
                  className="font-mono font-semibold text-foreground/80 tabular-nums ml-auto"
                  style={{ fontSize: fluid(14) }}
                >
                  {value}
                </span>
                <span
                  className="text-muted-foreground shrink-0"
                  style={{ fontSize: fluid(10), fontFamily: "var(--font-family-base)" }}
                >
                  {unit}
                </span>
              </div>
            ))}
          </div>
          </div>{/* end centered inner group */}
        </div>

      </div>
    </div>
    </div>
  );
}
