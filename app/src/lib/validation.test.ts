import { BIO_MAX_LENGTH, POST_MAX_LENGTH, REPLY_MAX_LENGTH, canReplyTo, toggleLikeState, validateTextWithinLimit } from "@/lib/validation";

function makeString(char: string, length: number): string {
  return char.repeat(length);
}

describe("validateTextWithinLimit - posts", () => {
  it("rejects empty or whitespace-only input", () => {
    expect(validateTextWithinLimit("", POST_MAX_LENGTH)).toBe(false);
    expect(validateTextWithinLimit("   ", POST_MAX_LENGTH)).toBe(false);
  });

  it("accepts lengths <= POST_MAX_LENGTH", () => {
    expect(validateTextWithinLimit(makeString("a", 1), POST_MAX_LENGTH)).toBe(true);
    expect(validateTextWithinLimit(makeString("a", POST_MAX_LENGTH), POST_MAX_LENGTH)).toBe(true);
  });

  it("rejects lengths > POST_MAX_LENGTH", () => {
    expect(validateTextWithinLimit(makeString("a", POST_MAX_LENGTH + 1), POST_MAX_LENGTH)).toBe(false);
  });

  it("handles multibyte characters near the limit", () => {
    const nearLimit = makeString("😀", Math.floor(POST_MAX_LENGTH / 2));
    expect(validateTextWithinLimit(nearLimit, POST_MAX_LENGTH)).toBe(true);
  });
});

describe("validateTextWithinLimit - replies and bios", () => {
  it("honors REPLY_MAX_LENGTH and BIO_MAX_LENGTH boundaries", () => {
    const replyAtLimit = makeString("r", REPLY_MAX_LENGTH);
    const replyOverLimit = makeString("r", REPLY_MAX_LENGTH + 1);
    expect(validateTextWithinLimit(replyAtLimit, REPLY_MAX_LENGTH)).toBe(true);
    expect(validateTextWithinLimit(replyOverLimit, REPLY_MAX_LENGTH)).toBe(false);

    const bioAtLimit = makeString("b", BIO_MAX_LENGTH);
    const bioOverLimit = makeString("b", BIO_MAX_LENGTH + 1);
    expect(validateTextWithinLimit(bioAtLimit, BIO_MAX_LENGTH)).toBe(true);
    expect(validateTextWithinLimit(bioOverLimit, BIO_MAX_LENGTH)).toBe(false);
  });
});

describe("reply depth rules", () => {
  it("allows replies to top-level posts", () => {
    expect(canReplyTo(true)).toBe(true);
  });

  it("rejects replies to replies", () => {
    expect(canReplyTo(false)).toBe(false);
  });
});

describe("like/unlike behavior", () => {
  it("does not allow more than one like for a given toggle cycle", () => {
    const first = toggleLikeState(false);
    const second = toggleLikeState(first);
    expect(first).toBe(true);
    expect(second).toBe(false);
  });

  it("toggling twice restores original state", () => {
    const original = false;
    const afterFirstToggle = toggleLikeState(original);
    const afterSecondToggle = toggleLikeState(afterFirstToggle);
    expect(afterSecondToggle).toBe(original);
  });
});
