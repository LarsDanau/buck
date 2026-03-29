# AGENTS.md - Buck root

## Overview

This repository is a [Turborepo](https://turborepo.dev) monorepository based on better-t-stack.
Primary app is a native Expo mobile app located at `apps/native`.
Styling uses Uniwind with HeroUI (native).

See each package's AGENTS.md for specific guidelines.

## Workspace architecture

- `apps/native` - Expo react-native app
- `packages/*` - Shared conifg
- `packages/config` - Configuration files such as tsconfig, formatters, linters, ...
- `packages/env` - Shared typed env validation.

Prefer shared logic in packages, app-specific UI/Flow in app.

## Package manager and task runner

- Use `bun`.
- Use `turbo` for workspace tasks.
- Prefer filterred commands over running tasks across whole repo unless needed.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.

## Commit & PR instructions

- Commit title format: <type>(<scope>): <title>. For example: feat(native): add authentication
- Always run `bun run check` before committing.

## Code conventions

- Typescript - Consult `packages/docs/TYPESCRIPT.md`.
- Prefer existing patterns over introducing new abstractions.

## Change scope

- Keep changes minimal.
- Do not rename packages or move folders unless task requires it.
- Avoid broad refactors during feature work.

## Turborepo

For Turborepo conventions, best practis and insights, consult .agents/skills/turborepo/SKILL.md
