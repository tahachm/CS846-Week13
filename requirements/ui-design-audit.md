# UI Design Audit

This file audits the implemented UI against requirements in requirements/ui-design.md as of this commit.

## 1. Overall Style and Layout

1.1 Desktop-first layout inspired by Twitter’s main layout.

- Status: Implemented
- Evidence: The main feed/profile UI in app/src/app/components/FeedClient.tsx uses a three-column flex layout (left nav + centered content with max width) optimized for desktop.

  1.2 Three-column structure on larger screens (left nav, center content, optional right column).

- Status: Partially implemented
- Evidence: Left navigation and a centered primary content column are implemented. There is no right-hand secondary column, which the spec marks as optional and can be omitted if time is tight.

  1.3 On smaller widths, left nav may collapse to a top bar and right column may be hidden.

- Status: Partially implemented (left nav hides, no top bar)
- Evidence: The nav uses `hidden md:flex`, so it is hidden on small screens and visible on larger ones; there is currently no alternative top bar nav on small screens, but the core content remains usable.

  1.4 Tailwind CSS shall be used for all styling.

- Status: Implemented
- Evidence: All UI components and pages use Tailwind utility classes for layout, spacing, typography, and colors; no other CSS frameworks are used.

  1.5 Design shall be clean, minimal, focused on readability and fast scanning.

- Status: Implemented
- Evidence: The feed, profile, and auth screens use simple cards, ample whitespace, consistent typography, and minimal chrome; posts are easy to scan.

## 2. Navigation (Left Column / Top Bar)

2.1 Navigation area shall include application name/logo at top.

- Status: Implemented
- Evidence: FeedClient nav renders a "CS846 Microblog" title at the top of the left column.

  2.2 Navigation shall include links/buttons for Global Feed, My Profile, Login/Logout.

- Status: Implemented
- Evidence: Nav includes a Global Feed link, a conditional My Profile link for logged-in users, and either a "Log in" button or "Log out" plus "Edit Profile" when authenticated.

  2.3 Nav items should have subtle hover background highlight.

- Status: Implemented
- Evidence: Nav links use Tailwind `hover:bg-gray-100` / `hover:bg-gray-50` classes for hover highlighting.

  2.4 On smaller screens, nav may become a horizontal top bar.

- Status: Not implemented (optional behavior)
- Evidence: There is no separate top bar nav on small screens; the spec treats this as optional behavior.

- Status: Implemented
- Evidence: Global feed loads posts ordered by createdAt desc and renders them as a stacked list of card-like items in the center column.

  3.2 Logged-in users see a post composer at top of feed with avatar, textarea, placeholder, X/N counter, and submit button.

- Status: Implemented (except avatar image uses initials)
- Evidence: For authenticated users in global context, FeedClient shows a "Compose a post" card with an Avatar on the left, textarea with "What's happening?" placeholder, live `X / N` counter, and disabled submit when empty or over limit.

  3.3 When over character limit, counter changes to error color and submit remains disabled.

- Status: Implemented
- Evidence: Counter text switches to red style when over POST_MAX_LENGTH and the Post button is disabled whenever input is empty or over the limit.

  3.4 Manual Refresh control near top of feed.

- Status: Implemented
- Evidence: A "Refresh" button appears in the header row next to "Global Feed" and calls router.refresh() when clicked.

### Post Card Design

3.5 Each post card includes avatar, username/display name, clickable username, timestamp, content, and like/reply buttons with counts.

- Status: Implemented
- Evidence: PostCard renders an Avatar, display name or username, an `@username` label linked to the profile page, a subtle timestamp, post content, and like/reply buttons with counts.

  3.6 Liked posts show like icon/count in active color.

- Status: Implemented
- Evidence: Like button uses a blue text color when liked vs muted hover state when not liked.

  3.7 Optimistic UI for like/reply, with error chip and revert on backend failure.

- Status: Implemented
- Evidence: Likes and replies update local state immediately; on error, the previous state is restored and a small red error chip appears under the card.

## 4. Replies (Under Posts)

4.1 Replies appear directly beneath parent post, slightly indented.

- Status: Implemented
- Evidence: Replies render in a list with a left border and padding, visually nested under the parent post.

  4.2 Each reply shows avatar, username, text, and timestamp.

