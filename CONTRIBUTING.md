# ChemRisk Project: CONTRIBUTING & Ticketing Guide

## Lean & Smart Ticketing System

To keep our small team (Dev + PM + AI assist) organized, use the following for all tasks, bugs, and features.

### 🎫 How to Create a Ticket

1. Go to **Issues** → **New Issue** → Select `Lean&Smart Ticket`.
2. Fill in all sections:
    - Short Title
    - Type (Feature, Bug, Chore/Infra, Research/Spike, Idea)
    - Short Description
    - Acceptance Criteria (let AI assist or auto-fill if you wish)
    - Priority (High, Medium, Low)
    - Status (Open, In Progress, In Review, Done, Blocked)
    - Contextual Labels (see below)
    - Assignee (yourself, PM, or "AI")
    - (Optional) Estimate (1, 2, 4, 8)

### 🚦 Workflow & Project Board

We use a GitHub Project board ([see here](https://github.com/users/Marcellokah/projects/2/views/1)) for status tracking.
Recommended columns:
- **Backlog**
- **In Progress**
- **In Review**
- **Done**
- **Blocked**

#### How to use smartly with AI:
- AI can help fill acceptance criteria, detect duplicates, and summarize progress.
- When PRs referencing an issue are merged, issues can be auto-moved to "In Review" or "Done".
- To automate more (e.g., auto-close issues), see [GitHub Actions workflow docs](https://docs.github.com/en/actions)!

### 🏷️ Recommended Labels
- **Type**: `feature`, `bug`, `chore`, `research`, `idea`
- **Area**: `ui`, `api`, `release`, `infra`, `tests`
- **Priority**: `high`, `medium`, `low`

(You can add more as your workflow evolves.)

### 🤖 Tips for AI-Enhanced Tickets

- When describing a ticket, be brief; let the AI suggest more details or acceptance criteria.
- Review auto-suggested text before submitting.
- Summarize multiple tickets or statuses any time by prompting your Copilot or GPT in Issues/Comments.

### 🆕 Quickstart
1. Use the Issue template for every task/bug/feature/discussion.
2. Move issues via Project board: Backlog → In Progress → In Review → Done.
3. Use labels for quick filtering (e.g., `priority:high` or `area:api`).
4. Let the AI help you generate acceptance criteria and review past tickets for similar issues.

---

Want deeper automation? Add a workflow file using GitHub Actions to auto-label, auto-assign, or close issues when PRs are merged.

Questions? Ask in the Project board or mention @Marcellokah.

---