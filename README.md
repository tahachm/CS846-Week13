# CS846-Week13

Vibe coding app in week 13 with LLM guidelines

## Implementation Checklist (Next.js + Prisma + Tests + Logging)

Use this checklist together with the files in requirements/ when implementing the app (ideally with Copilot).

1. Project and Stack Setup

- [ ] Scaffold Next.js App Router project (TypeScript).
- [ ] Install Prisma + SQLite, Jest (next/jest), Testing Library, and Playwright as described in requirements/tech-stack.md.

2. Data Model (Prisma)

- [ ] Define Prisma models User, Post, Reply, Like matching requirements/functional-requirements.md and requirements/seeding-requirements.md.
- [ ] Add constraints (one-like-per-(user, post), reply references posts only).
- [ ] Run prisma migrate dev.

3. Central Logger

- [ ] Implement logger.ts emitting structured JSON logs as specified in requirements/logging-requirements.md.
- [ ] Replace direct console.log calls in server code with logger calls.

4. Auth and Profiles

- [ ] Implement registration and login (email/password) consistent with requirements/user-stories.md and requirements/functional-requirements.md.
- [ ] Implement public profile pages and self-edit (displayName, bio, preset avatar selection).
- [ ] Add logging for register/login/update_profile actions.

5. Posts, Replies, Likes, and Feeds (API)

- [ ] Implement API routes or server actions for create post, create reply, like/unlike, global feed, and user profile feed.
- [ ] Enforce character limits, one-level reply depth, and like uniqueness.
- [ ] Implement manual refresh behavior and log create_post, create_reply, like_post, unlike_post, refresh_feed, and refresh_profile.

6. UI (Feed, Profile, Compose, Interactions)

- [x] Build global feed page with manual refresh and optimistic like/reply behavior.
- [x] Build profile page showing a user’s posts and a link from usernames to profiles.
- [x] Implement post/reply composer with X / N counters and red error state when over the limit.
- [x] Ensure only authenticated users can post, reply, like, or edit profiles.
- [x] Follow layout, component, and state guidelines from requirements/ui-design.md when building the UI.

7. Database Seeding

- [ ] Implement prisma/seed.ts according to requirements/seeding-requirements.md (5–10 users, ~50 posts, some replies and likes).
- [ ] Configure prisma db seed and verify seeding runs successfully on a fresh database.

8. Tests (Scoped for 1.5 Hours)

- [ ] Implement unit tests for character limits, reply depth, and like/unlike rules per requirements/testing-requirements.md.
- [ ] Implement minimal integration tests for register/login/post/feed, like, reply, and key negative cases.
- [ ] Implement 1–2 Playwright E2E tests (login + create post, character counter boundary behavior).
- [ ] Implement logging tests that mock logger.ts and assert action/userId/success and privacy constraints.

9. Final NFR and Requirements Sanity Check

- [ ] Skim all files in requirements/ and confirm major "shall" statements are implemented or consciously deferred.
- [ ] Note any deliberate omissions or simplifications for the 1.5-hour scope.

Refer to the markdown files under requirements/ for detailed behavior, limits, testing scope, logging format, and seeding expectations.
