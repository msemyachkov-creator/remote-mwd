import React, { useState } from "react";
import { Radio, Edit3, Database } from "lucide-react";
import { useI18n } from "./i18n";

interface StatusFooterProps {
  activePage?: string;
}

export function StatusFooter({ activePage = "decoder" }: StatusFooterProps) {
  const { t } = useI18n();
  const [activeDecoderTab, setActiveDecoderTab] = useState("decoder1");
  const [activeDataTab, setActiveDataTab] = useState("data1");

  const decoderTabs = [
    { id: "decoder1", label: t("footer_decoder1"), icon: <Radio className="size-3.5" /> },
    { id: "decoder2", label: t("footer_decoder2"), icon: <Radio className="size-3.5" /> },
    { id: "layout", label: t("footer_layout_editor"), icon: <Edit3 className="size-3.5" /> },
  ];

  const dataTabs = [
    { id: "data1", label: t("footer_data1"), icon: <Database className="size-3.5" /> },
    { id: "data2", label: t("footer_data2"), icon: <Database className="size-3.5" /> },
    { id: "data3", label: t("footer_data3"), icon: <Database className="size-3.5" /> },
    { id: "layout", label: t("footer_layout_editor"), icon: <Edit3 className="size-3.5" /> },
  ];

  const tabs = activePage === "data" ? dataTabs : decoderTabs;
  const activeTab = activePage === "data" ? activeDataTab : activeDecoderTab;
  const setActiveTab = activePage === "data" ? setActiveDataTab : setActiveDecoderTab;

  return (
    <div className="flex items-center border-t border-border bg-card/50">
      <div className="flex items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 border-r border-border transition-colors ${
              activeTab === tab.id
                ? "bg-primary/10 text-primary border-t-2 border-t-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            } ${activeTab === tab.id ? "mwd-btn-active" : "mwd-btn"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1" />
    </div>
  );
}