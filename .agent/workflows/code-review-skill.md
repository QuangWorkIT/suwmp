---
description: This workflow is used for coding review both FE and BE. Before making PR, use this workflow first.
---

---
name: code-review
description: Perform a structured, high-signal code review focusing on correctness, safety, maintainability, and performance. Use for PR reviews and pre-merge quality checks.
---

# Code Review Workflow

## Execution Principles
- Review behavior must be deterministic and repeatable
- Prefer correctness and safety over style
- Assume code will run in production
- Do not speculate beyond the visible code

---

## Review Steps (Strict Order)

### 1. Intent & Scope Validation
- Identify what the code change is intended to do
- Verify the change matches the PR description or commit intent
- Flag scope creep or unrelated changes

---

### 2. Correctness & Logic
- Verify the logic produces correct results for expected inputs
- Check control flow, conditionals, and state changes
- Identify logical bugs, race conditions, or incorrect assumptions

---

### 3. Edge Cases & Failure Handling
- Check behavior for:
  - null / empty inputs
  - invalid states
  - boundary values
  - partial failures
- Verify exceptions are either handled or explicitly allowed to propagate
- Ensure error paths do not corrupt state

---

### 4. Security & Safety (Mandatory)
- Validate input sanitization and validation
- Check for:
  - authentication / authorization gaps
  - sensitive data exposure
  - insecure defaults
- Flag anything that could escalate privileges or leak data

---

### 5. Performance & Resource Usage
- Identify unnecessary allocations, loops, or blocking calls
- Check database access patterns (N+1 queries, large fetches)
- Verify resource cleanup (streams, connections, locks)

---

### 6. Maintainability & Readability
- Assess naming clarity and structure
- Check separation of concerns
- Flag overly complex methods or duplicated logic
- Ensure comments explain *why*, not *what*

---

### 7. Style & Conventions (Last)
- Verify consistency with project or language standards
- Flag style issues only if they affect readability or maintenance

---

## Feedback Rules

- Be precise: reference exact lines or constructs
- Separate **bugs**, **risks**, and **suggestions**
- Always explain *why* an issue matters
- Provide a concrete fix or alternative when possible
- Avoid vague language (“maybe”, “might”, “consider”)

---

## Output Format (Required)

### Summary
- Overall assessment: ✅ Approve / ⚠️ Needs Changes / ❌ Block
- High-level risks (if any)

### Findings
- **Critical Issues** (must fix)
- **Warnings** (should fix)
- **Suggestions** (optional improvements)

### Positive Notes
- Explicitly note good design or correct patterns
