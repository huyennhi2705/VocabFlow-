import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { QuizPlayer } from "@/components/quiz-player";

export default async function DeckQuizPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  const user = await requireUser();
  const deck = await db.deck.findFirst({ where: { id: deckId, userId: user.id }, select: { id: true, name: true } });
  if (!deck) notFound();
  return <div className="mx-auto max-w-4xl">
    <Link href="/quiz" className="text-sm font-bold text-brand">← Tất cả quiz</Link>
    <header className="mb-7 mt-4"><p className="text-sm font-bold text-brand">QUIZ THEO BỘ TỪ</p><h1 className="mt-2 text-3xl font-extrabold">{deck.name}</h1><p className="mt-2 text-slate-500">Chọn nghĩa tiếng Việt chính xác nhất.</p></header>
    <QuizPlayer deckId={deck.id} />
  </div>;
}
