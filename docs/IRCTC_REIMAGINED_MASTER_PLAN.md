# IRCTC Reimagined — Frontend Master Plan

**Project:** IRCTC Reimagined hackathon prototype  
**Primary outcome:** A mobile-first Indian Railways journey website that helps ordinary passengers understand choices, complete a simulated booking, monitor a journey, and respond to disruption.  
**Scope:** Frontend only. Backend behavior, authentication, railway data, payment, notifications, and operational events are mocked with deterministic synthetic data.  
**Plan status:** Execution roadmap  
**Source material:** `IRCTC Reimagined — Complete Project Context.pdf` and `IRCTC Reimagined Master Plan.pdf`

---

## 1. How to read this plan

The supplied PDFs are treated as project context and planning requirements, not as proof that any railway capability or integration is available. The user’s explicit request is the final scope authority.

### Evidence labels

- **VERIFIED:** Confirmed by an authoritative source or by repeatable behavior in the prototype.
- **NEEDS VERIFICATION:** A current railway, regulatory, technical, or competitor fact that must be checked before it is presented as real.
- **PROTOTYPE ASSUMPTION:** A deliberate simplification used to make the demo reliable.
- **PROPOSED:** A product behavior created for this project and not represented as an existing railway service.

### Scope decisions

The documents describe a possible full product architecture, including databases, authentication services, AI services, real-time infrastructure, and railway integrations. Those are useful future considerations, but they are not implementation requirements for this hackathon build.

For this project:

- The website is the product being judged.
- A local mock data layer stands in for backend responses.
- Payment is a visual simulation and must never collect or process real money.
- Train position, availability, waitlist probability, alerts, and disruptions are simulated.
- The design must never imply that a prototype ticket is valid for travel.
- Any future production integration requires separate authorization, research, security review, and railway API access.

---

## 2. Executive summary

Indian railway passengers often receive information without enough help interpreting it. A train may be delayed, waitlisted, full, or affected by a platform change, but the passenger is still expected to decide what the information means and what to do next.

IRCTC Reimagined turns the traditional transaction sequence into a guided journey:

> **Discover → Compare → Understand → Book → Monitor → Travel → Recover**

The prototype should feel like a polished public-service travel website, not a dense railway operations dashboard. It should be particularly easy for first-time digital railway users, older passengers, families, students, people who are uncomfortable with railway terminology, and users operating on small screens or weak networks.

The strongest hackathon demonstration is a single coherent flow:

1. Describe or enter a journey.
2. Receive understandable, explainable train choices.
3. Select a train and complete a mock booking.
4. Open a clear digital ticket.
5. Enter Journey Mode.
6. Trigger a simulated delay.
7. Show the passenger impact and recommended recovery options.

The innovation is not merely “AI prediction” or a cleaner color palette. The differentiator is actionable assistance: the website explains what railway information means and helps the passenger decide what to do next.

---

## 3. Product definition

### Product statement

IRCTC Reimagined is a mobile-first Indian railway journey website that translates complex railway information into clear passenger choices and useful next actions.

### Core promise

The passenger should not need to understand railway systems, codes, or operational language before they can make a good decision. The website should understand the passenger’s goal and present the smallest useful set of choices.

### Core questions every feature must answer

- **Understand:** What is happening?
- **Decide:** Which option fits me best?
- **Act:** What should I do next?
- **Recover:** What should I do because something changed?

### Primary product surfaces

- Public home page and search entry point.
- Structured train search.
- Natural-language search preview.
- Search results with explainable recommendations.
- Availability and waitlist explanation.
- Mock booking and payment states.
- Digital ticket.
- My Trips.
- Journey Mode.
- Alerts.
- Disruption recovery.
- Multilingual interface.
- Voice interaction with typing fallback.
- Accessibility / Easy Mode.
- Demonstration-only operations simulator.

---

## 4. Verified, source-stated, and unresolved ecosystem context

The PDFs refer to changes in the Indian railway digital ecosystem and draw lessons from international platforms. These statements should be treated as follows until separately checked:

| Topic | Plan treatment | Product implication |
|---|---|---|
| IRCTC beta improvements | **NEEDS VERIFICATION** | Do not present visual cleanup alone as the innovation. |
| RailOne as a wider railway-services platform | **NEEDS VERIFICATION** | Position this prototype around passenger assistance, not service aggregation. |
| AI waitlist prediction already existing elsewhere in the ecosystem | **NEEDS VERIFICATION** | Do not claim waitlist prediction as a unique invention. Focus on explanation, confidence, alternatives, and monitoring. |
| DB Navigator, SNCF Connect, SBB, National Rail, JR, KORAIL, and 12306 patterns | **SOURCE-STATED INSPIRATION** | Use journey monitoring, disruption guidance, choice simplification, and queue transparency as design references. |
| Official railway status definitions and allocation rules | **NEEDS VERIFICATION** | Do not invent authoritative definitions. Clearly label prototype explanations. |
| Live railway API, GPS, inventory, ticketing, payment, and operational access | **NOT IN SCOPE / NOT AVAILABLE** | Simulate them and label the simulation. |

Before a production-oriented claim is added, research should use official IRCTC, Indian Railways, Ministry of Railways, PIB, RailOne, or official railway operator sources. Secondary sources can identify leads but should not support critical claims.

---

## 5. Target users and user problems

### Primary users

- First-time digital railway users.
- Frequent railway travelers who want speed and less repetition.
- Elderly travelers.
- Families traveling with children.
- Students and budget-conscious passengers.
- People who are uncomfortable with English or railway jargon.
- Passengers managing waitlists or last-minute travel.
- Passengers dealing with delays, cancellations, platform changes, or connections.

