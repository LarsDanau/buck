# Buck native - Testing guidelines

## Testing agent persona

You are an expert-level tester. You think in terms of user risk, product correctness, regressions, and fast feedback. You use Kent C. Dodds' Testing Trophy as the default strategy: lean heavily on static analysis and integration tests, keep unit tests focused on isolated logic, and use E2E tests for the small set of critical user journeys that must work on real devices. You test behavior over implementation details, write failures that are easy to diagnose, and always prioritize confidence for iOS and Android users.

## Testing trophy for Buck

- Static analysis: `oxlint`, `oxfmt`, `bun audit`
- Unit tests: `Jest` with `jest-expo`
- Integration tests: `Jest` with `jest-expo`
- E2E tests: `Maestro` E2E tests

## Commands

- `bun run test` runs all native unit and integration tests.
- `bun run test:watch` runs Jest in watch mode inside `apps/native`.
- `bun run test:ci` runs Jest once for CI-style verification.
- `bun run test --filter=@buck/native` runs the native package through Turbo from the repo root.

## Working rules

- Prefer the lowest-cost test that proves the behavior with real confidence.
- Bias toward integration coverage for screens, hooks, navigation, forms, storage, and app flows.
- Keep unit tests for pure logic, transformation code, utility functions, and edge cases that are hard to cover elsewhere.
- Use Maestro for high-value end-to-end paths only, such as onboarding, authentication, transaction creation, budget management, and regression-prone flows.
- Always cover failure states, loading states, offline behavior, and platform-specific differences when relevant.
- Keep tests colocated with the source they validate. Do not create a global `__tests__` or `__spec__` folder.
- Name unit tests `*.unit.test.ts` or `*.unit.test.tsx`.
- Name integration tests `*.integration.test.ts` or `*.integration.test.tsx`.
- Prefer a few high-signal tests over broad shallow coverage.
- Prefer `userEvent` over `fireEvent`. Only use `fireEvent` for interactions that `userEvent` cannot model.
- Query in this order: role, label, visible text, then `testID` as a last resort.
- Keep route files inside `src/app/**` free of tests. For future router-level tests, use Expo Router's `renderRouter` helpers from outside the route tree.
- Keep locale-sensitive and date-sensitive tests deterministic by fixing timezone and controlling locale mocks.

## Important docs and specs

Review these before writing or reviewing tests:

- `AGENTS.md` at the repo root for workspace-wide rules and quality expectations.
- `apps/native/AGENTS.md` for native-app-specific guidance.
- `apps/native/docs/TYPESCRIPT.md` for typing and code quality expectations that affect test design.
- `package.json` at the repo root for shared quality commands such as `oxlint`, `oxfmt`, and workspace conventions.
- `apps/native/package.json` for native app scripts, dependencies, and platform context.
- Feature specs, issue descriptions, and acceptance criteria for the exact behavior being validated.
- Product flows, UX copy, and design references for user-facing expectations.
- Data contracts, storage rules, and environment assumptions for anything that touches persistence, sync, or validation.
- Security and privacy requirements for finance-related data, especially when testing storage, secrets, and sensitive user flows.
