# Non-Functional Requirements Audit

This file audits the implemented app against the non-functional requirements in requirements/non-functional-requirements.md as of this commit.

## Performance and responsiveness

1. Under normal load (≤ 100 concurrent active users), respond to feed/profile requests within 500 ms server processing time for 95% of requests.

- Status: Not directly measurable in this dev setup; design-aligned
- Evidence: The app uses simple Prisma queries over a small SQLite database and renders relatively lightweight pages. There is no explicit performance instrumentation, SLIs, or load testing harness, but the data access patterns (single indexed queries with limits) are consistent with the target latencies at the specified scale.

2. Under normal load, respond to post/like/reply submissions within 300 ms server processing time for 95% of requests.

- Status: Not directly measurable in this dev setup; design-aligned
- Evidence: Write paths are one or two Prisma calls plus logging. No heavy synchronous work is done per request. Latency is not enforced or reported, but the implementation is light enough that the stated budget is reasonable for the target scale.

3. Render optimistic UI feedback (post appears, like toggles, reply shows) within 150 ms on typical desktop for 95% of interactions.

- Status: Implemented (behaviorally)
- Evidence: Optimistic updates are applied immediately on the client before awaiting server responses (e.g., posts are inserted into local state, likes and replies update local counts and lists). Any remaining latency is dominated by React rendering and the browser, not round trips.

4. Ensure manual refresh of feed/profile completes within 1 second server processing time for 95% of requests.

- Status: Not directly measured; design-aligned
- Evidence: Manual refresh uses router.refresh() which re-runs simple Prisma queries with limits. There is no heavy aggregation or cross-join logic; under the stated data volume and load, this should remain under the target, but there is no explicit SLA enforcement.

5. Degrade gracefully (slower but functional) when load exceeds 100 concurrent users without crashing or corrupting data.

- Status: Partially addressed by design
- Evidence: The stack (Next.js + Prisma + SQLite) will naturally slow down under high load but does not have explicit backpressure or circuit-breaking logic. However, writes are transactional via Prisma/SQLite, so data corruption due to overload is unlikely. There is no explicit overload-handling or graceful-degradation UI.

## Scalability and capacity

6. Design so storage/processing for posts, likes, replies can be scaled without changing client-visible behavior.

- Status: Partially implemented
- Evidence: The app uses Prisma with a relational schema and a clear separation between API/domain and UI. Moving from SQLite to a more scalable database or sharding strategy would not require client changes, but some server-side configuration (datasource URL, adapter) would change. No explicit abstractions for multi-node scaling are present, but the design does not block it.

7. Store several hundred thousand posts + likes/replies without significant degradation for typical feed/profile views under specified load.

- Status: Not tested; design is basic but reasonable for moderate data
- Evidence: The schema includes indexes implied by primary/foreign keys; queries filter by author and order by createdAt with limits. There is no pagination or query optimization beyond this and no load tests, so high-volume behavior is not validated.

8. May implement pagination or cursor-based loading to maintain performance as data grows.

- Status: Not implemented
- Evidence: Feeds are currently single-page with a fixed limit (e.g., 50 items). There is no cursor/page parameter or "Load more" UI.

## Availability and reliability

9. For production, target at least 99% uptime over 30 days (excluding maintenance).

- Status: Not addressed in code
- Evidence: This is primarily an operational SLO. The codebase does not include deployment, health checks, or monitoring; availability targets are not enforced or observed in this repo.

10. Ensure backend errors for write operations do not result in partial/corrupted records.

- Status: Implemented
- Evidence: Writes (createPost, createReply, like/unlike, profile update) are executed as single Prisma calls inside try/catch blocks. On failure, the functions return high-level error messages without attempting partial manual writes; Prisma/SQLite maintain transactional integrity for each operation.

11. Ensure client-visible UI state for posts/likes/replies converges to backend state after reload or manual refresh, even after optimistic failures.

- Status: Implemented
- Evidence: All key views (global feed and profile timelines) are server-rendered from fresh Prisma queries on navigation and router.refresh(). Optimistic UI state is kept only in client memory; a reload or refresh always reflects the backend’s persisted posts, likes, and replies.

## Usability and UX

12. Optimize for desktop web; no mobile layout required.

