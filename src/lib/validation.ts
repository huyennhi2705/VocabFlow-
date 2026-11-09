import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email("Vui lòng nhập email hợp lệ.").max(254),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự.").max(72)
});

export const deckSchema = z.object({
  name: z.string().trim().min(1, "Tên bộ từ không được để trống.").max(80),
  description: z.string().trim().max(240, "Mô tả tối đa 240 ký tự.").optional().default("")
});

export const wordSchema = z.object({
  deckId: z.string().min(1),
  term: z.string().trim().min(1, "Từ tiếng Anh không được để trống.").max(100),
  meaning: z.string().trim().min(1, "Nghĩa tiếng Việt không được để trống.").max(240),
  example: z.string().trim().max(500, "Ví dụ tối đa 500 ký tự.").optional().default(""),
  isRemembered: z.enum(["true", "false"]).optional().default("false")
});

export type FormState = { error?: string; success?: string };
