import React from "react";
import BhaSchematic from "../../imports/BhaSchematic";

interface BhaIllustrationProps {
  hoveredModule?: string | null;
  onHoverModule?: (name: string | null) => void;
}

export function BhaIllustration({ hoveredModule, onHoverModule }: BhaIllustrationProps) {
  const LabelLeft = ({ 
    top, 
    text, 
    subText 
  }: { 
    top: number; 
    text: string; 
    subText?: string 
  }) => {
    const isHighlighted = hoveredModule === text;
    
    return (
      <div 
        className={`absolute left-[-120px] flex flex-col items-end transition-all duration-300 cursor-pointer pointer-events-auto ${
          isHighlighted ? "scale-110" : "opacity-80 hover:opacity-100"
        }`} 
        style={{ top }}
        onMouseEnter={() => onHoverModule?.(text)}
        onMouseLeave={() => onHoverModule?.(null)}
      >
        {subText && (
          <div className="flex items-center gap-2 mb-1.5 translate-y-[-12px]">
            <span className={`text-[10px] font-medium text-right w-24 uppercase tracking-tighter transition-colors ${
              isHighlighted ? "text-[#209ef8]" : "text-foreground/40"
            }`}>
              {subText}
            </span>
            <div className={`w-6 h-[1px] transition-colors ${
              isHighlighted ? "bg-[#209ef8]" : "bg-foreground/20"
            }`} />
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className={`text-[13px] font-bold text-right w-20 tracking-tight transition-colors ${
            isHighlighted ? "text-[#209ef8]" : "text-foreground"
          }`}>
            {text}
          </span>
          <div className={`w-14 h-[1px] transition-colors ${
            isHighlighted ? "bg-[#209ef8] shadow-[0_0_8px_#209ef8]" : "bg-foreground/50"
          }`} />
        </div>
      </div>
    );
  };

  const LabelRight = ({ top, title, value }: { top: number; title: string; value: string }) => (
    <div className="absolute right-[-110px]" style={{ top }}>
      <div className="flex items-center gap-2">
        <div className="w-14 h-[1px] bg-foreground/50" />
        <div className="flex flex-col justify-center leading-none">
          <span className="text-[12px] font-bold text-foreground tracking-tight">{title}</span>
          <span className="text-[10px] font-medium text-foreground/60 mt-0.5 tabular-nums">
            {value}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-background overflow-auto">
      <div className="relative h-[820px] w-[340px] shrink-0 bg-sidebar/20 rounded border border-border/10 overflow-visible">
        {/* The high-fidelity BHA Schematic with internal highlighting logic */}
        <BhaSchematic highlightedModule={hoveredModule} />

        {/* --- Layered Module & technical labels --- */}
        <div 
          className="absolute inset-0 pointer-events-none text-foreground select-none" 
          style={{ fontFamily: "var(--font-family-base)" }}
        >
          <div className="flex flex-col h-full relative">
            <LabelLeft top={145} text="МП" subText="Смещ. МР" />
            <LabelLeft top={215} text="МБ1" />
            <LabelLeft top={315} text="МБ2" />
            <LabelLeft top={415} text="МБ3" />
            <LabelLeft top={485} text="МГК" />
            <LabelLeft top={585} text="МИ" />
          </div>

          <div className="flex flex-col h-full relative">
            <LabelRight top={485} title="GR" value="2.505 м" />
            <LabelRight top={585} title="D&I" value="1.362 м" />
            
            <div className="absolute bottom-[48px] right-[-100px] flex items-center gap-3">
              <div className="w-24 h-[1px] bg-foreground/40" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-foreground/80">Ноль</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
