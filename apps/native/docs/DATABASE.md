# Buck native - Database

## Overview

Buck uses one shared local SQLite database client for the native app runtime.

- SQLite driver: `expo-sqlite`
- ORM: `drizzle-orm/expo-sqlite`
- Encryption key storage: `expo-secure-store`
- Encryption engine: SQLCipher via the `expo-sqlite` config plugin

## Current flow

1. `src/db/key.ts` reads or creates the one SQLCipher key and stores it in SecureStore.
2. `src/db/client.ts` opens `buck.db` once for the app runtime.
3. `src/db/client.ts` applies `PRAGMA key` before the first schema read.
4. `src/db/client.ts` exports the singleton `buckDb` and typed Drizzle client `db`.
5. `src/db/provider.tsx` runs `useMigrations(db, migrations)`.
6. `src/db/provider.tsx` waits for one-time bootstrap work from `src/db/bootstrap.ts`.
7. Feature code imports `db` directly from `@/db/client`.

## Usage

Import the singleton Drizzle client directly:

```ts
import { db } from "@/db/client";
```

Use `databaseClient` only when code needs both layers:

```ts
import { databaseClient } from "@/db/client";

const { sqlite, db } = databaseClient;
```

Keep `DatabaseProvider` mounted at the app root so schema migrations and bootstrap data complete before feature UI renders.
