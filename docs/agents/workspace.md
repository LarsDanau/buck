# Workspace Architecture

## Repo Shape

- `apps/native`: Expo React Native app for iOS and Android.
- `packages/config`: shared TypeScript, lint, format, and tooling config.
- `packages/domain`: shared business and domain logic.
- `packages/db`: shared schema, migrations, repositories, and DB-facing contracts.

## Boundaries

- Keep shared logic in packages and app-specific UI and flows in `apps/native`.
- `app` workspaces may depend on `config`, `domain`, and `db`.
- `domain` workspaces must not depend on `app` or `db`.
- `db` workspaces may depend on `config` and `domain`.

## Related Docs

- [TypeScript conventions](../../packages/docs/TYPESCRIPT.md)
