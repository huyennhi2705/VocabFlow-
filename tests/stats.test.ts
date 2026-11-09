import { describe, expect, it } from "vitest";
import { calculateQuizRate, lastSevenDays } from "../src/lib/stats";

describe("dashboard statistics", () => {
  it("calculates weighted quiz accuracy from answered questions", () => {
    expect(calculateQuizRate([
      { correctAnswers: 1, totalQuestions: 2 },
      { correctAnswers: 8, totalQuestions: 10 }
    ])).toBe(75);
  });

  it("returns zero when no quiz questions have been answered", () => {
    expect(calculateQuizRate([])).toBe(0);
  });

  it("returns seven consecutive UTC days", () => {
    const range = lastSevenDays(new Date("2026-11-08T12:00:00Z"));
    expect(range).toHaveLength(7);
    expect(range[0].date.toISOString()).toBe("2026-11-02T00:00:00.000Z");
    expect(range[6].next.toISOString()).toBe("2026-11-09T00:00:00.000Z");
  });
});
