import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Flashcard } from "@/components/flashcard";

export default async function StudyPage() {
  const user = await requireUser();
  const [words, decks] = await Promise.all([
    db.word.findMany({ where: { deck: { userId: user.id } }, orderBy: { createdAt: "desc" } }),
    db.deck.findMany({ where: { userId: user.id }, orderBy: { name: "asc" }, select: { id: true, name: true } })
  ]);
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-7"><p className="text-sm font-bold text-brand">ÔN TẬP CHỦ ĐỘNG</p><h1 className="mt-2 text-3xl font-extrabold">Flashcard</h1><p className="mt-2 text-slate-500">Chọn bộ từ để tập trung, hoặc ôn tất cả từ của bạn.</p></header>
      <div className="mb-6 flex flex-wrap gap-2"><span className="self-center text-sm font-bold text-slate-500">Chọn bộ:</span><Link className="btn-secondary" href="/study">Tất cả từ</Link>{decks.map((deck) => <Link key={deck.id} className="btn-secondary" href={`/study/${deck.id}`}>{deck.name}</Link>)}</div>
      <Flashcard words={words} />
    </div>
  );
}
