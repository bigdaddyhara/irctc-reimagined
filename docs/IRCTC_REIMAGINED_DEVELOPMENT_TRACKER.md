# IRCTC Reimagined — Development Tracker

Use this document as the team’s working checklist during the hackathon. The detailed rationale, product requirements, trust boundaries, and acceptance criteria are in the [IRCTC Reimagined Frontend Master Plan](./IRCTC_REIMAGINED_MASTER_PLAN.md).

## How to use this tracker

- Change `⬜` to `✅` only when the phase exit criteria are met.
- Use `🔄` for work in progress and `⛔` for blocked work.
- Add evidence links, screenshots, test notes, or decisions in the Notes column.
- Do not move to a dependent phase just because the implementation has started.
- Keep the frontend-only boundary visible: backend behavior, railway data, payment, alerts, and operations are simulated.

## Project status

| Field | Current value |
|---|---|
| Project | IRCTC Reimagined |
| Product | Mobile-first Indian Railways journey website |
| Scope | Frontend only; deterministic mocked services and synthetic data |
| Current phase | Phase 28 — Deployment / Phase 29 — Demo preparation |
| Overall status | 🔄 Active prototype development |
| Demo URL | `http://127.0.0.1:5173/` during local development |
| Repository | `https://github.com/bigdaddyhara/irctc-reimagined` |
| Demo route | Use one prepared route plus one alternate route |
| Last reviewed | 2026-08-28 |
| Team owner | ____________________ |

## Priority legend

- **P0:** Must work for the core demo.
- **P1:** Strong differentiator; implement after P0 is stable.
- **P2:** Stretch feature.
- **P3:** Future production work; not part of the hackathon build.

## Phase tracker

| Done | Phase | Outcome to complete | Owner | Evidence / notes |
|---|---|---|---|---|
| ⬜ | 0. Evidence validation | Claims are labelled and no unavailable railway integration is presented as real. | ______ | ______ |
| ⬜ | 1. Problem framing | One clear passenger problem and measurable outcomes are agreed. | ______ | ______ |
| ⬜ | 2. User model | Personas and task scenarios cover first-time, elderly, family, multilingual, and low-literacy users. | ______ | ______ |
| ⬜ | 3. Information architecture | Navigation, pages, states, and back paths are mapped. | ______ | ______ |
| ⬜ | 4. Product requirements | P0/P1 requirements include behavior, states, validation, and acceptance criteria. | ______ | ______ |
| ⬜ | 5. UX design | Mobile wireframes cover search, results, booking, ticket, trips, journey, alerts, and recovery. | ______ | ______ |
| ⬜ | 6. Visual system | Blue palette, type, spacing, components, status colors, and mobile rules are consistent. | ______ | ______ |
| ⬜ | 7. Technical architecture | Frontend state, mock service boundaries, routing, validation, and deployment approach are agreed. | ______ | ______ |
| ⬜ | 8. Data architecture | Synthetic stations, trains, journeys, passengers, bookings, alerts, and disruptions are defined. | ______ | ______ |
| ⬜ | 9. Foundation | Public website shell, navigation, profile, responsive layout, and common states work. | ______ | ______ |
| ⬜ | 10. Search | Editable From/To/date/class fields, station suggestions, validation, and route-aware results work. | ______ | ______ |
| ⬜ | 11. Natural-language search | Users can enter a natural request, review interpreted criteria, and correct it. | ______ | ______ |
| ⬜ | 12. Recommendations | Results show Best match, alternatives, trade-offs, and explanations. | ______ | ______ |
| ⬜ | 13. Booking | User can select a train, passenger, class, preferences, review, and mock payment state. | ______ | ______ |
| ⬜ | 14. Waitlist intelligence | WL status, estimate label, confidence, reasons, and backup choices are understandable. | ______ | ______ |
| ⬜ | 15. Seat watch | Full train can be monitored and a simulated seat opening creates a useful update. | ______ | ______ |
| ⬜ | 16. Trips and ticket | Ticket and My Trips retain the selected route and booking details. | ______ | ______ |
| ⬜ | 17. Journey Mode | Passenger can see platform, coach, location, ETA, delay, and destination. | ______ | ______ |
| ⬜ | 18. Alerts and simulation | A deterministic operational event creates a relevant passenger alert. | ______ | ______ |
| ⬜ | 19. Disruption recovery | Delay/cancellation impact is explained and alternatives have trade-offs and actions. | ______ | ______ |
| ⬜ | 20. Multilingual support | Twelve language names use native scripts and core copy changes after selection. | ______ | ______ |
| ⬜ | 21. Voice | Speech works where supported and typing fallback works everywhere. | ______ | ______ |
| ⬜ | 22. Accessibility | Keyboard, focus, labels, contrast, Easy Mode, live status, and mobile readability pass. | ______ | ______ |
| ⬜ | 23. Admin simulation | Demo-only controls reliably trigger delay, platform, full, seat, waitlist, or cancellation states. | ______ | ______ |
| ⬜ | 24. Integration boundary | Mock contracts, loading states, failures, and future replacement points are reviewed. | ______ | ______ |
| ⬜ | 25. Testing | Functional, integration, mobile, accessibility, network, and demo tests are recorded. | ______ | ______ |
| ⬜ | 26. Security and privacy | No real credentials, payments, unnecessary sensitive data, or false official claims exist. | ______ | ______ |
| ⬜ | 27. Performance | Mobile loading, layout stability, slow states, and asset size are acceptable. | ______ | ______ |
| ⬜ | 28. Deployment | Public build loads cleanly and behaves like the verified local build. | ______ | ______ |
| ⬜ | 29. Demo preparation | Demo state, reset path, backup route, script, and recording are ready. | ______ | ______ |
| ⬜ | 30. Presentation | Story clearly communicates problem, gap, solution, demonstration, impact, and limitations. | ______ | ______ |

