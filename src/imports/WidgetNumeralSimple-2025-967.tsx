function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-baseline relative shrink-0 z-[3]">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#e8ebf0] text-[14px] whitespace-nowrap" style={{ fontFeatureSettings: "'rclt' 0" }}>
        Bit Hydraulics
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(191,201,212,0.7)] whitespace-nowrap">kg/m3</p>
      <div className="flex flex-row items-baseline self-stretch">
        <div className="content-stretch flex h-full items-center justify-end px-[2px] relative rounded-[2px] shrink-0 w-[11px]" data-name="Widget / Numeral / Time-Depth">
          <div aria-hidden="true" className="absolute bg-[rgba(29,43,58,0.95)] inset-0 mix-blend-luminosity pointer-events-none rounded-[2px]" />
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(191,201,212,0.7)] w-[7px]">
            <p className="leading-[14px]">T</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WidgetNumeralSimple() {
  return (
    <div className="content-stretch flex flex-col isolate items-start justify-center px-[6px] py-[4px] relative size-full" data-name="Widget / Numeral / Simple">
      <Frame />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#a0ff8a] text-[18px] whitespace-nowrap z-[2]" style={{ fontFeatureSettings: "'fina', 'init'" }}>
        17,582.09
      </p>
      <div className="absolute bg-[#121e2c] inset-0 rounded-[2px] z-[1]" data-name="Widget / Surface" />
    </div>
  );
}