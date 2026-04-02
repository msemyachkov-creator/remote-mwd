function Frame() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-baseline not-italic relative shrink-0 whitespace-nowrap z-[3]">
      <p className="leading-[24px] relative shrink-0 text-[18px] text-[rgba(191,201,212,0.7)]" style={{ fontFeatureSettings: "'fina', 'init'" }}>
        Bit Hydraulics
      </p>
      <p className="leading-[20px] relative shrink-0 text-[14px] text-[rgba(191,201,212,0.55)]" style={{ fontFeatureSettings: "'rclt' 0" }}>
        kg/m3
      </p>
    </div>
  );
}

export default function WidgetNumeralSimple() {
  return (
    <div className="content-stretch flex flex-col isolate items-start justify-center px-[6px] py-[4px] relative size-full" data-name="Widget / Numeral / Simple">
      <Frame />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[36px] not-italic relative shrink-0 text-[28px] text-[rgba(191,201,212,0.35)] tracking-[-1px] whitespace-nowrap z-[2]">—</p>
      <div className="absolute bg-[#121e2c] inset-0 rounded-[2px] z-[1]" data-name="Widget / Surface" />
    </div>
  );
}