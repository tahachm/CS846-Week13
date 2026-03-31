# Testing Requirements (Scoped for 1.5 Hours, Next.js + Copilot)

## Scope Constraint

- Given a total implementation budget of approximately 1.5 hours for the app, tests, and logging, the test suite shall prioritize a small number of high‑value, easy‑to‑template tests that Copilot can rapidly generate and replicate.
- Detailed load testing, full UI coverage, and exhaustive edge‑case testing may be deferred to a later iteration.

## Minimal Automated Test Suite

### 1. Core Domain Unit Tests (shall)

- Label: Level = unit; Target = domain validation and rules (character limits, reply depth, like/unlike); Constraints = pure functions, synchronous, no network or database.

- The test suite shall include unit tests for character limit validation:
  - Inputs with length less than or equal to the configured limit for posts, replies, and bios shall be accepted.
  - Inputs with length greater than the configured limit shall be rejected.
  - Boundary cases for text length shall be explicitly tested at lengths 0, 1, N (the configured limit), and N+1 characters.
  - At least one test shall cover multibyte characters (for example, emoji) near the limit to ensure that UI and backend agree on validity.
- The test suite shall include unit tests for reply depth rules:
  - Replies to top‑level posts shall be allowed.
  - Replies to replies shall be rejected.
- The test suite shall include unit tests for like/unlike behavior:
  - For a given (user, post) pair, at most one active like shall be permitted.
  - Toggling a like twice shall result in the original state being restored.
- These unit tests shall be implemented as pure function tests (no network, no database) so that Copilot may easily generate multiple input/output examples from one initial pattern.

### 2. Minimal API / Integration Tests (shall)

- Label: Level = integration; Target = Next.js API routes for auth, posts, likes, replies; Constraints = isolated test database, HTTP or handler-level calls, no browser.

- The test suite shall include at least one integration test that:
  - Registers a user via the API.
  - Logs the user in.
  - Creates a post.
  - Retrieves the global feed and asserts that the new post appears in the response.
- The test suite shall include at least one integration test that:
  - Logs in as a user.
  - Likes a post via the API.
  - Retrieves the post or feed and asserts that the like count and user‑like flag are updated.
- The test suite shall include at least one integration test that:
  - Logs in as a user.
  - Creates a reply to a post via the API.
  - Retrieves the post or thread and asserts that the reply is present and associated with the correct parent post.
- These integration tests shall reuse shared setup/teardown helpers (for example, a Next.js test client and an isolated test database) so Copilot may clone the structure with different endpoints and assertions.

- The test suite shall include at least one negative integration test for unauthorized access that:
  - Calls create‑post or like APIs without authentication and asserts a 401/403 response and no persisted changes.
- The test suite shall include at least one negative integration test for reply depth that:
  - Attempts to create a reply whose parent is itself a reply and asserts a 4xx response and no persisted reply record.
- The test suite should include at least one negative integration test for duplicate likes that:
  - Issues two like requests for the same (user, post) pair in quick succession and asserts that the persisted like count increases by at most one.

### 3. Optimistic UI Error Contract at API Level (shall)

- Label: Level = integration; Target = error handling for like/reply API; Constraints = simulate backend failure, assert response and persisted state only.

- The test suite shall include at least one integration test that simulates a backend failure for a like request and asserts that:
  - The API responds with an appropriate error status.
  - No persisted like record exists afterward for the (user, post) pair.
- The test suite shall include at least one integration test that simulates a backend failure for a reply request and asserts that:
  - The API responds with an appropriate error status.
  - No persisted reply record exists afterward.
- These tests shall verify backend state and responses only (no browser automation) so Copilot may implement them as simple "call handler, assert response and state" patterns.

## Lightweight E2E / UI Tests

### 4. Minimal E2E Flows (should)

- Label: Level = e2e; Target = main user journeys (login, create post, character counter); Constraints = Playwright (or equivalent), happy path and minimal boundary checks only.

- The test suite should include at least one E2E test (for example, using Playwright) that:
  - Navigates to the app.
  - Logs in via the UI.
  - Creates a short, valid post.
  - Asserts that the post appears in the visible feed.
- The test suite should include at least one E2E test that:
  - Focuses a post text box.
  - Types within and beyond the allowed character limit.
  - Asserts that the character counter displays the correct "X / N" pattern.
  - Asserts that when the limit is exceeded, the counter enters an error state and the submit action is disabled.
- These E2E tests shall be kept to one or two short scripts that follow a single, consistent pattern so Copilot may reuse selectors and steps from the first example.

## Deferred or Reduced‑Scope Tests

### 5. Future Enhancements (may)

- Load and performance tests for approximately 100 concurrent users may be specified but shall not be implemented within the initial 1.5‑hour window.
- Broad E2E coverage for all error cases, manual refresh behaviors, and UI edge conditions may be deferred to a later iteration.
- Detailed accessibility and cross‑browser compatibility tests may be deferred to a later iteration.

## Logging‑Aware Tests

### 6. Minimal Logging Verification (should)

- Label: Level = unit/integration; Target = logger module and key API actions; Constraints = Jest with mocked logger, no external log sinks.

- Where structured logging is implemented for critical actions (for example, login, create post, like, reply), at least one test per action should assert that a log entry is written that includes:
  - An action type identifier (for example, "login", "create_post", "like_post", "reply_post").
  - The authenticated user identifier.
  - A success or failure flag.
- These logging assertions should be implemented by mocking or capturing the application’s logging module in Jest so that Copilot may replicate a single assertion pattern across multiple actions.

- The test suite shall include at least one negative logging test for privacy that:
  - Exercises registration or login flows and asserts that the mocked logger is never called with raw password values, authentication tokens, or full request bodies.
- The test suite shall include at least one negative logging test for completeness that:
  - Exercises a successful key action (for example, create_post) and asserts that the logged JSON object includes the expected static fields (for example, message template and action) and dynamic fields (for example, userId, success).
