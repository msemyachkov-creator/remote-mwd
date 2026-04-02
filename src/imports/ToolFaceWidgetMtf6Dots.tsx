import svgPaths from "./svg-s32pthsjds";

function DragName() {
  return (
    <div className="content-stretch flex items-center pr-[2px] relative shrink-0 z-[3]" data-name="Drag + Name">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Re Order Move Dots / Drag">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[6px] left-1/2 top-1/2 w-[10px]" data-name="Shape">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
            <path d={svgPaths.pb1a1380} fill="var(--fill-0, #223B4E)" fillOpacity="0.8" id="Shape" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start pl-[4px] pr-[2px] relative shrink-0" data-name="Widget Name">
        <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🟩 Text">
          <div className="content-stretch flex isolate items-start relative shrink-0" data-name="Style=default, Type=primary, digits=false">
            <p className="font-['Inter_Display:SemiBold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#030507] text-[12px] whitespace-nowrap z-[2]">Toolface</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0 z-[2]" data-name="Actions">
      <div className="content-stretch flex items-center justify-center relative rounded-[4px] shrink-0" data-name="🟩 buttonIcon">
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Arrow Maximize">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[12px] top-1/2" data-name="Shape">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
              <g id="Shape">
                <path d={svgPaths.p2b457f80} fill="var(--fill-0, #B1C9DD)" fillOpacity="0.8" />
                <path d={svgPaths.p1010b800} fill="var(--fill-0, #B1C9DD)" fillOpacity="0.8" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center justify-center relative rounded-[4px] shrink-0" data-name="🟩 buttonIcon">
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Delete">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[12px] left-1/2 top-1/2 w-[11px]" data-name="Shape">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
              <path d={svgPaths.p307182c0} fill="var(--fill-0, #FA8A7F)" fillOpacity="0.8" id="Shape" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function RibbonTabsLineDashboardTabs() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex h-[20px] isolate items-center left-[calc(50%-0.5px)] opacity-0 px-[4px] top-[-20px]" data-name="Ribbon / Tabs Line / Dashboard Tabs">
      <DragName />
      <Actions />
      <div className="absolute inset-0 z-[1]" data-name="Widget Header Surface">
        <div className="absolute bottom-[-1px] h-[5px] left-[-4px] w-[110px]" data-name="Bottom Surface">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 121 5">
            <path d={svgPaths.p2fc10280} fill="var(--fill-0, #F0F5FA)" id="Bottom Surface" />
          </svg>
        </div>
        <div className="absolute bg-[#f0f5fa] inset-[0_0_4px_0] rounded-tl-[8px] rounded-tr-[8px]" data-name="Top Surface" />
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[2px] items-start leading-[14px] relative shrink-0 text-center">
      <p className="relative shrink-0 text-[rgba(191,201,212,0.7)]">for</p>
      <p className="relative shrink-0 text-[#e8ebf0]">45.2 ft</p>
    </div>
  );
}

function StatusDistance() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative whitespace-nowrap" data-name="Status & Distance">
      <div className="flex flex-col justify-center leading-[0] min-w-full overflow-hidden relative shrink-0 text-[#1c9344] text-ellipsis w-[min-content]">
        <p className="leading-[14px] overflow-hidden">Slide Oscilate Drilling</p>
      </div>
      <Frame13 />
    </div>
  );
}

function Md() {
  return (
    <div className="content-stretch flex gap-[2px] items-start justify-end relative shrink-0 w-full" data-name="MD">
      <p className="relative shrink-0 text-[rgba(191,201,212,0.7)] whitespace-nowrap">MD</p>
      <p className="relative shrink-0 text-[#e8ebf0] text-right w-[53px]">276.7 ft</p>
    </div>
  );
}

function Incl() {
  return (
    <div className="content-stretch flex gap-[2px] items-start justify-end relative shrink-0 w-full" data-name="INCL">
      <p className="flex-[1_0_0] min-h-px min-w-px relative text-[rgba(191,201,212,0.7)]">INCL</p>
      <p className="relative shrink-0 text-[#e8ebf0] text-right w-[32px]">4.32°</p>
    </div>
  );
}

