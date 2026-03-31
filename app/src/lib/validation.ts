export const POST_MAX_LENGTH = 280;
export const REPLY_MAX_LENGTH = 280;
export const BIO_MAX_LENGTH = 160;

export function validateTextWithinLimit(raw: string, maxLength: number): boolean {
  const value = raw.trim();
  if (!value) return false;
  return value.length <= maxLength;
}

export function canReplyTo(isParentPost: boolean): boolean {
  return isParentPost;
}

export function toggleLikeState(currentlyLiked: boolean): boolean {
  return !currentlyLiked;
}