## P0 feature checklist

### Website and search

- [x] Mobile-first public website shell exists.
- [x] Indian Railways branding is used without visible YatraSaathi branding.
- [x] Header/profile alignment is safe on mobile.
- [x] From field accepts typing.
- [x] To field accepts typing.
- [x] Station suggestions appear while typing.
- [x] Date can be changed.
- [x] Class can be changed.
- [x] Selected route is carried into the results.
- [x] Route changes update synthetic journey details, not only labels.
- [ ] Empty and invalid station states are reviewed manually on mobile.

### Compare and choose

- [x] Best match result exists.
- [x] Cheapest, fastest, and comfortable sorting exists.
- [x] Recommendation reason is visible.
- [x] Availability status is understandable.
- [ ] Recommendation wording is reviewed with a first-time user.

### Booking and ticket

- [x] Passenger selection exists.
- [x] Class and fare remain consistent after selection.
- [x] Payment is explicitly simulated.
- [x] Ticket contains route, times, coach, seat, PNR, and status.
- [x] Ticket is labelled as not valid for travel.
- [x] Journey Mode can be opened from the ticket.

### Journey and recovery

- [x] My Trips exists.
- [x] Journey Mode exists.
- [x] Simulated delay exists.
- [x] Delay changes ETA and journey state.
- [x] Recovery options explain trade-offs.
- [ ] Cancellation and platform-change states are rehearsed if included in the demo.

## P1 feature checklist

- [ ] Waitlist explanation and backup recommendations.
- [ ] Full-train seat watch.
- [ ] Alerts list and relevant actions.
- [x] Twelve native-script language labels.
- [x] Core language selection changes visible UI copy.
- [x] Browser speech recognition hook.
- [x] Typed voice fallback.
- [x] Easy Mode.
- [ ] Demo-only admin simulation controls.
- [ ] Natural-language budget/deadline interpretation.

## P2 / stretch backlog

- [ ] Offline ticket view.
- [ ] Richer train movement simulation.
- [ ] More disruption types.
- [ ] Multimodal onward journey suggestions.
- [ ] Saved favorite stations.
- [ ] Expanded passenger preferences.

## Current work queue

| Priority | Task | Owner | Status | Definition of done |
|---:|---|---|---|---|
| P0 | Run the full mobile search-to-recovery walkthrough | ______ | ⬜ | Walkthrough completes from a clean state without developer intervention. |
| P0 | Review all empty, loading, failed, and pending states | ______ | ⬜ | Each state has useful copy and a next action. |
| P0 | Rehearse the primary demo route three times | ______ | ⬜ | Three consecutive successful runs are recorded. |
| P1 | Test language switching on every main passenger surface | ______ | ⬜ | Core headings/actions remain readable in all twelve languages. |
| P1 | Test voice permission denial and unsupported browser | ______ | ⬜ | User always sees and can use the typing fallback. |
| P1 | Add or verify waitlist and full-train demonstration | ______ | ⬜ | Passenger sees explanation plus backup/watch action. |
| P1 | Add or verify operations simulation controls | ______ | ⬜ | One control produces an observable passenger update. |
| P2 | Evaluate offline ticket scope | ______ | ⬜ | Decision recorded; no P0 work is delayed. |

## Weekly / daily progress log

