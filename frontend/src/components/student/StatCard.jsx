// ─── Stat card — used on the student dashboard ───────────────────────────────
export default function StatCard({ num, label, tag, tagColor = "text-[#22c55e]" }) {
  return (
    <div className="border border-[#e8e8e8] rounded-[10px] p-[18px] hover:border-[#ccc] hover:shadow-sm transition-all">
      <div className="text-[28px] font-bold font-mono leading-none mb-1">{num}</div>
      <div className="text-[12px] text-[#888] font-medium">{label}</div>
      {tag && <div className={`mt-2.5 text-[11px] font-semibold ${tagColor}`}>{tag}</div>}
    </div>
  );
}
