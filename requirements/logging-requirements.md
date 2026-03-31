# Logging and Observability Requirements (Scoped for 1.5 Hours, Next.js + Copilot)

## 1. Scope and Constraints

- The logging implementation shall be simple enough to be implemented within the same ~1.5‑hour window as the app and tests, and shall rely on a single, shared logging module.
- The logging design shall prioritize:
  - Debuggability of critical flows (auth, posting, liking, replying, refresh).
  - Minimal privacy risk (no sensitive data in logs).
  - Ease of testing via Jest by mocking the logging module.
- Integration with external log aggregation or metrics platforms may be deferred to a later iteration.

## 2. Central Logger Module (shall)

- The application shall define a single logger module (for example, logger.ts) that exports functions for structured logging (for example, logInfo, logWarn, logError).
- All server‑side code (API routes, server actions, domain services) shall log exclusively through this central logger module.
- The logger module shall:
  - Emit log entries as structured JSON objects (for example, one JSON object per line) rather than free‑form strings.
  - Prefix or include in each JSON object a timestamp field.
  - Include a log level field (for example, "info", "warn", "error").
  - Accept a static message template string (for example, "user_login" or "create_post") and a structured metadata object that is merged into the JSON log entry.
  - Keep static text (such as the message template and action name) separate from dynamic variables (such as userId, targetId, counts, and errorCode) so that consumers can parse and filter logs reliably.
- For the initial implementation, the logger may write these JSON entries to console or a similarly simple sink, as long as the JSON structure of messages is consistent and testable.

## 3. Log Event Model (shall)

- For every logged event, the metadata object shall, where applicable, include:
  - `action`: a short string describing the operation (for example, `register_user`, `login`, `create_post`, `create_reply`, `like_post`, `unlike_post`, `refresh_feed`, `refresh_profile`).
  - `userId`: the authenticated user identifier, when available.
  - `targetId`: an identifier for the primary resource affected (for example, `postId`, `replyId`, or `profileUserId`).
  - `success`: a boolean indicating whether the operation succeeded.
  - `errorCode` or `errorType`: a short code or type string for failures (for example, `VALIDATION_ERROR`, `DB_ERROR`, `AUTH_ERROR`).
  - `requestId` or `correlationId`: an identifier that can be used to group logs for a single request or user action, if such an identifier is available in the request context.
  - `affectedCount`: for dataset‑changing operations (for example, bulk updates or deletes), the number of records written or modified, when applicable.
  - `resultCount`: for data‑retrieval operations (for example, feed or profile queries), the number of records returned after filtering, when applicable.
- The logger shall avoid including sensitive fields such as raw passwords, authentication tokens, or full request bodies in log messages.

## 4. Actions That Shall Be Logged

### 4.1 Authentication and Sessions

- Successful registration events shall be logged with:
  - `action = "register_user"`.
  - `userId` of the newly created user.
  - `success = true`.
- Failed registration attempts (for example, duplicate email or username, invalid data) shall be logged with:
  - `action = "register_user"`.
  - `success = false`.
  - An appropriate `errorCode`.
- Successful login events shall be logged with:
  - `action = "login"`.
  - `userId` of the authenticated user.
  - `success = true`.
- Failed login attempts (for example, wrong password) shall be logged with:
  - `action = "login"`.
  - `success = false`.
  - An appropriate `errorCode`.
- Logout events may be logged with `action = "logout"` and `userId`, where useful.

### 4.2 Profile Updates

- Successful profile update events (display name, bio, avatar selection) shall be logged with:
  - `action = "update_profile"`.
  - `userId` (the profile owner).
  - `success = true`.
- Failed profile update events (for example, validation errors on bio length or invalid avatar option) shall be logged with:
  - `action = "update_profile"`.
  - `userId`.
  - `success = false` and a relevant `errorCode`.

### 4.3 Posts

- Successful post creation events shall be logged with:
  - `action = "create_post"`.
  - `userId`.
  - `targetId = postId`.
  - `success = true`.
- Failed post creation events (for example, validation errors, backend errors) shall be logged with:
  - `action = "create_post"`.
  - `userId` (if available).
  - `success = false` and relevant `errorCode`.

### 4.4 Replies

- Successful reply creation events shall be logged with:
  - `action = "create_reply"`.
  - `userId`.
  - `targetId = replyId`.
  - `success = true`.
- Failed reply attempts (for example, reply to a reply, validation failure, backend error) shall be logged with:
  - `action = "create_reply"`.
  - `userId`.
  - `success = false` and a relevant `errorCode`.

### 4.5 Likes and Unlikes

- Successful like events shall be logged with:
  - `action = "like_post"`.
  - `userId`.
  - `targetId = postId`.
  - `success = true`.
- Successful unlike events shall be logged with:
  - `action = "unlike_post"`.
  - `userId`.
  - `targetId = postId`.
  - `success = true`.
- Failed like/unlike events (for example, backend failure, invalid state) shall be logged with:
  - `action = "like_post"` or `"unlike_post"`.
  - `userId`.
  - `success = false` and a relevant `errorCode`.

### 4.6 Feed and Profile Refresh

- The system should log feed refresh requests with:
  - `action = "refresh_feed"`.
  - `userId` when authenticated, or a marker for anonymous.
  - `success = true` for successful responses, or `false` with `errorCode` if the refresh fails.
- The system should log profile page refreshes with:
  - `action = "refresh_profile"`.
  - `userId` (viewer, if authenticated).
  - `targetId = profileUserId`.
  - `success` and `errorCode` as appropriate.

## 5. Log Levels (shall/should)

- Informational events such as successful registration, login, logout, profile updates, post/reply/like/unlike creations, and successful refreshes shall be logged at `info` level.
- Expected validation failures (for example, over‑length text, reply‑to‑reply attempts, unauthorized access attempts) should be logged at `warn` level with appropriate `errorCode`.
- Unexpected server errors (for example, unhandled exceptions, database errors) shall be logged at `error` level with enough context to support debugging, without exposing sensitive data.

## 6. Privacy and Data Protection

- The application shall not log raw passwords, authentication tokens, or full request bodies that may contain sensitive information.
- The application should avoid logging full user emails where not strictly necessary and may instead log user identifiers or partially masked emails.
- The application may log high‑level error descriptions and short codes but shall not log stack traces or internal implementation details in user‑visible channels.

## 7. Testability of Logging

- The logger module shall be easily mockable in Jest so that tests can assert that specific actions produce specific log calls.
- At least one Jest test per key action (login, create post, like, create reply) should verify that the logger is invoked with the expected `action`, `userId`, `success`, and `errorCode` fields.
- The structure of log entries (field names and basic types) shall remain stable over time to avoid breaking existing tests and downstream processing.

## 8. Metrics and Future Observability (may)

- The application may later derive simple metrics (for example, counts of posts, likes, replies, and failed operations) from logs or by adding lightweight counters.
- Integration with centralized logging or metrics platforms (for example, hosted log aggregation) may be added in future iterations, reusing the structured log format defined above.
