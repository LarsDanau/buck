# Buck - native app

This is a mobile app built with Expo (react-native) intended for iOS and Android devices.

Buck makes is easier to manage personal finance. Track transactions, analytics, budgets, and more.
Some main items are:

- Open source
- Free forever, no payments, no paywall and no advertisements
- Completely local, offline and encrypted

## Package manager

This app uses `bun` as package manager

## Local database

- The native app uses one shared local database client exported from `src/db/client.ts`.
- The app root must mount `src/db/provider.tsx` so migrations and one-time bootstrap work complete before feature UI renders.
- The database is intended to be encrypted with SQLCipher. This only applies in a rebuilt native binary that includes the `expo-sqlite` config plugin with `useSQLCipher: true`.
- Expo Go should not be treated as proof that the database is encrypted.
- The SQLCipher key is stored in SecureStore and applied with `PRAGMA key` before the first schema read.
- Import `db` directly only in the native DB runtime.
- In feature code, prefer shared DB query helpers and domain actions over direct Drizzle access.

## Typscript

For TypeScript conventions, see ../../packages/docs/TYPESCRIPT.md

## Testing

For Testing conventions, see ./docs/TESTING.md

## Documentation

For comment and JSDoc conventions, see ../../packages/docs/COMMENTS.md

## Architecture / structure

For native database flow and ownership boundaries, see `./docs/DATABASE.md`
