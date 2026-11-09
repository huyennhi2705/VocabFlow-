export function DashboardCards({
  total,
  remembered,
  notRemembered,
  percentage
}: {
  total: number;
  remembered: number;
  notRemembered: number;
  percentage: number;
}) {
  const cards = [
    { label: "Tổng số từ", value: total, icon: "Aa", color: "bg-violet-50 text-violet-700" },
    { label: "Đã nhớ", value: remembered, icon: "✓", color: "bg-emerald-50 text-emerald-700" },
    { label: "Chưa nhớ", value: notRemembered, icon: "↻", color: "bg-amber-50 text-amber-700" },
    { label: "Tiến độ ghi nhớ", value: `${percentage}%`, icon: "↗", color: "bg-sky-50 text-sky-700" }
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article className="card p-5" key={card.label}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <span className={`grid h-10 w-10 place-items-center rounded-xl font-extrabold ${card.color}`}>{card.icon}</span>
          </div>
          <p className="mt-4 text-3xl font-extrabold">{card.value}</p>
          {card.label === "Tiến độ ghi nhớ" && <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand" style={{ width: `${percentage}%` }} /></div>}
        </article>
      ))}
    </div>
  );
}
