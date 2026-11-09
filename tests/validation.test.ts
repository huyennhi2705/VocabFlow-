import { describe, expect, it } from "vitest";
import { deckSchema, registerSchema, wordSchema } from "../src/lib/validation";

describe("form validation", () => {
  it("rejects malformed registration email and short passwords", () => {
    expect(registerSchema.safeParse({ email: "not-an-email", password: "short" }).success).toBe(false);
  });

  it("requires a non-empty deck name", () => {
    expect(deckSchema.safeParse({ name: "  " }).success).toBe(false);
  });

  it("requires both word and meaning", () => {
    expect(wordSchema.safeParse({ deckId: "deck1", term: " ", meaning: "" }).success).toBe(false);
  });
});
