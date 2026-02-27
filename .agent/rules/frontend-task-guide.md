---
trigger: always_on
---

---
name: Antigravity Frontend Job Execution Rule (AFJER)
description: Guide the agent to implement, modify, or review frontend features using React 19, TypeScript, Vite, Tailwind, shadcn/ui, Redux Toolkit, and React Router.
---

# Frontend Task Execution Rule

## Execution Principles
- Prefer correctness and UX stability over visual polish
- Follow existing project structure and conventions strictly
- Type safety is mandatory; no implicit `any`
- Avoid premature abstraction
- Never break routing, global state, or theming

---

## Task Classification (Must Identify First)
Before acting, classify the task as one of:
- Feature implementation
- UI component creation
- State management change
- Routing/navigation update
- API integration
- Bug fix
- Refactor / cleanup

Abort if task scope is unclear.

---

## Execution Flow (Strict Order)

### 1. Context & Dependency Analysis
- Identify:
  - Affected pages/components
  - Required libraries (react-hook-form, zod, redux, axios, shadcn)
  - Existing patterns used in the project
- Do **not** introduce new libraries unless explicitly requested

---

### 2. Component & Architecture Design
- Decide:
  - Client component boundaries
  - State ownership (local vs Redux)
  - Controlled vs uncontrolled form logic
- Keep components:
  - Small
  - Single-responsibility
  - Reusable only when justified

---

### 3. Type Safety & Data Contracts
- Define strict TypeScript types:
  - Props
  - API responses
  - Form schemas (zod)
- Ensure frontend models align with backend DTOs
- Never trust backend data blindly

---

### 4. UI Implementation Rules
- Use **shadcn/ui** primitives when applicable
- Use **Tailwind utility classes**, merged via `tailwind-merge`
- Animations:
  - Use `framer-motion` sparingly
  - Never block user interaction
- Icons:
  - Use `lucide-react` only

---

### 5. Forms & Validation
- Use:
  - `react-hook-form`
  - `@hookform/resolvers`
  - `zod` schemas
- Validation must:
  - Run client-side
  - Show clear error messages
  - Prevent invalid submission

---

### 6. State Management
- Prefer:
  - Local state for UI-only concerns
  - Redux Toolkit for shared or persistent state
- Never:
  - Store derived data unnecessarily
  - Mutate state outside reducers

---

### 7. API Integration
- Use `axios`
- Centralize API calls
- Handle:
  - Loading state
  - Error state
  - Token expiration (jwt-decode)
- Never call APIs directly inside render logic

---

### 8. Routing & Navigation
- Use `react-router`
- Keep routes declarative
- Protect routes explicitly (auth / role-based)
- Avoid navigation side-effects during render

---

### 9. Performance & UX
- Avoid unnecessary re-renders
- Memoize only when measurable benefit exists
- Ensure:
  - Fast initial render
  - Clear loading indicators
  - No layout shifts

---

### 10. Accessibility & UX Safety
- Use semantic HTML
- Ensure keyboard navigation
- Avoid color-only meaning
- Ensure readable contrast with Tailwind utilities

---

### 11. Error Handling & Edge Cases
- Handle:
  - Empty data
  - API failure
  - Unauthorized access
- Never allow the UI to silently fail

---

## Output Requirements

When completing a task, the agent must provide:
- Brief explanation of architectural decisions
- File(s) changed or created
- Any assumptions made
- Known limitations or follow-up suggestions

---

## Prohibited Actions
- Introducing new libraries without approval
- Ignoring existing project patterns
- Over-engineering
- Writing JSX without types
- Hardcoding API URLs or secrets
