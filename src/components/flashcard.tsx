"use client";

import { useState, useTransition } from "react";
import { setWordRemembered } from "@/app/actions/words";

type CardWord = { id: string; term: string; meaning: string; example: string; isRemembered: boolean };

export function Flashcard({ words }: { words: CardWord[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [items, setItems] = useState(words);
  const [saveError, setSaveError] = useState("");
  const [pending, startTransition] = useTransition();
  const current = items[index];

  if (!items.length) {
    return <div className="card p-10 text-center"><h2 className="text-xl font-bold">Chưa có thẻ để ôn</h2><p className="mt-2 text-slate-500">Hãy thêm từ vào bộ trước nhé.</p></div>;
  }

  function move(direction: number) {
    setFlipped(false);
    setIndex((currentIndex) => (currentIndex + direction + items.length) % items.length);
  }
  function mark(remembered: boolean) {
    startTransition(async () => {
      const result = await setWordRemembered(current.id, remembered);
      if ("error" in result) {
        setSaveError(result.error ?? "Không thể cập nhật trạng thái từ.");
        return;
      }
      setSaveError("");
      setItems((currentItems) => currentItems.map((item) => item.id === current.id ? { ...item, isRemembered: remembered } : item));
      move(1);
    });
  }

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-500">
        <span>Thẻ {index + 1} / {items.length}</span>
        <span>{current.isRemembered ? "✓ Đã nhớ" : "○ Chưa nhớ"}</span>
      </div>
      <button type="button" className="flashcard-scene block w-full text-left" aria-label="Lật flashcard" onClick={() => setFlipped((value) => !value)}>
        <span className={`flashcard-inner block ${flipped ? "flipped" : ""}`}>
          <span className="flashcard-face card bg-gradient-to-br from-white to-indigo-50 text-center">
            <span className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-brand">Từ tiếng Anh</span>
            <span className="text-4xl font-extrabold sm:text-5xl">{current.term}</span>
            <span className="mt-7 text-sm text-slate-400">Chạm để lật thẻ</span>
          </span>
          <span className="flashcard-face flashcard-back card bg-gradient-to-br from-violet-50 to-white text-center">
            <span className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-brand">Nghĩa tiếng Việt</span>
            <span className="text-3xl font-extrabold">{current.meaning}</span>
            {current.example && <span className="mt-5 max-w-lg text-sm italic leading-6 text-slate-500">{current.example}</span>}
          </span>
        </span>
      </button>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button className="btn-secondary" onClick={() => move(-1)}>← Trước</button>
        <button disabled={pending} className="btn-secondary border-amber-200 text-amber-700" onClick={() => mark(false)}>Chưa nhớ</button>
        <button disabled={pending} className="btn-primary bg-emerald-600 hover:bg-emerald-700" onClick={() => mark(true)}>Đã nhớ ✓</button>
        <button className="btn-secondary" onClick={() => move(1)}>Tiếp →</button>
      </div>
      {saveError && <p role="alert" className="mt-3 text-center text-sm text-rose-700">{saveError}</p>}
      {pending && <p className="mt-3 text-center text-xs text-slate-400">Đang lưu trạng thái...</p>}
    </section>
  );
}
