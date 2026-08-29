# IRCTC Backend, Voice, and Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a synthetic Vercel backend, multilingual voice and natural-language route input, timing-aware recommendations, stored-intent disruption recovery, heavy-traffic queue behavior, expanded route data, and revamped mock authentication/profile flows to the IRCTC Reimagined mobile website.

**Architecture:** Move railway fixtures and deterministic business rules out of the monolithic `src/App.tsx` into typed data and service modules. Keep the UI on stable service contracts while adding Vercel-compatible `/api` handlers that use the same synthetic fixtures and return explicit loading, queue, success, and error states. Preserve the current website navigation and route-to-ticket-to-journey flow while making the normalized journey request the shared source of truth for search and recovery.

**Tech Stack:** React 19, TypeScript, Vite, Vercel serverless API routes, Vitest, Testing Library, Lucide icons, and browser `SpeechRecognition`/`webkitSpeechRecognition` where available.

**Spec:** `docs/superpowers/specs/2026-08-29-irctc-backend-and-voice-design.md`

## Global Constraints

- Use synthetic railway records, mock users, mock tickets, and simulated payment only.
- Keep the product a mobile-first public website with simple English default copy and twelve language choices.
- Do not claim universal browser speech support; always provide typed fallback and an interpreted-fields confirmation step.
- Store the normalized journey request as the source for disruption recovery.
- Treat the prototype queue as deterministic and user-visible; do not describe it as a real reservation or durable production queue.
- Preserve the existing route-aware result and journey-mode behavior while replacing hard-coded data access.
- Validate all API inputs and return consistent JSON errors without exposing credentials.
- Run focused tests after each task and `npm test`, `npm run lint`, and `npm run build` before deployment.

---

