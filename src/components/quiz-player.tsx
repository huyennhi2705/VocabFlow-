"use client";

import { useState } from "react";
import { answerQuiz, startQuiz } from "@/app/actions/quiz";

type PublicQuestion = { term: string; options: string[] };

export function QuizPlayer({ deckId }: { deckId?: string }) {
  const [attemptId, setAttemptId] = useState("");
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; correctAnswer: string; selectedIndex: number } | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function begin() {
    setLoading(true);
    setError("");
    const result = await startQuiz(deckId);
    setLoading(false);
    if (!result.ok) return setError(result.error);
    setAttemptId(result.attemptId);
    setQuestions(result.questions);
    setIndex(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
  }

  async function choose(optionIndex: number) {
    if (!attemptId || feedback) return;
    const result = await answerQuiz(attemptId, index, optionIndex);
    if (!result.ok) return setError(result.error);
    setError("");
    setFeedback({ correct: result.correct, correctAnswer: result.correctAnswer, selectedIndex: optionIndex });
    setScore(result.correctAnswers);
    if (result.completed) setFinished(true);
  }

  function next() {
    setFeedback(null);
    setIndex((value) => value + 1);
  }

  if (!questions.length || finished) {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-12">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-violet-50 text-3xl">{finished ? "🏆" : "✦"}</div>
        <h2 className="mt-5 text-2xl font-extrabold">{finished ? "Hoàn thành quiz!" : "Sẵn sàng kiểm tra?"}</h2>
        <p className="mt-2 text-slate-500">{finished ? `Bạn trả lời đúng ${score}/${questions.length} câu (${Math.round(score / questions.length * 100)}%).` : "10 câu hỏi ngẫu nhiên giúp bạn ôn lại nghĩa của từ."}</p>
        {error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
        <button disabled={loading} onClick={begin} className="btn-primary mt-6">{loading ? "Đang tạo quiz..." : finished ? "Làm lại" : "Bắt đầu quiz"}</button>
      </div>
    );
  }

  const question = questions[index];
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex justify-between text-sm font-semibold text-slate-500"><span>Câu {index + 1} / {questions.length}</span><span>Đúng: {score}</span></div>
      <div className="card p-6 sm:p-9">
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(index / questions.length) * 100}%` }} /></div>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-brand">Chọn nghĩa đúng</p>
        <h2 className="mb-7 mt-3 text-center text-3xl font-extrabold">{question.term}</h2>
        <div className="grid gap-3">
          {question.options.map((option, optionIndex) => (
            <button key={`${option}-${optionIndex}`} disabled={!!feedback} onClick={() => choose(optionIndex)} className={`rounded-xl border p-4 text-left font-semibold transition ${
              feedback?.correctAnswer === option ? "border-emerald-300 bg-emerald-50 text-emerald-800" :
              feedback && feedback.selectedIndex === optionIndex && !feedback.correct ? "border-rose-300 bg-rose-50 text-rose-800" :
              feedback ? "border-slate-100 bg-slate-50 text-slate-400" : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
            }`}>
              <span className="mr-3 inline-grid h-7 w-7 place-items-center rounded-lg bg-white text-xs text-slate-500">{String.fromCharCode(65 + optionIndex)}</span>{option}
            </button>
          ))}
        </div>
        {feedback && <div role="status" className={`mt-5 rounded-xl p-4 text-sm font-semibold ${feedback.correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
          {feedback.correct ? "Chính xác! ✨" : `Chưa đúng. Đáp án là: ${feedback.correctAnswer}`}
          <button onClick={next} className="btn-primary ml-4 mt-3 sm:mt-0">{index === questions.length - 1 ? "Xem kết quả" : "Câu tiếp →"}</button>
        </div>}
        {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      </div>
    </div>
  );
}
