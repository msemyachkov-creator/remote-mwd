import React from "react";
import { SummaryHeader } from "./summary/SummaryHeader";
import { ToolfaceWidget } from "./summary/ToolfaceWidget";
import { PulseView } from "./summary/PulseView";
import { SummarySidePanel } from "./summary/SummarySidePanel";

export function Summary() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-500">
      <div className="flex-1 flex overflow-hidden">
        {/* Main Central View (Left 60-70%) */}
        <div className="flex-1 flex flex-col border-r border-border min-w-0 overflow-hidden">
          {/* Toolface area */}
          <div className="flex-1 flex items-stretch overflow-hidden">
            <ToolfaceWidget />
          </div>

          {/* Pulse View at bottom */}
          <PulseView />
        </div>

        {/* Right Data Panel (30-40%) */}
        <SummarySidePanel />
      </div>
    </div>
  );
}
