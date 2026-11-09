import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { WordForm } from "@/components/word-form";
import { WordList } from "@/components/word-list";

export default async function DeckDetailPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  const user = await requireUser();
  const deck = await db.deck.findFirst({
    where: { id: deckId, userId: user.id },
    include: { words: { orderBy: { createdAt: "desc" } } }
  });
  if (!deck) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/decks" className="text-sm font-bold text-brand">← Tất cả bộ từ</Link>
      <header className="mb-7 mt-4 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-bold text-brand">BỘ TỪ VỰNG</p><h1 className="mt-2 text-3xl font-extrabold">{deck.name}</h1><p className="mt-2 text-slate-500">{deck.description || "Chưa có mô tả."} · {deck.words.length} từ</p></div>
        <div className="flex gap-2"><Link className="btn-secondary" href={`/study/${deck.id}`}>Flashcard</Link><Link className="btn-primary" href={`/quiz/${deck.id}`}>Làm quiz</Link></div>
      </header>
      <section className="card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-extrabold">Thêm từ mới</h2>
        <WordForm deckId={deck.id} />
      </section>
      <WordList deckId={deck.id} words={deck.words} />
    </div>
  );
}