### Task 1: Establish typed domain contracts and synthetic datasets

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/data/stations.ts`
- Create: `src/data/trains.ts`
- Create: `src/data/users.ts`
- Create: `src/data/disruptions.ts`
- Create: `src/data/index.ts`
- Test: `src/domain/types.test.ts`

**Interfaces:**
- Produces `Language`, `JourneyRequest`, `TrainResult`, `ConnectionLeg`, `SearchReference`, `User`, `Session`, `Disruption`, `RecoveryOption`, and `QueueState` types.
- Produces station alias records, at least six route families, multiple trains per family, at least one connecting-only route, mock users, and deterministic disruption fixtures.

- [ ] **Step 1: Write contract tests for the required route coverage and discriminated states.** Assert that the fixture set includes the existing Chennai–Bengaluru route, at least five additional origin/destination families, a route with no direct service, and available/waitlist/full train states.
- [ ] **Step 2: Run `npx vitest run src/domain/types.test.ts` and confirm the new fixture exports are not yet available.**
- [ ] **Step 3: Add the domain types and fixture records with stable IDs, station aliases, departure/arrival minutes, fares, classes, transfer metadata, and synthetic availability.** Keep display formatting separate from stored values.
- [ ] **Step 4: Run `npx vitest run src/domain/types.test.ts` and confirm the coverage assertions pass.**
- [ ] **Step 5: Commit with `git add src/domain src/data && git commit -m "feat: add synthetic railway domain data"`.**

### Task 2: Build deterministic search, ranking, and no-direct fallback services

**Files:**
- Create: `src/services/searchService.ts`
- Create: `src/services/recommendationService.ts`
- Create: `src/services/searchService.test.ts`
- Create: `src/services/recommendationService.test.ts`

**Interfaces:**
- Consumes: `JourneyRequest` and data exports from Task 1.
- Produces: `normalizeStationName(value: string): string`, `findDirectTrains(request: JourneyRequest): TrainResult[]`, `findConnectingTrains(request: JourneyRequest): TrainResult[]`, and `getRecommendations(request: JourneyRequest): RecommendationResponse`.
- `RecommendationResponse` contains `directAvailable`, `results`, `summary`, `suggestions`, and `searchReference`.

- [ ] **Step 1: Write failing tests for route filtering, class filtering, time-window ordering, direct results, connecting results, and empty results.** Include a no-direct case that returns a transfer station and transfer duration.
- [ ] **Step 2: Run both focused service test files and verify they fail because the service functions do not exist.**
- [ ] **Step 3: Implement station normalization, time preference scoring, class compatibility, direct ranking, one-change composition, and deterministic search-reference creation.** Rank direct trains before alternatives and expose explanation metadata for every result.
- [ ] **Step 4: Add tests for stored intent: changing origin, destination, date, class, or time preference changes the recommendation payload rather than only the heading.**
- [ ] **Step 5: Run `npx vitest run src/services/searchService.test.ts src/services/recommendationService.test.ts` and confirm all cases pass.**
- [ ] **Step 6: Commit with `git add src/services && git commit -m "feat: add route recommendations and connecting journeys"`.**

### Task 3: Add multilingual natural-language parsing

**Files:**
- Create: `src/services/languageCatalog.ts`
- Create: `src/services/naturalLanguageParser.ts`
- Create: `src/services/naturalLanguageParser.test.ts`

**Interfaces:**
- Consumes: station aliases, language IDs, and `JourneyRequest` types from Tasks 1–2.
- Produces `parseJourneyText(text: string, language: Language, defaults: Partial<JourneyRequest>): ParseResult`.
- `ParseResult` contains `requestPatch`, `matchedStations`, `confidence`, `missingFields`, and `message`.

- [ ] **Step 1: Write failing tests for English and at least four Indian-language phrase patterns covering route connectors, relative dates, morning/evening timing, passenger count, and class.** Include mixed-script and transliterated inputs such as “Mumbai se Pune kal”.
- [ ] **Step 2: Run `npx vitest run src/services/naturalLanguageParser.test.ts` and verify the parser tests fail.**
- [ ] **Step 3: Implement deterministic normalization dictionaries for station aliases, route connectors, date phrases, time phrases, class phrases, and passenger phrases across the twelve supported languages.** Return missing fields instead of guessing silently.
- [ ] **Step 4: Add tests for ambiguous stations, unknown stations, malformed dates, and empty speech transcripts.**
- [ ] **Step 5: Run the focused parser tests and confirm all expected patches and errors pass.**
- [ ] **Step 6: Commit with `git add src/services/languageCatalog.ts src/services/naturalLanguageParser.ts && git commit -m "feat: parse multilingual journey requests"`.**

### Task 4: Replace the voice stub with a real recognition adapter and fallback

**Files:**
- Create: `src/services/voiceService.ts`
- Create: `src/services/voiceService.test.ts`
- Modify: `src/App.tsx` voice state and handlers
- Modify: `src/App.test.tsx` existing speech test and fallback coverage

**Interfaces:**
- Consumes: selected `Language` and `parseJourneyText` from Task 3.
- Produces `createVoiceRecognition(options: VoiceRecognitionOptions): VoiceController`, with `start`, `stop`, `isSupported`, and lifecycle callbacks for `listening`, `transcript`, `parsed`, `permission-denied`, `unsupported`, and `error`.

- [ ] **Step 1: Extend tests for supported recognition, selected-language locale, final transcript parsing, unsupported browsers, permission errors, stop/cancel, and typed fallback.**
- [ ] **Step 2: Run the focused voice and App tests and confirm the new cases fail.**
- [ ] **Step 3: Implement the adapter against `SpeechRecognition` and `webkitSpeechRecognition`, map each language to a BCP-47 locale, consume final results, and pass transcripts to the parser.**
- [ ] **Step 4: Implement a visible “Type instead” fallback that focuses the route input and preserves the transcript for editing when recognition is unavailable or denied.**
- [ ] **Step 5: Update the UI to show the interpreted origin, destination, date, time, and class before applying them, with a clear correction action.**
- [ ] **Step 6: Run the focused tests and confirm browser support and fallback states pass.**
- [ ] **Step 7: Commit with `git add src/services/voiceService.ts src/App.tsx src/App.test.tsx && git commit -m "feat: add multilingual voice route input"`.**

### Task 5: Persist search references and implement disruption recovery

**Files:**
- Create: `src/services/searchReferenceStore.ts`
- Create: `src/services/recoveryService.ts`
- Create: `src/services/recoveryService.test.ts`
- Modify: `src/state` if a state directory is introduced for shared journey state
- Modify: `src/App.tsx` ticket, trips, journey, alerts, and recovery handlers

**Interfaces:**
- Consumes: `JourneyRequest`, selected train, disruption fixtures, and recommendation services.
- Produces `saveSearchReference(reference: SearchReference): void`, `getSearchReference(id: string): SearchReference | null`, and `getRecoveryOptions(reference: SearchReference, disruption: Disruption): RecoveryOption[]`.

- [ ] **Step 1: Write failing tests for delay recovery, cancellation recovery, class compatibility, arrival-time preference, transfer safety, no recovery option, and route propagation into the recovery explanation.**
- [ ] **Step 2: Run the focused recovery tests and confirm they fail.**
- [ ] **Step 3: Implement local persistence for the latest search reference and deterministic scoring of next-best trains using the original request, not the visible card alone.**
- [ ] **Step 4: Add UI states that show the stored request, disruption impact, ranked alternative, trade-offs, and a retry search action.**
- [ ] **Step 5: Run recovery tests plus the existing ticket/journey tests and confirm the original route remains intact for the normal flow.**
- [ ] **Step 6: Commit with `git add src/services src/App.tsx src/App.test.tsx && git commit -m "feat: add stored journey intent and recovery options"`.**

### Task 6: Add the deterministic heavy-traffic queue

**Files:**
- Create: `src/services/queueService.ts`
- Create: `src/services/queueService.test.ts`
- Modify: `src/App.tsx` search loading and result states
- Modify: `src/App.css` queue progress and status styles

**Interfaces:**
- Consumes: search-reference ID and a demo traffic mode.
- Produces `getQueueState(requestId: string, trafficMode: TrafficMode, now?: number): QueueState` and `advanceQueue(requestId: string): QueueState`.

- [ ] **Step 1: Write failing tests for `clear`, `queued`, and `admitted` states, deterministic position/wait time, preserved request ID, and retry/cancel transitions.**
- [ ] **Step 2: Run `npx vitest run src/services/queueService.test.ts` and confirm failure.**
- [ ] **Step 3: Implement deterministic queue state and a demo traffic toggle that does not claim a real booking slot.**
- [ ] **Step 4: Add the mobile queue card with position, estimated wait, progress, cancel, retry, and continue actions.**
- [ ] **Step 5: Run the queue tests and existing search tests.**
- [ ] **Step 6: Commit with `git add src/services/queueService.ts src/App.tsx src/App.css && git commit -m "feat: add heavy traffic queue state"`.**

### Task 7: Add mock backend API routes and client adapters

**Files:**
- Create: `api/search.ts`
- Create: `api/recommendations.ts`
- Create: `api/auth/login.ts`
- Create: `api/auth/signup.ts`
- Create: `api/queue/[requestId].ts`
- Create: `api/recovery.ts`
- Create: `src/services/apiClient.ts`
- Create: `src/services/apiClient.test.ts`
- Create: `api/api.test.ts`
- Modify: `vite.config.ts` only if local API proxying is required

**Interfaces:**
- Consumes: service contracts and fixtures from Tasks 1–6.
- Produces JSON handlers for `POST /api/search`, `POST /api/recommendations`, `POST /api/auth/login`, `POST /api/auth/signup`, `GET /api/queue/:requestId`, and `POST /api/recovery`.
- Produces `apiClient.search(request)`, `apiClient.recommend(request)`, `apiClient.login(credentials)`, `apiClient.signup(input)`, `apiClient.queue(requestId)`, and `apiClient.recover(input)`.

- [ ] **Step 1: Write handler tests for valid payloads, missing fields, invalid stations, no-direct routes, auth errors, queue status, and recovery responses.**
- [ ] **Step 2: Run the API tests and confirm the handlers are missing or fail validation.**
- [ ] **Step 3: Implement shared request parsing and response helpers with `{ data }` success and `{ error: { code, message, fields } }` failure shapes.**
- [ ] **Step 4: Implement each Vercel handler using deterministic service calls; never return passwords or imply real availability/payment.**
- [ ] **Step 5: Implement the browser client adapter and a local fallback mode so Vite development remains usable without a deployed API function.**
- [ ] **Step 6: Run API and client tests, then execute `npm run build` to validate the Vercel-compatible TypeScript surface.**
- [ ] **Step 7: Commit with `git add api src/services/apiClient.ts vite.config.ts && git commit -m "feat: add synthetic Vercel API boundary"`.**

### Task 8: Revamp mock login, signup, onboarding, and profile

**Files:**
- Create: `src/services/authService.ts`
- Create: `src/services/authService.test.ts`
- Create: `src/components/AuthDialog.tsx`
- Create: `src/components/ProfilePanel.tsx`
- Modify: `src/App.tsx` authentication/session/profile integration
- Modify: `src/App.css` auth/profile mobile styles
- Modify: `src/index.css` only for shared form focus styles if required

**Interfaces:**
- Consumes: mock users, language catalog, and API client from Tasks 1 and 7.
- Produces `loginDemo(credentials): Session`, `signupDemo(input): Session`, `logoutDemo(): void`, `getStoredSession(): Session | null`, and profile preference updates.

- [ ] **Step 1: Write tests for valid demo login, invalid credentials, short signup onboarding, session persistence, logout, language preference, Easy Mode, and saved passenger updates.**
- [ ] **Step 2: Run the focused auth tests and confirm they fail.**
- [ ] **Step 3: Implement mock credential validation and local session persistence with no real password storage or external identity calls.**
- [ ] **Step 4: Build a two-step mobile onboarding flow: identity plus preferences, with a clearly labeled demo quick-login path.**
- [ ] **Step 5: Replace the visually detached profile treatment with a cohesive profile panel that shares the website header, spacing, and blue palette.**
- [ ] **Step 6: Run auth tests and the existing language/profile tests.**
- [ ] **Step 7: Commit with `git add src/services/authService.ts src/components src/App.tsx src/App.css src/index.css && git commit -m "feat: revamp mock auth and profile flows"`.**

### Task 9: Integrate the services into focused website components

**Files:**
- Create: `src/components/RouteSearchForm.tsx`
- Create: `src/components/VoiceSearch.tsx`
- Create: `src/components/TrainResults.tsx`
- Create: `src/components/QueueCard.tsx`
- Create: `src/components/RecoveryCard.tsx`
- Modify: `src/App.tsx` to compose the components and shared state
- Modify: `src/App.css` to preserve and consolidate the existing visual system
- Test: `src/components/RouteSearchForm.test.tsx`
- Test: `src/components/TrainResults.test.tsx`

**Interfaces:**
- Consumes all service contracts from Tasks 2–8.
- Produces user-visible search, voice confirmation, queue, result, auth/profile, ticket, and recovery states with route/date/class/timing propagation.

- [ ] **Step 1: Write component tests for typed station suggestions, timing input, class changes, immediate recommendation updates, no-direct copy, voice confirmation, queue preservation, and recovery actions.**
- [ ] **Step 2: Run focused component tests and confirm they fail against the current monolithic implementation.**
- [ ] **Step 3: Extract the form, voice panel, result cards, queue card, and recovery card while preserving accessible labels, live status regions, and mobile layout.**
- [ ] **Step 4: Wire shared search intent through results, booking, ticket, My Trips, Journey Mode, Alerts, and recovery.**
- [ ] **Step 5: Add a clearly labeled demo traffic control for rehearsing the queue and a deterministic disruption control for rehearsing recovery.**
- [ ] **Step 6: Run focused component tests and the complete existing `src/App.test.tsx` suite.**
- [ ] **Step 7: Commit with `git add src/components src/App.tsx src/App.css && git commit -m "feat: integrate route voice queue and recovery flows"`.**

### Task 10: Update documentation, validate the release, and redeploy

**Files:**
- Modify: `README.md`
- Modify: `docs/IRCTC_REIMAGINED_MASTER_PLAN.md`
- Modify: `docs/IRCTC_REIMAGINED_DEVELOPMENT_TRACKER.md`
- Modify: `docs/superpowers/specs/2026-08-29-irctc-backend-and-voice-design.md` only if an implemented contract materially differs
- Test: all existing and new test files

- [ ] **Step 1: Update README scope, architecture, API routes, demo credentials guidance, live Vercel URL, and explicit synthetic-data limitations.**
- [ ] **Step 2: Update the master plan and tracker to mark only evidence-backed features complete, add the backend/API phase, and record the browser speech and durable-queue limitations.**
- [ ] **Step 3: Run `npm test` and record the complete pass count.**
- [ ] **Step 4: Run `npm run lint` and resolve all reported errors.**
- [ ] **Step 5: Run `npm run build` and confirm the production bundle succeeds.**
- [ ] **Step 6: Run the local mobile walkthrough covering typed timing search, multilingual voice, no-direct fallback, queue, login/profile, and delay recovery.**
- [ ] **Step 7: Deploy with `npx vercel@latest --prod`, verify the production URL returns HTTP 200, and exercise the critical flows against the deployed build.**
- [ ] **Step 8: Commit documentation and verified implementation with `git add README.md docs src api package.json package-lock.json && git commit -m "feat: complete synthetic IRCTC backend experience"`.**
- [ ] **Step 9: Push `main` and compare local `git rev-parse HEAD` with `git ls-remote origin refs/heads/main`.**

## Plan self-review

- All five requested feature groups map to Tasks 1–9.
- The approved spec is the source document for contracts and limitations.
- No task relies on a real railway provider, payment provider, identity provider, or durable queue.
- Existing route editing, language switching, ticket, journey, and delay tests are explicitly retained.
- The plan has no unresolved placeholder markers or incomplete instructions.
