"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";
import type { FormState } from "@/lib/validation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  const registering = mode === "register";
  return (
    <div className="min-h-screen px-5 py-10 md:grid md:grid-cols-2 md:p-0">
      <section className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-14 text-white md:flex">
        <Link href="/" className="flex items-center gap-3 text-xl font-extrabold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">V</span> VocabFlow</Link>
        <div className="max-w-lg">
          <p className="mb-5 text-sm font-bold uppercase tracking-[.22em] text-indigo-100">Học đều, nhớ lâu</p>
          <h1 className="text-5xl font-extrabold leading-tight">Mỗi từ mới là một bước tiến.</h1>
          <p className="mt-6 text-lg leading-8 text-indigo-100">Tạo bộ từ của riêng bạn, luyện tập bằng flashcard và theo dõi hành trình học mỗi ngày.</p>
        </div>
        <p className="text-sm text-indigo-100">Học từ vựng theo cách của bạn.</p>
      </section>
      <section className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-9 flex items-center gap-3 text-xl font-extrabold md:hidden"><span className="brand-mark">V</span>VocabFlow</Link>
          <p className="text-sm font-bold uppercase tracking-widest text-brand">{registering ? "Bắt đầu miễn phí" : "Chào mừng trở lại"}</p>
          <h2 className="mt-3 text-3xl font-extrabold">{registering ? "Tạo tài khoản" : "Đăng nhập"}</h2>
          <p className="mt-2 text-slate-500">{registering ? "Lưu tiến độ học của bạn ở một nơi." : "Tiếp tục hành trình học từ vựng."}</p>
          <form action={formAction} className="mt-8 space-y-5">
            <label className="block text-sm font-bold">Email
              <input className="field mt-2" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="ban@email.com" />
            </label>
            <label className="block text-sm font-bold">Mật khẩu
              <input className="field mt-2" name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} required minLength={8} maxLength={72} placeholder="Tối thiểu 8 ký tự" />
            </label>
            {state.error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">{state.error}</p>}
            <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Đang xử lý..." : registering ? "Tạo tài khoản" : "Đăng nhập"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {registering ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
            <Link className="font-bold text-brand hover:underline" href={registering ? "/login" : "/register"}>{registering ? "Đăng nhập" : "Đăng ký"}</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