- Status: Implemented
- Evidence: Reply items display an Avatar, author name and @username, formatted timestamp, and reply content.

  4.3 Reply composer appears when Reply button is clicked, with X/N counter and disabled submit when over limit.

- Status: Implemented
- Evidence: Clicking Reply toggles a small composer with textarea, live `X / N` counter, red error color when over REPLY_MAX_LENGTH, and disabled submit when empty or over limit.

## 5. Profile Page (Center Column)

5.1 Profile page reuses center column layout with profile header, refresh, and list of that user’s posts.

- Status: Implemented
- Evidence: In profile context, FeedClient renders a profile header with avatar, username, optional display name and bio, a Refresh button, and that user’s posts in the same card style as the global feed.

  5.2 Profile header: large avatar, username (primary), display name (secondary), short bio, Edit Profile for own profile.

- Status: Implemented
- Evidence: Profile header uses a larger Avatar, shows `@username` and optional displayName, displays bio text if present, and shows an "Edit profile" button when viewing own profile.

  5.3 Profile edit UI: displayName and bio fields with X/N counter and red error state when over limit.

- Status: Partially implemented
- Evidence: Edit profile page has displayName and bio fields with a static helper text about the bio limit, but does not include a live `X / N` counter or dynamic red error styling while typing.

  5.4 Profile edit UI: grid of 10 preset avatars with clickable selection.

- Status: Implemented
- Evidence: Edit profile page renders a 5x2 grid of avatar options (plus a "None" option) using radio inputs styled with Tailwind; clicking an avatar highlights it and sets the `avatarKey` form value.

  5.5 Profile edit UI: Save and Cancel buttons.

- Status: Partially implemented
- Evidence: A primary "Save changes" button is present; there is no explicit Cancel button (user can navigate away via browser controls instead).

## 6. Auth Screens

6.1 Login screen: centered card with email/password, primary login button, and link to registration.

- Status: Implemented
- Evidence: Login page shows a centered card with email and password fields, a full-width Log in button, and a text link to the registration page.

  6.2 Login screen: area for displaying validation/auth errors.

- Status: Partially implemented
- Evidence: Server logic redirects back with an `error` query param on failure, but the login UI does not yet read and display that error message on the page.

  6.3 Registration screen: email, username, password (and optional confirm), clear error messages for duplicate username/email or invalid input.

- Status: Implemented
- Evidence: Registration screen has fields for email, username, and password plus a link back to login. Duplicate/invalid input errors are propagated via an `error` query param and now shown in a red error box under the form when present.

## 7. States and Feedback

7.1 Loading states: skeletons or simple "Loading..." text for feed and profile while fetching.

- Status: Implemented
- Evidence: Root app loading and profile loading components render centered cards with "Loading feed..." and "Loading profile..." text while data is being fetched.

  7.2 Empty states: "No posts yet" for empty feed; "This user hasn’t posted anything yet." on profile.

- Status: Implemented
- Evidence: The feed shows a "No posts yet." message when there are no items, and the profile view now shows a tailored "This user hasn’t posted anything yet." message when that user has no posts.

  7.3 Error states: global errors as banners; action-specific errors as small chips near controls.

- Status: Implemented
- Evidence: Global feed errors are shown via a banner-like box above content; action-specific failures (post, like, reply) appear as small red chips near the relevant post or reply composer.

## 8. Tailwind Usage Guidelines

8.1 Use Tailwind utilities for layout, typography, and colors.

- Status: Implemented
- Evidence: All major components use Tailwind classes for layout and styling (flex, spacing, text colors, borders, etc.).

  8.2 Use consistent spacing scale.

- Status: Implemented
- Evidence: Spacing and sizes consistently use Tailwind’s spacing scale (e.g., px-3, py-2, mt-2, gap-4) across components.

  8.3 Use a small set of accent colors (primary, error red, muted grays).

- Status: Implemented
- Evidence: The UI uses blue for primary actions and active likes, red variants for errors, and muted grays for text and borders; there is no large or inconsistent color palette.

  8.4 Implement components (post card, composer, nav, profile header) as reusable React components.

- Status: Implemented
- Evidence: Core UI pieces like FeedClient, PostCard (inner component), Avatar, and the profile header block are reusable structures that can be invoked from different pages.

## Summary of gaps

- Mobile nav does not provide an alternative top bar; the left nav is simply hidden on small screens, which is acceptable but falls short of the optional enhancement described in the design.
