# Quotidian — Random Quote Generator

> CodeAlpha App Development Internship — Task 2: Random Quote Generator

Quotidian shows one quote at a time, styled like a small editorial card: an italic serif quote, an attributed author, and a category filter. Users can favorite quotes for later and browse them in a dedicated tab.

## Features

- **Random quote on launch and on demand** — a quote loads automatically when the app opens, and a "New Quote" button fetches another, guaranteed not to repeat the current one (up to 5 retries).
- **Category filter** — All / Wisdom / Motivation / Life / Humor, as horizontally scrollable chips.
- **Favorites** — tap the heart to save a quote; favorites persist across app restarts and are listed on a dedicated tab with a swipe/tap-to-remove action.
- **Clean, minimal UI** — light theme, Lora italic serif for the quote text, uppercase tracked sans-serif for labels and the author line.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Language | JavaScript |
| Navigation | React Navigation (bottom tabs) |
| Local storage | `@react-native-async-storage/async-storage` (favorites) |
| Fonts | `@expo-google-fonts/lora` (Lora Italic) |
| Icons | `@expo/vector-icons` (Feather) |

## Architecture

```
screens  →  components  →  hooks  →  context / services  →  repositories (AsyncStorage)
```

- `data/` — local dataset (`quotes.json`, `categories.json`) used as the quote source; `quoteService.js` normalizes and randomly samples from it per category.
- `context/FavoritesContext.js` — app-wide favorites state, avoiding prop-drilling between the Home and Favorites screens.
- `repositories/FavoritesRepository.js` — the only module that talks to AsyncStorage (get/add/remove/toggle).
- `hooks/useQuote.js` — owns quote-fetching state per screen; `hooks/useFavorites.js` reads from `FavoritesContext` when available, with a local-state fallback for isolated use.
- `screens/` — `HomeScreen` (quote + category picker + favorite toggle) and `FavoritesScreen` (saved quotes list with empty state).
- `theme/` — centralized `colors.js` and `typography.js`, shared by every screen and component.

## Project Structure

```
src/
├── components/          # QuoteCard, CategoryPicker, NewQuoteButton
├── context/              # FavoritesContext
├── data/                  # quotes.json, categories.json
├── hooks/                 # useQuote, useFavorites
├── repositories/          # FavoritesRepository (AsyncStorage)
├── screens/               # HomeScreen, FavoritesScreen
├── services/              # quoteService (category filtering, random sampling)
└── theme/                 # colors.js, typography.js
```

## Getting Started

```bash
npm install
npx expo start
```

Set `EXPO_PUBLIC_STORAGE_KEY` in your environment (used by `FavoritesRepository` as the AsyncStorage key) before running the app.

## Task Requirements Coverage

| CodeAlpha requirement | Status |
|---|---|
| Random quote on open / on click | ✅ |
| "New Quote" button | ✅ |
| Quote text + author clearly displayed | ✅ |
| Clean, minimal UI | ✅ |
