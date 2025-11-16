# Deal Simulator Project Context

## Vision
Transform the deal simulator into a comprehensive M&A financial modeling platform that empowers business owners, investors, and advisors with advanced analytics, collaboration tools, and professional-grade reports. Aim for industry-standard robustness, intuitive usability, and scalable features to handle complex deal structures globally.

## Current State
- Core functionality: Basic earn-out, seller financing, all-cash calculations with chart and PDF export.
- Tech stack: Next.js 15, React 19, TypeScript, Tailwind, Recharts, React PDF.
- Status: Functional MVP with room for enhancement.

## Roadmap Phases
1. **Foundation & Robustness** (Week 1-2): Input validation, error handling, mobile UX, onboarding.
2. **Core Power & Analytics** (Week 3-6): Sensitivity analysis, IRR/NPV, Monte Carlo, multi-currency.
3. **Feature Expansion** (Week 7-12): Scenario management, user accounts, collaboration, data import.
4. **Polish & Scale** (Ongoing): Accessibility, PWA, localization, advanced financing.

## Progress Tracking
- Completed: Basic app structure, core calculations, UI components, Phase 1 (Foundation & Robustness), Phase 2 (Core Power & Analytics), Phase 3 (Feature Expansion).
- In Progress: Phase 4 - Polish & Scale.
- Pending: Remaining todos from planning.

## Git Strategy
- **Branches**: 
  - `main`: Stable releases only.
  - `develop`: Integration branch for features.
  - `feature/*`: Individual features (e.g., `feature/sensitivity-analysis`).
- **Workflow**: Create feature branch from develop, commit frequently, merge back via PR (local only, no remote ops).
- **Commits**: Atomic, descriptive messages (e.g., "feat: add input validation").
- **Merging**: Use `git merge --no-ff` for feature branches into develop, then develop into main.

## Key Decisions
- Prioritize usability and power over features.
- Maintain TypeScript for type safety.
- Test-driven development for calculations.
- Modular architecture for extensibility.