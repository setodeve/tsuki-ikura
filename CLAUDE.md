# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"tsuki-ikura" (月いくら - "How much per month?") - A Japanese web application for calculating monthly income from hourly wages. The app uses weekly schedule settings (Monday-Sunday individual hour settings) optimized for freelancers and part-time workers.

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Linter/Formatter**: Biome 2.2.0
- **Package Manager**: pnpm 10.10.0

## Development Commands

```bash
pnpm install       # Install dependencies
pnpm dev          # Start development server with Turbopack (usually runs on port 3001)
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
```

## Architecture Overview

### Core Calculation System

The app uses a **weekly schedule approach** instead of traditional weekday/weekend/holiday categorization:

```typescript
interface WeeklySchedule {
  monday: number;    // Hours worked on Mondays
  tuesday: number;   // Hours worked on Tuesdays
  // ... for each day of week
}
```

**Calculation Logic:**
1. User sets individual hours for each day of the week
2. System calculates monthly income using selected month's exact calendar data
3. Japanese holidays (2024-2026) are automatically factored in via `lib/calendar.ts`

### Key Components Structure

- **WageCalculator** (`components/wage-calculator.tsx`): Main container component
  - Manages all state and calculation logic
  - Left column: Input forms (hourly wage + weekly schedule)
  - Right column: Month selector + results display

- **WeeklySchedule** (`components/weekly-schedule.tsx`): Individual day input forms
- **InputField** (`components/ui/input-field.tsx`): Standardized input with validation (0-24 hours, 0.5 step)
- **Calendar utilities** (`lib/calendar.ts`): Japanese holiday data and work day calculations

### Data Flow

1. `WorkConditions` stores: hourly rate + weekly schedule + selected month
2. `calculateIncome()` in `lib/calculations.ts` performs calculation
3. Returns `CalculationResult` with: monthly income, average daily rate, yearly projection
4. Results displayed in unified "計算結果" segment

## Japanese Holiday Integration

The app includes accurate Japanese holiday data (2024-2026) in `lib/calendar.ts`. The `calculateMonthlyWorkDays()` function returns exact weekday/weekend/holiday counts for any month, enabling precise monthly income calculations.

## Validation Rules

- Working hours: 0-24 hours per day (HTML5 validation + JS validation)
- Step size: 0.5 hours
- All calculations use exact calendar data when month is selected
- Fallback to 4.33 weeks/month average when no month specified

## Code Conventions

- Use Biome for linting and formatting
- TypeScript strict mode enabled
- Path alias `@/*` maps to project root
- Japanese UI text throughout
- No comments in code unless explicitly requested
- Functional components with React hooks for state management