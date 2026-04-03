/**
 * ViewportScale — shared scaling context
 *
 * Two modes:
 *  • scale === 1  (main layout): fluid() uses vw units so widgets grow
 *    proportionally as the viewport widens past 1920 px.
 *  • scale > 1   (standalone / detached tab): fluid() returns fixed px and
 *    the host component applies CSS transform:scale() instead — no double-scaling.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const BASE_VW = 1920;

// ── Context ───────────────────────────────────────────────────────────────────
export const ViewportScaleContext = createContext<number>(1);

/** Returns the current external scale factor (1 = no external transform). */
export function useViewportScaleCtx() {
  return useContext(ViewportScaleContext);
}

// ── fluid() hook ──────────────────────────────────────────────────────────────
/**
 * Returns a `fluid(px)` helper.
 *
 * - When externalScale === 1 → `clamp(px, vw%, px*maxMult)` (vw-based scaling)
 * - When externalScale > 1   → `px + "px"` (rely on CSS transform)
 */
export function useFluid(maxMult = 2) {
  const externalScale = useViewportScaleCtx();
  return (px: number): string => {
    if (externalScale > 1) return `${px}px`;
    const vw = ((px / BASE_VW) * 100).toFixed(3);
    return `clamp(${px}px, ${vw}vw, ${Math.round(px * maxMult)}px)`;
  };
}

// ── Hook: measure viewport scale ──────────────────────────────────────────────
export function useViewportScale(baseWidth = BASE_VW) {
  const calc = useCallback(
    () => Math.max(1, window.innerWidth / baseWidth),
    [baseWidth],
  );
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const handle = () => setScale(calc());
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [calc]);
  return scale;
}

// ── ScaledContainer ───────────────────────────────────────────────────────────
/**
 * Wraps children in a CSS-transform scaled box.
 * Content renders at 1920 × auto, then scales up to fill the actual viewport.
 * Provides ViewportScaleContext so fluid() inside uses fixed px (no double-scaling).
 */
export function ScaledContainer({ children }: { children: React.ReactNode }) {
  const scale = useViewportScale();
  return (
    <ViewportScaleContext.Provider value={scale}>
      <div className="w-screen h-screen bg-background overflow-hidden">
        <div
          style={{
            width: `${(100 / scale).toFixed(4)}%`,
            height: `${(100 / scale).toFixed(4)}%`,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </div>
    </ViewportScaleContext.Provider>
  );
}
