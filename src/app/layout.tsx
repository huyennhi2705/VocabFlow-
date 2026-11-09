import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VocabFlow — Học từ vựng có hệ thống",
  description: "Lưu từ mới, ôn tập bằng flashcard và quiz, theo dõi tiến độ học tiếng Anh."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
