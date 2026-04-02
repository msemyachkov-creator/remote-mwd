import React, { useState } from "react";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  FolderOpen,
  Download,
  Clock,
  ChevronDown,
  ArrowRight,
  Redo2,
  RotateCcw,
  Pencil,
  Braces,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useI18n } from "./i18n";

export function PlaybackToolbar({ 
  isPlaying, 
  onTogglePlay,
  decoderFilter,
  onDecoderFilterChange,
}: { 
  isPlaying: boolean; 
  onTogglePlay: () => void;
  decoderFilter: string;
  onDecoderFilterChange: (filter: string) => void;
}) {
  const { t } = useI18n();
  const [mode] = useState<"online" | "file">("online");
  const [showSyncMenu, setShowSyncMenu] = useState(false);
  const syncButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    if (!showSyncMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (syncButtonRef.current && !syncButtonRef.current.contains(e.target as Node)) {
        setShowSyncMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSyncMenu]);

  const syncOptions = [
    "SYNC",
    "SYNC + FID:0 (Static)",
    "SYNC + FID:1 (Slide low)",
    "SYNC + FID:2 (Rotor)",
    "SYNC + FID:3 (Static high)",
    "SYNC + FID:4 (Slide high)",
    "SYNC + FID:5 (Tech)",
    "SYNC + FID:6 (Static (aux))",
    "SYNC + FID:7 (Slide low (aux))",
    "SYNC + FID:8 (Rotor (aux))",
    "SYNC + FID:9 (Static high (aux))",
    "SYNC + FID:10 (Slide high (aux))",
  ];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-card/30">
      <Button variant="secondary" size="sm" className="gap-1 h-7">
        <FolderOpen className="size-3.5" />
        <span className="mwd-btn">{t("playback_file")}</span>
      </Button>

      <div className="flex items-center border border-border rounded-md overflow-hidden">
        {["A", "M", "D"].map((m) => (
          <button
            key={m}
            className="mwd-btn-active px-2 py-0.5 border-r border-border last:border-r-0 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" className="size-7 hover:bg-white/40">
          <SkipBack className="size-3.5" />
        </Button>
        <Button
          variant={isPlaying ? "ghost" : "default"}
          size="icon"
          className="size-7 hover:bg-white/40"
          onClick={onTogglePlay}
        >
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="size-7 hover:bg-white/40">
          <Square className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7 hover:bg-white/40">
          <SkipForward className="size-3.5" />
        </Button>
      </div>

      <Button variant="secondary" size="sm" className="gap-1 h-7">
        <Download className="size-3.5" />
        <span className="mwd-btn">Downlink</span>
      </Button>

      <div className="w-px h-5 bg-border" />

      <div className="flex items-center gap-1.5">
        <span className="mwd-cell text-muted-foreground">{t("playback_width")}</span>
        <input
          type="number"
          defaultValue={1200}
          disabled
          className="mwd-cell w-16 h-6 px-1.5 rounded-sm border border-border bg-input-background text-foreground text-center tabular-nums opacity-50 cursor-not-allowed"
        />
        <span className="mwd-cell text-muted-foreground">[ms]</span>
      </div>

      <div className="w-px h-5 bg-border" />

      <div className="flex items-center gap-1.5">
        <button className="flex items-center justify-center size-[24px] rounded hover:bg-secondary transition-colors border border-border">
          <ArrowRight className="size-3.5 text-foreground" />
        </button>
        <button className="flex items-center justify-center size-[24px] rounded hover:bg-secondary transition-colors border border-border">
          <Redo2 className="size-3.5 text-foreground" />
        </button>
        <Clock className="size-3.5 text-muted-foreground" />
        <span className="mwd-header text-foreground tabular-nums">3 h</span>
        <ChevronDown className="size-3 text-muted-foreground" />
        <input type="range" min={1} max={24} defaultValue={3} className="w-20 h-1 accent-primary cursor-pointer" />
        <button className="flex items-center justify-center size-[24px] rounded hover:bg-secondary transition-colors border border-border">
          <RotateCcw className="size-3.5 text-foreground" />
        </button>
        <button className="flex items-center justify-center size-[24px] rounded hover:bg-secondary transition-colors border border-border">
          <Pencil className="size-3.5 text-foreground" />
        </button>
        <div className="relative">
          <button
            ref={syncButtonRef}
            onClick={() => setShowSyncMenu(!showSyncMenu)}
            className="flex items-center justify-center size-[24px] rounded hover:bg-secondary transition-colors border border-border"
          >
            <Braces className="size-3.5 text-foreground" />
          </button>

          {/* Sync Menu Popup */}
          {showSyncMenu && (
            <div
              className="absolute top-full mt-1 right-0 z-50 min-w-[220px] rounded-md border border-border bg-card shadow-lg"
              style={{
                fontFamily: "var(--font-family-base)",
              }}
            >
              <div className="py-1">
                {syncOptions.map((option, index) => {
                  const isSelected = option === decoderFilter;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onDecoderFilterChange(option);
                        setShowSyncMenu(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left transition-colors ${
                        isSelected 
                          ? 'bg-[rgba(32,158,248,0.1)]' 
                          : 'hover:bg-secondary/50'
                      }`}
                      style={{
                        fontFamily: "var(--font-family-base)",
                        fontSize: "11px",
                        lineHeight: "16px",
                        color: isSelected ? "var(--accent)" : "var(--foreground)",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-px h-5 bg-border" />

      <Button variant="default" size="sm" className="h-7">
        <span className="mwd-btn">{t("playback_apply")}</span>
      </Button>
      <Button variant="secondary" size="sm" className="h-7">
        <span className="mwd-btn">{t("playback_cancel")}</span>
      </Button>

      <div className="w-px h-5 bg-border" />

      <div className="flex items-center gap-1.5">
        <span className="mwd-cell text-foreground/70">{t("playback_mode")}</span>
        <span className="mwd-header text-accent">{t("playback_online")}</span>
      </div>

      <div className="w-px h-5 bg-border" />

      <div className="flex items-center gap-1.5">
        <span className="mwd-cell text-foreground/70">{t("playback_position")}</span>
        <span className="mwd-header text-foreground">—</span>
      </div>

      <button className="flex items-center justify-center size-[24px] rounded hover:bg-secondary transition-colors border border-border">
        <Settings className="size-3.5 text-foreground" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <Checkbox id="log" defaultChecked />
        <label htmlFor="log" className="mwd-cell text-foreground cursor-pointer">
          {t("playback_log")}
        </label>
      </div>

      <button className="flex items-center justify-center size-[24px] rounded hover:bg-secondary transition-colors border border-border">
        <MoreHorizontal className="size-3.5 text-foreground" />
      </button>
    </div>
  );
}