### User problems to solve

1. Search forms expose railway fields without explaining them.
2. Long result lists make comparison difficult.
3. Availability codes create uncertainty.
4. A full train ends the task instead of offering monitoring or alternatives.
5. A delay alert reports a fact but not its consequence.
6. Booking and payment uncertainty creates anxiety.
7. Users must repeatedly find their PNR, platform, coach, and ticket details.
8. Voice and language support can fail silently or leave users without a fallback.
9. Mobile layouts often prioritize dense information over confident action.

### Success outcomes

- A first-time user can search without developer explanation.
- A passenger can tell why one option is recommended.
- A user can understand waitlist and full-train states.
- A passenger can complete the simulated booking flow.
- A user can identify platform, coach, departure, and destination quickly.
- A user understands the effect of a disruption and sees a recommended next action.

---

## 6. Product principles

1. **Passenger goal before railway terminology.** Ask what the person is trying to do.
2. **Explain before asking for a decision.** Add a short reason beside important choices.
3. **One primary action per state.** Make the next step obvious.
4. **Short, plain, respectful language.** Avoid unexplained acronyms and dense paragraphs.
5. **Mobile first.** Design for one-hand use, small screens, and weak connectivity.
6. **Progressive disclosure.** Show essential information first; reveal details on demand.
7. **Trust through labeling.** Separate official-looking status, prediction, history, and prototype simulation.
8. **Every problem needs a recovery path.** Never stop at “no availability” or “something went wrong.”
9. **Voice is optional.** Typing must always remain available.
10. **Accessible by default.** Easy Mode should be a useful preference, not an afterthought.
11. **Deterministic demos.** The presentation must not depend on random data or live railway systems.
12. **Do not overbuild.** A stable end-to-end journey is more valuable than many unfinished features.

---

## 7. Feature inventory and priority

| Feature | Priority | Prototype treatment | Depends on |
|---|---:|---|---|
| Mobile-first public website shell | P0 | Build | Design system |
| Structured search: From, To, date, passengers, class | P0 | Build | Mock journey data |
| Editable station autocomplete | P0 | Build | Station dataset |
| Route-aware synthetic results | P0 | Build | Search state and result model |
| Explainable best-match results | P0 | Build | Result scoring fixture |
| Mock booking flow | P0 | Build | Selected journey and passenger fixture |
| Mock payment states | P0 | Build | Booking state |
| Digital ticket | P0 | Build | Confirmed mock booking |
| My Trips | P0 | Build | Ticket and journey state |
| Journey Mode | P0 | Build | Active journey fixture |
| Delay and recovery demonstration | P0 | Build | Journey state and alternatives |
| Alerts | P1 | Build if time allows; core delay alert is P0 | Event fixture |
| Waitlist explanation | P1 | Build | Availability state |
| Seat watch | P1 | Build | Full-train fixture |
| Natural-language search | P1 | Mock intent extraction | Search model |
| Voice search | P1 | Browser API plus typed fallback | Language and search state |
| Twelve-language UI | P1 | Translate core interface; native language names | Copy system |
| Easy Mode | P1 | Build | Accessibility review |
| Admin operations simulator | P1 | Demo-only controls | Deterministic events |
| PWA/offline ticket view | P2 | Optional | Deployment and storage decisions |
| Multimodal transport | P2 | Future prototype | Verified transport data |
| Real railway integrations | P3 | Not part of hackathon | Authorization and official APIs |

### Priority rules

- **P0:** The judge must be able to complete the journey without a broken state.
- **P1:** Strong differentiators that make the prototype feel intelligent and passenger-centered.
- **P2:** Useful enhancements only after P0 is reliable.
- **P3:** Production or expansion work that must not distract from the demo.

---

## 8. Frontend architecture boundary

The application should be organized around user journeys and predictable mock state, not around production infrastructure that the hackathon does not need.

### Conceptual layers

1. **Website shell:** Header, navigation, responsive layout, profile entry, language selector, status messaging.
2. **Journey state:** Current page, selected route, selected journey, booking state, active disruption, language, Easy Mode.
3. **Mock service boundary:** Search, booking, payment, alert, and simulation responses returned from deterministic local fixtures.
4. **Presentation components:** Search form, result card, ticket, trip card, alert, timeline, recovery option, language controls.
5. **Validation and trust layer:** Input validation, error states, simulated-data labels, accessible status updates.

### Mock service rules

- Mock responses should look like service responses so the frontend can later be connected to a real backend.
- Data should be realistic enough to exercise states, but never imply live availability.
- The same action should produce the same result during a demo.
- Loading, empty, unavailable, failed, pending, and success states must be deliberately represented.

---

## 9. Conceptual data model

The frontend needs only enough synthetic data to express the journeys below.

| Entity | Purpose | Important data | Lifecycle | Authority |
|---|---|---|---|---|
| User | Demo identity | Name, language, Easy Mode | Signed-in demo session | Mock frontend state |
| Station | Search and route display | Name, city, aliases | Static fixture | Mock data |
| Train | Result and ticket identity | Name, number, classes, route | Static fixture | Mock data |
| Journey | A train on a date and route | Departure, arrival, duration, fare | Search result to ticket | Mock search response |
| Availability | Communicate seat state | Confirmed, RAC, waitlist, full, estimate | Changes through simulation | Mock data; not official |
| Passenger | Booking participant | Name, age band, preference | Saved or selected | Demo profile |
| Booking | Confirmation flow | Status, PNR, fare, passenger | Initiated → processing → confirmed/failed | Mock booking response |
| Alert | Meaningful notification | Category, priority, read state, action | Created → read → resolved | Mock event response |
| Seat watch | Monitoring intent | Journey, status, last update | Active → seat found/cancelled | Mock state |
| Disruption | Event affecting a journey | Delay, platform change, cancellation | Detected → explained → recovered | Mock operations event |
| Journey state | Travel-day context | Location, ETA, platform, coach, delay | Before departure → in journey → arrived | Mock simulation |

