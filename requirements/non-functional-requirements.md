### Non-Functional Requirements

**Performance and responsiveness**

- Under a normal load of up to 100 concurrent active users, the system shall respond to:
  - Feed and profile page requests within 500 ms server processing time for 95% of requests.
  - Post, like, and reply submissions within 300 ms server processing time for 95% of requests.
- The system should render optimistic UI feedback (e.g., showing a new post in the list, toggling like state, showing a new reply) within 150 ms on a typical desktop environment for 95% of interactions.
- The system shall ensure that manual refresh of feed or profile views completes within 1 second server processing time for 95% of requests under normal load.
- The system may degrade gracefully (e.g., slower responses but still functional) when load exceeds 100 concurrent users, and it shall not crash or corrupt persisted data solely due to overload.

**Scalability and capacity**

- The system shall be designed so that storage and processing for posts, likes, and replies may be scaled horizontally or vertically without changes to client-visible behavior.
- The system should be able to store at least several hundred thousand posts and associated likes/replies without significant degradation in query performance for typical feed and profile views under the specified load.
- The system may implement pagination or cursor-based loading to maintain acceptable performance as data volume grows.

**Availability and reliability**

- For a production deployment, the system should target at least 99% uptime over a 30-day period, excluding planned maintenance windows.
- The system shall ensure that backend errors for write operations (post, like, reply, profile update) do not result in partial or corrupted records.
- The system shall ensure that client-visible UI state for posts, likes, and replies converges to backend state after page reload or manual refresh, even following previous optimistic failures.

**Usability and UX**

- The application shall be optimized for desktop web browsers; it shall render correctly and be fully usable without requiring a mobile layout.
- The system shall provide clear, concise error messages or chips when actions fail (e.g., “Failed to save like. Please try again.”), without exposing low-level technical details.
- The system shall provide discoverable manual refresh controls (e.g., labeled buttons or clearly recognizable icons) on feed and profile timelines.
- The system should provide consistent layout and visual styling across all primary views (login, registration, feed, profile, post/reply forms).

**Security**

- The system shall store user passwords in a form that is not reversible (e.g., using appropriate hashing and salting mechanisms, to be detailed separately).
- The system shall restrict any write operations (create/edit posts, likes, replies, profile edits) to authenticated users only.
- The system shall validate all user inputs on the server side, in addition to any client-side validations, to prevent malformed or malicious data from being persisted.
- The system should protect against common web vulnerabilities such as injection attacks and cross-site scripting by sanitizing or encoding user-generated content before rendering.

**Privacy**

- The system shall not expose users’ passwords or sensitive authentication tokens in any responses or logs.
- The system shall treat all profile information and posts as public by design and shall not implement private profile or post visibility controls.
- The system should avoid logging full sensitive payloads (e.g., raw passwords) and may log only non-sensitive metadata required for debugging and analytics (to be refined under logging requirements).

**Accessibility**

- The system should ensure that core features (viewing feed, reading posts, creating posts/replies, liking) are accessible via keyboard navigation.
- The system should use semantic HTML and ARIA attributes where appropriate to make key UI elements (buttons, forms, error messages, refresh controls) understandable to assistive technologies.
- The system should provide sufficient color contrast in character counters and error indicators (including the red error state) to remain distinguishable for users with visual impairments.
