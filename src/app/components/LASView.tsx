import React, { useState, useMemo } from "react";
import { useI18n } from "./i18n";
import { useWell } from "./WellContext";
import { Save, FolderOpen, RotateCcw, ChevronDown, Minus, ChevronUp, ChevronDown as ChevronDownIcon, Plus, RotateCw } from "lucide-react";

export function LASView() {
  const { t } = useI18n();
  const { activeWell } = useWell();
  const [activeTab, setActiveTab] = useState<"curves" | "params">("params");
  const [exportMode, setExportMode] = useState<"none" | "selected">("none");

  // Mock data for parameters table - updated based on active well
  const parametersData = useMemo(() => [
    { привязка: "", мнемоника: "STRT", единица: "m", значение: "0.00", описание: "START DEPTH", hasControls: false },
    { привязка: "", мнемоника: "STOP", единица: "m", значение: activeWell.holeDepth.toFixed(2), описание: "STOP DEPTH", hasControls: false },
    { привязка: "", мнемоника: "STEP", единица: "m", значение: "0.10", описание: "STEP", hasControls: false },
    { привязка: "", мнемоника: "NULL", единица: "", значение: "-999.25", описание: "NULL VALUE", hasControls: false },
    { привязка: "DATE", мнемоника: "DATE", единица: "", значение: "16-September-25", описание: "LOG DATE(DD-MMM-YY)", hasControls: true },
    { привязка: "ENGI", мнемоника: "ENGI", единица: "", значение: "DrillSpot AI", описание: "ENGINEER", hasControls: true },
    { привязка: "SRVC", мнемоника: "SRVC", единица: "", значение: "Remote MWD", описание: "SERVICE COMPANY", hasControls: true },
    { привязка: "COMP", мнемоника: "COMP", единица: "", значение: "Operator Corp", описание: "COMPANY", hasControls: true },
    { привязка: "WELL", мнемоника: "WELL", единица: "", значение: activeWell.name, описание: "WELL NAME", hasControls: true },
    { привязка: "FLD", мнемоника: "FLD", единица: "", значение: "North Field", описание: "FIELD NAME", hasControls: true },
    { привязка: "LOC", мнемоника: "LOC", единица: "", значение: "Platform A", описание: "LOCATION", hasControls: true },
    { привязка: "CNTY", мнемоника: "CNTY", единица: "", значение: "RU", описание: "COUNTRY", hasControls: true },
    { привязка: "STAT", мнемоника: "STAT", единица: "", значение: "Active", описание: "STATE", hasControls: true },
    { привязка: "PROV", мнемоника: "PROV", единица: "", значение: "Siberia", описание: "PROVINCE", hasControls: true },
    { привязка: "LATI", мнемоника: "LATI", единица: "deg", значение: "62.123456", описание: "LATITUDE", hasControls: true },
    { привязка: "LONG", мнемоника: "LONG", единица: "deg", значение: "74.654321", описание: "LONGITUDE", hasControls: true },
  ], [activeWell]);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === parametersData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(parametersData.map((_, i) => i)));
    }
  };

  return (
    <div className="flex h-full w-full gap-1.5 p-1.5 bg-background overflow-hidden">
      {/* Left panel - LAS Creation Form */}
      <div className="flex flex-col w-[380px] shrink-0">
        <div className="bg-card border border-border rounded overflow-hidden flex flex-col h-full">
          {/* Header with icons */}
          <div className="px-3 py-2 border-b border-border bg-card/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button 
                className="p-1.5 border border-border rounded hover:bg-secondary transition-colors"
                title={t("las_save")}
              >
                <Save className="w-4 h-4 text-foreground" />
              </button>
              <button 
                className="p-1.5 border border-border rounded hover:bg-secondary transition-colors"
                title={t("las_folder")}
              >
                <FolderOpen className="w-4 h-4 text-foreground" />
              </button>
              <button 
                className="p-1.5 border border-border rounded hover:bg-secondary transition-colors"
                title={t("las_cancel")}
              >
                <RotateCcw className="w-4 h-4 text-foreground" />
              </button>
              <button 
                className="p-1.5 border border-border rounded hover:bg-secondary transition-colors"
                title={t("las_redo")}
              >
                <RotateCw className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <button className="px-3 py-1.5 bg-primary border border-primary rounded hover:bg-primary/90 transition-colors mwd-btn text-primary-foreground">
              {t("las_create")}
            </button>
          </div>

          {/* Form fields */}
          <div className="p-3 space-y-2.5 flex-1 overflow-auto">
            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2.5 items-center">
              {/* Индекс */}
              <label className="mwd-cell text-foreground">{t("las_index")}</label>
              <select 
                className="px-2 py-1 pr-8 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[length:16px_16px] bg-[right_4px_center] bg-no-repeat"
                style={{ 
                  fontFamily: "var(--font-family-base)",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E\")"
                }}
              >
                <option>MD</option>
              </select>

              {/* Источник */}
              <label className="mwd-cell text-foreground">{t("las_source")}</label>
              <select 
                className="px-2 py-1 pr-8 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[length:16px_16px] bg-[right_4px_center] bg-no-repeat"
                style={{ 
                  fontFamily: "var(--font-family-base)",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E\")"
                }}
              >
                <option>{t("las_from_pelica")}</option>
              </select>

              {/* Рейс */}
              <label className="mwd-cell text-foreground">{t("las_trip")}</label>
              <select 
                className="px-2 py-1 pr-8 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[length:16px_16px] bg-[right_4px_center] bg-no-repeat"
                style={{ 
                  fontFamily: "var(--font-family-base)",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E\")"
                }}
              >
                <option>{t("las_trip")}1</option>
              </select>

              {/* Запись */}
              <label className="mwd-cell text-foreground">{t("las_record")}</label>
              <select 
                className="px-2 py-1 pr-8 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[length:16px_16px] bg-[right_4px_center] bg-no-repeat"
                style={{ 
                  fontFamily: "var(--font-family-base)",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E\")"
                }}
              >
                <option>{t("las_drilling")}</option>
              </select>

              {/* Начальная Глубина */}
              <label className="mwd-cell text-foreground whitespace-nowrap">{t("las_start_depth_m")}</label>
              <input
                type="number"
                step="0.01"
                className="px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue="0.00"
                style={{ fontFamily: "var(--font-family-base)" }}
              />

              {/* Конечная Глубина */}
              <label className="mwd-cell text-foreground whitespace-nowrap">{t("las_end_depth_m")}</label>
              <input
                type="number"
                step="0.01"
                className="px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue="11.33"
                style={{ fontFamily: "var(--font-family-base)" }}
              />

              {/* Шаг */}
              <label className="mwd-cell text-foreground">{t("las_step_m")}</label>
              <input
                type="number"
                step="0.01"
                className="px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue="0.10"
                style={{ fontFamily: "var(--font-family-base)" }}
              />

              {/* NULL */}
              <label className="mwd-cell text-foreground">NULL</label>
              <input
                type="number"
                step="0.01"
                className="px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue="-999.25"
                style={{ fontFamily: "var(--font-family-base)" }}
              />

              {/* Точность */}
              <label className="mwd-cell text-foreground">{t("las_precision")}</label>
              <input
                type="number"
                className="px-2 py-1 bg-input-background border border-border rounded mwd-cell text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                defaultValue="2"
                style={{ fontFamily: "var(--font-family-base)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Parameters table */}
      <div className="flex-1 min-w-0 bg-card border border-border rounded overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-border bg-card/50">
          <button
            onClick={() => setActiveTab("curves")}
            className={`px-3 py-1.5 border-r border-border transition-colors relative ${
              activeTab === "curves"
                ? "text-foreground bg-secondary mwd-btn-active"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground mwd-btn"
            }`}
          >
            {t("las_curves")}
            {activeTab === "curves" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("params")}
            className={`px-3 py-1.5 transition-colors relative ${
              activeTab === "params"
                ? "text-foreground bg-secondary mwd-btn-active"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground mwd-btn"
            }`}
          >
            {t("las_parameters")}
            {activeTab === "params" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === "curves" && (
          <div className="flex-1 p-4">
            <p className="mwd-cell text-muted-foreground">{t("las_curves_content")}</p>
          </div>
        )}

        {activeTab === "params" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Filter dropdown */}
            <div className="px-4 py-2 border-b border-border flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-foreground" />
              <span className="mwd-cell text-foreground">{t("las_default")}</span>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-table-header-bg border-b border-border">
                  <tr>
                    <th className="px-2 py-2 border-r border-border w-10"></th>
                    <th className="px-2 py-2 border-r border-border w-24"></th>
                    <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border">{t("las_binding")}</th>
                    <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border">{t("las_mnemonic")}</th>
                    <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border">{t("las_unit")}</th>
                    <th className="px-3 py-2 text-left mwd-header text-foreground border-r border-border">{t("las_value")}</th>
                    <th className="px-3 py-2 text-left mwd-header text-foreground">{t("las_description")}</th>
                  </tr>
                </thead>
                <tbody>
                  {parametersData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="px-2 py-1.5 border-r border-border text-center">
                        {idx >= 4 && (
                          <button className="p-1 border border-border rounded hover:bg-secondary transition-colors" title={t("las_delete")}>
                            <Minus className="w-3 h-3 text-foreground" />
                          </button>
                        )}
                      </td>
                      <td className="px-2 py-1.5 border-r border-border">
                        {row.hasControls && (
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1 border border-border rounded hover:bg-secondary transition-colors" title={t("las_move_up")}>
                              <ChevronUp className="w-3 h-3 text-foreground" />
                            </button>
                            <button className="p-1 border border-border rounded hover:bg-secondary transition-colors" title={t("las_move_down")}>
                              <ChevronDownIcon className="w-3 h-3 text-foreground" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-1.5 mwd-table-cell text-foreground border-r border-border">{row.привязка}</td>
                      <td className="px-3 py-1.5 mwd-table-cell text-foreground border-r border-border">{row.мнемоника}</td>
                      <td className="px-3 py-1.5 mwd-table-cell text-foreground border-r border-border">{row.единица}</td>
                      <td className="px-3 py-1.5 mwd-table-cell text-foreground border-r border-border">{row.значение}</td>
                      <td className="px-3 py-1.5 mwd-table-cell text-foreground">{row.описание}</td>
                    </tr>
                  ))}
                  {/* Empty row */}
                  <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-2 py-1.5 border-r border-border text-center">
                      <button className="p-1 border border-border rounded hover:bg-secondary transition-colors" title={t("las_add")}>
                        <Plus className="w-3 h-3 text-foreground" />
                      </button>
                    </td>
                    <td className="px-2 py-1.5 border-r border-border"></td>
                    <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border"></td>
                    <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border"></td>
                    <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border"></td>
                    <td className="px-3 py-1.5 mwd-cell text-foreground border-r border-border"></td>
                    <td className="px-3 py-1.5 mwd-cell text-foreground"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}