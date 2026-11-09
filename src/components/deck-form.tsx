"use client";

import { useActionState } from "react";
import { saveDeckAction } from "@/app/actions/decks";
import type { FormState } from "@/lib/validation";

export function DeckForm({ deck }: { deck?: { id: string; name: string; description: string } }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveDeckAction, {});
  return (
    <form action={action} className="card space-y-4 p-5">
      {deck && <input type="hidden" name="id" value={deck.id} />}
      <label className="block text-sm font-bold">Tên bộ từ
        <input className="field mt-2" name="name" required maxLength={80} defaultValue={deck?.name} placeholder="Ví dụ: TOEIC – Từ vựng công sở" />
      </label>
      <label className="block text-sm font-bold">Mô tả
        <textarea className="field mt-2 min-h-24 resize-y" name="description" maxLength={240} defaultValue={deck?.description} placeholder="Mục tiêu hoặc chủ đề của bộ từ..." />
      </label>
      {state.error && <p role="alert" className="text-sm text-rose-700">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-emerald-700">{state.success}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? "Đang lưu..." : deck ? "Lưu thay đổi" : "Tạo bộ từ"}</button>
    </form>
  );
}