Every display of prediction, availability, location, fare, or payment must use trust-aware copy such as “demo estimate”, “simulated”, or “not valid for travel” where appropriate.

---

# Phased development plan

Each phase below is ordered. Do not begin a dependent phase until its exit criteria are met. Each phase contains the minimum implementation work, verification, common mistakes, and handoff dependencies.

## Phase 0 — Evidence validation

**Goal:** Establish what is known, what is assumed, and what must not be claimed.

**Implement in order:**

1. Review official railway sources for any fact that will appear as an authoritative statement.
2. Mark each claim as VERIFIED, NEEDS VERIFICATION, PROTOTYPE ASSUMPTION, or PROPOSED.
3. Record all unavailable integrations and convert them into mock states.
4. Freeze the hackathon scope: frontend website, deterministic synthetic backend behavior, no real payment.

**Deliverables:** Evidence register, scope boundary, source list, prototype ethics checklist.

**Verification:** A reviewer can identify the source or label for every railway-specific claim.

**Common mistakes:** Treating the supplied PDFs as proof of live capability; describing a mock ticket as valid; claiming a unique AI feature that already exists elsewhere.

**Exit criteria:** No unresolved claim is presented as an official live fact. All later phases know which data can be simulated.

**Dependencies:** Required before product requirements and demo copy.

## Phase 1 — Problem framing

**Goal:** Convert the broad redesign ambition into a small set of passenger problems.

**Implement in order:** Define the primary user, list failure moments, rank them by passenger impact, write the problem statement, and define measurable outcomes.

**Deliverables:** Problem statement, opportunity areas, success outcomes, non-goals.

**Verification:** The team can explain the project without leading with technology.

**Common mistakes:** Describing “modern UI” as the problem; including every railway service; prioritizing AI before user value.

**Exit criteria:** One clear statement: passengers need help understanding railway information and choosing the next action.

**Dependencies:** Phase 0 evidence boundary.

## Phase 2 — User model

**Goal:** Design for ordinary passengers rather than internal railway or software terminology.

**Implement in order:** Create lightweight personas, identify digital literacy barriers, identify mobile/network constraints, map language and accessibility needs, and define task scenarios.

**Deliverables:** Persona set, task list, user assumptions, research questions.

**Verification:** Test users can be recruited for search, booking, waitlist, ticket, and delay tasks.

**Common mistakes:** Designing for a confident English-speaking power user; treating elderly or first-time users as edge cases.

**Exit criteria:** Every P0 feature maps to a real passenger task.

**Dependencies:** Phase 1 problem statement.

## Phase 3 — Information architecture

**Goal:** Make the public website and booking flow easy to scan.

**Implement in order:** Define primary navigation, decide which content is public, map the search-to-journey flow, define page states, and define back-navigation behavior.

**Recommended navigation:** Home, Search trains, My trips, Alerts, Profile.

**Deliverables:** Sitemap, route map, state map, page inventory, empty/error-state inventory.

**Verification:** A user can find search, ticket, trips, profile, and Journey Mode without instruction.

**Common mistakes:** Building a dashboard with no public website hierarchy; hiding the active journey; forcing users to restart after an error.

**Exit criteria:** Every P0 task has a destination and a clear next action.

**Dependencies:** Phase 2 task scenarios.

## Phase 4 — Product requirements

**Goal:** Turn the product vision into behavior-level requirements.

**Implement in order:** Define inputs, outputs, states, validation, trust labels, responsive behavior, accessibility expectations, and integration points for every P0/P1 feature.

**Deliverables:** Requirements matrix, acceptance criteria, state inventory, priority decisions.

**Verification:** Design and engineering can estimate each item without inventing missing behavior.

**Common mistakes:** Writing “build AI” or “build backend” without user-visible behavior; omitting failed and pending states.

**Exit criteria:** Every planned feature says what the passenger sees, what action is available, and what can be simulated.

**Dependencies:** Phases 0–3.

## Phase 5 — UX design

**Goal:** Create a low-cognitive-load journey flow before visual styling.

**Implement in order:** Sketch the home search, result comparison, booking, ticket, trips, Journey Mode, alert, and recovery screens. Add first-time guidance only where it changes behavior.

**Deliverables:** Mobile wireframes, content hierarchy, interaction rules, error-state designs.

**Verification:** Run task walkthroughs with someone unfamiliar with the prototype.

**Common mistakes:** Adding long explanatory copy; presenting every result equally; making the user infer what to do after a delay.

**Exit criteria:** The core journey can be narrated in one sentence per screen.

**Dependencies:** Phase 4 requirements.

## Phase 6 — Visual system

**Goal:** Make the site feel trustworthy, calm, and distinctly public-service oriented.

**Implement in order:** Choose typography, blue palette, spacing scale, card treatment, button hierarchy, status colors, icon rules, and responsive breakpoints. Ensure warning and danger colors remain semantically distinct without overwhelming the blue foundation.

**Deliverables:** Visual tokens, component states, mobile layouts, high-fidelity core screens.

**Verification:** Review at narrow mobile widths, large text settings, and high-contrast conditions.

