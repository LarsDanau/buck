# Native Database Flow

This document describes the current Buck local-data architecture.

## Layers

Buck currently uses three layers for local persistence:

1. `apps/native`
   Expo runtime, SQLite client setup, startup coordination, and feature UI.
2. `packages/domain`
   Domain entities, write-side validation, repository contracts, and shared app
   errors.
3. `packages/db`
   Drizzle schema, migrations, seed data, row mapping, query helpers, and
   repository implementations.

## Ownership

### `apps/native`

Owns:

- opening the SQLite database
- applying the SQLCipher key
- enabling connection-level PRAGMAs
- coordinating migrations and bootstrap work before UI renders
- feature hooks, screens, and app-specific state

Does not own:

- Drizzle schema definitions
- domain validation rules
- repository implementations

### `packages/domain`

Owns:

- domain entities and domain-level type aliases
- write-side validation
- repository contracts
- stable app/domain error types

Does not own:

- React Query
- Expo runtime details
- Drizzle or SQLite driver details

### `packages/db`

Owns:

- Drizzle schema
- migrations
- shared seed data
- repository implementations
- query helpers
- row-to-domain mapping

Does not own:

- Expo-specific runtime setup
- screen logic
- app presentation concerns

## Runtime Startup Flow

1. `apps/native/src/db/client.ts` opens the one native SQLite connection.
2. The SQLCipher key is loaded from SecureStore and applied before the first
   schema read.
3. `apps/native/src/db/provider.tsx` runs Drizzle migrations.
4. After migrations succeed, `apps/native/src/db/bootstrap.ts` ensures
   bootstrap seed data exists exactly once for the active database.
5. Only after those steps complete does the app tree render.

## Read And Write Guidance

- Reads should prefer shared DB query helpers in `@buck/db`.
- Writes should prefer domain actions in `@buck/domain`, backed by repository
  contracts implemented in `@buck/db`.
- Feature code should not import Drizzle tables or query builders directly.
- Shared packages should not import Expo runtime modules.

## Current Bootstrap Data

The app currently bootstraps default categories for a new local database. The
seed data lives in `packages/db`, while the decision to run bootstrap work at
startup remains in `apps/native`.
