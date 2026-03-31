import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, User, Post, Reply, Like } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function resetDatabase() {
  await prisma.like.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

const SAMPLE_USERS: Array<
  Pick<User, "username" | "displayName" | "bio" | "avatarKey"> & { email: string }
> = [
  {
    username: "alice",
    email: "alice@example.com",
    displayName: "Alice",
    bio: "Likes vibes and microblogs.",
    avatarKey: "sunny",
  },
  {
    username: "bob",
    email: "bob@example.com",
    displayName: "Bob",
    bio: "Building tiny apps.",
    avatarKey: "ocean",
  },
  {
    username: "carol",
    email: "carol@example.com",
    displayName: "Carol",
    bio: "Testing all the things.",
    avatarKey: "forest",
  },
  {
    username: "dave",
    email: "dave@example.com",
    displayName: "Dave",
    bio: "Enjoys long threads.",
    avatarKey: "sunset",
  },
  {
    username: "erin",
    email: "erin@example.com",
    displayName: "Erin",
    bio: "Reply enthusiast.",
    avatarKey: "midnight",
  },
  {
    username: "frank",
    email: "frank@example.com",
    displayName: "Frank",
    bio: "Keeps it short.",
    avatarKey: "sunny",
  },
  {
    username: "grace",
    email: "grace@example.com",
    displayName: "Grace",
    bio: "Likes good error messages.",
    avatarKey: "ocean",
  },
  {
    username: "heidi",
    email: "heidi@example.com",
    displayName: "Heidi",
    bio: "Here for the vibes.",
    avatarKey: "forest",
  },
];

const POST_SNIPPETS: string[] = [
  "Trying out this tiny microblog app.",
  "Today I'm working on some Next.js code.",
  "Prisma + SQLite is surprisingly nice for small projects.",
  "Remember to keep posts under 280 characters.",
  "Logging all the things with structured JSON.",
  "Manual refresh is underrated but very controllable.",
  "Replies only go one level deep here.",
  "Likes are idempotent by design.",
  "Public timelines make debugging easier.",
  "CS846 week 13 vibes.",
];

const REPLY_SNIPPETS: string[] = [
  "Love this.",
  "Totally agree.",
  "Nice detail!",
  "This is a good test case.",
  "I should try this pattern.",
  "What about edge cases?",
  "Replying just to say hi.",
  "Great for manual exploration.",
];

async function createUsers(): Promise<User[]> {
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  const users: User[] = [];

  for (const u of SAMPLE_USERS) {
    const created = await prisma.user.create({
      data: {
        email: u.email,
        username: u.username,
        displayName: u.displayName,
        bio: u.bio,
        avatarKey: u.avatarKey,
        passwordHash,
      },
    });
    users.push(created);
  }

  return users;
}

async function createPosts(users: User[]): Promise<Post[]> {
  const posts: Post[] = [];
  const postsPerUser = 7; // 8 users * 7 = 56 posts

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    for (let j = 0; j < postsPerUser; j++) {
      const snippetIndex = (i * postsPerUser + j) % POST_SNIPPETS.length;
      const content = `${POST_SNIPPETS[snippetIndex]} (#${j + 1})`;

      const created = await prisma.post.create({
        data: {
          authorId: user.id,
          content,
        },
      });

      posts.push(created);
    }
  }

  return posts;
}

async function createReplies(users: User[], posts: Post[]): Promise<Reply[]> {
  const replies: Reply[] = [];

  const selectedPosts = posts.slice(0, 10); // first 10 posts get replies

  for (let i = 0; i < selectedPosts.length; i++) {
    const post = selectedPosts[i];

    // Two replies per selected post => 20 replies total
    for (let r = 0; r < 2; r++) {
      const author = users[(i + r) % users.length];
      const snippetIndex = (i * 2 + r) % REPLY_SNIPPETS.length;
      const content = REPLY_SNIPPETS[snippetIndex];

      const created = await prisma.reply.create({
        data: {
          authorId: author.id,
          postId: post.id,
          content,
        },
      });

      replies.push(created);
    }
  }

  return replies;
}

async function createLikes(users: User[], posts: Post[]): Promise<Like[]> {
  const likes: Like[] = [];

  // Deterministic pattern: each user likes every 2nd post starting at their index
  for (let ui = 0; ui < users.length; ui++) {
    const user = users[ui];

    for (let pi = ui; pi < posts.length; pi += 2 * users.length) {
      const post = posts[pi];

      const created = await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });

      likes.push(created);
    }
  }

  return likes;
}

async function main() {
  await resetDatabase();

  const users = await createUsers();
  const posts = await createPosts(users);
  const replies = await createReplies(users, posts);
  const likes = await createLikes(users, posts);

  console.log(
    JSON.stringify(
      {
        action: "seed_complete",
        success: true,
        counts: {
          users: users.length,
          posts: posts.length,
          replies: replies.length,
          likes: likes.length,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