**Common mistakes:** Oversized editorial headlines that push the form below the fold; decorative cards that hide the primary action; relying on color alone for status.

**Exit criteria:** Search, results, ticket, and Journey Mode share one coherent visual language.

**Dependencies:** Phase 5 wireframes.

## Phase 7 — Technical architecture

**Goal:** Select only the frontend technologies and conceptual boundaries needed for the prototype.

**Recommended direction:** React, TypeScript, Vite, a restrained component system, client-side routing, deterministic mock services, and a deployable static frontend.

**Implement in order:** Define state ownership, mock service contracts, routing, validation, persistence needs, error handling, and deployment target. Keep production backend technologies as future context, not current blockers.

**Deliverables:** Architecture decision record, state map, mock contract list, deployment choice.

**Verification:** The team can replace a mock service with a real service later without redesigning every screen.

**Common mistakes:** Introducing databases, microservices, or real authentication before the experience works; mixing mock data directly into presentational copy.

**Exit criteria:** A developer can explain how search, booking, simulation, and language state move through the frontend.

**Dependencies:** Phases 4–6.

## Phase 8 — Data architecture

**Goal:** Create realistic, reusable synthetic data rather than hard-coded screens.

**Implement in order:** Define stations and aliases, trains and routes, classes, schedules, fares, availability states, passengers, bookings, alerts, disruptions, and alternative journeys. Create fixtures for the main demo route and at least two alternate routes.

**Deliverables:** Synthetic data catalogue, state fixtures, route profiles, deterministic event fixtures.

**Verification:** Changing From, To, date, or class changes the result response and downstream display.

**Common mistakes:** Changing only a heading while leaving all journey details identical; using random values that make the demo unreliable.

**Exit criteria:** Each P0 screen can render from data/state rather than duplicated markup.

**Dependencies:** Phase 7 state model.

## Phase 9 — Core product foundation

**Goal:** Build the public website frame and common interaction primitives.

**Implement in order:** Responsive shell, header, navigation, profile entry, button hierarchy, cards, form controls, status messages, route navigation, and mobile-safe layout.

**Deliverables:** Working website shell, responsive navigation, focus states, common components, loading and toast patterns.

**Verification:** Keyboard navigation works; profile does not protrude from the mobile header; no desktop sidebar is required for the primary flow.

**Common mistakes:** Treating the product as an app dashboard; allowing fixed-width elements to overflow on mobile.

**Exit criteria:** All primary pages can be opened from the website shell.

**Dependencies:** Phases 6–8.

## Phase 10 — Search experience

**Goal:** Make structured train search fast, editable, and understandable.

**Implement in order:** From, To, date, passengers, class, optional preferences, station suggestions, validation, search action, loading state, empty state, and route-aware result response.

**Mobile behavior:** Stack fields vertically, keep controls large, keep date and class easy to change, and keep the main action visible after the fields.

**Accessibility:** Use real labels, semantic inputs, keyboard-selectable suggestions, visible focus, and polite result announcements.

**Deliverables:** Search form, station autocomplete, validation messages, deterministic result states.

**Verification:** Type a station, select a suggestion, change date and class, search, and confirm that the result route and details change.

**Common mistakes:** Making the inputs visually styled but not editable; updating the summary but not the result cards; accepting ambiguous station text without feedback.

**Exit criteria:** A first-time user can perform a search without explanation.

**Dependencies:** Phase 8 data fixtures.

## Phase 11 — Natural-language search

**Goal:** Let users describe a travel goal in ordinary language.

**Implement in order:** Provide example prompts, extract route/date/budget/deadline/preferences from synthetic input, show the interpreted fields for confirmation, validate them through the normal search form, and allow correction before search.

**Prototype treatment:** Intent extraction may be a deterministic local simulation. It must not claim that an AI model has access to live railway systems.

**Deliverables:** Natural-language entry state, interpreted-criteria preview, correction flow, unavailable-service fallback.

**Verification:** Test budget, arrival deadline, cheapest, direct, and family-travel examples.

**Common mistakes:** Sending unvalidated AI output directly to results; hiding what the system understood; making natural language mandatory.

**Exit criteria:** A user can see and correct the interpreted search criteria.

**Dependencies:** Phase 10 structured search.

## Phase 12 — Recommendation intelligence

**Goal:** Help passengers choose rather than scan a long list.

**Implement in order:** Define recommendation categories, calculate deterministic synthetic scores, show the reason, show trade-offs, expose alternative sorting, and preserve clear availability status.

**Categories:** Best match, Cheapest, Fastest, Most comfortable, Best availability, and family-friendly where data supports it.

**Deliverables:** Recommendation rules, result cards, sort/filter controls, explanation copy.

**Verification:** Every recommendation has a visible reason and no unsupported promise.

**Common mistakes:** Showing a percentage without explaining it; presenting a prototype score as an official railway score; optimizing one metric while hiding fare or waitlist risk.

**Exit criteria:** A user can explain why the first result was recommended.

**Dependencies:** Phases 8 and 10.

## Phase 13 — Booking experience

**Goal:** Complete a clear, mock booking without exposing unnecessary complexity.

**Implement in order:** Select train, confirm class, choose saved passenger, add passenger preview, choose preferences, review journey, review fare, enter mock payment, show processing, and confirm or fail.

**Deliverables:** Booking steps, passenger selection, preference states, review screen, payment states, confirmation.

**Verification:** Complete a booking on mobile with keyboard and touch. Confirm the selected route, train, class, fare, and passenger remain consistent.