- Status: Implemented
- Evidence: Layout uses fixed-width center column with a left nav, tuned for desktop; there is no responsive/mobile-specific layout logic. The primary flows are fully usable in a desktop browser.

13. Provide clear, concise error messages or chips on failures without low-level details.

- Status: Implemented
- Evidence: FeedClient shows short, user-friendly error chips like "Failed to create post" or "Failed to update like"; server actions return simple messages and structured logs capture technical details separately.

14. Provide discoverable manual refresh controls on feed and profile timelines.

- Status: Implemented
- Evidence: Both global and profile views show a labeled "Refresh" button next to the header ("Global Feed" or "Timeline"), making manual refresh obvious.

15. Provide consistent layout and visual styling across login, registration, feed, profile, and forms.

- Status: Implemented
- Evidence: All views use the same base layout, typography, and Tailwind utility classes (cards, buttons, text styles). Forms for login, registration, post/reply composition, and profile editing share similar visual patterns.

## Security

16. Store user passwords in a non-reversible form (hash + salt).

- Status: Implemented
- Evidence: Passwords are hashed with bcrypt (bcryptjs) before storage; raw passwords are never persisted.

17. Restrict write operations (create/edit posts, likes, replies, profile edits) to authenticated users.

- Status: Implemented
- Evidence: Server-side helpers (requireCurrentUser, createPost, createReply, like/unlike, profile update) all require a valid session-derived user id. UI handlers redirect unauthenticated users to /login when they attempt write actions.

18. Validate all user inputs on the server as well as client.

- Status: Implemented
- Evidence: Domain functions validate presence and length of content against shared constants; profile update validates bio length server-side. Client-side checks exist but are not relied on exclusively.

19. Protect against common web vulnerabilities by sanitizing/encoding user-generated content before rendering.

- Status: Partially implemented / relies on defaults
- Evidence: User content is rendered as plain text in React components without using dangerouslySetInnerHTML, which mitigates most XSS risks. There is no additional sanitization layer, but the lack of raw HTML rendering significantly reduces exposure. Injection risks into SQL are mitigated by Prisma’s parameterization.

## Privacy

20. Do not expose users’ passwords or sensitive auth tokens in responses or logs.

- Status: Implemented
- Evidence: Passwords are only handled in memory during login/registration and are never logged. Logging uses structured metadata and does not record raw credentials or tokens.

21. Treat all profile information and posts as public by design; do not implement private visibility controls.

- Status: Implemented
- Evidence: All profiles and posts are accessible without auth; there are no privacy flags or checks for per-user visibility.

22. Avoid logging full sensitive payloads; log only non-sensitive metadata for debugging/analytics.

- Status: Implemented
- Evidence: Logger entries include action names, user ids, counts, and high-level error codes; they omit raw passwords, full content bodies, or tokens. Tests explicitly verify passwords are not logged.

## Accessibility

23. Ensure core features (view feed, read posts, create posts/replies, like) are accessible via keyboard navigation.

- Status: Partially implemented
- Evidence: All interactive elements (buttons, links, form fields) are standard HTML controls with focus states, so they are keyboard-focusable and activatable. There is no explicit focus management beyond browser defaults, but the core flows can be performed with keyboard alone.

24. Use semantic HTML and ARIA where appropriate for key UI elements (buttons, forms, errors, refresh controls).

- Status: Partially implemented
- Evidence: The app largely uses semantic elements (button, form, main, section, nav, header). ARIA attributes are minimal (e.g., Avatar is aria-hidden). There is no dedicated ARIA labeling for error chips or refresh controls beyond their visible text.

25. Provide sufficient color contrast in character counters and error indicators (including red error state).

- Status: Largely implemented; not formally tested
- Evidence: Tailwind colors used for error text and backgrounds (e.g., text-red-600, bg-red-50, text-gray-500) generally have acceptable contrast on white or light backgrounds. However, no automated contrast checks or accessibility tests are present in the codebase.

## Summary of gaps

- Performance and availability targets (latency percentiles, 99% uptime) are not instrumented or tested; the implementation is designed to be lightweight but does not include explicit SLO measurement or enforcement.
- Scalability beyond a single SQLite instance is not implemented; pagination/cursor-based loading is not present.
- Accessibility practices are basic: semantic HTML and keyboard-usable controls exist, but there is little use of ARIA metadata, and contrast has not been formally verified.
