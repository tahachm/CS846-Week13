# Functional Requirements Audit

This file audits the implemented app against the functional requirements in requirements/functional-requirements.md as of this commit.

## 1. Avatars and public profiles

1.1 The system shall create a profile record for each registered user at registration time.

- Status: Implemented
- Evidence: Registration creates a User row in the database with profile fields (displayName, bio, avatarKey) available on that record; profile editing and feeds rely on those fields.

  1.2 The system shall treat all profiles as public; it shall not support private profiles or profile-level access controls.

- Status: Implemented
- Evidence: Profile pages under /users/[username] are accessible without auth checks; there is no visibility or privacy flag anywhere in the schema or UI.

  1.3 The system shall provide a fixed catalog of approximately ten preset avatar options.

- Status: Implemented
- Evidence: Edit profile page defines a fixed avatarOptions array of 10 keys ("sunny", "moon", "star", "wave", "leaf", "mountain", "cloud", "flame", "bolt", "planet").

  1.4 The system shall allow a user to select an avatar only from this preset catalog; the system shall not allow arbitrary image uploads or external avatar URLs.

- Status: Implemented
- Evidence: Avatar selection is a <select> whose options are exactly the preset keys plus an empty option; no upload fields or URL inputs exist, and the Avatar component renders initials with CSS classes, not external images.

  1.5 The system shall allow a user to have no avatar selected; in this case, the system shall display a default placeholder or no image, as designed.

- Status: Implemented
- Evidence: Edit profile select includes a "No avatar" option with empty value; Avatar component treats null/unknown avatarKey via default gray styling, effectively a placeholder.

  1.6 The system shall provide a public profile page for each user that includes username and optional display name, optional avatar, optional bio, and the user’s posts in reverse chronological order.

- Status: Implemented
- Evidence: /users/[username] page fetches profileUser (username, displayName, bio, avatarKey) and items (posts) ordered by createdAt desc; FeedClient profile header shows avatar, @username, displayName, and bio; the list below shows that user’s posts.

  1.7 When a user clicks on a username (including their own) from any view, the system shall navigate to that user’s public profile page and display their posts.

- Status: Implemented
- Evidence: Post and reply cards wrap author names in links to /users/{username}; the left nav includes "My Profile" linking to /users/{currentUser.username}; navigation successfully routes into the profile feed.

## 2. Character limits and counters

2.1 The system shall define a maximum length for posts, replies, and profile bio.

- Status: Implemented
- Evidence: POST_MAX_LENGTH, REPLY_MAX_LENGTH, and BIO_MAX_LENGTH constants are defined in the shared validation module and used in domain logic and UI.

  2.2 For each text field subject to a length limit, the system shall display a live character counter in the form "X / N".

- Status: Partially implemented
- Evidence: Global post composer and reply textarea both show live counters of the form "X / N"; the bio textarea on the profile edit page currently shows static helper text ("Up to N characters") but not a live counter that updates as the user types.

  2.3 The system shall update the character counter in real time as the user types.

- Status: Partially implemented
- Evidence: Counters for posts and replies update live via React state; bio length does not currently have a live-updating counter.

  2.4 If the user’s input exceeds the configured limit, the system shall change the character counter’s appearance to an error state and prevent submission while over limit.

- Status: Implemented for posts and replies; not implemented for bio.
- Evidence: Post and reply counters switch to red/error styling and the corresponding buttons are disabled when over the limit. The bio field relies on the textarea’s maxLength attribute and server-side validation; there is no dynamic error-state counter or disabled Save button tied to live length checks.

  2.5 The system shall not allow creation of posts, replies, or bios that exceed their defined character limits in the backend, even if client validations are bypassed.

- Status: Implemented
- Evidence: Domain logic in posts library enforces POST_MAX_LENGTH and REPLY_MAX_LENGTH with validation errors; profile update handler checks BIO_MAX_LENGTH and redirects with an error when exceeded before updating the database.

## 3. Global feed and manual refresh

3.1 The system shall provide a global feed of posts from all users in reverse chronological order.

- Status: Implemented
- Evidence: Global feed function queries posts ordered by createdAt desc and the home page renders these in FeedClient with a "Global Feed" heading.

  3.2 The system shall provide a manual refresh control on the global feed view.

- Status: Implemented
- Evidence: FeedClient renders a "Refresh" button next to the Global Feed heading; it is visible on the global feed.

  3.3 When a user activates manual refresh, the system shall retrieve the latest snapshot of posts and counts and update the feed.

