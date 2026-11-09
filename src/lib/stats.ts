export function lastSevenDays(now = new Date()) {
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(now);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (6 - offset));
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + 1);
    return { date, next };
  });
}

export function calculateQuizRate(attempts: Array<{ correctAnswers: number; totalQuestions: number }>) {
  const totals = attempts.reduce(
    (result, attempt) => ({
      correct: result.correct + attempt.correctAnswers,
      questions: result.questions + attempt.totalQuestions
    }),
    { correct: 0, questions: 0 }
  );
  return totals.questions === 0 ? 0 : Math.round((totals.correct / totals.questions) * 100);
}
