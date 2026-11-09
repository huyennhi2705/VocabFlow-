"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { wordSchema, type FormState } from "@/lib/validation";

function isUniqueError(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}

export async function saveWordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = wordSchema.safeParse({
    deckId: formData.get("deckId"),
    term: formData.get("term"),
    meaning: formData.get("meaning"),
    example: formData.get("example"),
    isRemembered: formData.get("isRemembered") ?? "false"
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Thông tin từ chưa hợp lệ." };
  const { deckId, term, meaning, example, isRemembered } = parsed.data;
  const deck = await db.deck.findFirst({ where: { id: deckId, userId: user.id }, select: { id: true } });
  if (!deck) return { error: "Không tìm thấy bộ từ." };

  try {
    if (id) {
      const result = await db.word.updateMany({
        where: { id, deckId },
        data: { term, normalizedTerm: term.toLocaleLowerCase(), meaning, example, isRemembered: isRemembered === "true" }
      });
      if (!result.count) return { error: "Không tìm thấy từ cần cập nhật." };
    } else {
      await db.word.create({
        data: {
          deckId,
          term,
          normalizedTerm: term.toLocaleLowerCase(),
          meaning,
          example,
          isRemembered: isRemembered === "true"
        }
      });
    }
  } catch (error) {
    if (isUniqueError(error)) return { error: "Từ này đã có trong bộ. Hãy kiểm tra từ/cách viết." };
    throw error;
  }
  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/dashboard");
  return { success: id ? "Đã cập nhật từ." : "Đã thêm từ." };
}

export async function deleteWordAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const deckId = String(formData.get("deckId") ?? "");
  await db.word.deleteMany({ where: { id, deckId, deck: { userId: user.id } } });
  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/dashboard");
}

export async function setWordRemembered(wordId: string, isRemembered: boolean) {
  const user = await requireUser();
  const word = await db.word.findFirst({ where: { id: wordId, deck: { userId: user.id } }, select: { deckId: true } });
  if (!word) return { error: "Không tìm thấy từ." };
  await db.word.update({ where: { id: wordId }, data: { isRemembered } });
  revalidatePath(`/decks/${word.deckId}`);
  revalidatePath("/dashboard");
  return { success: true };
}
