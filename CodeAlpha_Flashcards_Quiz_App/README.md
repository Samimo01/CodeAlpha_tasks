# Recall — Flashcard Quiz App

> CodeAlpha App Development Internship — Task 1: Flashcard Quiz App

Recall is a mobile flashcard app for studying with custom collections. Users create collections of question/answer cards, review them in a swipeable session, and track their score at the end of each round.

## Features

- **Collections CRUD** — create, rename, and delete collections; each collection must always contain at least one card (enforced at the repository level, not just the UI).
- **Card management** — add, edit, and delete flashcards within a collection, with an undo snackbar (4s window) after deletion.
- **Review session** — cards are shuffled once per session; tap to flip between question and answer, swipe right for "Correct" / left for "Incorrect", or use the Previous/Next buttons to navigate freely.
- **Results screen** — animated progress ring showing score and percentage, with contextual encouragement messages and a "Retry" action.
- **Search** — filter collections by name once more than a handful exist.
- **Persistent local storage** — everything is stored in SQLite on-device; no backend, no network dependency.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo (SDK 54, Expo Router, dark theme) |
| Language | TypeScript (strict mode) |
| Local database | Expo SQLite, versioned migrations via `PRAGMA user_version` |
| UI kit | React Native Paper (dialogs, snackbar) |
| Animation / gestures | React Native Reanimated v4 + React Native Gesture Handler + `react-native-worklets` |
| Icons | `@expo/vector-icons` (MaterialCommunityIcons) |
| Fonts | Space Grotesk (display/UI), Inter (body) |

## Architecture

The app follows a strict layered separation — no data-fetching or storage logic lives in components:

```
components  →  hooks  →  services  →  repositories  →  database (SQLite)
```

- `database/` — SQLite connection singleton (`database.ts`) and versioned migrations (`migrations.ts`, `schema.ts`).
- `database/repositories/` — `CollectionRepository` and `CardRepository`; all SQL lives here. `CardRepository.delete` throws if it's the collection's last card.
- `hooks/` — `useCollections`, `useCards`, `useReview` own component state and orchestrate repository calls (including optimistic delete + undo).
- `services/ReviewService.ts` — pure, framework-agnostic helpers (Fisher–Yates shuffle, score/percentage calculation), fully unit-testable.
- `components/` — presentation only: `card/` (FlipCard, ProgressRing, ResultBadge), `collection/`, `dialogs/`, `layout/`, `common/`.
- `app/` — Expo Router screens: `index` (home), `collection/new`, `collection/[id]`, `review/[id]`, `result`.

## Project Structure

```
src/
├── app/                    # Expo Router screens
├── components/
│   ├── card/                # FlipCard, ProgressRing, ResultBadge
│   ├── collection/           # SearchBar, CollectionList, CollectionRow, EmptyState
│   ├── dialogs/              # Confirm/blocked-delete/card-form dialogs
│   ├── layout/                # ScreenContainer, BrandHeader
│   └── common/                # IconButton, AppButton, StatChip
├── database/
│   ├── database.ts
│   ├── migrations.ts
│   ├── schema.ts
│   └── repositories/
├── hooks/                    # useCollections, useCards, useReview
├── services/                 # ReviewService (pure logic)
├── theme/                    # colors.ts, typography.ts, paperTheme.ts
└── types/
```

## Getting Started

```bash
npm install
npx expo start
```

Requires Expo Go (SDK 54) or a development build — the app uses `expo-sqlite`, which is not available in a plain web preview.

### Environment Variables

Recall reads one optional variable at runtime with a safe default, so the app runs out of the box without any `.env` file:

| Variable | Default | Used in | Purpose |
| --- | --- | --- | --- |
| `EXPO_PUBLIC_DB_NAME` | `recall.db` | `src/database/database.ts` | Name of the local SQLite database file opened via `expo-sqlite`. |

To override the default, copy the example file and fill in the value:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_DB_NAME=recall.db
```

Changing the database name is mainly useful when running multiple Recall instances (or app variants) on the same device/simulator without their local data colliding — for example during QA against two branches at once. The `EXPO_PUBLIC_` prefix is required by Expo to expose the variable to client-side code; without it, `process.env` would be `undefined` at runtime. `.env` is typically gitignored — only `.env.example` is committed.

## Technical Notes

- **Reanimated v4 worklets**: state-update callbacks (`onFlip`, `onMark`) cannot be invoked directly from a worklet. `FlipCard` uses `scheduleOnRN` from `react-native-worklets` (the replacement for the deprecated `runOnJS`) to safely cross the JS/UI-thread boundary on swipe/tap gestures.
- **Data integrity**: the one-card-per-collection minimum is enforced in `CardRepository`, not only in the UI, so it can't be bypassed by any future caller.
- **Undo delete**: card deletion is optimistic (removed from local state immediately) with a repository call performed in the background; on failure, the local state is rolled back.

## Task Requirements Coverage

| CodeAlpha requirement | Status |
|---|---|
| Front/back flashcards with reveal | ✅ (tap-to-flip instead of a "Show Answer" button) |
| Next / Previous navigation | ✅ |
| Add, edit, delete flashcards | ✅ |
| Clean, simple UI | ✅ |
