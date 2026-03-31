# Technology and Library Stack

## Framework and Runtime

- Application framework: Next.js (App Router, TypeScript).
- Rendering: React (server and client components where appropriate).
- Styling: Simple CSS modules or Tailwind CSS (whichever is fastest to implement).

## Data and Persistence

- ORM: Prisma.
- Database (development): SQLite (file-based) for minimal setup overhead.
- Database seeding: Prisma seed script (TypeScript) creating sample users, posts, replies, and likes.

## Authentication and Sessions

- Authentication: Email/password based credentials.
- Session handling: Next.js server-side session storage mechanism (for example, NextAuth.js credentials provider or a minimal custom session implementation).

## Testing

- Test runner (unit/integration): Jest via next/jest.
- React component tests: @testing-library/react and @testing-library/jest-dom.
- E2E tests: @playwright/test (Playwright) for a small number of critical UI journeys.

## Logging

- Logging interface: Central logger module (logger.ts) emitting structured JSON to console.
- Log fields: timestamp, level, static message template, action, userId, targetId, success, errorCode, requestId/correlationId, affectedCount, resultCount.

## Tooling and DX

- Package manager: npm or yarn (whichever your environment prefers).
- Type checking: TypeScript.
- Linting/formatting: Optional ESLint/Prettier, only if time permits within the 1.5-hour constraint.
