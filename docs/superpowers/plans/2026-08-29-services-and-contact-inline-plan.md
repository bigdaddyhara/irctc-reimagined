# Services and Contact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add five working, mobile-first Services & help workflows backed by clearly labeled synthetic data.

**Architecture:** A catalog and service workflow module will own validation, deterministic results, and local request history. `App.tsx` will render the service view and forms using the existing navigation, session, toast, and mock-data patterns; no real external submission will occur.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, existing Vercel mock API boundary.

**Spec:** `docs/superpowers/specs/2026-08-29-irctc-backend-and-voice-design.md` plus the approved NS-inspired Services design in the preceding task.

## Global Constraints

- The experience remains a mobile-first public website rather than a dashboard or native app.
- All service records, payments, refunds, passes, and claims are synthetic demo data.
- Every service must have a working form, validation, result, and reference number.
- Do not use NS branding, NLOV terminology, or Dutch policy as Indian railway policy.
- Run `npm test`, `npm run lint`, and `npm run build` before deployment.

### Task 1: Add service domain catalog and workflow logic

**Files:** Create `src/data/services.ts`, `src/services/serviceWorkflow.ts`, `src/services/serviceWorkflow.test.ts`.

- [ ] Define five service IDs and user-facing English copy.
- [ ] Define typed request/result records for pass change, delay refund, payment issue, journey correction, and lost-and-found.
- [ ] Implement deterministic validation, reference generation, synthetic outcomes, and request history persistence.
- [ ] Test success/error/duplicate behavior for every service.

### Task 2: Add Services navigation and mobile-first UI

**Files:** Modify `src/App.tsx`, `src/App.css`, `src/index.css`; create components only if needed.

- [ ] Add Services to navigation and view routing.
- [ ] Render five cards and a shared one-task-at-a-time workflow.
- [ ] Add accessible inputs, review state, submit state, error state, and copyable references.
- [ ] Show “demo data only” and “What happens next?” messaging.

### Task 3: Connect profile history and route-level tests

**Files:** Modify `src/App.tsx`, `src/App.test.tsx`, `README.md`.

- [ ] Persist submitted requests for the current demo session.
- [ ] Show service request history in Profile for signed-in users.
- [ ] Test navigation, each service opening, validation, successful submission, and profile history.

### Task 4: Verify and publish

- [ ] Run all tests, lint, and production build.
- [ ] Commit the coherent feature.
- [ ] Push `main` and deploy production to the existing Vercel alias.
- [ ] Verify HTTP 200 and Git SHA parity.