function Az() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0 w-full" data-name="AZ">
      <p className="flex-[1_0_0] min-h-px min-w-px relative text-[rgba(191,201,212,0.7)]">AZ GN</p>
      <p className="relative shrink-0 text-[#e8ebf0] text-right w-[32px]">311.0°</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[14px] relative shrink-0 w-[72px]">
      <Md />
      <Incl />
      <Az />
    </div>
  );
}

function Info() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-start mb-[-18px] not-italic relative shrink-0 text-[10px] w-full" data-name="Info">
      <StatusDistance />
      <Frame12 />
    </div>
  );
}

function WithoutLine() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 6L0.5 14" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 274L0.5 282" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine1() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 6L0.5 14" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 274L0.5 282" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine2() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 6L0.5 14" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 274L0.5 282" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine3() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 6L0.5 14" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 274L0.5 282" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine4() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 6L0.5 14" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 274L0.5 282" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine5() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 6L0.5 14" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 274L0.5 282" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine6() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine7() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine8() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine9() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine10() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine11() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine12() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine13() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine14() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine15() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine16() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine17() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine18() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine19() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine20() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine21() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine22() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine23() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine24() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine25() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine26() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine27() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine28() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WithoutLine29() {
  return (
    <div className="h-[288px] relative w-0" data-name="Without Line">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 288">
          <g id="Without Line">
            <path d="M0.5 8L0.5 12" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.5 276L0.5 280" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] text-center whitespace-nowrap">
        <p className="leading-[14px]">300</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[248px] relative shrink-0 w-0">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 248">
          <g id="Frame 81513084">
            <path d="M0.500004 3.59813e-06L0.5 96" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.500004 152L0.5 248" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] text-center whitespace-nowrap">
        <p className="leading-[14px]">120</p>
      </div>
    </div>
  );
}

function WithLine() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-center relative w-[36px]" data-name="With Line">
      <Frame19 />
      <Frame />
      <Frame17 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] text-center whitespace-nowrap">
        <p className="leading-[14px]">330</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[248px] relative shrink-0 w-0">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 248">
          <g id="Frame 81513084">
            <path d="M0.500004 3.59813e-06L0.5 96" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.500004 152L0.5 248" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] text-center whitespace-nowrap">
        <p className="leading-[14px]">150</p>
      </div>
    </div>
  );
}

function WithLine1() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-center relative w-[36px]" data-name="With Line">
      <Frame20 />
      <Frame1 />
      <Frame18 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex flex-col items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] text-center whitespace-nowrap">
        <p className="leading-[14px]">30</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[248px] relative shrink-0 w-0">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 248">
          <g id="Frame 81513084">
            <path d="M0.500004 3.59813e-06L0.5 96" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.500004 152L0.5 248" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] text-center whitespace-nowrap">
        <p className="leading-[14px]">210</p>
      </div>
    </div>
  );
}

function WithLine2() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-center relative w-[36px]" data-name="With Line">
      <Frame16 />
      <Frame2 />
      <Frame21 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex flex-col items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] text-center whitespace-nowrap">
        <p className="leading-[14px]">60</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[248px] relative shrink-0 w-0">
      <div className="absolute inset-[0_-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 248">
          <g id="Frame 81513084">
            <path d="M0.500004 3.59813e-06L0.5 96" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
            <path d="M0.500004 152L0.5 248" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] text-center whitespace-nowrap">
        <p className="leading-[14px]">240</p>
      </div>
    </div>
  );
}

function WithLine3() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-center relative w-[36px]" data-name="With Line">
      <Frame22 />
      <Frame3 />
      <Frame23 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#e8ebf0] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">0</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[248px] relative shrink-0 w-px">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 248">
        <g id="Frame 81513084">
          <path d="M0.500004 3.59813e-06L0.5 96" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          <path d="M0.500004 152L0.5 248" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
        </g>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#e8ebf0] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">180</p>
      </div>
    </div>
  );
}

