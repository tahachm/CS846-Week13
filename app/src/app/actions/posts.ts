"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/auth";
import {
  createPost,
  createReply,
  likePost,
  unlikePost,
} from "@/lib/posts";

export async function createPostAction(content: string) {
  const user = await requireCurrentUser();

  const result = await createPost(user.id, content);

  if (result.success) {
    // Revalidate the home feed; optimistic UI will already show the post.
    revalidatePath("/");
  }

  return result;
}

export async function createReplyAction(postId: number, content: string) {
  const user = await requireCurrentUser();

  const result = await createReply(user.id, postId, content);

  if (result.success) {
    revalidatePath("/");
    // Profile feeds using the same posts also benefit from this.
  }

  return result;
}

export async function likePostAction(postId: number) {
  const user = await requireCurrentUser();

  const result = await likePost(user.id, postId);

  if (result.success) {
    revalidatePath("/");
  }

  return result;
}

export async function unlikePostAction(postId: number) {
  const user = await requireCurrentUser();

  const result = await unlikePost(user.id, postId);

  if (result.success) {
    revalidatePath("/");
  }

  return result;
}
