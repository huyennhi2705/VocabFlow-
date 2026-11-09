"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-screen place-items-center p-6"><section className="card max-w-lg p-8 text-center">
    <h1 className="text-2xl font-extrabold">Đã xảy ra lỗi</h1>
    <p className="mt-3 text-slate-500">Ứng dụng chưa thể hoàn thành thao tác. Vui lòng thử lại.</p>
    <button className="btn-primary mt-5" onClick={reset}>Thử lại</button>
  </section></main>;
}
