import React from "react";
import svgPaths from "./svg-qfdmsjp3uw";

interface BhaSchematicProps {
  highlightedModule?: string | null;
}

export default function BhaSchematic({ highlightedModule }: BhaSchematicProps) {
  const barlowStyle = { fontFamily: "var(--font-family-base)" };
  const interStyle = { fontFamily: "var(--font-family-base)" };
  const interDisplayStyle = { fontFamily: "var(--font-family-display)" };

  const highlightClass = "bg-[#209ef8]/20 ring-1 ring-[#209ef8] ring-inset transition-all duration-300";

  return (
    <div className="bg-[#121e2c] content-stretch flex isolate items-end p-[2px] relative rounded-[2px] size-full" data-name="BHA Schematic">
      <div className="absolute bg-[#121e2c] bottom-[2px] content-stretch flex h-[16px] items-start left-[2px] overflow-clip pb-[2px] pt-px px-[3px] rounded-[6px] w-[15px] z-[2]" data-name="md">
        <div className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(191,201,212,0.7)] text-center tracking-[0.5px] whitespace-nowrap" style={barlowStyle}>
          <p className="leading-[12px]">ft</p>
        </div>
      </div>
      <div className="content-stretch flex h-full items-end overflow-clip pl-[8px] relative rounded-[2px] shrink-0 z-[1]" data-name="List Conteiner">
        <div className="bg-[#192838] content-stretch flex flex-col h-full items-start relative shrink-0" data-name="Components List">
          <div className="bg-[#192838] min-h-[28px] relative rounded-tl-[2px] rounded-tr-[2px] shrink-0 w-full" data-name="Top Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid inset-0 pointer-events-none rounded-tl-[2px] rounded-tr-[2px]" />
            <div className="flex flex-col items-center justify-end min-h-[inherit] size-full">
              <div className="content-stretch flex flex-col items-center justify-end min-h-[inherit] px-[16px] py-[4px] relative w-full">
                <div className="content-stretch flex gap-[2px] items-center justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="buttonMain">
                  <div className="relative shrink-0 size-[16px]" data-name="Arrow">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[12px] left-1/2 top-1/2 w-[10px]" data-name="Shape">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 12">
                        <path d={svgPaths.p3818200} fill="var(--fill-0, #223B4E)" fillOpacity="0.8" id="Shape" />
                      </svg>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
                    <div className="content-stretch flex isolate items-start relative shrink-0" data-name="style=default, type=primary, digits=false">
                      <p className="leading-[16px] not-italic relative shrink-0 text-[#030507] text-[12px] whitespace-nowrap z-[2]" style={interDisplayStyle}>Extend</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Module Item 1 */}
          <div className={`bg-[rgba(255,255,255,0)] content-stretch flex items-start px-[44px] relative shrink-0`} data-name="Component Scheme Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex items-start overflow-clip px-[13px] relative shrink-0" data-name="Selected=False">
              <div className="h-[100px] relative shrink-0 w-[34px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 100">
                  <g clipPath="url(#clip0_2170_3163)" id="Frame 81512783">
                    <path d={svgPaths.p111c4700} fill="var(--fill-0, #1A2939)" id="Vector 1167" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467779" width="30" x="2" y="18" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467804" width="30" x="2" y="81" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467802" width="28" x="3" y="22" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467803" width="28" x="3" y="77" />
                    <path d={svgPaths.p31432c70} id="Vector 1166" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p326a0100} id="Vector 1168" stroke="var(--stroke-0, #8D99A5)" strokeWidth="0.5" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467763" width="30" x="2" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467764" width="30" x="2" y="99" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2170_3163">
                      <rect fill="white" height="100" width="34" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[rgba(18,30,44,0.8)] content-stretch flex h-[16px] items-center leading-[0] not-italic overflow-clip pb-[2px] px-[3px] relative rounded-[6px] shrink-0 text-[#e8ebf0] text-[14px] text-center" data-name="compTracksScaleValue" style={barlowStyle}>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">189</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 w-[2px]">
                  <p className="leading-[14px]">.</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">6</p>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-normal justify-center leading-[0] not-italic right-[4px] text-[10px] text-[rgba(191,201,212,0.7)] text-right top-[11px] whitespace-nowrap" style={interStyle}>
              <p className="leading-[14px]">×2</p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-semibold justify-center leading-[0] left-[8px] not-italic opacity-20 text-[#e8ebf0] text-[14px] top-1/2 whitespace-nowrap" style={{ ...interStyle, fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">8</p>
            </div>
          </div>

          {/* Module Item 2: МП */}
          <div className={`bg-[rgba(255,255,255,0)] content-stretch flex items-start px-[44px] relative shrink-0 ${highlightedModule === "МП" ? highlightClass : ""}`} data-name="Component Scheme Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex items-start overflow-clip px-[13px] relative shrink-0" data-name="Selected=False">
              <div className="h-[60px] overflow-clip relative shrink-0 w-[34px]">
                <div className="absolute bg-[#1a2939] h-[58px] left-[2px] top-px w-[30px]" />
                <p className="-translate-x-1/2 absolute font-normal leading-[16px] left-1/2 not-italic text-[12px] text-[rgba(191,201,212,0.55)] text-center top-[22px] w-[30px]" style={interStyle}>X/O</p>
                <div className="absolute bg-[#8d99a5] h-[60px] left-px top-0 w-px" />
                <div className="absolute bg-[#8d99a5] h-[60px] left-[32px] top-0 w-px" />
                <div className="absolute bg-[#424f5d] h-px left-[2px] top-0 w-[30px]" />
                <div className="absolute bg-[#424f5d] bottom-0 h-px left-[2px] w-[30px]" />
                <div className="absolute bg-[#8d99a5] h-[60px] left-[0.5px] top-0 w-[0.5px]" />
                <div className="absolute bg-[#8d99a5] h-[60px] left-[33px] top-0 w-[0.5px]" />
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[rgba(18,30,44,0.8)] content-stretch flex h-[16px] items-center leading-[0] not-italic overflow-clip pb-[2px] px-[3px] relative rounded-[6px] shrink-0 text-[#e8ebf0] text-[14px] text-center" data-name="compTracksScaleValue" style={barlowStyle}>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">107</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 w-[2px]">
                  <p className="leading-[14px]">.</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">2</p>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-semibold justify-center leading-[0] left-[8px] not-italic opacity-20 text-[#e8ebf0] text-[14px] top-1/2 whitespace-nowrap" style={{ ...interStyle, fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">7</p>
            </div>
          </div>

          {/* Module Item 3: МБ1 */}
          <div className={`bg-[rgba(255,255,255,0)] content-stretch flex items-start px-[44px] relative shrink-0 ${highlightedModule === "МБ1" ? highlightClass : ""}`} data-name="Component Scheme Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex items-start overflow-clip px-[10px] relative shrink-0" data-name="Selected=False">
              <div className="h-[74px] relative shrink-0 w-[40px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 74">
                  <g clipPath="url(#clip0_2170_2223)" id="Frame 81512791">
                    <path d={svgPaths.p21942d80} fill="var(--fill-0, #192838)" id="Vector 1168" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467769" width="30" x="5" y="60" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467772" width="30" x="5" y="15" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467770" width="34" x="3" y="55" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467771" width="34" x="3" y="20" />
                    <path d={svgPaths.p3ff7b850} id="Vector 1167" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p10da4b00} id="Vector 1169" stroke="var(--stroke-0, #8D99A5)" strokeWidth="0.5" />
                    <path d={svgPaths.p15d94500} fill="var(--fill-0, #1F2D3D)" id="Vector 1157" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p1786cf00} fill="var(--fill-0, #1F2D3D)" id="Vector 1158" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p1b2f0500} fill="var(--fill-0, #1F2D3D)" id="Vector 1159" stroke="var(--stroke-0, #8D99A5)" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467767" width="30" x="5" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467768" width="30" x="5" y="73" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2170_2223">
                      <rect fill="white" height="74" width="40" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[rgba(18,30,44,0.8)] content-stretch flex h-[16px] items-center leading-[0] not-italic overflow-clip pb-[2px] px-[3px] relative rounded-[6px] shrink-0 text-[#e8ebf0] text-[14px] text-center" data-name="compTracksScaleValue" style={barlowStyle}>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">59</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 w-[2px]">
                  <p className="leading-[14px]">.</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">2</p>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-semibold justify-center leading-[0] left-[8px] not-italic opacity-20 text-[#e8ebf0] text-[14px] top-1/2 whitespace-nowrap" style={{ ...interStyle, fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">6</p>
            </div>
          </div>

          {/* Module Item 4: МБ2 */}
          <div className={`bg-[rgba(255,255,255,0)] content-stretch flex items-start px-[44px] relative shrink-0 ${highlightedModule === "МБ2" ? highlightClass : ""}`} data-name="Component Scheme Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex items-start overflow-clip px-[11px] relative shrink-0" data-name="Selected=False">
              <div className="h-[100px] relative shrink-0 w-[38px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 100">
                  <g clipPath="url(#clip0_2170_3774)" id="Frame 81512780">
                    <rect fill="var(--fill-0, #8D99A5)" height="100" id="Rectangle 3467802" width="0.5" x="2.5" />
                    <rect fill="var(--fill-0, #8D99A5)" height="100" id="Rectangle 3467801" width="0.5" x="35" />
                    <g id="Rectangle 3467693">
                      <mask fill="white" id="path-3-inside-1_2170_3774">
                        <path d="M3 0H35V65H3V0Z" />
                      </mask>
                      <path d="M3 0H35V65H3V0Z" fill="var(--fill-0, #192838)" />
                      <path d={svgPaths.pd55ec80} fill="var(--stroke-0, #424F5D)" mask="url(#path-3-inside-1_2170_3774)" />
                    </g>
                    <g id="Rectangle 3467694">
                      <mask fill="white" id="path-5-inside-2_2170_3774">
                        <path d="M3 72H35V97H3V72Z" />
                      </mask>
                      <path d="M3 72H35V97H3V72Z" fill="var(--fill-0, #192838)" />
                      <path d={svgPaths.p1e5ff480} fill="var(--stroke-0, #424F5D)" mask="url(#path-5-inside-2_2170_3774)" />
                    </g>
                    <g id="Rectangle 3467696">
                      <mask fill="white" id="path-7-inside-3_2170_3774">
                        <path d="M3 65H35V72H3V65Z" />
                      </mask>
                      <path d="M3 65H35V72H3V65Z" fill="var(--fill-0, #192838)" />
                      <path d={svgPaths.p28001500} fill="var(--stroke-0, #424F5D)" mask="url(#path-7-inside-3_2170_3774)" />
                    </g>
                    <g id="Rectangle 3467695">
                      <mask fill="white" id="path-9-inside-4_2170_3774">
                        <path d="M3 96H35V100H3V96Z" />
                      </mask>
                      <path d="M3 96H35V100H3V96Z" fill="var(--fill-0, #192838)" />
                      <path d={svgPaths.p26c29180} fill="var(--stroke-0, #424F5D)" mask="url(#path-9-inside-4_2170_3774)" />
                    </g>
                    <rect fill="var(--fill-0, #8D99A5)" height="100" id="Rectangle 3467765" width="1" x="3" />
                    <rect fill="var(--fill-0, #8D99A5)" height="100" id="Rectangle 3467766" width="1" x="34" />
                    <path d={svgPaths.p2f47a700} fill="var(--fill-0, #1F2D3D)" id="Vector 1157" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p218f9800} fill="var(--fill-0, #1F2D3D)" id="Vector 1160" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p37cad780} fill="var(--fill-0, #1F2D3D)" id="Vector 1158" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p23888bf0} fill="var(--fill-0, #1F2D3D)" id="Vector 1161" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p12137380} fill="var(--fill-0, #1F2D3D)" id="Vector 1159" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p3e796600} fill="var(--fill-0, #1F2D3D)" id="Vector 1162" stroke="var(--stroke-0, #8D99A5)" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2170_3774">
                      <rect fill="white" height="100" width="38" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[rgba(18,30,44,0.8)] content-stretch flex h-[16px] items-center leading-[0] not-italic overflow-clip pb-[2px] px-[3px] relative rounded-[6px] shrink-0 text-[#e8ebf0] text-[14px] text-center" data-name="compTracksScaleValue" style={barlowStyle}>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">47</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 w-[2px]">
                  <p className="leading-[14px]">.</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">7</p>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-semibold justify-center leading-[0] left-[8px] not-italic opacity-20 text-[#e8ebf0] text-[14px] top-1/2 whitespace-nowrap" style={{ ...interStyle, fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">5</p>
            </div>
          </div>

          {/* Module Item 5: МБ3 */}
          <div className={`bg-[rgba(255,255,255,0.06)] content-stretch flex items-start px-[44px] relative shrink-0 ${highlightedModule === "МБ3" ? highlightClass : ""}`} data-name="Component Scheme Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex items-start overflow-clip px-[13px] relative shrink-0" data-name="Selected=False">
              <div className="h-[60px] overflow-clip relative shrink-0 w-[34px]">
                <div className="absolute bg-[#1a2939] h-[58px] left-[2px] top-px w-[30px]" />
                <p className="-translate-x-1/2 absolute font-normal leading-[16px] left-1/2 not-italic text-[12px] text-[rgba(191,201,212,0.55)] text-center top-[22px] w-[30px]" style={interStyle}>X/O</p>
                <div className="absolute bg-[#8d99a5] h-[60px] left-px top-0 w-px" />
                <div className="absolute bg-[#8d99a5] h-[60px] left-[32px] top-0 w-px" />
                <div className="absolute bg-[#424f5d] h-px left-[2px] top-0 w-[30px]" />
                <div className="absolute bg-[#424f5d] bottom-0 h-px left-[2px] w-[30px]" />
                <div className="absolute bg-[#8d99a5] h-[60px] left-[0.5px] top-0 w-[0.5px]" />
                <div className="absolute bg-[#8d99a5] h-[60px] left-[33px] top-0 w-[0.5px]" />
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[rgba(18,30,44,0.8)] content-stretch flex h-[16px] items-center leading-[0] not-italic overflow-clip pb-[2px] px-[3px] relative rounded-[6px] shrink-0 text-[#e8ebf0] text-[14px] text-center" data-name="compTracksScaleValue" style={barlowStyle}>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">27</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 w-[2px]">
                  <p className="leading-[14px]">.</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">2</p>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-semibold justify-center leading-[0] left-[8px] not-italic opacity-20 text-[#e8ebf0] text-[14px] top-1/2 whitespace-nowrap" style={{ ...interStyle, fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">4</p>
            </div>
          </div>

          {/* Module Item 6: МГК */}
          <div className={`bg-[rgba(255,255,255,0)] content-stretch flex items-start px-[44px] relative shrink-0 ${highlightedModule === "МГК" ? highlightClass : ""}`} data-name="Component Scheme Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex items-start overflow-clip px-[10px] relative shrink-0" data-name="Selected=False">
              <div className="h-[74px] relative shrink-0 w-[40px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 74">
                  <g clipPath="url(#clip0_2170_2223)" id="Frame 81512791">
                    <path d={svgPaths.p21942d80} fill="var(--fill-0, #192838)" id="Vector 1168" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467769" width="30" x="5" y="60" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467772" width="30" x="5" y="15" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467770" width="34" x="3" y="55" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467771" width="34" x="3" y="20" />
                    <path d={svgPaths.p3ff7b850} id="Vector 1167" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p10da4b00} id="Vector 1169" stroke="var(--stroke-0, #8D99A5)" strokeWidth="0.5" />
                    <path d={svgPaths.p15d94500} fill="var(--fill-0, #1F2D3D)" id="Vector 1157" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p1786cf00} fill="var(--fill-0, #1F2D3D)" id="Vector 1158" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p1b2f0500} fill="var(--fill-0, #1F2D3D)" id="Vector 1159" stroke="var(--stroke-0, #8D99A5)" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467767" width="30" x="5" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467768" width="30" x="5" y="73" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2170_2223">
                      <rect fill="white" height="74" width="40" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[rgba(18,30,44,0.8)] content-stretch flex h-[16px] items-center leading-[0] not-italic overflow-clip pb-[2px] px-[3px] relative rounded-[6px] shrink-0 text-[#e8ebf0] text-[14px] text-center" data-name="compTracksScaleValue" style={barlowStyle}>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">19</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 w-[2px]">
                  <p className="leading-[14px]">.</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 whitespace-nowrap">
                  <p className="leading-[14px]">6</p>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-semibold justify-center leading-[0] left-[8px] not-italic opacity-20 text-[#e8ebf0] text-[14px] top-1/2 whitespace-nowrap" style={{ ...interStyle, fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">3</p>
            </div>
          </div>

          {/* Module Item 7: МИ */}
          <div className={`bg-[rgba(255,255,255,0)] content-stretch flex items-start px-[44px] relative shrink-0 ${highlightedModule === "МИ" ? highlightClass : ""}`} data-name="Component Scheme Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex items-start overflow-clip px-[10px] relative shrink-0" data-name="Selected=False">
              <div className="h-[100px] relative shrink-0 w-[40px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 100">
                  <g clipPath="url(#clip0_2170_2840)" id="Frame 81512793">
                    <path d={svgPaths.p34bacd00} fill="var(--fill-0, #192838)" id="Vector 1171" />
                    <g id="Rectangle 3467699">
                      <mask fill="white" id="path-2-inside-1_2170_2840">
                        <path d="M4 97H36V93H4V97Z" />
                      </mask>
                      <path d="M4 97H36V93H4V97Z" fill="var(--fill-0, #192838)" />
                      <path d={svgPaths.p3e3d8700} fill="var(--stroke-0, #424F5D)" mask="url(#path-2-inside-1_2170_2840)" />
                    </g>
                    <g id="Rectangle 3467700">
                      <mask fill="white" id="path-4-inside-2_2170_2840">
                        <path d="M4 100H36V97H4V100Z" />
                      </mask>
                      <path d="M4 100H36V97H4V100Z" fill="var(--fill-0, #192838)" />
                      <path d={svgPaths.p37eb1c70} fill="var(--stroke-0, #424F5D)" mask="url(#path-4-inside-2_2170_2840)" />
                    </g>
                    <path d={svgPaths.p11daca80} fill="var(--fill-0, #424F5D)" id="Rectangle 3467741" />
                    <path d={svgPaths.p39c4bd80} fill="var(--fill-0, #424F5D)" id="Rectangle 3467742" />
                    <path d={svgPaths.p2c1ae170} fill="var(--fill-0, #424F5D)" id="Rectangle 3467743" />
                    <path d={svgPaths.p21ef6180} fill="var(--fill-0, #424F5D)" id="Rectangle 3467744" />
                    <path d={svgPaths.p21a0f280} fill="var(--fill-0, #424F5D)" id="Rectangle 3467745" />
                    <path d={svgPaths.pf61de50} fill="var(--fill-0, #424F5D)" id="Rectangle 3467746" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467764" width="30" x="5" y="7" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467765" width="30" x="5" y="31" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467766" width="30" x="5" y="51" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467767" width="30" x="5" y="65" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467768" width="32" x="4" y="68" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467769" width="32" x="4" y="92" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467770" width="30" x="5" y="96" />
                    <path d={svgPaths.p18c51d80} id="Vector 1170" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p55bf800} id="Vector 1172" stroke="var(--stroke-0, #8D99A5)" strokeWidth="0.5" />
                    <path d={svgPaths.p1c5d7b00} fill="var(--fill-0, #1F2D3D)" id="Vector 1157" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p16db1800} fill="var(--fill-0, #1F2D3D)" id="Vector 1158" stroke="var(--stroke-0, #8D99A5)" />
                    <path d={svgPaths.p25c6a040} fill="var(--fill-0, #1F2D3D)" id="Vector 1159" stroke="var(--stroke-0, #8D99A5)" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467763" width="30" x="5" />
                    <rect fill="var(--fill-0, #424F5D)" height="1" id="Rectangle 3467771" width="30" x="5" y="99" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2170_2840">
                      <rect fill="white" height="100" width="40" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[rgba(18,30,44,0.8)] content-stretch flex h-[16px] items-center overflow-clip pb-[2px] px-[3px] relative rounded-[6px] shrink-0" data-name="compTracksScaleValue" style={barlowStyle}>
                <div className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#e8ebf0] text-[14px] text-center whitespace-nowrap">
                  <p className="leading-[14px]">11</p>
                </div>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-semibold justify-center leading-[0] left-[8px] not-italic opacity-20 text-[#e8ebf0] text-[14px] top-1/2 whitespace-nowrap" style={{ ...interStyle, fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">2</p>
            </div>
          </div>

          {/* Drill Bit PDC - Bottom */}
          <div className="content-stretch flex items-start px-[44px] relative shrink-0" data-name="Component Scheme Item">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
              <div className="absolute bg-[rgba(0,73,175,0.8)] inset-0 mix-blend-luminosity" />
              <div className="absolute bg-[rgba(0,73,175,0.8)] inset-0 mix-blend-color" />
            </div>
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-b border-solid border-t inset-0 pointer-events-none" />
            <div className="content-stretch flex flex-col items-start overflow-clip px-[5px] relative shrink-0" data-name="DrillBit_PDC">
              <div className="h-[46px] relative shrink-0 w-[50px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 46">
                  <g clipPath="url(#clip0_2170_4088)" id="Frame 81512773">
                    <path d={svgPaths.p3dc1c400} fill="var(--fill-0, #0A4390)" id="Vector" />
                    <path d={svgPaths.p2a474100} id="Vector_2" stroke="var(--stroke-0, #105FBB)" />
                    <path d={svgPaths.p263eb210} id="Vector_3" stroke="var(--stroke-0, #209EF8)" />
                    <path d={svgPaths.p2a509c80} id="Vector_4" stroke="var(--stroke-0, #209EF8)" strokeWidth="0.5" />
                    <g id="Ellipse 746">
                      <path d={svgPaths.p3998c300} fill="var(--fill-0, #0A4390)" />
                      <path d={svgPaths.p1bbe4d00} fill="var(--fill-0, #0A4390)" />
                      <path d={svgPaths.p25a74600} stroke="var(--stroke-0, #209EF8)" />
                    </g>
                    <g id="Ellipse 749">
                      <path d={svgPaths.p2add0900} fill="var(--fill-0, #0A4390)" />
                      <path d={svgPaths.p1da1040} stroke="var(--stroke-0, #209EF8)" />
                    </g>
                    <g id="Ellipse 750">
                      <path d={svgPaths.p414460} fill="var(--fill-0, #0A4390)" />
                      <path d={svgPaths.p3f8f24c0} stroke="var(--stroke-0, #209EF8)" />
                    </g>
                    <g id="Ellipse 751">
                      <path d={svgPaths.p30664a00} fill="var(--fill-0, #0A4390)" />
                      <path d={svgPaths.p2ca51800} stroke="var(--stroke-0, #209EF8)" />
                    </g>
                    <g id="Ellipse 748">
                      <path d={svgPaths.p2e332b00} fill="var(--fill-0, #0A4390)" />
                      <path d={svgPaths.p144d3100} fill="var(--fill-0, #0A4390)" />
                      <path d={svgPaths.p5af6480} stroke="var(--stroke-0, #209EF8)" />
                    </g>
                    <circle cx="43" cy="31" fill="var(--fill-0, #0A4390)" id="Ellipse 752" r="2" stroke="var(--stroke-0, #209EF8)" />
                    <circle cx="42" cy="36" fill="var(--fill-0, #0A4390)" id="Ellipse 753" r="2" stroke="var(--stroke-0, #209EF8)" />
                    <circle cx="40.5" cy="40.5" fill="var(--fill-0, #0A4390)" id="Ellipse 754" r="1.5" stroke="var(--stroke-0, #209EF8)" />
                    <rect fill="var(--fill-0, #105FBB)" height="1" id="Rectangle 3467780" width="30" x="10" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2170_4088">
                      <rect fill="white" height="46" width="50" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-semibold justify-center leading-[0] left-[8px] not-italic text-[#209ef8] text-[14px] top-[calc(50%+0.5px)] whitespace-nowrap" style={{ ...interStyle, fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">1</p>
            </div>
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[#209ef8] flex-[1_0_0] min-h-px min-w-px relative rounded-[6px]" data-name="compTracksScaleValue">
                <div className="overflow-clip rounded-[inherit] size-full">
                  <div className="content-stretch flex h-full items-baseline not-italic pb-[2px] px-[3px] relative text-[#0c1521] text-[14px] text-center" style={barlowStyle}>
                    <p className="leading-[14px] relative shrink-0 whitespace-nowrap">2</p>
                    <p className="h-[13px] leading-[15px] relative shrink-0 w-[2px]">.</p>
                    <p className="leading-[14px] relative shrink-0 whitespace-nowrap">45</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#192838] h-[24px] relative rounded-br-[2px] shrink-0 w-full" data-name="Bottom Item">
            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.08)] border-solid border-t inset-0 pointer-events-none rounded-br-[2px]" />
            <div className="absolute content-stretch flex flex-col h-[16px] items-start justify-center left-[-8px] top-[-8px]" data-name="Widget / Linear / Time-Depth / Values">
              <div className="bg-[#209ef8] flex-[1_0_0] min-h-px min-w-px relative rounded-[6px]" data-name="compTracksScaleValue">
                <div className="overflow-clip rounded-[inherit] size-full">
                  <div className="content-stretch flex h-full items-baseline pb-[2px] px-[3px] relative">
                    <p className="leading-[14px] not-italic relative shrink-0 text-[#0c1521] text-[14px] text-center whitespace-nowrap" style={barlowStyle}>0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 flex items-center justify-center right-0 top-0 w-[14px]">
            <div className="-scale-y-100 flex-none h-[814px] w-[14px]">
              <div className="overflow-clip relative rounded-br-[7px] rounded-tr-[7px] size-full" data-name="Scroll Bar / Scroll Bar">
                <div className="absolute h-[133px] right-[4px] top-[16px] w-[2px]" data-name="Thumb">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 133">
                    <path clipRule="evenodd" d={svgPaths.p2689c00} fill="var(--fill-0, white)" fillOpacity="0.5442" fillRule="evenodd" id="Thumb" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
