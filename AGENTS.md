# AGENTS.md

Buck is a Turborepo monorepo for a local-first Expo personal finance app with shared domain and database packages.

## Essentials

- Use `bun`.
- Use `turbo` for workspace tasks.
- Prefer filtered workspace commands over whole-repo runs when possible.
- Confirm workspace names from each package's `package.json`; do not use the root package name for `--filter`.
- Repo-wide typecheck: `bun run check-types`
- Repo-wide verification: `bun run check`

## Read Next

- [Workspace architecture](docs/agents/workspace.md)
- [Git workflow and change scope](docs/agents/git-workflow.md)
- [Native app guidance](docs/agents/native-app.md)
- [Native database boundaries](docs/agents/native-database.md)
- [DB package guidance](docs/agents/db-package.md)
- [Native E2E guidance](docs/agents/native-e2e.md)
- [TypeScript conventions](packages/docs/TYPESCRIPT.md)
