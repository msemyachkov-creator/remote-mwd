import React from "react";

interface LogTrack {
  name: string;
  minValue: number;
  maxValue: number;
  currentValue: number;
  color: string;
  data: number[]; // Array of values for the waveform
  scaleLabel?: string; // Optional scale label (e.g., "м" for meters)
  scaleMin?: number; // Optional scale minimum value
  scaleMax?: number; // Optional scale maximum value
}

interface VerticalLogTrackProps {
  wellName: string;
  tracks: LogTrack[];
  className?: string;
}

/**
 * VerticalLogTrack — вертикальный лог-трек для панели Планшет
 * Адаптирован из Schedule компонента Figma
 * Использует CSS-переменные из дизайн-системы
 */
export function VerticalLogTrack({ wellName, tracks, className = "" }: VerticalLogTrackProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const overlayCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = React.useState<{ x: number; y: number } | null>(null);
  const [trackedValues, setTrackedValues] = React.useState<Array<{ value: number; x: number }>>([]);

  // Draw waveform on canvas
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

    // Draw grid
    ctx.strokeStyle = "rgba(104, 105, 106, 0.3)";
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines - aligned with TimeScale (every 40px starting from 40px)
    const timeInterval = 40; // Match TimeScale interval
    
    // Draw fine grid lines every 20px
    const fineGridSpacing = 20;
    for (let y = 0; y < rect.height; y += fineGridSpacing) {
      ctx.strokeStyle = "rgba(104, 105, 106, 0.2)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    
    // Draw thicker lines at time marks (every 40px, starting from 40px)
    for (let i = 1; i * timeInterval <= rect.height; i++) {
      const y = i * timeInterval;
      ctx.strokeStyle = "rgba(104, 105, 106, 0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Vertical grid lines (track separators)
    ctx.strokeStyle = "rgba(104, 105, 106, 0.3)";
    ctx.lineWidth = 0.5;
    const trackWidth = rect.width / tracks.length;
    for (let i = 0; i <= tracks.length; i++) {
      const x = i * trackWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }

    // Draw waveforms for each track
    tracks.forEach((track, trackIndex) => {
      const xOffset = trackIndex * trackWidth;
      const padding = trackWidth * 0.1; // 10% padding from edges
      const usableWidth = trackWidth - padding * 2;

      ctx.strokeStyle = track.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const pointsPerPixel = track.data.length / rect.height;
      
      for (let y = 0; y < rect.height; y++) {
        const dataIndex = Math.floor(y * pointsPerPixel);
        if (dataIndex >= track.data.length) break;

        const value = track.data[dataIndex];
        const normalizedValue = (value - track.minValue) / (track.maxValue - track.minValue);
        const x = xOffset + padding + normalizedValue * usableWidth;

        if (y === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    });
  }, [tracks]);

  // Draw crosshair overlay
  React.useEffect(() => {
    const overlayCanvas = overlayCanvasRef.current;
    const container = containerRef.current;
    if (!overlayCanvas || !container) return;

    const ctx = overlayCanvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    overlayCanvas.width = rect.width * dpr;
    overlayCanvas.height = rect.height * dpr;
    overlayCanvas.style.width = rect.width + "px";
    overlayCanvas.style.height = rect.height + "px";
    
    ctx.scale(dpr, dpr);

    // Clear overlay
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!mousePos) return;

    const trackWidth = rect.width / tracks.length;

    // Draw horizontal crosshair line
    ctx.strokeStyle = "#d32f2f";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, mousePos.y);
    ctx.lineTo(rect.width, mousePos.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate values at this Y position
    const pointsPerPixel = tracks[0].data.length / rect.height;
    const dataIndex = Math.floor(mousePos.y * pointsPerPixel);

    const values: Array<{ value: number; x: number }> = [];

    tracks.forEach((track, trackIndex) => {
      if (dataIndex >= 0 && dataIndex < track.data.length) {
        const xOffset = trackIndex * trackWidth;
        const padding = trackWidth * 0.1;
        const usableWidth = trackWidth - padding * 2;
        const normalizedValue = (track.data[dataIndex] - track.minValue) / (track.maxValue - track.minValue);
        const x = xOffset + padding + normalizedValue * usableWidth;

        // Draw vertical line at value position
        ctx.strokeStyle = "#d32f2f";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x, mousePos.y - 10);
        ctx.lineTo(x, mousePos.y + 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw circle at intersection
        ctx.fillStyle = "#d32f2f";
        ctx.beginPath();
        ctx.arc(x, mousePos.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Calculate actual value
        const actualValue = track.minValue + normalizedValue * (track.maxValue - track.minValue);
        values.push({ value: actualValue, x });
      }
    });

    // Draw value labels
    values.forEach((val, idx) => {
      const text = val.value.toFixed(2);
      ctx.font = "10px var(--font-family-base)";
      const metrics = ctx.measureText(text);
      const padding = 4;
      const boxWidth = metrics.width + padding * 2;
      const boxHeight = 16;

      // Draw background
      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(val.x - boxWidth / 2, mousePos.y - 25, boxWidth, boxHeight);

      // Draw text
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, val.x, mousePos.y - 17);
    });

    setTrackedValues(values);
  }, [mousePos, tracks]);

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setTrackedValues([]);
  };

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-1 px-2 py-1 shrink-0 border-b border-border bg-card/50">
        <div
          className="px-2 py-0.5 rounded-sm w-fit"
          style={{
            backgroundColor: "#fd8c2f",
            fontSize: "10px",
            fontWeight: "var(--font-weight-semibold)",
            lineHeight: "12px",
            textTransform: "uppercase",
            color: "#f8fafc",
          }}
        >
          {wellName}
        </div>
        <div className="flex gap-1">
          {tracks.map((track, index) => (
            <div key={index} className="flex-1">
              {track.scaleLabel ? (
                // Display scale without colored background
                <div className="flex items-center justify-between px-2 py-0.5">
                  <span
                    className="text-muted-foreground"
                    style={{
                      fontSize: "10px",
                      fontWeight: "var(--font-weight-regular)",
                      fontFamily: "var(--font-family-base)",
                      fontFeatureSettings: "'zero', 'salt', 'lnum', 'tnum'",
                    }}
                  >
                    {(track.scaleMin ?? 0).toFixed(1)}
                  </span>
                  <span 
                    className="text-muted-foreground" 
                    style={{ 
                      fontSize: "10px",
                      fontWeight: "var(--font-weight-regular)",
                      fontFamily: "var(--font-family-base)",
                    }}
                  >
                    {track.scaleLabel}
                  </span>
                  <span
                    className="text-muted-foreground"
                    style={{
                      fontSize: "10px",
                      fontWeight: "var(--font-weight-regular)",
                      fontFamily: "var(--font-family-base)",
                      fontFeatureSettings: "'zero', 'salt', 'lnum', 'tnum'",
                    }}
                  >
                    {(track.scaleMax ?? 10).toFixed(0)}
                  </span>
                </div>
              ) : (
                // Display default with colored background
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-sm"
                  style={{
                    backgroundColor: track.color,
                    fontSize: "10px",
                    fontWeight: "var(--font-weight-semibold)",
                    lineHeight: "12px",
                    color: "#f8fafc",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: "var(--font-family-base)",
                      fontFeatureSettings: "'zero', 'salt', 'lnum', 'tnum'",
                    }}
                  >
                    {track.minValue.toFixed(1)}
                  </span>
                  <span style={{ textTransform: "uppercase" }}>{track.currentValue.toFixed(2)}</span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: "var(--font-family-base)",
                      fontFeatureSettings: "'zero', 'salt', 'lnum', 'tnum'",
                    }}
                  >
                    {track.maxValue.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Canvas for waveform */}
      <div 
        ref={containerRef} 
        className="flex-1 relative bg-background"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
    </div>
  );
}

/**
 * Generate mock waveform data similar to Figma design
 */
export function generateMockWaveformData(length: number, complexity: number = 5): number[] {
  const data: number[] = [];
  let value = 0.5;
  
  for (let i = 0; i < length; i++) {
    // Add some randomness with varying frequency
    value += (Math.random() - 0.5) * 0.1;
    
    // Add sine wave components for complexity
    for (let j = 1; j <= complexity; j++) {
      value += Math.sin(i / (20 * j)) * 0.05;
    }
    
    // Clamp between 0 and 1
    value = Math.max(0, Math.min(1, value));
    
    data.push(value);
  }
  
  return data;
}

/**
 * Generate realistic drilling measurement data
 * Simulates real-world sensor readings with trends and variations
 */
export function generateRealisticDrillingData(length: number, minValue: number, maxValue: number): number[] {
  const data: number[] = [];
  const range = maxValue - minValue;
  
  // Start at around 30% of the range
  let currentValue = minValue + range * 0.3;
  let trend = 0;
  let trendChangeCounter = 0;
  
  for (let i = 0; i < length; i++) {
    // Change trend periodically (every 200-400 samples)
    if (trendChangeCounter <= 0) {
      trend = (Math.random() - 0.5) * 0.002 * range;
      trendChangeCounter = 200 + Math.floor(Math.random() * 200);
    }
    trendChangeCounter--;
    
    // Apply trend
    currentValue += trend;
    
    // Add medium frequency oscillation (drilling cycle)
    currentValue += Math.sin(i / 30) * range * 0.05;
    
    // Add high frequency noise (vibration)
    currentValue += (Math.random() - 0.5) * range * 0.03;
    
    // Add occasional spikes (events)
    if (Math.random() < 0.005) {
      currentValue += (Math.random() - 0.5) * range * 0.2;
    }
    
    // Clamp to range
    currentValue = Math.max(minValue, Math.min(maxValue, currentValue));
    
    data.push(currentValue);
  }
  
  return data;
}

/**
 * Generate realistic BPOS (Bit Position) data
 * Simulates drilling bit position with forward progress, pullbacks, and oscillations
 */
export function generateBPOSData(length: number, minValue: number, maxValue: number): number[] {
  const data: number[] = [];
  const range = maxValue - minValue;
  
  // Start at minimum (beginning of drilling)
  let currentValue = minValue + range * 0.05;
  let phase: "drilling" | "pullback" | "oscillating" = "drilling";
  let phaseCounter = 0;
  let targetValue = currentValue;
  
  for (let i = 0; i < length; i++) {
    // Phase transitions
    if (phaseCounter <= 0) {
      const rand = Math.random();
      if (phase === "drilling") {
        // Switch to pullback or oscillating
        if (rand < 0.3) {
          phase = "pullback";
          phaseCounter = 100 + Math.floor(Math.random() * 150);
          targetValue = currentValue - range * (0.1 + Math.random() * 0.15);
        } else if (rand < 0.5) {
          phase = "oscillating";
          phaseCounter = 80 + Math.floor(Math.random() * 100);
        } else {
          // Continue drilling
          phaseCounter = 150 + Math.floor(Math.random() * 200);
          targetValue = currentValue + range * (0.15 + Math.random() * 0.25);
        }
      } else if (phase === "pullback") {
        // After pullback, go back to drilling
        phase = "drilling";
        phaseCounter = 150 + Math.floor(Math.random() * 200);
        targetValue = currentValue + range * (0.2 + Math.random() * 0.3);
      } else {
        // After oscillating, go back to drilling
        phase = "drilling";
        phaseCounter = 150 + Math.floor(Math.random() * 200);
        targetValue = currentValue + range * (0.15 + Math.random() * 0.25);
      }
    }
    phaseCounter--;
    
    // Move towards target based on phase
    if (phase === "drilling") {
      // Gradual forward movement
      currentValue += (targetValue - currentValue) * 0.008;
      // Add small oscillations
      currentValue += Math.sin(i / 15) * range * 0.015;
      // Add noise
      currentValue += (Math.random() - 0.5) * range * 0.008;
    } else if (phase === "pullback") {
      // Quick pullback
      currentValue += (targetValue - currentValue) * 0.015;
      // Add oscillations during pullback
      currentValue += Math.sin(i / 10) * range * 0.02;
      // Add noise
      currentValue += (Math.random() - 0.5) * range * 0.01;
    } else {
      // Oscillating - zigzag pattern
      currentValue += Math.sin(i / 8) * range * 0.04;
      currentValue += Math.cos(i / 12) * range * 0.025;
      // Add noise
      currentValue += (Math.random() - 0.5) * range * 0.012;
    }
    
    // Clamp to range
    currentValue = Math.max(minValue, Math.min(maxValue, currentValue));
    
    data.push(currentValue);
  }
  
  return data;
}

/**
 * Generate realistic HKLA (Hook Load) data
 * Simulates hook load with initial high value, sharp drop, and stable mid-level oscillations
 */
export function generateHKLAData(length: number, minValue: number, maxValue: number): number[] {
  const data: number[] = [];
  const range = maxValue - minValue;
  
  // Start high (90-95% of range) - full weight on hook
  let currentValue = minValue + range * (0.90 + Math.random() * 0.05);
  
  for (let i = 0; i < length; i++) {
    const progress = i / length;
    
    // Phase 1: Initial high load (first 5-10% of data)
    if (progress < 0.08) {
      // Stay high with minor fluctuations
      currentValue += (Math.random() - 0.5) * range * 0.01;
      currentValue += Math.sin(i / 5) * range * 0.008;
    }
    // Phase 2: Sharp drop (next 5-8% of data)
    else if (progress < 0.15) {
      // Rapid decrease to mid-level (50-60%)
      const targetValue = minValue + range * (0.52 + Math.random() * 0.08);
      currentValue += (targetValue - currentValue) * 0.12;
      // Add some oscillation during drop
      currentValue += Math.sin(i / 3) * range * 0.015;
    }
    // Phase 3: Stable drilling load (rest of data)
    else {
      // Oscillate around mid-level with periodic variations
      const midLevel = minValue + range * 0.55;
      
      // Slow drift
      const driftTarget = midLevel + (Math.sin(i / 300) * range * 0.08);
      currentValue += (driftTarget - currentValue) * 0.005;
      
      // Medium frequency oscillations (drilling cycles)
      currentValue += Math.sin(i / 25) * range * 0.025;
      currentValue += Math.cos(i / 18) * range * 0.015;
      
      // High frequency noise (vibration)
      currentValue += (Math.random() - 0.5) * range * 0.012;
      
      // Occasional small spikes
      if (Math.random() < 0.008) {
        currentValue += (Math.random() - 0.5) * range * 0.08;
      }
    }
    
    // Clamp to range
    currentValue = Math.max(minValue, Math.min(maxValue, currentValue));
    
    data.push(currentValue);
  }
  
  return data;
}