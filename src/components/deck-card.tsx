import Link from "next/link";
import { DeckForm } from "@/components/deck-form";
import { DeckDeleteForm } from "@/components/deck-delete-form";

export function DeckCard({
  deck
}: {
  deck: { id: string; name: string; description: string; _count: { words: number } };
}) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/decks/${deck.id}`} className="min-w-0 flex-1">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-xl text-brand">▤</div>
          <h2 className="mt-4 truncate text-lg font-extrabold hover:text-brand">{deck.name}</h2>
          <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{deck.description || "Chưa có mô tả."}</p>
        </Link>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{deck._count.words} từ</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link href={`/decks/${deck.id}`} className="text-sm font-bold text-brand">Mở bộ từ →</Link>
        <details className="relative">
          <summary className="cursor-pointer list-none text-sm font-bold text-slate-500">Tùy chọn ▾</summary>
          <div className="absolute right-0 z-10 mt-2 w-[min(90vw,360px)] rounded-2xl bg-white p-4 shadow-soft">
            <DeckForm deck={deck} />
            <DeckDeleteForm deckId={deck.id} deckName={deck.name} />
          </div>
        </details>
      </div>
    </article>
  );
}