**Common mistakes:** Calling a mock payment success a real transaction; losing selected route between screens; creating a dense form before the user understands the selected train.

**Exit criteria:** A first-time user can complete the mock booking and knows it is simulated.

**Dependencies:** Phases 10–12 and passenger fixture.

## Phase 14 — Waitlist intelligence

**Goal:** Explain waiting-list uncertainty and help users make a safer choice.

**Implement in order:** Show current status, define the estimate label, explain confidence, give reasons, show backup journeys, offer monitoring, and clearly distinguish official status from prototype estimate.

**Deliverables:** Waitlist card, explanation panel, confidence language, backup options, monitoring action.

**Verification:** A user unfamiliar with “WL” can explain their position, the uncertainty, and their available choices.

**Common mistakes:** Claiming confirmation probability is official; using historical context without a source; showing a prediction without a backup action.

**Exit criteria:** Waitlist is a decision-support state, not a dead end.

**Dependencies:** Availability fixtures and recommendation engine.

## Phase 15 — Seat watch

**Goal:** Give a useful path when a train is full.

**Implement in order:** Show “currently full,” explain the limitation, offer “Notify me,” show active watch state, simulate a seat opening, and provide a clear alert/action.

**Deliverables:** Full state, seat-watch state, seat-release event, notification state.

**Verification:** A full train can be monitored without requiring a refresh or a real account.

**Common mistakes:** Promising that a seat will open; hiding watch state; making the user restart their search.

**Exit criteria:** “No availability” always has an understandable next action.

**Dependencies:** Phases 8, 12, and 18 event simulation.

## Phase 16 — Trips and digital ticket

**Goal:** Make the passenger’s saved journey the center of travel preparation.

**Implement in order:** Show upcoming, active, past, cancelled, waitlisted, and monitored journeys as available states; create the digital ticket; include PNR, passenger, route, date, times, coach, berth, fare, status, and Track journey action.

**Deliverables:** My Trips view, ticket view, ticket status, route-consistent details.

**Verification:** The ticket exactly matches the selected booking and can be reached without repeating search.

**Common mistakes:** Treating the ticket as a decorative card; omitting route or coach; failing to label the ticket as a prototype.

**Exit criteria:** A passenger can find the next useful ticket detail in seconds.

**Dependencies:** Phase 13 booking.

## Phase 17 — Journey Mode

**Goal:** Change from booking mode to travel-day assistance.

**Implement in order:** Before departure state, departure countdown, station/platform/coach, simulated current location, ETA, delay, connection risk, destination approach, and arrival state.

**Primary displays:** Train status, current location, platform, coach, stopping zone where simulated, delay, connection information, and next action.

**Deliverables:** Journey banner, timeline, live simulation state, metrics, delay entry point.

**Verification:** A user can tell where the train is, what platform to use, when it should arrive, and what changed.

**Common mistakes:** Showing “live” without saying simulated; burying platform and coach; using the same route after the user selected a different journey.

**Exit criteria:** Journey Mode answers “Where is my train?” and “What do I do now?”

**Dependencies:** Phase 16 ticket and Phase 18 simulation.

## Phase 18 — Alerts and real-time simulation

**Goal:** Demonstrate meaningful event-to-passenger updates.

**Implement in order:** Define event categories, priorities, read state, persistence, action destination, and deterministic operations events. Support departure reminder, platform change, delay, cancellation, waitlist movement, seat availability, and connection risk as fixtures.

**Deliverables:** Alert model, alert list, event controls, passenger-facing updates, navigation actions.

**Verification:** Triggering an event changes the appropriate journey state and alert without refreshing.

**Common mistakes:** Alerting for every small change; creating notifications with no action; allowing events to create inconsistent ticket and Journey Mode data.

**Exit criteria:** One operational event creates a visible, understandable passenger response.

**Dependencies:** Shared state, ticket, trips, and journey fixtures.

## Phase 19 — Disruption recovery

**Goal:** Help a passenger recover rather than merely report a problem.

**Implement in order:** Detect event, identify passenger impact, explain consequence, generate synthetic alternatives, rank them, explain trade-offs, allow a decision, record the choice, notify, and continue simulated monitoring.

**Disruptions:** Delay, cancellation, platform change, missed connection, no alternative, and full replacement journey where supported by fixtures.

**Deliverables:** Recovery panel, alternatives, trade-off copy, selected-plan state, no-alternative state.

**Verification:** A user can answer what went wrong, how it affects them, which option is recommended, and what happens after choosing it.

**Common mistakes:** Showing alternatives without context; hiding cost or time trade-offs; guaranteeing a replacement that is only simulated.

**Exit criteria:** The delay demo ends in a decision, not an error message.

**Dependencies:** Phases 12, 17, and 18.

## Phase 20 — Multilingual support

**Goal:** Make the core interface usable in twelve Indian languages.

**Languages:** English, Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Odia, Punjabi, and Assamese.

**Implement in order:** Use native-script language names, create translated copy for navigation and core forms, translate headings/actions/help/error/status text, preserve proper names and railway codes, support language persistence in the demo session, and review text expansion on mobile.

**Deliverables:** Language selector, twelve native labels, translated core UI, fallback strategy for missing copy, language test matrix.

**Verification:** Selecting a language visibly changes the current interface without reload; the selector remains understandable; no translated string clips or overflows on mobile.

**Common mistakes:** Translating only the selector; mixing languages in the same action; transliterating instead of using the requested script; changing station names that should remain proper names.

**Exit criteria:** A user can search and understand the main result/action flow in each supported language, with any untranslated prototype-only detail explicitly handled.

