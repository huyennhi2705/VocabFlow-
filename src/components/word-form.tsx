"use client";

import { useActionState } from "react";
import { saveWordAction } from "@/app/actions/words";
import type { FormState } from "@/lib/validation";

export function WordForm({
  deckId,
  word
}: {
  deckId: string;
  word?: { id: string; term: string; meaning: string; example: string; isRemembered: boolean };
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveWordAction, {});
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="deckId" value={deckId} />
      {word && <input type="hidden" name="id" value={word.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" name="term" required maxLength={100} defaultValue={word?.term} placeholder="Từ tiếng Anh" aria-label="Từ tiếng Anh" />
        <input className="field" name="meaning" required maxLength={240} defaultValue={word?.meaning} placeholder="Nghĩa tiếng Việt" aria-label="Nghĩa tiếng Việt" />
      </div>
      <input className="field" name="example" maxLength={500} defaultValue={word?.example} placeholder="Ví dụ (không bắt buộc)" aria-label="Ví dụ" />
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" name="isRemembered" value="true" defaultChecked={word?.isRemembered} />
        Đã nhớ
      </label>
      {state.error && <p role="alert" className="text-sm text-rose-700">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-emerald-700">{state.success}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? "Đang lưu..." : word ? "Cập nhật từ" : "Thêm từ"}</button>
    </form>
  );
}
