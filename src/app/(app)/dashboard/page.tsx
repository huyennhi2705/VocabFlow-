import Link from "next/link";
import { getDashboardStats } from "@/app/actions/stats";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { DashboardCards } from "@/components/dashboard-cards";
import { WeeklyChart } from "@/components/weekly-chart";

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, decks] = await Promise.all([
    getDashboardStats(),
    db.deck.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 3, include: { _count: { select: { words: true } } } })
  ]);
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold text-brand">TỔNG QUAN HỌC TẬP</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Học tốt nhé 👋</h1><p className="mt-2 text-slate-500">Mỗi ngày một chút, bạn sẽ tiến bộ hơn.</p></div>
        <Link href="/decks" className="btn-primary">+ Tạo bộ từ</Link>
      </header>
      <DashboardCards total={stats.total} remembered={stats.remembered} notRemembered={stats.notRemembered} percentage={stats.percentage} />
      <section className="card mt-6 p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-extrabold">Từ mới trong tuần</h2><p className="mt-1 text-sm text-slate-500">7 ngày gần nhất</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-brand">MỤC TIÊU: HỌC ĐỀU</span></div>
        <WeeklyChart data={stats.weekly} />
      </section>
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-extrabold">Bộ từ gần đây</h2><Link href="/decks" className="text-sm font-bold text-brand">Xem tất cả →</Link></div>
        {decks.length ? <div className="grid gap-4 md:grid-cols-3">{decks.map((deck) => <Link key={deck.id} href={`/decks/${deck.id}`} className="card p-5 transition hover:-translate-y-1"><span className="text-2xl">📚</span><h3 className="mt-3 font-extrabold">{deck.name}</h3><p className="mt-1 text-sm text-slate-500">{deck._count.words} từ</p></Link>)}</div> : <div className="card p-6 text-slate-500">Bạn chưa có bộ từ. <Link className="font-bold text-brand" href="/decks">Tạo bộ đầu tiên →</Link></div>}
      </section>
    </div>
  );
}
