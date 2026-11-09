"use client";

import { useMemo, useState } from "react";
import { deleteWordAction } from "@/app/actions/words";
import { WordForm } from "@/components/word-form";

type WordItem = {
  id: string;
  deckId: string;
  term: string;
  meaning: string;
  example: string;
  isRemembered: boolean;
};

export function WordList({ deckId, words }: { deckId: string; words: WordItem[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => words.filter((word) => {
    const matchesText = `${word.term} ${word.meaning}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim());
    const matchesStatus = filter === "all" || (filter === "remembered" ? word.isRemembered : !word.isRemembered);
    return matchesText && matchesStatus;
  }), [filter, query, words]);

  return (
    <section className="mt-7">
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_190px]">
        <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm từ hoặc nghĩa..." aria-label="Tìm từ hoặc nghĩa" />
        <select className="field" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Lọc trạng thái">
          <option value="all">Tất cả trạng thái</option>
          <option value="remembered">Đã nhớ</option>
          <option value="new">Chưa nhớ</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">{words.length ? "Không tìm thấy từ phù hợp." : "Bộ từ chưa có từ nào. Thêm từ đầu tiên nhé!"}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((word) => (
            <article key={word.id} className="card p-4 sm:p-5">
              <details>
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-extrabold">{word.term}</h3>
                    <p className="mt-1 text-sm text-slate-500">{word.meaning}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${word.isRemembered ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {word.isRemembered ? "Đã nhớ" : "Chưa nhớ"}
                  </span>
                </summary>
                {word.example && <p className="mt-3 border-l-2 border-violet-200 pl-3 text-sm italic text-slate-500">{word.example}</p>}
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <WordForm deckId={deckId} word={word} />
                  <form action={deleteWordAction} className="mt-3">
                    <input type="hidden" name="id" value={word.id} />
                    <input type="hidden" name="deckId" value={deckId} />
                    <button className="btn-danger" formAction={async (formData) => {
                      if (window.confirm(`Xóa từ "${word.term}"?`)) await deleteWordAction(formData);
                    }}>Xóa từ</button>
                  </form>
                </div>
              </details>
            </article>
          ))}
        </div>
      )}
      <p className="mt-3 text-right text-xs text-slate-400">{filtered.length} / {words.length} từ</p>
    </section>
  );
}
