# IRCTC Reimagined Backend, Voice, and Recovery Design

## Status

Approved direction on 2026-08-29. This design extends the original frontend-only prototype with a small, synthetic backend boundary required for the hackathon. It does not connect to IRCTC, real railway availability, real payments, or production identity systems.

## Goal

Make the IRCTC Reimagined website understand typed and spoken journey requests, recommend trains for a route and time preference, retain the passenger's original travel intent for disruption recovery, handle routes without direct trains clearly, show a heavy-traffic queue state, and provide simple mock login/profile flows.

## Product boundaries

- The experience remains a mobile-first public website rather than a dashboard or native app.
- All railway records, availability, delays, fares, credentials, tickets, and queue positions are synthetic.
- The interface remains simple English by default and retains twelve language choices with native-script names and translated core copy.
- Voice input uses browser speech recognition when available, with the selected language locale and a typed transcript fallback. The implementation must not promise universal browser support.
- A replaceable speech-provider adapter will be defined so a reliable server-side multilingual speech-to-text provider can be added later without changing the UI contract.
- Serverless in-memory state is not treated as a durable production queue. The prototype queue is deterministic and user-visible; a real deployment would use a durable store such as Redis/Upstash.

## Architecture

The React client will call small service modules through a stable interface. Vercel API routes will provide mock HTTP endpoints for search, recommendations, authentication, queue status, and disruption recovery. The UI may use the service modules directly in local development through the same response shapes, but all feature logic must be separated from presentation so the data source can be replaced.

The principal units are:

- `src/data/`: stations, route families, trains, users, sessions, tickets, and disruption fixtures.
- `src/services/`: search, natural-language parsing, speech recognition, recommendations, auth, queue, and recovery logic.
- `src/state/`: shared search intent, selected train, session, ticket, and disruption state.
- `src/components/`: focused search, voice, result, queue, auth, profile, ticket, and recovery surfaces.
- `api/`: Vercel-compatible mock endpoint handlers with deterministic synthetic responses.

## Journey request contract

Every typed or spoken request is normalized into this shape:

```ts
type JourneyRequest = {
  from: string
  to: string
  travelDate: string
  timePreference?: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night'
  arriveBy?: string
  className: string
  passengers: number
  source: 'typed' | 'voice'
  language: Language
  originalText?: string
}
```

The normalized request is stored as a search reference whenever the user runs a search. Recovery must read this stored request rather than infer intent from the currently displayed result card.

## Voice and natural-language behavior

1. The user chooses a language or uses the current interface language.
2. The voice adapter starts browser recognition with the matching BCP-47 locale where the browser exposes `SpeechRecognition` or `webkitSpeechRecognition`.
3. The final transcript is passed to the language-aware parser.
4. The parser recognizes station aliases, route connectors, relative dates, time phrases, class phrases, and passenger counts.
5. The UI shows the interpreted fields for confirmation and correction.
6. Unsupported recognition, denied microphone permission, empty transcripts, or parse failures return an actionable typed-input state.

The parser must use deterministic aliases and phrase dictionaries for the twelve supported languages in this prototype. It should not claim arbitrary-language understanding. The provider adapter interface may later accept a cloud transcript, but credentials and external speech calls are outside this implementation unless separately authorized.

## Search and recommendation behavior

Search filters the synthetic dataset by origin, destination, date availability, class compatibility, and time preference. Results are ranked in this order:

1. Direct service matching the requested time window.
2. Direct service outside the window, with the time trade-off explained.
3. One-change alternatives, ranked by total duration, transfer safety, fare, and arrival fit.

If no direct service exists, the results page must explicitly say so, show the best one-change option, identify the transfer station, include transfer time, and offer a route correction or nearby-station suggestion. If no viable route exists, it must show a clear empty state with the user's original request and a way to edit it.

At least six route families and multiple synthetic trains per family must be available, including direct and connecting examples. Search results must visibly change when the route, timing, date, or class changes.

## Stored intent and disruption recovery

The search reference stores the normalized request, selected train, search timestamp, and relevant constraints. A delay or cancellation fixture is evaluated against the stored intent. Recovery options are generated from the same train dataset and scored for:

- reaching the same destination;
- preserving the requested arrival/time preference;
- transfer count and transfer safety;
- class compatibility;
- additional fare and total travel time.

The UI must label the recommendation as synthetic, explain why it is the next best option, and show at least one alternative when available. A route with no viable recovery option must explain why and provide a way to search again.

## Heavy-traffic queue

The queue service returns a deterministic queue state based on a demo traffic mode:

```ts
type QueueState = {
  status: 'clear' | 'queued' | 'admitted'
  position?: number
  estimatedWaitSeconds?: number
  message: string
}
```

The search flow may enter `queued` before recommendations load. The page must explain that the queue protects the service during heavy traffic, preserve the user's journey request, show progress, and provide a safe retry/cancel action. The prototype can advance to `admitted` through a timer or demo control. It must never imply that a real booking slot or railway reservation has been secured.

## Authentication and profile

Mock users will be stored in synthetic fixtures. Login accepts a demo email/mobile and password or a clearly labeled demo quick-login path. Signup is a short onboarding flow: name, mobile/email, preferred language, and optional travel preference. The session is persisted locally for the demo and includes a logout action.

The profile page will use the same visual system as the public website and expose language, Easy Mode, saved passengers, preferred class, and demo account details. Credentials and tickets must be labelled as mock data and must not resemble real authentication or payment confirmation.

## API boundary

The initial Vercel handlers will use JSON and deterministic fixtures:

- `POST /api/search` — validate a `JourneyRequest`, return queue state or normalized search reference.
- `POST /api/recommendations` — return direct/connecting results and explanation metadata.
- `POST /api/auth/login` — return a mock session or safe validation error.
- `POST /api/auth/signup` — return a mock session and onboarding profile.
- `GET /api/queue/:requestId` — return deterministic queue progress.
- `POST /api/recovery` — return ranked synthetic alternatives for a stored search reference and disruption.

Handlers must validate inputs, return consistent error objects, and avoid leaking credentials. They are mock contracts, not a claim of production backend readiness.

## Testing and acceptance criteria

- Unit tests cover language parsing, station aliases, relative dates, class/time extraction, direct ranking, one-change fallback, no-route states, queue transitions, and recovery scoring.
- Component tests cover typed route editing, suggestions, interpreted voice results, unsupported voice fallback, login/signup, profile persistence, queue messaging, and route propagation into results and recovery.
- API tests cover valid requests, invalid requests, no-direct routes, queue states, auth errors, and recovery responses.
- Existing search-to-ticket, language-switching, and journey-mode tests continue to pass.
- `npm test`, `npm run lint`, and `npm run build` must pass before deployment.
- The final mobile walkthrough must demonstrate: typed route and time search; spoken route with confirmation; no-direct-train explanation; queue state; mock login/onboarding; profile update; and delay recovery using the stored intent.

## Explicit non-goals

- No real IRCTC integration.
- No real payment processing.
- No real railway inventory or PNR validity.
- No promise that every browser can perform speech recognition.
- No durable production queue without an approved persistence provider.
- No production-grade identity, encryption, or personal-data handling.
