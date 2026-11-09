import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center p-6"><section className="card max-w-lg p-8 text-center">
    <p className="text-sm font-bold text-brand">404</p><h1 className="mt-2 text-2xl font-extrabold">Không tìm thấy nội dung</h1>
    <p className="mt-3 text-slate-500">Có thể nội dung đã bị xóa hoặc bạn không có quyền truy cập.</p>
    <Link href="/dashboard" className="btn-primary mt-5">Về tổng quan</Link>
  </section></main>;
}
