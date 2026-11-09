"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deckSchema, type FormState } from "@/lib/validation";

export async function saveDeckAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = deckSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description")
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Thông tin bộ từ chưa hợp lệ." };
  try {
    if (id) {
      const result = await db.deck.updateMany({
        where: { id, userId: user.id },
        data: parsed.data
      });
      if (!result.count) return { error: "Không tìm thấy bộ từ." };
    } else {
      await db.deck.create({ data: { ...parsed.data, userId: user.id } });
    }
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return { error: "Bạn đã có bộ từ cùng tên." };
    }
    throw error;
  }
  revalidatePath("/decks");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/decks/${id}`);
  return { success: id ? "Đã cập nhật bộ từ." : "Đã tạo bộ từ." };
}

export async function deleteDeckAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await db.deck.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/decks");
  revalidatePath("/dashboard");
  redirect("/decks");
}