**Dependencies:** Content inventory, design system, search, and accessibility review.

## Phase 21 — Voice

**Goal:** Provide optional natural voice interaction without trapping users when it fails.

**Implement in order:** Choose language, request permission where supported, start recognition, show listening state, capture result, extract intent, display interpreted fields, let the user correct them, submit search, handle denial/error/unavailable states, and always retain typing fallback.

**Deliverables:** Voice action, listening state, route parsing, confirmation/correction state, typed fallback, error copy.

**Verification:** Test supported browser, denied permission, unsupported browser, silence, malformed route, mixed-language input, and correction.

**Common mistakes:** Assuming microphone support exists everywhere; searching immediately without confirmation; replacing typing with voice; silently failing.

**Exit criteria:** Voice improves speed when available and never blocks a passenger from completing the search.

**Dependencies:** Phase 20 language state and Phase 10 search state.

## Phase 22 — Accessibility

**Goal:** Make the core journey usable for people with varied vision, mobility, hearing, language, and digital literacy needs.

**Implement in order:** Check typography, contrast, touch targets, semantic hierarchy, labels, keyboard order, focus visibility, live regions, reduced motion, Easy Mode, error communication, and screen-reader descriptions.

**Deliverables:** Accessibility checklist, Easy Mode, keyboard path, screen-reader path, error and status patterns.

**Verification:** Test search → booking → ticket → Journey Mode → delay recovery with keyboard, screen reader, zoom, and large text.

**Common mistakes:** Relying on color; making suggestions inaccessible; using icons without labels; making Easy Mode merely larger text while leaving dense wording.

**Exit criteria:** The primary task can be completed without a mouse, without color interpretation, and without relying on unexplained jargon.

**Dependencies:** All primary surfaces.

## Phase 23 — Admin simulation

**Goal:** Give judges a controlled way to see the system respond to railway-like events.

**Controls:** Add delay, change platform, mark full, release seat, move waitlist, cancel train, and trigger notification.

**Implement in order:** Define event, change deterministic mock state, update passenger effect, create alert, update Journey Mode, and expose recovery logic.

**Deliverables:** Demo-only control surface, event log, predictable event fixtures, passenger response.

**Verification:** Each control produces one visible and explainable downstream effect.

**Common mistakes:** Building a second product; exposing admin controls in the public passenger flow; using random events that cannot be reproduced.

**Exit criteria:** The team can demonstrate operational event → passenger notification → next action.

**Dependencies:** Phase 18 event model.

## Phase 24 — Integration boundary

**Goal:** Validate that the frontend is ready for a future service without pretending one exists.

**Implement in order:** Check mock response shapes, loading states, error handling, validation boundaries, state transitions, and replacement points for search, booking, alerts, and AI services.

**Deliverables:** Integration checklist, mock contract review, unresolved production dependencies.

**Verification:** A mock failure produces a useful interface state; no component assumes network success.

**Common mistakes:** Calling local fixtures “backend integration”; hardwiring production credentials; coupling display copy to an unavailable API.

**Exit criteria:** The prototype is honest about what is simulated and structurally ready for later integration.

**Dependencies:** Phases 7–23.

## Phase 25 — Testing

**Goal:** Prove the journey works as a system, not only as isolated screens.

**Test layers:**

- Functional: each form, button, selector, state, and validation rule.
- Integration: search → booking; booking → ticket; ticket → trips; trips → Journey Mode; delay → alert → recovery; waitlist → backup; seat watch → availability event.
- Accessibility: keyboard, screen reader, Easy Mode, zoom, contrast, language expansion.
- Mobile: narrow widths, touch, scroll, orientation, safe-area spacing.
- Network: slow, unavailable, delayed, and failed mock responses.
- Demo: exact presentation sequence repeated from a clean state.

**Deliverables:** Test matrix, automated critical-flow tests, manual mobile checklist, defect list.

**Verification:** No P0 flow has an untested success or failure state.

**Common mistakes:** Testing only the happy path; asserting implementation details instead of passenger-visible outcomes; skipping real mobile inspection.

**Exit criteria:** Critical-flow tests are repeatable and the demo can be reset reliably.

**Dependencies:** All implemented features.

## Phase 26 — Security and privacy

**Goal:** Keep a frontend-only demo safe and honest.

**Implement in order:** Remove real credentials, avoid unnecessary personal data, keep payment fake, prevent secrets in the client, label demo accounts, validate user input, separate passenger and admin demo surfaces, and avoid claiming official identity.

**Deliverables:** Privacy boundary, demo-data policy, secret review, admin visibility decision.

**Verification:** No real payment, railway credential, or unnecessary sensitive passenger data is used.

**Common mistakes:** Collecting Aadhaar, real payment details, or real PNRs; presenting mock authentication as production identity assurance.

**Exit criteria:** The demo can be shared without exposing sensitive data or implying official infrastructure.

**Dependencies:** All data and deployment work.

## Phase 27 — Performance and reliability

**Goal:** Keep the website responsive on realistic mobile devices and poor networks.

**Targets to define:** Initial load, first useful content, search response, navigation response, asset size, mobile layout stability, mock event response, and offline ticket availability if included.

**Implement in order:** Remove unnecessary assets, prevent layout shifts, keep mock responses deterministic, handle slow state visibly, preserve ticket details locally only if the PWA scope is approved, and verify the smallest supported viewport.

**Deliverables:** Performance checklist, slow-network states, mobile measurements, asset review.

**Verification:** The user always knows whether the website is loading, waiting, empty, failed, or complete.

