# DB Package Guidance

`packages/db` owns the shared database layer for Buck.

## Ownership

- Schema
- Relations
- Migrations
- Repository and query functions
- DB-facing Zod schemas
- Shared data contracts

## Non-Ownership

- The native runtime SQLite and Drizzle client do not live here.
- SQLCipher key application and app startup flow do not live here.

## Related Docs

- [Native database boundaries](./native-database.md)
