# LiftLog — Fitness Tracker App

> CodeAlpha App Development Internship — Task 3: Fitness Tracker App

LiftLog is a mobile workout tracking application designed to help users plan, perform, and review their training sessions. Users can choose from predefined workout templates or create their own, track exercises and sets during an active session, monitor their training progress, and review their workout history and personal records.

## Features

* **Workout templates** — browse predefined workout routines such as Push Day, Pull Day, Leg Day, Upper Body, and Full Body, with targeted muscle groups, exercises, and estimated durations.
* **Custom workouts** — create personalized workout templates by selecting exercises and configuring the training routine.
* **Workout preview** — review the exercises included in a workout before starting a training session.
* **Active workout sessions** — start a workout from a template, track weight and repetitions for each set, add sets, and complete the session when training is finished.
* **Workout summary** — review a completed session with key statistics such as duration, total volume, completed exercises, and personal records.
* **Workout history** — browse previously completed sessions and open an individual session to review its details.
* **Progress tracking** — visualize training statistics and monitor progression over time through activity, volume, and weight charts.
* **Personal records** — automatically detect and display new personal records for exercises.
* **Local persistence** — workout sessions, sets, and body-weight history are stored locally with SQLite, while workout templates and template edits are persisted in AsyncStorage.
* **Bodyweight exercise support** — bodyweight exercises take the user's body weight into account when calculating training volume.
* **Offline-first experience** — the application does not require a backend or external API to manage workout data.

## Tech Stack

| Layer         | Choice                                      |
| ------------- | ------------------------------------------- |
| Framework     | React Native + Expo                         |
| Expo SDK      | SDK 54                                      |
| Language      | TypeScript                                  |
| Type checking | TypeScript strict mode                      |
| Navigation    | Expo Router                                 |
| Database      | Expo SQLite                                 |
| Local storage | `@react-native-async-storage/async-storage` |
| Charts        | `react-native-gifted-charts`                |
| Icons         | `lucide-react-native`                       |
| Gradients     | `expo-linear-gradient`                      |
| SVG           | `react-native-svg`                          |

## Architecture

The application follows a layered architecture that separates the presentation layer, application state, business logic, and data persistence. The real implementation combines SQLite for workout history with AsyncStorage for template state:

```text
Screens
   ↓
Components
   ↓
Hooks
   ↓
Services
   ↓
Repositories
   ↓
SQLite + AsyncStorage
```

### `app/`

Contains the application's screens and navigation flows using Expo Router.

* Home dashboard
* Workout templates
* Workout creation
* Workout preview
* Active workout
* Workout summary
* Workout history
* Workout details
* Progress tracking

The application uses file-based routing with tab navigation and dedicated routes for the workout lifecycle.

### `components/`

Contains reusable presentation components organized by feature:

* `common/` — buttons, chips, stat cards, steppers, empty states, and other shared UI components.
* `history/` — components used to display workout history.
* `progress/` — charts and personal-record components.
* `workout/` — exercise rows, set rows, effort indicators, and other workout-specific components.
* `layout/` — reusable screen containers and headers.

Components are primarily responsible for rendering the interface and handling user interactions without directly accessing the database.

### `hooks/`

Contains custom React hooks responsible for application state and data orchestration.

Hooks act as the bridge between the screens/components and the underlying services and repositories. They encapsulate operations such as loading workout data, managing workout state, refreshing persisted data, and exposing simplified actions to the UI.

This prevents screens from having to directly interact with persistence code or implement business logic themselves.

```text
Screen
  ↓
Custom Hook
  ↓
Service / Repository
  ↓
SQLite or AsyncStorage
```

### `services/`

Contains framework-independent business logic.

The services handle operations such as:

* Creating and preparing workout sessions.
* Calculating training volume.
* Calculating workout statistics.
* Detecting personal records.
* Managing predefined workout templates.
* Handling workout-related calculations.

