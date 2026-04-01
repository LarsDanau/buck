# Buck native E2E

This directory contains Maestro end-to-end tests for the native app.

## Structure

- `full/` contains the full branch suite that runs on `master` and `staging`.

## Writing guidance

- Prefer stable `testID` selectors over visible text when possible.
- Keep flows focused on real user journeys.
- Avoid brittle timing assumptions. Prefer assertions over sleeps.
- Add new flows close to the feature area they validate when the suite grows.
- Keep selectors and assertions resilient across iOS and Android.

## Scope

- Use this directory only for native app E2E coverage.
- Do not place cross-repo or root-level E2E assets here.
