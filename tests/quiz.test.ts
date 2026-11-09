import { describe, expect, it } from "vitest";
import { makeQuiz } from "../src/lib/quiz";

const words = [
  { term: "apple", meaning: "quả táo" },
  { term: "book", meaning: "quyển sách" },
  { term: "cloud", meaning: "đám mây" },
  { term: "door", meaning: "cánh cửa" },
  { term: "engine", meaning: "động cơ" }
];

describe("makeQuiz", () => {
  it("creates four distinct choices with exactly one correct choice", () => {
    const quiz = makeQuiz(words, 3);
    expect(quiz).toHaveLength(3);
    for (const question of quiz) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.correctIndex]).toBe(words.find((word) => word.term === question.term)?.meaning);
    }
  });

  it("requires at least four distinct meanings", () => {
    expect(() => makeQuiz(words.slice(0, 3))).toThrow("ít nhất 4 từ");
  });

  it("does not use duplicate meanings as extra distractors", () => {
    expect(() => makeQuiz([...words.slice(0, 3), { term: "apple2", meaning: "QUẢ TÁO" }])).toThrow("ít nhất 4 từ");
  });
});
