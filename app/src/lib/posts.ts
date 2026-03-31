import { prisma } from "@/lib/prisma";
import { logInfo, logWarn, logError } from "@/lib/logger";
import { POST_MAX_LENGTH, REPLY_MAX_LENGTH } from "@/lib/validation";

type Result<T> = { success: true; data: T } | { success: false; error: string };

export async function createPost(
  userId: number,
  contentRaw: string,
): Promise<Result<{ id: number }>> {
  const content = contentRaw.trim();

  if (!content) {
    logWarn("create_post", {
      action: "create_post",
      userId,
      success: false,
      errorCode: "VALIDATION_ERROR",
    });
    return { success: false, error: "Post content is required" };
  }

  if (content.length > POST_MAX_LENGTH) {
    logWarn("create_post", {
      action: "create_post",
      userId,
      success: false,
      errorCode: "CONTENT_TOO_LONG",
    });
    return { success: false, error: "Post is too long" };
  }

  try {
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content,
      },
      select: { id: true },
    });

    logInfo("create_post", {
      action: "create_post",
      userId,
      targetId: post.id,
      success: true,
      affectedCount: 1,
    });

    return { success: true, data: { id: post.id } };
  } catch {
    logError("create_post", {
      action: "create_post",
      userId,
      success: false,
      errorCode: "DB_ERROR",
    });
    return { success: false, error: "Failed to create post" };
  }
}

export async function createReply(
  userId: number,
  postId: number,
  contentRaw: string,
): Promise<Result<{ id: number }>> {
  const content = contentRaw.trim();

  if (!content) {
    logWarn("create_reply", {
      action: "create_reply",
      userId,
      success: false,
      errorCode: "VALIDATION_ERROR",
    });
    return { success: false, error: "Reply content is required" };
  }

  if (content.length > REPLY_MAX_LENGTH) {
    logWarn("create_reply", {
      action: "create_reply",
      userId,
      success: false,
      errorCode: "CONTENT_TOO_LONG",
    });
    return { success: false, error: "Reply is too long" };
  }

  const parentPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!parentPost) {
    logWarn("create_reply", {
      action: "create_reply",
      userId,
      targetId: postId,
      success: false,
      errorCode: "PARENT_NOT_FOUND",
    });
    return { success: false, error: "Post not found" };
  }

  try {
    const reply = await prisma.reply.create({
      data: {
        authorId: userId,
        postId,
        content,
      },
      select: { id: true },
    });

    logInfo("create_reply", {
      action: "create_reply",
      userId,
      targetId: reply.id,
      success: true,
      affectedCount: 1,
    });

    return { success: true, data: { id: reply.id } };
  } catch {
    logError("create_reply", {
      action: "create_reply",
      userId,
      targetId: postId,
      success: false,
      errorCode: "DB_ERROR",
    });
    return { success: false, error: "Failed to create reply" };
  }
}

export async function likePost(
  userId: number,
  postId: number,
): Promise<Result<null>> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      logWarn("like_post", {
        action: "like_post",
        userId,
        targetId: postId,
        success: false,
        errorCode: "POST_NOT_FOUND",
      });
      return { success: false, error: "Post not found" };
    }

    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    logInfo("like_post", {
      action: "like_post",
      userId,
      targetId: postId,
      success: true,
      affectedCount: 1,
    });

    return { success: true, data: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown like error";

    if (message.includes("Unique constraint failed")) {
      // Already liked; treat as idempotent success.
      logInfo("like_post", {
        action: "like_post",
        userId,
        targetId: postId,
        success: true,
        affectedCount: 0,
      });
      return { success: true, data: null };
    }

    logError("like_post", {
      action: "like_post",
      userId,
      targetId: postId,
      success: false,
      errorCode: "DB_ERROR",
    });

    return { success: false, error: "Failed to like post" };
  }
}