**Common mistakes:** Optimizing desktop first; showing a blank screen during delay; adding PWA complexity before the booking flow is stable.

**Exit criteria:** The P0 demo remains usable on a modest mobile connection.

**Dependencies:** Stable feature set from Phase 25.

## Phase 28 — Deployment

**Goal:** Publish a stable frontend demonstration.

**Implement in order:** Choose static hosting, configure environment boundaries, build the production bundle, verify routes, verify refresh behavior, verify mock data, test on a public URL, and document the local fallback.

**Deliverables:** Production URL, deployment notes, reset/demo instructions, known limitations.

**Verification:** A clean browser can load the public URL and complete the P0 journey.

**Common mistakes:** Deploying a development server; depending on local state that judges do not have; omitting the simulated-data disclaimer.

**Exit criteria:** The published site behaves the same as the verified local demo.

**Dependencies:** Phases 25–27.

## Phase 29 — Demo preparation

**Goal:** Make the hackathon demonstration reliable and easy to follow.

**Prepare:** Demo account, predefined route, selected train, confirmed mock ticket, waitlist example, full-train example, disruption event, alternative journeys, and reset path.

**Recommended sequence:** Natural-language or structured search → explain recommendation → select train → mock booking → ticket → Journey Mode → delay → connection risk → recovery decision.

**Deliverables:** Demo script, seeded state, backup route, screen recording or screenshots, failure recovery plan.

**Verification:** Run the exact sequence at least three times from a clean state.

**Common mistakes:** Depending on live data, random probability, microphone access, or a judge clicking the exact hidden control.

**Exit criteria:** The team can recover gracefully if voice, network, or one mock state fails.

**Dependencies:** Published build and Phase 25 test evidence.

## Phase 30 — Hackathon presentation

**Goal:** Tell a coherent story about passenger impact.

**Story structure:**

1. **Problem:** Passengers receive information but must interpret it themselves.
2. **Context:** Existing railway services are evolving; the opportunity is contextual assistance.
3. **Gap:** Search, waitlist, delay, and disruption information is not enough by itself.
4. **Solution:** A mobile-first journey website that explains choices and next actions.
5. **Demonstration:** Search → Compare → Book → Track → Disruption → Recover.
6. **Impact:** Less cognitive burden, uncertainty, information overload, booking anxiety, and journey confusion.
7. **Honesty:** This is a frontend prototype using synthetic data and mock payment; production use requires official integrations and review.

**Deliverables:** Presentation narrative, live demo, backup recording, architecture boundary slide, prototype-versus-production slide.

**Verification:** A judge can understand the problem, see the differentiator, and repeat the core value in their own words.

**Exit criteria:** The presentation proves a working passenger experience rather than a collection of disconnected screens.

**Dependencies:** All previous phases, especially Phase 29.

---

## 10. Execution order for a time-limited hackathon

### Minimum viable build

Must work:

1. Public mobile website shell.
2. Structured search with editable From/To/date/class.
3. Station suggestions.
4. Route-aware results with explainable best match.
5. Mock booking and payment.
6. Digital ticket.
7. My Trips.
8. Journey Mode.
9. Delay and recovery demonstration.
10. Clear synthetic-data labels.

### Strong build

Add after the MVP is stable:

- Waitlist explanation and backup journeys.
- Seat watch.
- Alerts.
- Twelve-language core interface.
- Easy Mode.
- Voice with a typing fallback.
- Admin simulation.

### Stretch build

Only add if the core flow remains reliable:

- Natural-language deadline/budget extraction.
- PWA/offline ticket.
- More disruption types.
- Richer live journey simulation.
- Multimodal onward journey concepts.

Never remove working search, booking, ticket, Journey Mode, or recovery behavior to make room for a stretch feature.

---

## 11. Suggested team workstreams

| Workstream | Responsibilities | Deliverables | Handoff |
|---|---|---|---|
| UX / Product | Problems, flows, copy, priorities, acceptance criteria | Wireframes, requirements, test tasks | Gives design and engineering clear behaviors |
| Frontend experience | Website shell, responsive screens, interaction states | Working passenger flow | Receives data fixtures and copy |
| Mock data / services | Deterministic journeys, booking, alerts, events | Synthetic fixtures and state transitions | Supplies predictable responses |
| AI / intelligence | Natural-language interpretation, explanation, recommendation logic | Interpreted criteria and explainable result rules | Must validate output through normal search rules |
| Language / accessibility | Translations, native labels, Easy Mode, keyboard/screen reader review | Language matrix and accessibility checklist | Reviews every core surface |
| QA | Functional, integration, mobile, failure, demo testing | Test evidence and defect priority | Blocks release on P0 regressions |
| Presentation | Story, live sequence, backup materials | Demo script and slides | Uses the verified build only |

Roles may overlap. The important boundary is ownership of decisions and handoffs, not rigid titles.

---

## 12. Suggested seven-day schedule

Adjust this to the actual hackathon duration; it is a planning aid, not a fixed requirement.

| Day | Focus | End-of-day checkpoint |
|---|---|---|
| 1 | Evidence, scope, problem, user tasks, IA | P0 scope and journey map approved |
| 2 | UX, visual system, frontend foundation, mock data | Website shell and search contract ready |
| 3 | Structured search, autocomplete, route-aware results | Search flow works on mobile |
| 4 | Booking, payment simulation, ticket, My Trips | Search-to-ticket path works |
| 5 | Journey Mode, alerts, delay, recovery | Main demo story works end to end |
| 6 | Waitlist, seat watch, languages, voice, accessibility | Differentiators work with fallbacks |
| 7 | QA, performance, deployment, demo rehearsal | Public build and backup demo ready |

