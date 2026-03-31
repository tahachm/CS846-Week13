"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { FeedItem, FeedReply } from "@/lib/posts";
import {
  createPostAction,
  createReplyAction,
  likePostAction,
  unlikePostAction,
} from "@/app/actions/posts";
import { Avatar } from "@/app/components/Avatar";
import { POST_MAX_LENGTH, REPLY_MAX_LENGTH } from "@/lib/validation";

type SessionUser = {
  id: number;
  username: string;
};

type FeedClientProps = {
  initialItems: FeedItem[];
  currentUser: SessionUser | null;
  context: "global" | "profile";
  profileUser?: {
    id: number;
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarKey: string | null;
  };
};

type OptimisticPost = FeedItem & { isOptimistic?: boolean };

type PostErrorState = {
  postError?: string;
  replyError?: string;
};

export function FeedClient({ initialItems, currentUser, context, profileUser }: FeedClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [postErrors, setPostErrors] = useState<Record<number | string, PostErrorState>>({});

  const [items, setItems] = useState<OptimisticPost[]>(initialItems);

  const handleManualRefresh = () => {
    router.refresh();
  };

  const handleCreatePost = (content: string) => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const trimmed = content.trim();
    if (!trimmed || trimmed.length > POST_MAX_LENGTH) {
      return;
    }

    const optimisticPost: OptimisticPost = {
      id: -1,
      content: trimmed,
      createdAt: new Date(),
      author: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.username,
        avatarKey: null,
      },
      likeCount: 0,
      replyCount: 0,
      likedByCurrentUser: false,
      replies: [],
      isOptimistic: true,
    };

    setGlobalError(null);
    setItems((prev) => [optimisticPost, ...prev]);

    startTransition(async () => {
      const result = await createPostAction(trimmed);
      if (!result.success) {
        setItems((prev) => prev.slice(1));
        setGlobalError(result.error ?? "Failed to create post");
        return;
      }

      // Let server revalidation refresh the real post; remove optimistic entry.
      setItems((prev) => prev.slice(1));
      router.refresh();
    });
  };

  const handleToggleLike = (post: OptimisticPost) => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const alreadyLiked = post.likedByCurrentUser;

    const previous = items;

    setPostErrors((prev) => ({
      ...prev,
      [post.id]: { ...prev[post.id], postError: undefined },
    }));

    setItems((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likedByCurrentUser: !alreadyLiked,
              likeCount: p.likeCount + (alreadyLiked ? -1 : 1),
            }
          : p,
      ),
    );

    startTransition(async () => {
      const result = alreadyLiked
        ? await unlikePostAction(post.id)
        : await likePostAction(post.id);

      if (!result.success) {
        setItems(previous);
        setPostErrors((prev) => ({
          ...prev,
          [post.id]: {
            ...prev[post.id],
            postError: result.error ?? "Failed to update like",
          },
        }));
      }
    });
  };

  const handleCreateReply = (post: OptimisticPost, content: string) => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const trimmed = content.trim();
    if (!trimmed || trimmed.length > REPLY_MAX_LENGTH) {
      return;
    }

    const optimisticReply: FeedReply = {
      id: -1,
      content: trimmed,
      createdAt: new Date(),
      author: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.username,
        avatarKey: null,
      },
    };

    setPostErrors((prev) => ({
      ...prev,
      [post.id]: { ...prev[post.id], replyError: undefined },
    }));

    setItems((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              replies: [...p.replies, optimisticReply],
              replyCount: p.replyCount + 1,
            }
          : p,
      ),
    );

    const previous = items;

    startTransition(async () => {
      const result = await createReplyAction(post.id, trimmed);
      if (!result.success) {
        setItems(previous);
        setPostErrors((prev) => ({
          ...prev,
          [post.id]: {
            ...prev[post.id],
            replyError: result.error ?? "Failed to create reply",
          },
        }));
        return;
      }

      router.refresh();
    });
  };

  const [composerValue, setComposerValue] = useState("");

  return (
    <div className="flex gap-4 px-4 py-6">
      {/* Left nav */}
      <nav className="hidden w-56 flex-shrink-0 flex-col gap-2 md:flex">
        <div className="mb-4 text-xl font-bold">CS846 Microblog</div>
        <Link
          href="/"
          className="rounded px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Global Feed
        </Link>
        {currentUser && (
          <Link
            href={`/users/${currentUser.username}`}
            className="rounded px-3 py-2 text-sm font-medium hover:bg-gray-100"
          >
            My Profile
          </Link>
        )}
        {!currentUser ? (
          <Link
            href="/login"
            className="mt-4 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Log in
          </Link>
        ) : (
          <Link
            href="/profile/edit"
            className="mt-4 rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Edit Profile
          </Link>
        )}
      </nav>

      {/* Center column */}
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {context === "profile" && profileUser && (
          <section className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-start gap-4">
              <Avatar
                avatarKey={profileUser.avatarKey}
                name={profileUser.displayName || profileUser.username}
                size="lg"
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-xl font-semibold">
                    @{profileUser.username}
                  </h1>
                  {profileUser.displayName && (
                    <span className="text-sm text-gray-600">
                      {profileUser.displayName}
                    </span>
                  )}
                </div>
                {profileUser.bio && (
                  <p className="mt-2 text-sm text-gray-800">
                    {profileUser.bio}
                  </p>
                )}
                {currentUser && currentUser.id === profileUser.id && (
                  <div className="mt-3">
                    <Link
                      href="/profile/edit"
                      className="inline-flex items-center rounded border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50"
                    >
                      Edit profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="flex items-center justify-between">
          {context === "global" ? (
            <h1 className="text-xl font-semibold">Global Feed</h1>
          ) : (
            <span className="text-sm font-medium text-gray-700">Timeline</span>
          )}
          <button
            type="button"
            onClick={handleManualRefresh}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50"
            disabled={isPending}
          >
            Refresh
          </button>
        </div>

        {globalError && (
          <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800">
            {globalError}
          </div>
        )}

        {currentUser && context === "global" && (
          <section className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-2 text-sm font-semibold">Compose a post</h2>
            <div className="flex gap-3">
              <Avatar
                avatarKey={null}
                name={currentUser.username}
                size="md"
              />
              <div className="flex-1">
                <textarea
                  value={composerValue}
                  onChange={(e) => setComposerValue(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span
                    className={
                      composerValue.length > POST_MAX_LENGTH
                        ? "font-medium text-red-600"
                        : "text-gray-500"
                    }
                  >
                    {composerValue.length} / {POST_MAX_LENGTH}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleCreatePost(composerValue);
                      setComposerValue("");
                    }}
                    disabled={
                      !composerValue.trim() ||
                      composerValue.length > POST_MAX_LENGTH ||
                      isPending
                    }
                    className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-lg bg-white p-4 shadow">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">No posts yet.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((post) => (
                <li key={post.id} className="border-b pb-4 last:border-b-0">
                  <PostCard
                    post={post}
                    currentUser={currentUser}
                    onToggleLike={() => handleToggleLike(post)}
                    onCreateReply={(content) => handleCreateReply(post, content)}
                    errorState={postErrors[post.id]}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

type PostCardProps = {
  post: OptimisticPost;
  currentUser: SessionUser | null;
  onToggleLike: () => void;
  onCreateReply: (content: string) => void;
  errorState?: PostErrorState;
};

function PostCard({ post, currentUser, onToggleLike, onCreateReply, errorState }: PostCardProps) {
  const [replyValue, setReplyValue] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const replyOverLimit = replyValue.length > REPLY_MAX_LENGTH;

  return (
    <article className="flex gap-3">
      <div className="mt-1">
        <Avatar
          avatarKey={post.author.avatarKey}
          name={post.author.displayName || post.author.username}
          size="md"
        />
      </div>
      <div className="flex-1">
        <header className="flex items-baseline gap-2">
          <Link
            href={`/users/${post.author.username}`}
            className="text-sm font-semibold hover:underline"
          >
            {post.author.displayName || post.author.username}
          </Link>
          <span className="text-xs text-gray-500">@{post.author.username}</span>
          <span className="ml-auto text-xs text-gray-400">
            {post.createdAt.toLocaleString()}
          </span>
        </header>
        <p className="mt-1 text-sm text-gray-900">{post.content}</p>

        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <button
            type="button"
            onClick={onToggleLike}
            className={
              post.likedByCurrentUser
                ? "flex items-center gap-1 text-blue-600"
                : "flex items-center gap-1 hover:text-blue-600"
            }
          >
            <span>♥</span>
            <span>{post.likeCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowReplyBox((v) => !v)}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <span>💬</span>
            <span>{post.replyCount}</span>
          </button>
        </div>

        {errorState?.postError && (
          <div className="mt-1 inline-block rounded bg-red-50 px-2 py-1 text-[11px] text-red-700">
            {errorState.postError}
          </div>
        )}

        {/* Replies */}
        {post.replies.length > 0 && (
          <ul className="mt-3 space-y-2 border-l pl-3 text-xs">
            {post.replies.map((reply) => (
              <li key={reply.id} className="flex gap-2">
                <div className="mt-1">
                  <Avatar
                    avatarKey={reply.author.avatarKey}
                    name={reply.author.displayName || reply.author.username}
                    size="sm"
                  />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <Link
                      href={`/users/${reply.author.username}`}
                      className="font-semibold hover:underline"
                    >
                      {reply.author.displayName || reply.author.username}
                    </Link>
                    <span className="text-gray-500">@{reply.author.username}</span>
                    <span className="ml-auto text-gray-400">
                      {reply.createdAt.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-900">{reply.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {showReplyBox && currentUser && (
          <div className="mt-3 rounded bg-gray-50 p-3">
            <textarea
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              placeholder="Write a reply"
              className="w-full rounded border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span
                className={
                  replyOverLimit ? "font-medium text-red-600" : "text-gray-500"
                }
              >
                {replyValue.length} / {REPLY_MAX_LENGTH}
              </span>
              <button
                type="button"
                onClick={() => {
                  onCreateReply(replyValue);
                  setReplyValue("");
                  setShowReplyBox(false);
                }}
                disabled={
                  !replyValue.trim() || replyOverLimit
                }
                className="rounded bg-blue-600 px-3 py-1 text-[11px] font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                Reply
              </button>
            </div>
            {errorState?.replyError && (
              <div className="mt-1 inline-block rounded bg-red-50 px-2 py-1 text-[11px] text-red-700">
                {errorState.replyError}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