### Day 1 — Evidence, problem, and scope

- Planned:
- Completed:
- Blocked:
- Decision:
- Evidence:

### Day 2 — UX, visual system, and foundation

- Planned:
- Completed:
- Blocked:
- Decision:
- Evidence:

### Day 3 — Search and results

- Planned:
- Completed:
- Blocked:
- Decision:
- Evidence:

### Day 4 — Booking, payment, and ticket

- Planned:
- Completed:
- Blocked:
- Decision:
- Evidence:

### Day 5 — Journey Mode and recovery

- Planned:
- Completed:
- Blocked:
- Decision:
- Evidence:

### Day 6 — Language, voice, accessibility, and simulation

- Planned:
- Completed:
- Blocked:
- Decision:
- Evidence:

### Day 7 — QA, deployment, and presentation

- Planned:
- Completed:
- Blocked:
- Decision:
- Evidence:

## Decision log

Record decisions that affect scope, behavior, trust, or the demo. Do not silently change them in code or design.

| ID | Date | Decision | Reason | Owner | Status |
|---|---|---|---|---|---|
| D-001 | 2026-08-28 | Frontend-only implementation with mocked backend behavior | Hackathon scope is the passenger-facing experience | ______ | Accepted |
| D-002 | 2026-08-28 | Use synthetic railway data and mock payment | Avoid unauthorized access and real financial handling | ______ | Accepted |
| D-003 | 2026-08-28 | Mobile-first website rather than dashboard-style app | Primary usability requirement | ______ | Accepted |
| D-004 | 2026-08-28 | Support twelve Indian language options | Accessibility and user requirement | ______ | Accepted |
| D-005 | 2026-08-28 | Voice must always have typing fallback | Browser support and accessibility vary | ______ | Accepted |
| D-006 | ______ | ______ | ______ | ______ | Open |

## Risk and blocker log

| ID | Risk / blocker | Impact | Mitigation | Owner | Status |
|---|---|---|---|---|---|
| R-001 | No live IRCTC or railway API access | Cannot certify production data | Use deterministic fixtures and visible simulation labels | ______ | Open |
| R-002 | Browser does not support speech recognition | Voice action may appear broken | Keep typed route fallback visible and tested | ______ | Mitigated |
| R-003 | Translation text expands on mobile | Buttons or headings may overflow | Review all supported scripts at narrow widths | ______ | Open |
| R-004 | Feature growth threatens demo stability | Core journey may remain incomplete | Freeze P0 before starting stretch work | ______ | Open |
| R-005 | Mock states become inconsistent across screens | Passenger loses trust | Use one selected journey and shared deterministic state | ______ | Open |
| R-006 | ______ | ______ | ______ | ______ | Open |

## Release gates

### Gate A — Search ready

- [ ] First-time user can search without explanation.
- [ ] From and To are editable.
- [ ] Suggestions can be selected.
- [ ] Date and class can be changed quickly.
- [ ] Results change with the selected criteria.

### Gate B — Booking ready

- [ ] User can select a journey and passenger.
- [ ] Fare and class remain consistent.
- [ ] Mock payment has visible state.
- [ ] Ticket is clear and labelled as simulated.

### Gate C — Journey ready

- [ ] My Trips and ticket use the selected route.
- [ ] Journey Mode shows the important travel-day details.
- [ ] Delay changes the journey state.
- [ ] Recovery options are understandable.

### Gate D — Inclusive experience ready

- [ ] Twelve language labels use their native scripts.
- [ ] Selecting a language changes core visible copy.
- [ ] Voice works where supported.
- [ ] Typing fallback works where voice does not.
- [ ] Easy Mode and keyboard flow are usable.

### Gate E — Demo ready

- [ ] Public URL is available.
- [ ] Clean-state reset is known.
- [ ] Primary demo route is seeded.
- [ ] Backup route or recording exists.
- [ ] Full walkthrough has passed three consecutive rehearsals.
- [ ] Team can explain prototype-versus-production boundaries.

## Final handoff checklist

- [ ] Master plan reviewed by product/design/engineering/QA.
- [ ] Tracker updated with completed phases and evidence.
- [ ] P0 acceptance criteria passed.
- [ ] No real payment or sensitive data is present.
- [ ] No unsupported official railway claim is presented as fact.
- [ ] Repository is pushed and the final commit is recorded here: `____________________`.
- [ ] Public demo URL recorded here: `____________________`.
- [ ] Presentation owner assigned: `____________________`.
- [ ] Demo operator assigned: `____________________`.
- [ ] Backup operator assigned: `____________________`.