---

## 13. Final QA checklist

### Website and mobile

- [ ] Website shell feels public-service oriented rather than like an internal app.
- [ ] Primary flow is usable on a narrow mobile viewport.
- [ ] Profile/avatar stays inside the header.
- [ ] No horizontal overflow or clipped primary action.
- [ ] Navigation is understandable and has a visible active state.

### Search

- [ ] From and To fields accept typing.
- [ ] Suggestions appear while typing.
- [ ] Suggestions can be selected by touch and keyboard.
- [ ] Date can be changed quickly.
- [ ] Class can be changed quickly.
- [ ] Search validates empty or ambiguous input.
- [ ] Results visibly change when route, date, or class changes.
- [ ] Result cards display the selected route, not a stale default route.

### Recommendations and availability

- [ ] Recommendation includes a reason.
- [ ] Cheapest, fastest, and comfortable controls behave consistently.
- [ ] Confirmed, waitlist, RAC, and full states are distinguishable.
- [ ] Waitlist estimate is clearly labeled as a prototype estimate.
- [ ] Full trains provide seat watch or alternatives.

### Booking and ticket

- [ ] Selected train, route, class, passenger, and fare remain consistent.
- [ ] Payment is visibly simulated.
- [ ] Processing, success, failure, and pending states exist.
- [ ] Digital ticket shows route, date, times, coach, seat, PNR, and status.
- [ ] Ticket is clearly not valid for travel.

### Journey and recovery

- [ ] My Trips contains the selected journey.
- [ ] Journey Mode uses the selected route.
- [ ] Platform, coach, current location, ETA, and delay are easy to find.
- [ ] Delay explains passenger impact.
- [ ] Recovery options show trade-offs.
- [ ] Choosing an option produces a visible state change.

### Language and voice

- [ ] All twelve language options are named in their respective scripts.
- [ ] Selecting a language changes visible interface copy without reload.
- [ ] Core search and navigation copy is translated.
- [ ] Long translations remain readable on mobile.
- [ ] Voice shows listening state when supported.
- [ ] Permission denial and unsupported browser have useful messages.
- [ ] Typing fallback always works.

### Accessibility and trust

- [ ] All controls have accessible names.
- [ ] Keyboard order is logical.
- [ ] Focus is visible.
- [ ] Status changes are announced politely.
- [ ] Color is not the only signal.
- [ ] Easy Mode increases readability and control size.
- [ ] Mock data and payment labels are visible where needed.
- [ ] No real credentials, payment details, or sensitive passenger data are present.

### Demo reliability

- [ ] Demo can be reset.
- [ ] Demo does not depend on live railway APIs.
- [ ] Demo does not depend on microphone availability.
- [ ] Backup route and backup recording exist.
- [ ] The exact presentation sequence has been rehearsed repeatedly.

---

## 14. Final prototype acceptance criteria

The prototype is ready for judging when:

1. A first-time passenger can search for a route using plain, understandable controls.
2. Typing From and To shows suggestions and selecting them updates the route.
3. Changing route, date, or class changes the synthetic journeys and downstream ticket details.
4. Results explain why an option is recommended.
5. Waitlist and full-train states present decisions rather than dead ends.
6. A passenger can complete the booking flow without real payment.
7. The digital ticket is clear, internally consistent, and visibly simulated.
8. My Trips and Journey Mode use the selected journey.
9. A simulated delay creates a meaningful alert and recovery decision.
10. The website works on mobile and remains readable for first-time users.
11. The twelve language names appear in their native scripts and selecting one changes visible core copy.
12. Voice works where the browser supports it and typing remains available everywhere.
13. The prototype does not claim unauthorized IRCTC access, live GPS, official availability, official prediction, or genuine payment.
14. The team can explain what is ready for production only after official integration, security, compliance, and reliability work.

---

## 15. Prototype versus production boundary

### Prototype may use

- Synthetic stations, trains, fares, routes, availability, delays, alerts, and locations.
- Demo accounts and saved passenger fixtures.
- Mock authentication and mock payment.
- Deterministic admin controls.
- Local or static frontend hosting.
- Prototype-generated recommendation and waitlist explanations.

### Production would require

- Authorized railway APIs and official data contracts.
- Official inventory, timetable, PNR, and operational integrations.
- Secure identity and access control.
- Real payment infrastructure and reconciliation.
- Railway-approved notifications and operational event sources.
- Security, privacy, legal, compliance, and accessibility review.
- High availability, monitoring, auditability, data governance, and disaster recovery.
- Verification of all railway definitions, allocation rules, and prediction claims.

The hackathon prototype should demonstrate the quality of the passenger experience without pretending that those production prerequisites already exist.

---

## 16. Future production roadmap

After the frontend prototype is validated with real users, the next work should be:

1. Validate the highest-impact usability findings with first-time, elderly, family, and multilingual users.
2. Replace mock search with an authorized railway data contract.
3. Validate station, timetable, fare, availability, waitlist, and PNR semantics with official sources.
4. Introduce real identity only after privacy and security requirements are defined.
5. Integrate approved payment and reservation flows with explicit failure reconciliation.
6. Replace simulated journey location and disruptions with authoritative operational events.
7. Validate AI interpretation and recommendations against safe, explainable rules.
8. Establish data governance for passenger information and prediction history.
9. Run performance, accessibility, security, reliability, and high-volume testing.
10. Pilot with a limited user group before any broad public launch.

The product philosophy remains unchanged through production: do not merely show railway information; explain what it means for the passenger and help them decide what to do next.

