# UI Design (Twitter-like, Desktop-first)

## 1. Overall Style and Layout

- Desktop-first layout inspired by Twitter’s main layout.
- Three-column structure on larger screens:
  - Left: narrow navigation column.
  - Center: primary content (feed or profile timeline).
  - Right: optional secondary column (simple static info, can be omitted if time is tight).
- On smaller widths, left nav may collapse to a top bar and the right column may be hidden.
- Tailwind CSS shall be used for all styling.
- The design shall be clean and minimal, focusing on readability and fast scanning of posts.

## 2. Navigation (Left Column / Top Bar)

- The navigation area shall include:
  - Application name or logo at the top.
  - Links/buttons for:
    - Global Feed.
    - My Profile.
    - Login / Logout (depending on auth state).
- On hover, nav items should have a subtle background highlight.
- On smaller screens, the nav may become a horizontal top bar with the same items.

## 3. Global Feed (Center Column)

- The center column shall display a vertical list of post cards, most recent first.
- At the top of the feed (for logged-in users) there shall be a post composer:
  - User avatar (if available) on the left.
  - Text area with a clear placeholder (for example, "What’s happening?").
  - Character counter in the form `X / N` aligned to the bottom-right of the text area.
  - Primary button to submit the post, disabled when over the limit or empty.
  - When over the limit, the counter shall change to an error color and the button remains disabled.
- A manual "Refresh" button or icon shall be placed near the top of the feed so users can explicitly reload content.

### Post Card Design

- Each post card shall include:
  - Author avatar (preset avatar or default) on the left.
  - Author username and optional display name, with username clickable to navigate to the profile.
  - Timestamp (relative or absolute) in a subtle text style.
  - Post content text, wrapped for readability.
  - A small footer row with interaction buttons:
    - Like (heart or thumbs-up icon) with a count.
    - Reply (comment icon) with a count.
- When the user has liked a post, the like icon and count shall be shown in an active color (for example, filled icon and accent color).
- When a like or reply is submitted, the UI shall update immediately (optimistic UI). If the backend fails, a small error chip shall appear under the card and the UI shall revert to the previous state.

## 4. Replies (Under Posts)

- Replies shall appear directly beneath the parent post, slightly indented from the left to visually group them.
- Each reply shall display:
  - Reply author avatar and username.
  - Reply text with appropriate wrapping.
  - Timestamp.
- A reply composer (similar to the post composer but smaller) shall appear when the user clicks the Reply button:
  - Text area with `X / N` counter and submit button.
  - Same over-limit behavior (red counter, disabled submit).

## 5. Profile Page (Center Column)

- The profile page shall reuse the same center column layout, showing:
  - Profile header at the top:
    - Avatar (preset from the 10 options), larger than in feed.
    - Username (primary) and display name (secondary).
    - Short bio text with character limit and wrapping.
    - Edit Profile button when viewing own profile.
  - Below the header, a manual "Refresh" button for the profile timeline.
  - List of that user’s posts in the same post card style as the global feed, filtered by author.
- Profile edit UI:
  - Fields for displayName and bio (with `X / N` counter and red error state when over the limit).
  - A grid of the 10 preset avatars; clicking one selects it and highlights the selection.
  - Save and Cancel buttons.

## 6. Auth Screens

- Login screen:
  - Simple centered card with fields for email and password.
  - Primary login button and a link to registration.
  - Area for displaying validation or authentication errors.
- Registration screen:
  - Fields for email, username, password (and confirm password if desired).
  - Clear error messages for duplicate username/email or invalid input.

## 7. States and Feedback

- Loading states:
  - Skeletons or simple "Loading..." text for feed and profile when data is being fetched.
- Empty states:
  - For an empty feed: "No posts yet" message.
  - For a new user with no posts: "This user hasn’t posted anything yet." on the profile.
- Error states:
  - Global errors (for example, feed load failure) may appear as a banner at the top of the center column.
  - Action-specific errors (failed like, failed reply, failed post) shall appear as small error chips close to the relevant control.

## 8. Tailwind Usage Guidelines

- Tailwind utility classes shall be used for layout (flex, grid, spacing), typography, and colors.
- Consistent spacing scale (for example, multiples of 4) should be used for margins and paddings.
- A small set of accent colors should be used (for example, one primary accent for buttons and active likes, a red for errors, and muted grays for text and borders).
- Components (post card, composer, nav, profile header) should be implemented as reusable React components so Copilot can easily replicate patterns.