export async function unlikePost(
  userId: number,
  postId: number,
): Promise<Result<null>> {
  try {
    const result = await prisma.like.deleteMany({
      where: {
        userId,
        postId,
      },
    });

    logInfo("unlike_post", {
      action: "unlike_post",
      userId,
      targetId: postId,
      success: true,
      affectedCount: result.count,
    });

    return { success: true, data: null };
  } catch {
    logError("unlike_post", {
      action: "unlike_post",
      userId,
      targetId: postId,
      success: false,
      errorCode: "DB_ERROR",
    });
    return { success: false, error: "Failed to unlike post" };
  }
}

export type FeedReply = {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    id: number;
    username: string;
    displayName: string | null;
    avatarKey: string | null;
  };
};

export type FeedItem = {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    id: number;
    username: string;
    displayName: string | null;
    avatarKey: string | null;
  };
  likeCount: number;
  replyCount: number;
  likedByCurrentUser: boolean;
  replies: FeedReply[];
};


export async function getGlobalFeed(
  viewerUserId: number | null,
  limit = 50,
  before?: Date,
): Promise<Result<FeedItem[]>> {
  try {
    const posts = await prisma.post.findMany({
      where: before
        ? {
          createdAt: { lt: before },
        }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarKey: true,
          },
        },
        _count: {
          select: { likes: true, replies: true },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarKey: true,
              },
            },
          },
        },
        likes: viewerUserId
          ? {
              where: { userId: viewerUserId },
              select: { id: true },
            }
          : false,
      },
    });

    const items: FeedItem[] = posts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      author: post.author,
      likeCount: post._count.likes,
      replyCount: post._count.replies,
      likedByCurrentUser: viewerUserId
        ? post.likes.length > 0
        : false,
      replies: post.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        author: reply.author,
      })),
    }));

    logInfo("refresh_feed", {
      action: "refresh_feed",
      userId: viewerUserId ?? undefined,
      success: true,
      resultCount: items.length,
    });

    return { success: true, data: items };
  } catch {
    logError("refresh_feed", {
      action: "refresh_feed",
      userId: viewerUserId ?? undefined,
      success: false,
      errorCode: "DB_ERROR",
    });
    return { success: false, error: "Failed to load feed" };
  }
}

export async function getUserFeed(
  profileUsername: string,
  viewerUserId: number | null,
  limit = 50,
  before?: Date,
): Promise<
  Result<{
    profileUser: {
      id: number;
      username: string;
      displayName: string | null;
      bio: string | null;
      avatarKey: string | null;
    };
    items: FeedItem[];
  }>
> {
  try {
    const profileUser = await prisma.user.findUnique({
      where: { username: profileUsername },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarKey: true,
      },
    });

    if (!profileUser) {
      logWarn("refresh_profile", {
        action: "refresh_profile",
        userId: viewerUserId ?? undefined,
        targetId: profileUsername,
        success: false,
        errorCode: "PROFILE_NOT_FOUND",
      });
      return { success: false, error: "User not found" };
    }

    const posts = await prisma.post.findMany({
      where: before
        ? { authorId: profileUser.id, createdAt: { lt: before } }
        : { authorId: profileUser.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarKey: true,
          },
        },
        _count: {
          select: { likes: true, replies: true },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarKey: true,
              },
            },
          },
        },
        likes: viewerUserId
          ? {
              where: { userId: viewerUserId },
              select: { id: true },
            }
          : false,
      },
    });

    const items: FeedItem[] = posts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      author: post.author,
      likeCount: post._count.likes,
      replyCount: post._count.replies,
      likedByCurrentUser: viewerUserId
        ? post.likes.length > 0
        : false,
      replies: post.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        author: reply.author,
      })),
    }));

    logInfo("refresh_profile", {
      action: "refresh_profile",
      userId: viewerUserId ?? undefined,
      targetId: profileUser.id,
      success: true,
      resultCount: items.length,
    });

    return { success: true, data: { profileUser, items } };
  } catch {
    logError("refresh_profile", {
      action: "refresh_profile",
      userId: viewerUserId ?? undefined,
      targetId: profileUsername,
      success: false,
      errorCode: "DB_ERROR",
    });
    return { success: false, error: "Failed to load profile feed" };
  }
}
