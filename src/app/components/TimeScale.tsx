import React from "react";
import { useI18n } from "./i18n";

interface TimeScaleProps {
  className?: string;
}

/**
 * TimeScale — вертикальная временная шкала между лог-треками
 * Использует CSS-переменные из дизайн-системы
 */
export function TimeScale({ className = "" }: TimeScaleProps) {
  const { t } = useI18n();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Draw time scale on canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Get CSS variables for colors
    const styles = getComputedStyle(document.documentElement);
    const mutedForeground = styles.getPropertyValue('--muted-foreground').trim() || 'rgb(104, 105, 106)';
    const border = styles.getPropertyValue('--border').trim() || 'rgb(51, 51, 52)';

    // Time interval in pixels
    const interval = 40;
    const startTime = new Date();
    startTime.setHours(14, 0, 10, 0); // Start at 14:00:10

    // Calculate total number of marks to fill the entire height
    const totalMarks = Math.ceil(rect.height / interval) + 1;

    // Calculate text height for gaps
    ctx.font = "10px var(--font-family-base)";
    const textHeight = 12; // Approximate height for 10px font

    // Draw center vertical line with gaps for text
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    
    let prevY = 0;
    for (let i = 0; i < totalMarks; i++) {
      const y = i * interval;
      if (y > rect.height) {
        // Draw final segment to bottom
        ctx.beginPath();
        ctx.moveTo(rect.width / 2, prevY);
        ctx.lineTo(rect.width / 2, rect.height);
        ctx.stroke();
        break;
      }

      // Draw line segment up to this mark (with gap for text)
      const gapStart = y - textHeight / 2;
      const gapEnd = y + textHeight / 2;
      
      if (prevY < gapStart) {
        ctx.beginPath();
        ctx.moveTo(rect.width / 2, prevY);
        ctx.lineTo(rect.width / 2, gapStart);
        ctx.stroke();
      }
      
      prevY = gapEnd;
    }

    // Draw time marks
    ctx.fillStyle = mutedForeground;
    ctx.font = "10px var(--font-family-base)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < totalMarks; i++) {
      const y = (i + 1) * interval; // Shift down by one interval
      if (y > rect.height) break;

      // Calculate time for this mark (starting from i=0)
      const secondsElapsed = i * 10; // 10 seconds per interval
      const time = new Date(startTime.getTime() + secondsElapsed * 1000);
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const seconds = String(time.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;

      // Draw time label horizontally centered
      ctx.fillStyle = mutedForeground;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(timeStr, rect.width / 2, y);
    }
  }, []);

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-1 px-2 py-1 shrink-0 border-b border-border bg-card/50">
        <div className="px-2 py-0.5" style={{ height: "16px" }}>
          {/* Empty space to match WELL badge height */}
        </div>
        <div className="flex items-center justify-center px-2 py-0.5">
          <span
            style={{
              fontSize: "10px",
              fontWeight: "var(--font-weight-semibold)",
              lineHeight: "12px",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
            }}
          >
            {t("data_time")}
          </span>
        </div>
      </div>

      {/* Canvas for time scale */}
      <div ref={containerRef} className="flex-1 relative bg-background">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}