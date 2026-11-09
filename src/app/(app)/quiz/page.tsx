import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { QuizPlayer } from "@/components/quiz-player";
import Link from "next/link";

export default async function QuizPage() {
  const user = await requireUser();
  const decks = await db.deck.findMany({ where: { userId: user.id }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  return <div className="mx-auto max-w-4xl">
    <header className="mb-7"><p className="text-sm font-bold text-brand">KIỂM TRA GHI NHỚ</p><h1 className="mt-2 text-3xl font-extrabold">Quiz trắc nghiệm</h1><p className="mt-2 text-slate-500">Chọn nghĩa tiếng Việt chính xác nhất.</p></header>
    <div className="mb-6 flex flex-wrap gap-2"><span className="self-center text-sm font-bold text-slate-500">Phạm vi:</span><Link href="/quiz" className="btn-secondary">Tất cả từ</Link>{decks.map((deck) => <Link key={deck.id} href={`/quiz/${deck.id}`} className="btn-secondary">{deck.name}</Link>)}</div>
    <QuizPlayer />
  </div>;
}
