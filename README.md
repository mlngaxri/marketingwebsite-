# Fourthform marketing website

Editorial marketing site with an animated website object, selected work, process, interactive client portal preview, scheduled States and clear Site/First/Core/Pro pricing. Includes preview onboarding, draft recovery and illustrative checkout.

## Local development

Requires Node.js 22.6+. Run `npm ci`, then `npm run dev`; open http://localhost:3000. Run `npm run typecheck` and `npm run build` for checks.

- `/` — marketing website
- `/preview` — full product preview
- `/preview/start` — Site onboarding
- `/preview/start?package=first` — First onboarding

Browser tests: set `PREVIEW_URL` to the running local URL and `TEST_CHROME` to a Chromium executable, then run `npm run test:browser`. Screenshot evidence is generated under `docs/preview-evidence`.

## Deployment

Import this repository into the Vercel project serving https://fourthform-marketing.vercel.app/. The framework is Next.js. No service credentials are required for this preview. This commit does not itself link or deploy the Vercel project.

The primary Client portal link uses https://fourthform-client-portal.vercel.app/. The embedded portal and onboarding handoff stay on the marketing origin for consistent browser-local data. Its source matches the standalone client portal repository.

## Preview boundary

Onboarding and checkout are illustrations. They do not create real accounts or charge cards. Password input is never persisted. The embedded portal uses example data and verified device storage, with no real CMS, SEO crawler, analytics or payment integration. Production service code from the larger source pack is intentionally outside these preview repositories.

Local fonts, reduced-motion handling, image loading, responsive screens, keyboard dialogs and preview journey checks are included. See `docs/LOCAL_ACCEPTANCE.md` for the tested scope.
