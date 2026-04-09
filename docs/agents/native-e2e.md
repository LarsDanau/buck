# Native E2E Guidance

`apps/native/E2E` contains Maestro end-to-end coverage for the native app.

## Structure

- `full/` contains the full-branch suite that runs on `master` and `staging`.

## Writing Guidance

- Prefer stable `testID` selectors over visible text when possible.
- Keep flows focused on real user journeys.
- Prefer assertions over sleeps.
- Keep selectors and assertions resilient across iOS and Android.
- Add new flows close to the feature area they validate when the suite grows.

## Scope

- Use this directory only for native app E2E coverage.
- Do not place cross-repo or root-level E2E assets here.