- Status: Implemented
- Evidence: Refresh button calls router.refresh(), which re-runs the server component data fetch (getGlobalFeed) and re-renders the feed with the latest posts and counts.

  3.4 The system shall not perform automatic background refreshes of the feed; new content becomes visible only on manual refresh or navigation.

- Status: Implemented
- Evidence: There are no intervals, subscriptions, or background polling; updates occur only through router.refresh() or navigating into the page.

## 4. Profile timelines and manual refresh

4.1 The system shall provide a timeline of posts for each user on their public profile page, in reverse chronological order.

- Status: Implemented
- Evidence: User feed function fetches posts for the profile user ordered by createdAt desc and passes them to FeedClient in profile context.

  4.2 The system shall provide a manual refresh control on the profile timeline.

- Status: Implemented
- Evidence: The same Refresh button rendered by FeedClient is present when context === "profile", providing manual refresh on profile pages.

  4.3 When a user triggers manual refresh on a profile page, the system shall retrieve latest posts and like counts for that user and update the timeline.

- Status: Implemented
- Evidence: Profile refresh also uses router.refresh(), which re-executes getUserFeed and updates posts and counts from the backend.

  4.4 The system shall not automatically refresh profile timelines in the background.

- Status: Implemented
- Evidence: As with the global feed, no automatic polling or background updates are implemented for profile timelines.

## 5. Likes with optimistic UI and immediate error feedback

5.1 The system shall allow only logged-in users to like and unlike posts.

- Status: Implemented
- Evidence: Like handler checks for currentUser; if absent, it redirects to /login. Server-side like/unlike actions also rely on a valid authenticated user id.

  5.2 For each (user, post) pair, the system shall persist at most one active like.

- Status: Implemented
- Evidence: Database schema enforces a unique (userId, postId) constraint; likePost function treats unique constraint violations as idempotent success.

  5.3 The system should optimistically update the UI when a like or unlike is initiated (toggle button state and count).

- Status: Implemented
- Evidence: Client state is updated immediately on click to flip likedByCurrentUser and adjust likeCount before the server response.

  5.4 The system shall send the like/unlike request to the backend concurrently with the optimistic UI change.

- Status: Implemented
- Evidence: After optimistic state change, like/unlike server actions are invoked inside a startTransition, in parallel with the already-updated UI.

  5.5 If the backend confirms success, the system shall keep the updated UI state.

- Status: Implemented
- Evidence: On success, the optimistic like state is not rolled back; the feed remains in the toggled state until the next refresh.

  5.6 If the backend returns an error or times out, the system shall revert the like button and count and show a visible error indicator without requiring refresh.

- Status: Implemented
- Evidence: On error, the code restores the previous items array and sets a postError message; FeedClient renders an inline red chip showing the error on that post.

  5.7 After any manual refresh of feeds or profiles, visible likes and counts shall match backend state.

- Status: Implemented
- Evidence: Both global and profile refresh paths re-query likes and reply counts from the database and rebuild derived likeCount values.

## 6. Replies with optimistic UI and immediate error feedback

6.1 The system shall allow only logged-in users to create replies to posts, not to replies.

- Status: Implemented
- Evidence: Reply handler checks for currentUser and redirects to /login if absent; reply creation uses a postId and there is no support for replying to replies in schema or UI.

  6.2 The system should optimistically display a newly submitted reply directly under the parent post as soon as the user submits it.

- Status: Implemented
- Evidence: On submit, a temporary reply object is appended to the post’s replies array and rendered immediately before the server confirms.

  6.3 The system shall send the reply content to the backend concurrently with adding the reply into the UI.

- Status: Implemented
- Evidence: After adding the optimistic reply, a server action is called inside a startTransition to persist it.

  6.4 If the backend confirms successful persistence, the reply shall remain visible and appear after any manual refresh.

- Status: Implemented
- Evidence: On success, the UI is left in place and subsequent router.refresh() calls re-fetch replies from the database so persisted replies continue to appear.

  6.5 If the backend returns an error or fails to confirm persistence, the system shall remove the temporary reply (or mark as failed) and display an error chip without requiring refresh.

- Status: Implemented
- Evidence: On error, the code restores the previous items array (removing the optimistic reply) and sets a replyError; FeedClient displays an inline red error chip under the post.

  6.6 After any manual refresh, the set of replies shown under each post shall match the backend’s persisted replies.

- Status: Implemented
- Evidence: Both global and profile feed loaders include replies in their queries and reconstruct the replies list from persisted data on every refresh.

## Summary of gaps

- The main partial implementation area is character counters for the profile bio field: backend limits are enforced and maxLength is set, but a live "X / N" counter with real-time updates and error styling is not yet present on the bio textarea, and the Save button is not dynamically disabled when the bio exceeds its limit.
