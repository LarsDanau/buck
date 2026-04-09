# buck

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React Native, Expo, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **Encrypted local database** - SQLCipher-backed SQLite database with the key stored in SecureStore
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

For the native app database setup, use a rebuilt native binary such as `bun --cwd apps/native run ios` or `bun --cwd apps/native run android`.
Expo Go is not sufficient for verifying the encrypted database, because SQLCipher is enabled through the native `expo-sqlite` config plugin.

## Local Database

The Buck native app uses one shared local SQLite client defined in [apps/native/src/db/client.ts](/Users/larsdanau/Documents/github/buck/apps/native/src/db/client.ts).

- The native binary enables SQLCipher with `useSQLCipher: true` in [apps/native/app.config.ts](/Users/larsdanau/Documents/github/buck/apps/native/app.config.ts).
- The runtime opens `buck.db`, applies `PRAGMA key`, enables foreign keys, and verifies the schema before exposing the typed Drizzle client.
- The database key is generated once and stored in SecureStore.
- App runtime code can import the singleton directly with `import { db } from "@/db/client"`.
- Feature code should prefer shared DB query helpers and domain actions over direct Drizzle access.
- [apps/native/src/db/provider.tsx](/Users/larsdanau/Documents/github/buck/apps/native/src/db/provider.tsx) is still required at the app root so migrations and one-time bootstrap data finish before feature UI renders.

## Git Hooks and Formatting

- Full repo quality gate: `bun run check`

## Project Structure

```
buck/
├── apps/
│   ├── native/      # Mobile application (React Native, Expo)
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run check-types`: Check TypeScript types across workspace packages
- `bun --cwd apps/native run dev`: Start the React Native/Expo development server
- `bun run check`: Check formatting, linting, and vulnerabilities
