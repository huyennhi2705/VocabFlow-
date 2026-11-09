import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Flashcard } from "@/components/flashcard";

export default async function DeckStudyPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  const user = await requireUser();
  const deck = await db.deck.findFirst({ where: { id: deckId, userId: user.id }, include: { words: { orderBy: { createdAt: "desc" } } } });
  if (!deck) notFound();
  return <div className="mx-auto max-w-4xl">
    <Link href="/study" className="text-sm font-bold text-brand">← Ôn tập</Link>
    <header className="mb-7 mt-4"><p className="text-sm font-bold text-brand">FLASHCARD</p><h1 className="mt-2 text-3xl font-extrabold">{deck.name}</h1><p className="mt-2 text-slate-500">{deck.words.length} thẻ trong bộ này</p></header>
    <Flashcard words={deck.words} />
  </div>;
}
