export type QuizQuestion = {
  term: string;
  options: string[];
  correctIndex: number;
};

export type QuizWord = { term: string; meaning: string };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  // Fisher–Yates avoids biased ordering while shuffling both questions and answer options.
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function makeQuiz(words: QuizWord[], requestedCount = 10): QuizQuestion[] {
  const uniqueMeanings = new Map<string, QuizWord>();
  for (const word of words) {
    const normalizedMeaning = word.meaning.trim().toLocaleLowerCase();
    if (normalizedMeaning) uniqueMeanings.set(normalizedMeaning, word);
  }
  const candidates = [...uniqueMeanings.values()];
  if (candidates.length < 4) {
    throw new Error("Cần ít nhất 4 từ có nghĩa khác nhau để bắt đầu quiz.");
  }

  return shuffle(candidates)
    .slice(0, Math.min(requestedCount, candidates.length))
    .map((word) => {
      const distractors = shuffle(
        candidates.filter((candidate) => candidate.meaning.trim().toLocaleLowerCase() !== word.meaning.trim().toLocaleLowerCase())
      ).slice(0, 3);
      const options = shuffle([word.meaning, ...distractors.map((item) => item.meaning)]);
      return { term: word.term, options, correctIndex: options.indexOf(word.meaning) };
    });
}
