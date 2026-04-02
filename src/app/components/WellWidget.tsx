import React from "react";
import { ExternalLink } from "lucide-react";
import { useDrag } from "react-dnd";

export interface WellData {
  id: string;
  name: string;
  bitDepth: number;
  holeDepth: number;
  unit: string;
}

interface WellWidgetProps {
  well: WellData;
  onClick?: () => void;
  isActive?: boolean;
}

export function WellWidget({ well, onClick, isActive }: WellWidgetProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "well",
    item: { id: well.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`group flex flex-col gap-0.5 p-1.5 rounded border transition-all w-full relative ${
        isDragging ? "opacity-40 cursor-grabbing scale-95" : "cursor-grab active:cursor-grabbing"
      } ${
        isActive
          ? "bg-primary/10 border-primary/30 shadow-[0_0_10px_rgba(var(--color-primary),0.05)]"
          : "bg-secondary/50 hover:bg-secondary/80 border-border hover:border-border-bright"
      }`}
      style={{ borderRadius: "var(--radius)" }}
    >
      {/* Title row */}
      <div className="flex items-center justify-between gap-2 w-full">
        <span
          className="text-foreground whitespace-nowrap overflow-hidden text-ellipsis flex-1"
          style={{ 
            fontSize: "var(--text-sm)",
            fontFamily: "var(--font-family-base)",
            fontWeight: "var(--font-weight-medium)",
            lineHeight: "16px"
          }}
        >
          {well.name}
        </span>
        
        {/* Pop-out icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // In a real app, this would window.open()
            console.log("Opening well in new window:", well.id);
          }}
          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity p-0.5 rounded hover:bg-primary/20 text-foreground shrink-0"
          title="Open in separate window"
        >
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Depth data */}
      <div 
        className="flex gap-2 text-foreground/50" 
        style={{ 
          fontSize: "var(--text-xs)",
          fontFamily: "var(--font-family-base)",
          fontWeight: "var(--font-weight-normal)",
          lineHeight: "14px"
        }}
      >
        {/* Bit depth */}
        <div className="flex gap-1 items-baseline shrink-0">
          <span className="opacity-60" style={{ fontWeight: "var(--font-weight-medium)" }}>Bit</span>
          <span className="tabular-nums text-foreground/80">{well.bitDepth.toLocaleString()}</span>
          <span className="opacity-40">{well.unit}</span>
        </div>

        {/* Hole depth */}
        <div className="flex gap-1 items-baseline shrink-0">
          <span className="opacity-60" style={{ fontWeight: "var(--font-weight-medium)" }}>Hole</span>
          <span className="tabular-nums text-foreground/80">{well.holeDepth.toLocaleString()}</span>
          <span className="opacity-40">{well.unit}</span>
        </div>
      </div>
    </div>
  );
}
