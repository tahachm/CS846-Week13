# Database Seeding Requirements

## 1. Scope

- The application shall provide a database seed that populates a development database with a small, realistic dataset to support manual exploration and automated tests.
- The seed shall be safe to run multiple times without creating duplicate logical data (idempotent or reset-based behavior).

## 2. Seed Dataset Content (shall)

- The seed shall create:
  - At least 5–10 user accounts with distinct usernames.
  - At least 50 posts distributed across these users.
  - A non-trivial number of replies (for example, at least 10 replies) attached to various posts, respecting the one-level reply depth rule.
  - A non-trivial number of likes (for example, at least 30 likes) distributed across users and posts, respecting the one-like-per-(user, post) rule.
- The seed shall ensure that all seeded profiles, posts, replies, and likes are consistent with the application’s validation rules (character limits, reply depth, uniqueness of likes).

## 3. Implementation Approach (shall/should)

- The seed shall be implemented as a Prisma seed script (for example, prisma/seed.ts) written in TypeScript.
- The seed script shall:
  - Clear or reset relevant tables in a safe order (for example, delete likes and replies before posts and users) or use a truncate/reset mechanism for development.
  - Insert the sample users, posts, replies, and likes.
- The project should configure `prisma db seed` (via package.json and Prisma schema configuration) so that running a single command seeds the database.

## 4. Copilot-Friendly Seeding Strategy (should)

- The seed script should:
  - Use simple arrays of sample usernames and text snippets so that Copilot can generate loops that create users and content from these arrays.
  - Use clear function boundaries (for example, createUsers, createPosts, createReplies, createLikes) so Copilot can expand or modify each part independently.
- Randomness may be used to distribute posts, replies, and likes among users, but the script should remain deterministic enough for tests by either:
  - Using a fixed random seed, or
  - Using simple, predictable patterns (for example, every user likes the first N posts).

## 5. Usage (shall)

- It shall be possible to fully initialize a fresh development database by running a small number of commands (for example, migrate and seed) documented in the project README.
- The seed script shall complete quickly (on the order of seconds) so that it can be run as part of local setup and, optionally, before integration tests.

## 6. Prisma Models and Seed Script Shape (planning)

- The Prisma schema should define at least the following models and relations (field types and names may be adjusted during implementation, but relationships shall be preserved):
  - User
    - id (primary key)
    - email (unique)
    - username (unique)
    - displayName (optional)
    - bio (optional)
    - avatarKey (optional, refers to one of the preset avatar options)
    - createdAt
    - posts (one-to-many relation to Post)
    - replies (one-to-many relation to Reply)
    - likes (one-to-many relation to Like)
  - Post
    - id (primary key)
    - authorId (foreign key to User)
    - content (text, with configured max length)
    - createdAt
    - replies (one-to-many relation to Reply)
    - likes (one-to-many relation to Like)
  - Reply
    - id (primary key)
    - authorId (foreign key to User)
    - postId (foreign key to Post)
    - content (text, with configured max length)
    - createdAt
  - Like
    - id (primary key)
    - userId (foreign key to User)
    - postId (foreign key to Post)
    - createdAt
    - Unique constraint on (userId, postId).

- The prisma/seed.ts script should follow this high-level structure so Copilot can quickly fill in details:
  - Import PrismaClient and instantiate a single client.
  - Define helper functions:
    - resetDatabase: delete or truncate Like, Reply, Post, and User tables in a safe order.
    - createUsers: create 5–10 users from a static array of sample usernames and emails.
    - createPosts: for each user, create several posts using a static array of content snippets.
    - createReplies: attach replies to a subset of posts, ensuring replies always reference posts (not replies).
    - createLikes: for each user, like a subset of posts while respecting the unique (user, post) constraint.
  - In an async main function:
    - Call resetDatabase.
    - Call createUsers, then createPosts, then createReplies, then createLikes.
    - Log simple JSON messages (via the central logger or console) summarizing how many users/posts/replies/likes were created.
  - Export or invoke main so that `prisma db seed` can run the script.

- This structure shall be simple and regular enough that Copilot can:
  - Generate loops over arrays of sample data.
  - Wire foreign keys using returned IDs from previous create operations.
  - Expand or adjust counts (for example, number of posts per user) with minimal manual editing.
