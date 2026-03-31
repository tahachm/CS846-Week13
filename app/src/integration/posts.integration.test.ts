import { prisma } from "@/lib/prisma";
import { createPost, createReply, getGlobalFeed, likePost } from "@/lib/posts";

async function resetDatabase() {
  await prisma.like.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

describe("posts + likes + replies integration", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it("registers a user, creates a post, and sees it in the global feed", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hash",
      },
    });

    const content = "Hello from a test post";
    const createResult = await createPost(user.id, content);
    expect(createResult.success).toBe(true);

    const feedResult = await getGlobalFeed(user.id, 10);
    expect(feedResult.success).toBe(true);
    const items = feedResult.data;
    const found = items.find((item) => item.content === content);
    expect(found).toBeDefined();
    expect(found?.author.username).toBe("testuser");
  });

  it("likes a post and sees like count and flag updated", async () => {
    const user = await prisma.user.create({
      data: {
        email: "like@example.com",
        username: "likeuser",
        passwordHash: "hash",
      },
    });

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        content: "Post to like",
      },
    });

    const likeResult = await likePost(user.id, post.id);
    expect(likeResult.success).toBe(true);

    const feedResult = await getGlobalFeed(user.id, 10);
    expect(feedResult.success).toBe(true);
    const item = feedResult.data.find((p) => p.id === post.id);
    expect(item).toBeDefined();
    expect(item?.likeCount).toBe(1);
    expect(item?.likedByCurrentUser).toBe(true);
  });

  it("creates a reply and sees it on the parent post", async () => {
    const user = await prisma.user.create({
      data: {
        email: "reply@example.com",
        username: "replyuser",
        passwordHash: "hash",
      },
    });

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        content: "Parent post",
      },
    });

    const replyResult = await createReply(user.id, post.id, "First reply");
    expect(replyResult.success).toBe(true);

    const feedResult = await getGlobalFeed(user.id, 10);
    expect(feedResult.success).toBe(true);
    const item = feedResult.data.find((p) => p.id === post.id);
    expect(item).toBeDefined();
    expect(item?.replies.length).toBe(1);
    expect(item?.replies[0].content).toBe("First reply");
  });

  it("rejects a reply whose parent is itself a reply", async () => {
    const user = await prisma.user.create({
      data: {
        email: "depth@example.com",
        username: "depthuser",
        passwordHash: "hash",
      },
    });

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        content: "Depth parent",
      },
    });

    const firstReply = await prisma.reply.create({
      data: {
        authorId: user.id,
        postId: post.id,
        content: "First level reply",
      },
    });

    // Domain rule: replies always point to posts, not replies.
    // Attempt to create a reply that "targets" a reply by using its id as a post id should fail lookup.
    const secondReplyResult = await createReply(user.id, firstReply.id, "Second level");
    expect(secondReplyResult.success).toBe(false);
    expect(secondReplyResult.error).toBe("Post not found");
  });

  it("treats duplicate likes as idempotent and does not increase count", async () => {
    const user = await prisma.user.create({
      data: {
        email: "dupe@example.com",
        username: "dupeuser",
        passwordHash: "hash",
      },
    });

    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        content: "Like idempotency",
      },
    });

    const first = await likePost(user.id, post.id);
    expect(first.success).toBe(true);

    const second = await likePost(user.id, post.id);
    expect(second.success).toBe(true);

    const count = await prisma.like.count({ where: { userId: user.id, postId: post.id } });
    expect(count).toBe(1);
  });
});
