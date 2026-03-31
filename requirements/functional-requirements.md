### Detailed Functional Requirements (Updated)

#### 1. Avatars and public profiles

- The system shall create a profile record for each registered user at registration time.
- The system shall treat all profiles as public; it shall not support private profiles or profile-level access controls.
- The system shall provide a fixed catalog of approximately ten preset avatar options.
- The system shall allow a user to select an avatar only from this preset catalog; the system shall not allow arbitrary image uploads or external avatar URLs.
- The system shall allow a user to have no avatar selected; in this case, the system shall display a default placeholder or no image, as designed.
- The system shall provide a public profile page for each user that includes:
  - Username and optional display name.
  - Optional avatar from the preset set (or placeholder if none).
  - Optional bio.
  - The list of that user’s posts in reverse chronological order.
- When a user clicks on a username (including their own) from any view, the system shall navigate to that user’s public profile page and display their posts.

#### 2. Character limits and counters

- The system shall define a maximum length for:
  - Posts.
  - Replies.
  - Profile bio.
- For each text field subject to a length limit, the system shall display a live character counter in the form “X / N”, where N is the configured limit and X is the number of characters currently entered.
- The system shall update the character counter in real time as the user types.
- If the user’s input exceeds the configured limit, the system shall:
  - Change the character counter’s appearance to an error state (e.g., red text or background).
  - Prevent submission of the form while the input exceeds the limit.
- The system shall not allow creation of posts, replies, or bios that exceed their defined character limits in the backend, even if client validations are bypassed.

#### 3. Global feed and manual refresh (clarification)

- The system shall provide a global feed of posts from all users in reverse chronological order.
- The system shall provide a manual refresh control on the global feed view.
- When a user activates manual refresh, the system shall:
  - Retrieve the latest snapshot of posts and associated counts from the backend.
  - Replace or update the current feed to reflect this snapshot.
- The system shall not perform automatic background refreshes of the feed; new content from other users shall become visible when the user manually refreshes or navigates into the view again.

#### 4. Profile timelines and manual refresh (clarification)

- The system shall provide a timeline of posts for each user on their public profile page, in reverse chronological order.
- The system shall provide a manual refresh control on the profile timeline.
- When a user triggers manual refresh on a profile page, the system shall:
  - Retrieve the latest posts and like counts for that user.
  - Update the profile timeline to match backend state.
- The system shall not automatically refresh profile timelines in the background.

#### 5. Likes with optimistic UI and immediate error feedback

- The system shall allow only logged-in users to like and unlike posts.
- For each (user, post) pair, the system shall persist at most one active like.
- The system should optimistically update the UI when a like or unlike is initiated:
  - Toggle the like button visual state.
  - Adjust the visible like count accordingly.
- The system shall send the like/unlike request to the backend concurrently with the optimistic UI change.
- If the backend confirms success, the system shall keep the updated UI state.
- If the backend returns an error or fails to confirm persistence within a defined timeout:
  - The system shall revert the like button and visible count to the last known consistent state, or otherwise clearly indicate that the action did not succeed.
  - The system shall display a visible error indicator (e.g., a chip or banner) as soon as the error is known, without requiring manual page refresh.
- After any manual refresh of feeds or profiles, the visible likes and counts shall match backend state.

#### 6. Replies with optimistic UI and immediate error feedback

- The system shall allow only logged-in users to create replies to posts, not to replies.
- The system should optimistically display a newly submitted reply directly under the parent post as soon as the user submits it.
- The system shall send the reply content to the backend concurrently with adding the reply into the UI.
- If the backend confirms successful persistence, the reply shall remain visible and shall appear after any manual refresh.
- If the backend returns an error or fails to confirm persistence:
  - The system shall remove the temporary reply from the UI or clearly mark it as failed and non-persisted.
  - The system shall display a visible error indicator (e.g., a chip) as soon as the error is known, without requiring manual refresh.
- After any manual refresh, the set of replies shown under each post shall match the backend’s persisted replies.
