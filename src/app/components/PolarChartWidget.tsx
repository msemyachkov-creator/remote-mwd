import React from "react";
import svgPaths from "../../imports/svg-xewpn0npyr";

/**
 * PolarChartWidget — точная копия дизайна Figma для диаграммы отклонителя
 * Использует CSS-переменные из theme.css для соблюдения дизайн-системы
 * Адаптивный масштаб под размер контейнера
 */

/* ───── Radial lines without labels ───── */
function WithoutLine({ d1, d2 }: { d1?: string; d2?: string }) {
  return (
    <div className="h-[256px] relative w-0">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 256">
          <g>
            <path d={d1 || "M0.5 6L0.5 14"} stroke="white" strokeOpacity="0.12" />
            <path d={d2 || "M0.5 242L0.5 250"} stroke="white" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ───── Vertical line component (used in main axes) ───── */
function VerticalLine({ height = 216 }: { height?: number }) {
  return (
    <div className="relative shrink-0" style={{ height, width: 1 }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 216">
        <g>
          <path d={svgPaths.p186b4380} stroke="white" strokeOpacity="0.12" />
          <path d="M0.500003 136L0.5 216" stroke="white" strokeOpacity="0.12" />
        </g>
      </svg>
    </div>
  );
}

/* ───── Labeled axis markers ───── */
interface AxisLabelProps {
  topLabel: string;
  bottomLabel: string;
  isMain?: boolean;
}

function AxisWithLine({ topLabel, bottomLabel, isMain }: AxisLabelProps) {
  const chipH  = isMain ? 16 : 14;   // fixed chip height — keeps layout stable
  const fontSize = isMain ? "text-[9px]" : "text-[8px]";
  const textColor = isMain ? "var(--foreground)" : "rgba(191,201,212,0.7)";
  const width = isMain ? "w-[40px]" : "w-[36px]";
  const gap = isMain ? "gap-[2px]" : "gap-[3px]";

  return (
    <div className={`flex flex-col ${gap} items-center relative ${width}`} style={{ height: isMain ? "auto" : 250 }}>
      <div className="flex items-center justify-center px-[2px] relative shrink-0" style={{ background: "rgba(31,45,61,1)", height: chipH, transform: "scale(0.5)", transformOrigin: "center" }}>
        <div className={`flex flex-col justify-center leading-[0] relative shrink-0 ${fontSize} text-center whitespace-nowrap`} style={{ fontFamily: "var(--font-family-base)", color: textColor }}>
          <p>{topLabel}</p>
        </div>
      </div>
      {isMain ? <VerticalLine /> : (
        <div className="h-[216px] relative shrink-0 w-0">
          <div className="absolute inset-[0_-0.5px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 216">
              <g>
                <path d={svgPaths.p2e457af4} stroke="white" strokeOpacity="0.12" />
                <path d="M0.500003 136L0.5 216" stroke="white" strokeOpacity="0.12" />
              </g>
            </svg>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center px-[2px] relative shrink-0" style={{ background: "rgba(31,45,61,1)", height: chipH, transform: "scale(0.5)", transformOrigin: "center" }}>
        <div className={`flex flex-col justify-center leading-[0] relative shrink-0 ${fontSize} text-center whitespace-nowrap`} style={{ fontFamily: "var(--font-family-base)", color: textColor }}>
          <p>{bottomLabel}</p>
        </div>
      </div>
    </div>
  );
}

/* ───── Round Grid — all radial lines and labeled axes ───── */
function RoundGrid() {
  const radialLines = [
    { angle: -15, w: 66.258, h: 247.277 },
    { angle: -45, w: 181.019, h: 181.019 },
    { angle: 75, w: 247.277, h: 66.258 },
    { angle: 45, w: 181.019, h: 181.019 },
    { angle: 15, w: 66.258, h: 247.277 },
    { angle: 105, w: 247.277, h: 66.258 },
    { angle: -20, w: 87.557, h: 240.561 },
    { angle: 70, w: 240.561, h: 87.557 },
    { angle: 25, w: 108.19, h: 232.015 },
    { angle: 115, w: 232.015, h: 108.19 },
    { angle: -25, w: 108.19, h: 232.015 },
    { angle: 65, w: 232.015, h: 108.19 },
    { angle: 20, w: 87.557, h: 240.561 },
    { angle: 110, w: 240.561, h: 87.557 },
    { angle: -5, w: 22.312, h: 255.026 },
    { angle: 85, w: 255.026, h: 22.312 },
    { angle: 40, w: 164.554, h: 196.107 },
    { angle: 130, w: 196.107, h: 164.554 },
    { angle: -10, w: 44.454, h: 252.111 },
    { angle: 80, w: 252.111, h: 44.454 },
    { angle: 35, w: 146.836, h: 209.703 },
    { angle: 125, w: 209.703, h: 146.836 },
    { angle: -35, w: 146.836, h: 209.703 },
    { angle: 55, w: 209.703, h: 146.836 },
    { angle: 10, w: 44.454, h: 252.111 },
    { angle: 100, w: 252.111, h: 44.454 },
    { angle: -40, w: 164.554, h: 196.107 },
    { angle: 50, w: 196.107, h: 164.554 },
    { angle: 5, w: 22.312, h: 255.026 },
    { angle: 95, w: 255.026, h: 22.312 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* All radial lines without labels */}
      {radialLines.map((line, idx) => (
        <div
          key={idx}
          className="absolute flex items-center justify-center"
          style={{
            width: line.w,
            height: line.h,
            transform: `translate(-50%, -50%) rotate(${line.angle}deg)`,
            left: "50%",
            top: "50%",
          }}
        >
          <WithoutLine d1={idx >= 6 ? "M0.5 8L0.5 12" : "M0.5 6L0.5 14"} d2={idx >= 6 ? "M0.5 244L0.5 248" : "M0.5 242L0.5 250"} />
        </div>
      ))}

      {/* Labeled axes — with angle labels */}
      {/* 330 / 150 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: 234.506,
          height: 156.177,
          transform: "translate(-50%, -50%) rotate(-60deg)",
          left: "50%",
          top: "50%",
        }}
      >
        <AxisWithLine topLabel="-60" bottomLabel="120" />
      </div>

      {/* 300 / 120 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: 156.177,
          height: 234.506,
          transform: "translate(-50%, -50%) rotate(-30deg)",
          left: "50%",
          top: "50%",
        }}
      >
        <AxisWithLine topLabel="-30" bottomLabel="150" />
      </div>

      {/* 60 / 240 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: 156.177,
          height: 234.506,
          transform: "translate(-50%, -50%) rotate(30deg)",
          left: "50%",
          top: "50%",
        }}
      >
        <AxisWithLine topLabel="30" bottomLabel="-150" />
      </div>

      {/* 30 / 210 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: 234.506,
          height: 156.177,
          transform: "translate(-50%, -50%) rotate(60deg)",
          left: "50%",
          top: "50%",
        }}
      >
        <AxisWithLine topLabel="60" bottomLabel="-120" />
      </div>

      {/* 0 / 180 — main vertical axis */}
      <div
        className="absolute flex flex-col gap-[2px] items-center w-[40px]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <AxisWithLine topLabel="HS" bottomLabel="LS" isMain />
      </div>

      {/* 270 / 90 — main horizontal axis */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          width: 252,
          height: 40,
          transform: "translate(-50%, -50%) rotate(-90deg)",
          left: "50%",
          top: "50%",
        }}
      >
        <AxisWithLine topLabel="90L" bottomLabel="90R" isMain />
      </div>
    </div>
  );
}

/* ───── Concentric circles with dots ───── */
interface DotProps {
  size: number;
  isFilled?: boolean;
}

function DotFrame({ size, isFilled }: DotProps) {
  const viewBoxSize = size + 2;
  const strokeWidth = 1;
  const outerRadius = (size + strokeWidth) / 2;
  const innerRadius = size / 2 - strokeWidth;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute" style={{ inset: `${-(strokeWidth / size) * 100}%` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          <g>
            <rect
              height={size + 1}
              rx={outerRadius}
              stroke="rgba(25,40,56,1)"
              width={size + 1}
              x="0.5"
              y="0.5"
            />
            <circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              fill={isFilled ? "var(--primary)" : "rgba(8,15,24,1)"}
              r={innerRadius}
              stroke={isFilled ? undefined : "var(--foreground)"}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

interface CircleRingProps {
  diameter: number;
  dotSize: number;
  rotation: number;
  isFilled?: boolean;
}

function CircleRing({ diameter, dotSize, rotation, isFilled }: CircleRingProps) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: diameter,
        height: diameter,
        border: "1px solid rgba(255,255,255,0.12)",
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        left: "50%",
        top: "50%",
      }}
    >
      <div
        className="absolute flex items-center justify-center left-[-6px] top-1/2"
        style={{ transform: "translateY(-50%)", width: 12, height: 12 }}
      >
        <DotFrame size={dotSize} isFilled={isFilled} />
      </div>
    </div>
  );
}

function Dots({ gtfAngle = -90 }: { gtfAngle?: number }) {
  const rings = [
    { diameter: 184, dotSize: 12, baseRotation: 0, isFilled: true },
    { diameter: 152, dotSize: 10, baseRotation: 15, isFilled: false },
    { diameter: 120, dotSize: 8, baseRotation: 8, isFilled: false },
    { diameter: 88, dotSize: 6, baseRotation: 13, isFilled: false },
    { diameter: 56, dotSize: 4, baseRotation: 7, isFilled: false },
  ];

  // Конвертация GTF угла в визуальный угол поворота
  // GTF: 0°=верх, 90°=право, 180°=низ, 270°=лево
  // Точка изначально слева (left: -6px), поэтому для GTF=270° нужен rotation=0°
  // Формула: visualRotation = gtfAngle + 90
  const visualRotation = gtfAngle + 90;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {rings.map((ring, idx) => {
        // Главная точка следует за gtfAngle, остальные имеют небольшой offset
        const rotation = idx === 0 ? visualRotation : visualRotation + ring.baseRotation;
        return (
          <div
            key={idx}
            className="absolute flex items-center justify-center"
            style={{
              width: idx === 0 ? ring.diameter : ring.diameter + 30,
              height: idx === 0 ? ring.diameter : ring.diameter + 30,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              left: "50%",
              top: "50%",
            }}
          >
            <CircleRing
              diameter={ring.diameter}
              dotSize={ring.dotSize}
              rotation={0}
              isFilled={ring.isFilled}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ───── Center value display ───── */
function Value({ label = "GTF", gtfValue = -90.0, timestamp = "00:56" }: { label?: string; gtfValue?: number; timestamp?: string }) {
  return (
    <div
      className="absolute flex flex-col items-center not-italic pb-[2px] text-center"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <p
        className="relative shrink-0 w-[56px]"
        style={{
          fontFamily: "var(--font-family-base)",
          fontSize: "9.6px",
          lineHeight: "13px",
          color: "var(--foreground)",
        }}
      >
        {label}
      </p>
      <p
        className="relative shrink-0 w-[56px]"
        style={{
          fontFamily: "var(--font-family-base)",
          fontSize: "11.2px",
          fontWeight: "var(--font-weight-medium)",
          lineHeight: "16px",
          color: "var(--primary)",
        }}
      >
        <span>{gtfValue.toFixed(1)}</span>
        <span style={{ fontWeight: "var(--font-weight-normal)" }}>°</span>
      </p>
      <p
        className="relative shrink-0 w-[56px]"
        style={{
          fontFamily: "var(--font-family-base)",
          fontSize: "8px",
          lineHeight: "11px",
          color: "rgba(191,201,212,0.55)",
        }}
      >
        {timestamp}
      </p>
    </div>
  );
}

/* ───── Main visualization circle ───── */
function Visualization({ label = "GTF", gtfAngle = 0, gtfValue = 0.0, timestamp = "00:56" }: { label?: string; gtfAngle?: number; gtfValue?: number; timestamp?: string }) {
  return (
    <div
      className="relative rounded-full shrink-0"
      style={{
        width: 256,
        height: 256,
        background: "rgba(25,40,56,1)",
        border: "16px solid rgba(31,45,61,1)",
      }}
    >
      <RoundGrid />
      <Dots gtfAngle={gtfAngle} />
      <Value label={label} gtfValue={gtfValue} timestamp={timestamp} />
    </div>
  );
}

/* ───── Public component ───── */
export interface PolarChartWidgetProps {
  label?: string;
  gtfAngle?: number;
  gtfValue?: number;
  timestamp?: string;
}

export function PolarChartWidget({ label = "GTF", gtfAngle = 0, gtfValue = 0.0, timestamp = "00:56" }: PolarChartWidgetProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Базовый размер виджета: 256px круг + border 32px (16px×2) + padding 2px = 290px
        const baseSize = 290;
        // Вычисляем масштаб, чтобы виджет помещался в контейнер
        const scaleX = width / baseSize;
        const scaleY = height / baseSize;
        const newScale = Math.min(scaleX, scaleY);
        setScale(newScale);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex items-center justify-center relative size-full">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div className="flex items-center pb-1 px-1 relative">
          <Visualization label={label} gtfAngle={gtfAngle} gtfValue={gtfValue} timestamp={timestamp} />
        </div>
      </div>
    </div>
  );
}