Keeping this logic outside the UI makes the application easier to maintain and test.

### `repositories/`

Provides a data-access layer that abstracts persistence and keeps SQLite-specific logic out of the UI.

In this codebase, repositories are used for both SQLite-backed data (workout sessions, sets, body weight logs) and application-level template state stored in `AsyncStorage` for custom and edited workout templates.

This separation keeps screens and hooks focused on interaction and state orchestration rather than database internals.

### `database/`

Contains the SQLite setup, schema, migrations, and repository access logic.

The application uses `expo-sqlite` to persist workout sessions, exercises, set history, and body-weight logs on the device. Workout templates themselves are stored through `@react-native-async-storage/async-storage` rather than in a dedicated SQLite table.

### `types/`

Contains shared TypeScript types and interfaces used throughout the application.

These types represent concepts such as:

* Exercises
* Workout templates
* Workout exercises
* Workout sessions
* Sets
* Personal records

### `theme/`

Contains centralized design tokens such as colors and typography used throughout the application.

---

## Database Schema

Fitness Tracker uses **SQLite through `expo-sqlite`** to persist workout data locally.

Unlike a simple flashcard application, the Fitness Tracker database has to represent several interconnected concepts. A workout template is different from an actual workout session, exercises can be reused across multiple templates and sessions, and each performed exercise can contain multiple sets.

The database therefore uses a relational structure to avoid duplicating information and to preserve workout history.

### Main Entities

```text
SQLite (expo-sqlite)
├── workout_sessions
│   └── session_exercises
│       └── sets
├── body_weight_log
└── optional migration metadata

AsyncStorage
└── workout template state
    ├── default templates visibility
    ├── custom templates
    ├── template edits
    └── hidden default templates
```

### Workout Templates

Workout templates are not stored in a dedicated SQLite table in the current implementation.

Instead, the app keeps:

* a built-in catalog of default templates in the service layer,
* custom templates created by the user,
* edited/default visibility metadata,
* hidden default templates,

inside `AsyncStorage` through `WorkoutTemplateRepository`.

This makes the template list flexible for user modifications without mutating historical workout data.

### Workout Sessions

A workout session represents an actual training session performed by the user.

The session is stored in SQLite with information such as:

* workout name
* start timestamp
* duration in seconds
* calories burned

Each session may contain multiple `session_exercises`, each of which can have multiple sets recorded for the workout.

### Session Exercises

`session_exercises` stores the exercises that were actually performed during a specific training session.

The same exercise can appear in different sessions, but each session keeps its own set history and ordering. This allows the app to preserve historical performance without modifying the template definition.

Example:

```text
Workout Session
    └── Bench Press
        ├── Set 1 → 60 kg × 10
        ├── Set 2 → 60 kg × 8
        └── Set 3 → 65 kg × 6
```

### Set Entries

Each recorded exercise can contain multiple sets.

A set captures:

* weight
* repetitions
* order within the exercise

These values are used to calculate volume, detect trends, and build session summaries.

### Body Weight Log

Bodyweight measurements are tracked in `body_weight_log` and stored independently of workout sessions.

This table is used to:

* determine the user's latest body weight,
* include bodyweight resistance in volume calculations,
* display weight progression charts.

### Personal Records

Personal records are not stored in a dedicated `personal_records` table in the current implementation.

The app computes them dynamically by querying all sets for each exercise and taking the maximum recorded weight. This result is then displayed in the progress screen and workout summary.

---

## Database Relationships

The current implementation uses a simpler, practical model than the original documentation draft:

```text
Workout Session
   │
   └─────────────── 1 ─── N ─── Session Exercise 
                                      │
                                      │ 1
                                      │
                                      N
                                      ▼
                                    Set Entry

Body Weight Log
   └── independent measurements used for weight charts and volume calculations

AsyncStorage template store
   └── default templates + custom templates + edit/visibility metadata
```

This structure reflects the real codebase:

* **What the user plans to do** → template definitions in `AsyncStorage`.
* **What the user actually did** → workout sessions in SQLite.
* **How the user performed** → session exercises and sets.
* **How body weight evolves** → `body_weight_log`.
* **Best performance** → computed dynamically from stored set data instead of a dedicated table.

---

## Data Flow

The typical workout lifecycle is:

```text
Select Workout Template
          ↓
     Preview Workout
          ↓
      Start Session
          ↓
   Create Workout Session
          ↓
  Record Exercises & Sets
          ↓
      Complete Session
          ↓
 Calculate Statistics
          ↓
 Detect Personal Records
          ↓
    Save to SQLite
          ↓
 History / Progress
```

This architecture allows the application to reuse the same persisted data for several features.

For example, a completed set can contribute to:

* The current workout's total volume.
* The workout summary.
* Workout history.
* Progress charts.
* Personal-record detection.

---

## Project Structure

```text
CodeAlpha_FitnessTracker/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── history/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── progress/
│   │   │   └── index.tsx
│   │   └── workouts/
│   │       ├── index.tsx
│   │       └── create.tsx
│   │
│   ├── workout/
│   │   ├── preview/
│   │   │   └── [templateId].tsx
│   │   ├── active/
│   │   │   └── [sessionId].tsx
│   │   └── summary/
│   │       └── [sessionId].tsx
│   │
│   └── _layout.tsx
│
├── components/
│   ├── common/
│   ├── history/
│   ├── layout/
│   ├── progress/
│   └── workout/
│
├── database/
│   └── ...
│
├── hooks/
│   └── ...
│
├── repositories/
│   └── ...
│
├── services/
│   └── ...
│
├── theme/
│   └── ...
│
├── types/
│   └── ...
│
├── assets/
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Expo CLI / Expo tooling
* Expo Go on a compatible mobile device, or an Android/iOS development environment

### Installation

Clone the repository and navigate to the project:

```bash
git clone https://github.com/Samimo01/CodeAlpha_tasks.git
cd CodeAlpha_tasks/CodeAlpha_FitnessTracker
```

Install the dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

The application can then be opened using Expo Go or an appropriate development build.

## Technical Notes

* **Local database** — Fitness Tracker uses `expo-sqlite` to persist workout sessions, set history, and body-weight records directly on the device.
* **Template persistence** — default/custom templates and template edits are saved in `AsyncStorage` instead of a dedicated SQLite table.
* **No backend required** — the application does not depend on a remote server or external API for its core functionality.
* **Reusable workout templates** — predefined templates are provided for common training splits, while users can also create custom routines.
* **Training volume** — weighted exercises calculate volume from weight and repetitions. Bodyweight exercises additionally account for the user's body weight.
* **Personal records** — completed workouts are analyzed dynamically to determine whether a new personal record has been achieved.
* **Progress visualization** — historical workout data is reused to generate activity, volume, and weight-related charts.
* **Type safety** — TypeScript strict mode is enabled throughout the project, with the `@/*` path alias mapped to the source directory.
* **Expo Router** — navigation follows the file-based routing architecture provided by Expo Router.
* **Component organization** — reusable components are grouped by responsibility and feature rather than being kept in a single directory.

## Task Requirements Coverage

| CodeAlpha requirement               | Status |
| ----------------------------------- | ------ |
| Track workout exercises             | ✅      |
| Record weight and repetitions       | ✅      |
| Create custom workouts              | ✅      |
| Use predefined workout templates    | ✅      |
| Start and complete workout sessions | ✅      |
| View workout summaries              | ✅      |
| View completed workout history      | ✅      |
| Track workout progress              | ✅      |
| Display workout statistics          | ✅      |
| Track personal records              | ✅      |
| Persist workout data locally        | ✅      |
| Support bodyweight exercises        | ✅      |
| Provide a clean mobile interface    | ✅      |
