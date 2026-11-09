"use client";

import { deleteDeckAction } from "@/app/actions/decks";

export function DeckDeleteForm({ deckId, deckName }: { deckId: string; deckName: string }) {
  return (
    <form action={deleteDeckAction} className="mt-3" onSubmit={(event) => {
      if (!window.confirm(`Xóa bộ "${deckName}" và tất cả từ bên trong?`)) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={deckId} />
      <button className="btn-danger">Xóa bộ từ</button>
    </form>
  );
}