function WithLine4() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col gap-[2px] items-center left-1/2 top-1/2 w-[40px]" data-name="With Line">
      <Frame14 />
      <Frame4 />
      <Frame15 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#e8ebf0] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">270</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[248px] relative shrink-0 w-px">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 248">
        <g id="Frame 81513084">
          <path d="M0.500004 3.59813e-06L0.5 96" id="Vector 953" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
          <path d="M0.500004 152L0.5 248" id="Vector 954" stroke="var(--stroke-0, white)" strokeOpacity="0.12" />
        </g>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[#1f2d3d] content-stretch flex items-center px-[2px] relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#e8ebf0] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">90</p>
      </div>
    </div>
  );
}

function WithLine5() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative w-[40px]" data-name="With Line">
      <Frame24 />
      <Frame5 />
      <Frame25 />
    </div>
  );
}

function RoundGrid() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-1/2 top-1/2" data-name="Round Grid">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[278.187px] items-center justify-center left-1/2 top-1/2 w-[74.54px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-15 flex-none">
          <WithoutLine />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[203.647px] top-1/2" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-45 flex-none">
          <WithoutLine1 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[74.54px] items-center justify-center left-1/2 top-1/2 w-[278.187px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-75">
          <WithoutLine2 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[203.647px] top-1/2" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-45">
          <WithoutLine3 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[278.187px] items-center justify-center left-1/2 top-1/2 w-[74.54px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-15">
          <WithoutLine4 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[74.54px] items-center justify-center left-1/2 top-1/2 w-[278.187px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-105">
          <WithoutLine5 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[270.631px] items-center justify-center left-1/2 top-1/2 w-[98.502px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-20 flex-none">
          <WithoutLine6 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[98.502px] items-center justify-center left-1/2 top-1/2 w-[270.631px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-70">
          <WithoutLine7 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[261.017px] items-center justify-center left-1/2 top-1/2 w-[121.714px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-25">
          <WithoutLine8 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[121.714px] items-center justify-center left-1/2 top-1/2 w-[261.017px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-115">
          <WithoutLine9 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[261.017px] items-center justify-center left-1/2 top-1/2 w-[121.714px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-25 flex-none">
          <WithoutLine10 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[121.714px] items-center justify-center left-1/2 top-1/2 w-[261.017px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-65">
          <WithoutLine11 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[270.631px] items-center justify-center left-1/2 top-1/2 w-[98.502px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-20">
          <WithoutLine12 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[98.502px] items-center justify-center left-1/2 top-1/2 w-[270.631px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-110">
          <WithoutLine13 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[286.904px] items-center justify-center left-1/2 top-1/2 w-[25.101px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-5 flex-none">
          <WithoutLine14 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[25.101px] items-center justify-center left-1/2 top-1/2 w-[286.904px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-85">
          <WithoutLine15 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[220.621px] items-center justify-center left-1/2 top-1/2 w-[185.123px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-40">
          <WithoutLine16 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[185.123px] items-center justify-center left-1/2 top-1/2 w-[220.621px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-130">
          <WithoutLine17 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[283.625px] items-center justify-center left-1/2 top-1/2 w-[50.011px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-10 flex-none">
          <WithoutLine18 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[50.011px] items-center justify-center left-1/2 top-1/2 w-[283.625px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-80">
          <WithoutLine19 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[235.916px] items-center justify-center left-1/2 top-1/2 w-[165.19px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-35">
          <WithoutLine20 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[165.19px] items-center justify-center left-1/2 top-1/2 w-[235.916px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-125">
          <WithoutLine21 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[235.916px] items-center justify-center left-1/2 top-1/2 w-[165.19px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-35 flex-none">
          <WithoutLine22 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[165.19px] items-center justify-center left-1/2 top-1/2 w-[235.916px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-55">
          <WithoutLine23 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[283.625px] items-center justify-center left-1/2 top-1/2 w-[50.011px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-10">
          <WithoutLine24 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[50.011px] items-center justify-center left-1/2 top-1/2 w-[283.625px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-100">
          <WithoutLine25 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[220.621px] items-center justify-center left-1/2 top-1/2 w-[185.123px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-40 flex-none">
          <WithoutLine26 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[185.123px] items-center justify-center left-1/2 top-1/2 w-[220.621px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-50">
          <WithoutLine27 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[286.904px] items-center justify-center left-1/2 top-1/2 w-[25.101px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-5">
          <WithoutLine28 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[25.101px] items-center justify-center left-1/2 top-1/2 w-[286.904px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-95">
          <WithoutLine29 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[172.177px] items-center justify-center left-1/2 top-1/2 w-[262.219px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "57" } as React.CSSProperties}>
        <div className="-rotate-60 flex-none">
          <WithLine />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[262.219px] items-center justify-center left-1/2 top-1/2 w-[172.177px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "57" } as React.CSSProperties}>
        <div className="-rotate-30 flex-none">
          <WithLine1 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[262.219px] items-center justify-center left-1/2 top-1/2 w-[172.177px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "57" } as React.CSSProperties}>
        <div className="flex-none rotate-30">
          <WithLine2 />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[172.177px] items-center justify-center left-1/2 top-1/2 w-[262.219px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "57" } as React.CSSProperties}>
        <div className="flex-none rotate-60">
          <WithLine3 />
        </div>
      </div>
      <WithLine4 />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[40px] items-center justify-center left-1/2 top-1/2 w-[284px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "57" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <WithLine5 />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 size-[12px]">
      <div className="absolute inset-[-8.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <g id="Frame 81513092">
            <rect height="13" rx="6.5" stroke="var(--stroke-0, #192838)" width="13" x="0.5" y="0.5" />
            <circle cx="7" cy="7" fill="var(--fill-0, #209EF8)" id="Ellipse" r="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Component1EditAngle() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 rounded-[999px] size-[216px] top-1/2" data-name="1 (Edit Angle)">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-[-0.5px] pointer-events-none rounded-[999.5px]" />
      <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center left-[-6px] top-1/2" data-name="Dot">
        <Frame6 />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 size-[10.4px]">
      <div className="absolute inset-[-9.62%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.4 12.4">
          <g id="Frame 81513093">
            <rect height="11.4" rx="5.7" stroke="var(--stroke-0, #192838)" width="11.4" x="0.5" y="0.5" />
            <circle cx="6.2" cy="6.2" fill="var(--fill-0, #080F18)" id="Ellipse" r="4.7" stroke="var(--stroke-0, #E8EBF0)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Component2EditAngle() {
  return (
    <div className="relative rounded-[999px] size-[184px]" data-name="2 (Edit Angle)">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-[-0.5px] pointer-events-none rounded-[999.5px]" />
      <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center left-[-6px] size-[12px] top-1/2" data-name="Dot">
        <Frame7 />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[8.8px]">
      <div className="absolute inset-[-11.36%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.8 10.8">
          <g id="Frame 81513094">
            <rect height="9.8" rx="4.9" stroke="var(--stroke-0, #192838)" width="9.8" x="0.5" y="0.5" />
            <circle cx="5.4" cy="5.4" fill="var(--fill-0, #080F18)" id="Ellipse" r="3.9" stroke="var(--stroke-0, #E8EBF0)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Component3EditAngle() {
  return (
    <div className="relative rounded-[999px] size-[152px]" data-name="3 (Edit Angle)">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-[-0.5px] pointer-events-none rounded-[999.5px]" />
      <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center left-[-6px] size-[12px] top-1/2" data-name="Dot">
        <Frame8 />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 size-[7.2px]">
      <div className="absolute inset-[-13.89%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.2 9.2">
          <g id="Frame 81513095">
            <rect height="8.2" rx="4.1" stroke="var(--stroke-0, #192838)" width="8.2" x="0.5" y="0.5" />
            <circle cx="4.6" cy="4.6" fill="var(--fill-0, #080F18)" id="Ellipse" r="3.1" stroke="var(--stroke-0, #E8EBF0)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Component4EditAngle() {
  return (
    <div className="relative rounded-[999px] size-[120px]" data-name="4 (Edit Angle)">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-[-0.5px] pointer-events-none rounded-[999.5px]" />
      <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center left-[-6px] size-[12px] top-1/2" data-name="Dot">
        <Frame9 />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative shrink-0 size-[5.6px]">
      <div className="absolute inset-[-17.86%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.6 7.6">
          <g id="Frame 81513096">
            <rect height="6.6" rx="3.3" stroke="var(--stroke-0, #192838)" width="6.6" x="0.5" y="0.5" />
            <circle cx="3.8" cy="3.8" fill="var(--fill-0, #080F18)" id="Ellipse" r="2.3" stroke="var(--stroke-0, #E8EBF0)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Component5EditAngle() {
  return (
    <div className="relative rounded-[999px] size-[88px]" data-name="5 (Edit Angle)">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-[-0.5px] pointer-events-none rounded-[999.5px]" />
      <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center left-[-6px] size-[12px] top-1/2" data-name="Dot">
        <Frame10 />
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative shrink-0 size-[4px]">
      <div className="absolute inset-[-25%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <g id="Frame 81513097">
            <rect height="5" rx="2.5" stroke="var(--stroke-0, #192838)" width="5" x="0.5" y="0.5" />
            <circle cx="3" cy="3" fill="var(--fill-0, #080F18)" id="Ellipse" r="1.5" stroke="var(--stroke-0, #E8EBF0)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Component6EditAngle() {
  return (
    <div className="bg-[#1f2d3d] relative rounded-[999px] size-[56px]" data-name="6 (Edit Angle)">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-[-0.5px] pointer-events-none rounded-[999.5px]" />
      <div className="-translate-y-1/2 absolute content-stretch flex items-center justify-center left-[-6px] size-[12px] top-1/2" data-name="Dot">
        <Frame11 />
      </div>
    </div>
  );
}

function Dots() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-1/2 top-1/2" data-name="Dots">
      <Component1EditAngle />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[225.353px] top-1/2" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-15">
          <Component2EditAngle />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[171.675px] top-1/2" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-8">
          <Component3EditAngle />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[143.919px] top-1/2" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-13">
          <Component4EditAngle />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[98.069px] top-1/2" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-7">
          <Component5EditAngle />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center left-1/2 size-[64.874px] top-1/2" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-10">
          <Component6EditAngle />
        </div>
      </div>
    </div>
  );
}

function Value() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-center left-1/2 not-italic pb-[2px] text-center top-1/2" data-name="Value">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#e8ebf0] text-[12px] w-[56px]">MTF</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#209ef8] text-[14px] w-[56px]" style={{ fontFeatureSettings: "'fina', 'init'" }}>
        <span className="leading-[20px]">270.0</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px]">°</span>
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[10px] text-[rgba(191,201,212,0.55)] w-[56px]">00:56</p>
    </div>
  );
}

function Visualization() {
  return (
    <div className="bg-[#192838] relative rounded-[999px] shrink-0 size-[288px]" data-name="Visualization">
      <div aria-hidden="true" className="absolute border-20 border-[#1f2d3d] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <RoundGrid />
      <Dots />
      <Value />
    </div>
  );
}

function VisualizationContainer() {
  return (
    <div className="content-stretch flex items-center mb-[-18px] pb-[4px] px-[4px] relative shrink-0" data-name="Visualization Container">
      <Visualization />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[18px] relative shrink-0 w-full" data-name="Content">
      <Info />
      <VisualizationContainer />
    </div>
  );
}

export default function ToolFaceWidgetMtf6Dots() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[2px] size-full" data-name="ToolFace Widget / MTF / 6 dots">
      <div className="absolute bg-[#f0f5fa] inset-0 rounded-[4px]" data-name="Widget / Surface v4">
        <RibbonTabsLineDashboardTabs />
        <div className="absolute bg-[#f0f5fa] inset-0 rounded-[4px]" data-name="Surface" />
      </div>
      <Content />
    </div>
  );
}