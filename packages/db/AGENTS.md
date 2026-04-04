# Buck DB package

This package owns the following DB items:

- Schema
- Relations
- Migrations
- Repository/query functions
- DB facing zod schemas
- Shared data contracts

This package does not own the native runtime database client.
The singleton SQLite/Drizzle client, SQLCipher key application, and app startup flow live in `apps/native/src/db`.
