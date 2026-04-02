import React from "react";
import { FolderOpen, Save, Pen, Plus, MoveHorizontal, Settings, MoreHorizontal } from "lucide-react";
import { useI18n } from "./i18n";

/**
 * Custom icon: Square brackets with dot
 */
function BracketDotIcon({ className = "", strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left bracket */}
      <path
        d="M4 3.5 L2.5 3.5 L2.5 12.5 L4 12.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right bracket */}
      <path
        d="M12 3.5 L13.5 3.5 L13.5 12.5 L12 12.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dot in the middle */}
      <circle
        cx="8"
        cy="8"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * ChannelPanel — панель инструментов каналов
 * Использует CSS-переменные из theme.css для соблюдения дизайн-системы
 */

interface ChannelPanelProps {
  className?: string;
}

export function ChannelPanel({ className = "" }: ChannelPanelProps) {
  const { t } = useI18n();
  const [activeTool, setActiveTool] = React.useState<string>("");

  const tools = [
    { id: "folder", icon: FolderOpen, label: "Folder" },
    { id: "save", icon: Save, label: "Save" },
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "add", icon: Plus, label: "Add" },
    { id: "resize", icon: MoveHorizontal, label: "Resize" },
  ];

  const rightTools = [
    { id: "bracket_dot", icon: BracketDotIcon, label: "Bracket Dot" },
  ];

  // Mock channel data
  const channels = [
    { name: "DEPTH", unit: "ft", value: 0.0, hasData: false },
    { name: "HDEPTH", unit: "ft", value: 0.0, hasData: false },
    { name: "KELLY_DOWN", unit: "ft", value: 0.7, hasData: true },
    { name: "BPOS", unit: "ft", value: 0.7, hasData: true },
  ];

  return (
    <div className={`border border-border rounded-md bg-background overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1 border-b border-border bg-card/50 shrink-0">
        <span className="mwd-title text-muted-foreground">{t("data_channels")}</span>
        <div className="flex-1" />
        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="size-3.5" />
        </button>
        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="size-3.5" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-1.5 py-1.5">
        {/* Left tools */}
        <div className="flex items-center gap-0.5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`
                  p-1.5 rounded transition-colors
                  ${isActive 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                title={tool.label}
              >
                <Icon className="size-4" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-border mx-1" />

        {/* Right tools */}
        <div className="flex items-center gap-0.5">
          {rightTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title={tool.label}
              >
                <Icon className="size-4" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Channel Widgets */}
      <div className="flex-1 min-h-0 overflow-auto px-2 py-2">
        <div className="grid grid-cols-2 gap-1.5">
          {channels.map((channel) => (
            <div
              key={channel.name}
              className="relative isolate flex flex-col items-start justify-center px-1.5 py-1 rounded-sm cursor-pointer hover:brightness-110 transition-all"
            >
              {/* Background surface */}
              <div className="absolute inset-0 bg-card rounded-sm z-[1]" />
              
              {/* Header: Channel name + unit */}
              <div className="relative z-[3] flex gap-1 items-baseline">
                <span 
                  className={channel.hasData ? "text-foreground" : "text-muted-foreground"}
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 'var(--font-weight-normal)',
                    lineHeight: '20px',
                    opacity: channel.hasData ? 1 : 0.7
                  }}
                >
                  {channel.name}
                </span>
                <span 
                  className="text-muted-foreground"
                  style={{ 
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-normal)',
                    lineHeight: '16px',
                    opacity: channel.hasData ? 0.7 : 0.55 
                  }}
                >
                  {channel.unit}
                </span>
              </div>
              
              {/* Value */}
              {channel.hasData ? (
                <div 
                  className="relative z-[2] text-accent"
                  style={{ 
                    fontSize: '18px',
                    fontWeight: 'var(--font-weight-normal)',
                    lineHeight: '24px'
                  }}
                >
                  {channel.value.toFixed(2)}
                </div>
              ) : (
                <div 
                  className="relative z-[2] text-muted-foreground"
                  style={{ 
                    fontSize: '18px',
                    fontWeight: 'var(--font-weight-normal)',
                    lineHeight: '24px',
                    letterSpacing: '-1px' 
                  }}
                >
                  —
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}