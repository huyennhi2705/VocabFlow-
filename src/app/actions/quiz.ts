"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { makeQuiz, type QuizQuestion } from "@/lib/quiz";

type StartQuizResult =
  | { ok: false; error: string }
  | { ok: true; attemptId: string; questions: Array<{ term: string; options: string[] }> };

type AnswerQuizResult =
  | { ok: false; error: string }
  | {
      ok: true;
      correct: boolean;
      correctAnswer: string;
      correctAnswers: number;
      totalQuestions: number;
      completed: boolean;
    };

export async function startQuiz(deckId?: string): Promise<StartQuizResult> {
  const user = await requireUser();
  const words = await db.word.findMany({
    where: deckId ? { deckId, deck: { userId: user.id } } : { deck: { userId: user.id } },
    select: { term: true, meaning: true }
  });
  if (deckId && !(await db.deck.findFirst({ where: { id: deckId, userId: user.id }, select: { id: true } }))) {
    return { ok: false, error: "Không tìm thấy bộ từ." };
  }
  let questions: QuizQuestion[];
  try {
    questions = makeQuiz(words);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Không thể tạo quiz." };
  }
  const attempt = await db.quizAttempt.create({
    data: {
      userId: user.id,
      deckId: deckId || null,
      questionsJson: JSON.stringify(questions),
      answersJson: JSON.stringify(Array.from({ length: questions.length }, () => null)),
      totalQuestions: questions.length
    }
  });
  return {
    ok: true,
    attemptId: attempt.id,
    questions: questions.map(({ term, options }) => ({ term, options }))
  };
}

export async function answerQuiz(attemptId: string, questionIndex: number, optionIndex: number): Promise<AnswerQuizResult> {
  const user = await requireUser();
  const attempt = await db.quizAttempt.findFirst({ where: { id: attemptId, userId: user.id } });
  if (!attempt || attempt.completedAt) return { ok: false, error: "Bài quiz không còn mở." };
  const questions = JSON.parse(attempt.questionsJson) as QuizQuestion[];
  const answers = JSON.parse(attempt.answersJson) as Array<number | null>;
  if (!Number.isInteger(questionIndex) || !Number.isInteger(optionIndex) || questionIndex < 0 || questionIndex >= questions.length) {
    return { ok: false, error: "Câu trả lời không hợp lệ." };
  }
  const nextUnanswered = answers.findIndex((answer) => answer === null);
  if (
    optionIndex < 0 ||
    optionIndex >= questions[questionIndex].options.length ||
    answers[questionIndex] !== null ||
    questionIndex !== nextUnanswered
  ) {
    return { ok: false, error: "Câu hỏi này đã được trả lời hoặc đáp án không hợp lệ." };
  }
  answers[questionIndex] = optionIndex;
  const correctAnswers = answers.reduce<number>(
    (total, answer, index) => total + (answer === questions[index].correctIndex ? 1 : 0),
    0
  );
  const completed = answers.length === questions.length && answers.every((answer) => answer !== null && answer !== undefined);
  await db.quizAttempt.update({
    where: { id: attemptId },
    data: {
      answersJson: JSON.stringify(answers),
      correctAnswers,
      completedAt: completed ? new Date() : null
    }
  });
  revalidatePath("/dashboard");
  return {
    ok: true,
    correct: optionIndex === questions[questionIndex].correctIndex,
    correctAnswer: questions[questionIndex].options[questions[questionIndex].correctIndex],
    correctAnswers,
    totalQuestions: questions.length,
    completed
  };
}
