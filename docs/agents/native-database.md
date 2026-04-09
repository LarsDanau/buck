# Native Database Boundaries

- Buck uses one shared local SQLite client in `apps/native/src/db/client.ts`.
- The app root must mount `apps/native/src/db/provider.tsx` so migrations and one-time bootstrap finish before feature UI renders.
- Database runtime setup such as opening the database, applying the SQLCipher key, and exporting the singleton client belongs in `apps/native`.
- Shared schema, migrations, seed data, repositories, and DB-facing contracts belong in `packages/db`.
- The database is intended to be encrypted with SQLCipher through `apps/native/app.config.ts`.
- Expo Go is not proof that SQLCipher encryption is active; only a rebuilt native binary with `useSQLCipher: true` proves that path.
- Store the SQLCipher key in SecureStore and apply `PRAGMA key` before the first schema read.
- Import `db` directly only inside the native DB runtime.
- In feature code, prefer shared query helpers and domain actions over direct Drizzle access.
