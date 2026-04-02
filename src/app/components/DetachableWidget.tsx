// ─── DetachableWidget ─────────────────────────────────────────────────────────
//
// A thin wrapper that adds a hover-reveal "Detach" button (ExternalLink icon)
// to any widget. On click opens the widget in a new browser tab at:
//   /standalone/:widgetId
//
// Usage:
//   <DetachableWidget widgetId="toolface" label="Toolface">
//     <ToolfaceWidget />
//   </DetachableWidget>
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { ExternalLink } from "lucide-react";

interface DetachableWidgetProps {
  /** Maps to /standalone/:widgetId */
  widgetId: string;
  /** Short label shown on the detach button */
  label: string;
  children: React.ReactNode;
  /** Extra classes forwarded to the wrapper div */
  className?: string;
  /** Always show the button instead of only on hover */
  alwaysVisible?: boolean;
}

export function DetachableWidget({
  widgetId,
  label,
  children,
  className,
  alwaysVisible,
}: DetachableWidgetProps) {
  const openDetached = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const w = window.open(`${import.meta.env.BASE_URL}#/standalone/${widgetId}`, "_blank", "noopener,noreferrer");
    w?.focus();
  };

  return (
    <div className={`relative group/detach ${className ?? ""}`}>
      {children}

      {/* ── Detach overlay button — top-right corner, appears on hover ── */}
      <button
        onClick={openDetached}
        className={`
          absolute top-2 right-2 z-50
          ${alwaysVisible ? "opacity-100" : "opacity-0 group-hover/detach:opacity-100"}
          flex items-center gap-1 px-1.5 py-0.5
          rounded border border-primary/30
          bg-background/80 backdrop-blur-sm
          transition-all duration-150
          hover:bg-primary/15 hover:border-primary/60
        `}
        title={`Open ${label} in new tab`}
      >
        <ExternalLink className="size-3 text-primary" />
        <span
          className="text-primary"
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-family-base)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </button>
    </div>
  );
}
