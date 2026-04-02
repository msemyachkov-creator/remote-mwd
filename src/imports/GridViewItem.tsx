export default function GridViewItem() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] content-stretch flex gap-[4px] isolate items-start p-[8px] relative rounded-[4px] size-full" data-name="Grid View Item">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] isolate items-start min-h-px min-w-px overflow-clip relative z-[2]" data-name="Grid View Item / Content">
        <div className="content-stretch flex items-center relative shrink-0 w-full z-[5]">
          <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0" data-name="Grid View Item / Title">
            <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#f8fafc] text-[14px] whitespace-nowrap" style={{ fontFeatureSettings: "'fina', 'init'" }}>
              <p className="leading-[20px]">Rig PD143</p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[16px] items-start leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.7)] whitespace-nowrap z-[3]" data-name="Depth">
          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0" data-name="Grid View Item / Depth Data">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0">Bit</p>
            <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[2px] items-start relative shrink-0 w-[64px]" data-name="Hole depth">
              <p className="relative shrink-0">9,879</p>
              <p className="relative shrink-0">ft</p>
            </div>
          </div>
          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0" data-name="Grid View Item / Depth Data">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0">Hole</p>
            <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[2px] items-start relative shrink-0 w-[53px]" data-name="Hole depth">
              <p className="relative shrink-0">23,568</p>
              <p className="relative shrink-0">ft</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 rounded-[4px] z-[1]" data-name="Grid View / Grid View Item">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[4px]" data-name="Base" />
      </div>
    </div>
  );
}