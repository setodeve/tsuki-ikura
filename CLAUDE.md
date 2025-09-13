# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"tsuki-ikura" (月いくら - "How much per month?") - A web application for hourly wage workers to instantly calculate their monthly income based on hourly rate and working hours.

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Linter/Formatter**: Biome 2.2.0
- **Package Manager**: pnpm 10.10.0

## Development Commands

```bash
pnpm install       # Install dependencies
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components (to be created)
- `lib/` - Utility functions and business logic (to be created)
- `public/` - Static assets

## Core Calculation Logic

The application implements these calculations (from spec.md):

```typescript
// Monthly income calculation
monthly = hourly * (
  hoursWeekday * weekdaysPerMonth +
  hoursHoliday * holidaysPerMonth +
  hoursNationalHoliday * nationalHolidaysPerMonth
)

// Reverse calculation (hours to income)
earningsByHours = hourly * totalHours

// Daily rates
weekdayDaily = hourly * hoursWeekday
holidayDaily = hourly * hoursHoliday
nationalHolidayDaily = hourly * hoursNationalHoliday
```

## Key Features (MVP)

1. **Real-time Calculation**: All inputs trigger instant recalculation
2. **Multi-day Type Support**: Separate hour/day settings for weekdays, holidays, and national holidays
3. **Reverse Calculation**: Calculate income from total hours worked
4. **Presets**: Save/load multiple wage conditions using localStorage
5. **URL Sharing**: Embed calculation parameters in query strings

## Validation Rules

- Working hours: 0-24 hours per day
- Days per month: 0-31 days
- Decimal precision: 2 digits maximum
- All numeric inputs must be positive

## Code Conventions

- Use Biome for linting and formatting (already configured)
- TypeScript strict mode is enabled
- Path alias `@/*` maps to project root
- Component structure: Functional components with TypeScript
- State management: React hooks for local state, consider Zustand for presets

## Performance Requirements

- Initial calculation display: < 10 seconds
- Input-to-update latency: < 100ms
- Mobile-first responsive design (iPhone SE baseline)
- All calculations client-side (no API calls needed)