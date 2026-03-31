### User Stories

**Accounts and profiles**

- As a Visitor, I want to sign up and create a user profile so that I can start posting and interacting with content.
- As a Registered User, I want to edit my profile information (display name, bio, avatar) so that my public presence reflects my identity.
- As a Registered User, I want my avatar to be chosen from a fixed set of approximately ten preset avatars provided by the app so that profile images are simple and safe to manage.
- As a Registered User, I want my avatar to be optional so that I can choose not to display any image.
- As a Registered User, I want to log in with my email and password so that I can securely access my account from a desktop browser.
- As a Registered User, I want to log out so that others using the same device cannot act as me.
- As a Visitor or Registered User, I want all user profiles to be public so that I can view any user’s profile and posts without having to request access.

**Posting and content**

- As a Registered User, I want to post a short text update with a clear length limit so that I can quickly share brief thoughts.
- As a Registered User, I want to see a live character counter (e.g., “X / 100”) when I type in text fields such as posts, replies, and bio so that I can keep my content within allowed limits.
- As a Registered User, I want the character counter label to turn red and prevent submission if I exceed the limit so that I immediately understand why the form cannot be submitted.
- As a Registered User, I want to see my new post appear in the feed immediately after submitting so that the interface feels responsive.

**Feed and profile navigation**

- As a Visitor, I want to view a global, chronological feed of recent posts from all users so that I can quickly see what is happening.
- As a Registered User, I want the global feed to load quickly even with many posts so that browsing does not feel sluggish on desktop.
- As a Visitor or Registered User, when I click on any user’s profile from the feed or elsewhere, I want to see that user’s public profile and all of their posts so that I can browse their content in one place.
- As a Registered User, when I click on my own profile, I want to see my public profile and all of my posts so that I can verify how my activity appears to others.
- As a Visitor or Registered User, I want a manual refresh control on feeds and profile timelines so that I can explicitly reload content when I want to see the latest state from the server.

**Likes and replies (optimistic but reliable)**

- As a Registered User, I want to like a post so that I can show appreciation for content I enjoy.
- As a Registered User, I want my like action to reflect in the UI immediately (button state and count) so that the app feels fast.
- As a Registered User, I want my like to be reliably stored so that when I refresh the feed, the liked state and counts remain consistent.
- As a Registered User, I want to reply to a post (one level deep) so that I can respond directly to what someone wrote.
- As a Registered User, I want my reply to appear immediately beneath the original post so that the conversation feels fluid.
- As a Registered User, I want the system to show me right away (without manual refresh) if a like or reply could not be saved on the backend, for example via a visible “failed to save” chip, so that I am not misled by an incorrect optimistic state.

**Visibility and constraints**

- As a Product Owner, I want there to be no private messaging capability so that the product scope remains focused on public microblogging.
- As a Product Owner, I want there to be no retweet/repost functionality so that content creation remains simple and original.
- As a Product Owner, I want there to be no follower graph so that the feed remains a single global timeline rather than a personalized network-based feed.
- As a Product Owner, I want all posts tied to registered usernames and all profiles to be public so that users are accountable and profiles stay meaningful.
- As a Product Owner, I want basic content moderation to be out of scope for v1 so that development can focus on core posting and interaction features.
