// ─── Topbar used by every admin page ─────────────────────────────────────────
export default function AdminTopbar({ title, subtitle, actions }) {
  return (
    <div className="h-14 border-b border-[#e8e8e8] flex items-center justify-between px-7 bg-white sticky top-0 z-[5]">
      <div>
        <h1 className="text-[15px] font-semibold text-[#111]">{title}</h1>
        {subtitle && <p className="text-[12px] text-[#888] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
