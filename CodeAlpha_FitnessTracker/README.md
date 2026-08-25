# Fitness Tracker — Workout Tracking App

> CodeAlpha App Development Internship — Task 3: Fitness Tracker

Fitness Tracker is a mobile workout tracking application designed to help users plan, perform, and review their training sessions. Users can choose from predefined workout templates or create their own, track exercises and sets during an active session, monitor their training progress, and review their workout history and personal records.

## Features

* **Workout templates** — browse predefined workout routines such as Push Day, Pull Day, Leg Day, Upper Body, and Full Body, with targeted muscle groups, exercises, and estimated durations.
* **Custom workouts** — create personalized workout templates by selecting exercises and configuring the training routine.
* **Workout preview** — review the exercises included in a workout before starting a training session.
* **Active workout sessions** — start a workout from a template, track weight and repetitions for each set, add sets, and complete the session when training is finished.
* **Workout summary** — review a completed session with key statistics such as duration, total volume, completed exercises, and personal records.
* **Workout history** — browse previously completed sessions and open an individual session to review its details.
* **Progress tracking** — visualize training statistics and monitor progression over time through activity, volume, and weight charts.
* **Personal records** — automatically detect and display new personal records for exercises.
* **Local persistence** — workout templates, sessions, exercises, sets, and personal records are stored locally on the device using SQLite.
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

The application follows a layered architecture that separates the presentation layer, application state, business logic, and data persistence:

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
SQLite Database
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

This prevents screens from having to directly interact with SQLite or implement business logic themselves.

```text
Screen
  ↓
Custom Hook
  ↓
Service / Repository
  ↓
SQLite
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

Provides an abstraction over the local database.

Repositories are responsible for reading and writing persistent data while keeping SQLite-specific operations away from the rest of the application.

This separation makes the data layer independent from the screens and components.

### `database/`

Contains the SQLite database configuration, schema, initialization, and persistence-related logic.

The application uses `expo-sqlite` to maintain structured relational data directly on the user's device.

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
                    ┌──────────────────────┐
                    │      exercises       │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
┌─────────────────────────────┐   ┌──────────────────────┐
│ workout_template_exercises  │   │   personal_records   │
└──────────────┬──────────────┘   └──────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│     workout_templates       │
└──────────────┬──────────────┘
               │
               │
               ▼
┌─────────────────────────────┐
│      workout_sessions       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      session_exercises      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        set_entries          │
└─────────────────────────────┘
```

### Exercises

The `exercises` entity represents the application's exercise library.

An exercise can be reused in multiple workout templates and across multiple workout sessions.

Typical information includes:

* Exercise name
* Target muscle group
* Equipment
* Exercise type

### Workout Templates

Workout templates represent reusable workout routines.

The application provides predefined templates such as:

* Push Day
* Pull Day
* Leg Day
* Upper Body
* Full Body

Users can also create their own custom workout templates.

A template describes the planned workout rather than an actual completed training session.

### Workout Template Exercises

A workout template can contain multiple exercises, and the same exercise can appear in multiple templates.

This relationship is represented through a dedicated association between templates and exercises.

This allows the application to preserve:

* Which exercises belong to a template.
* The order of exercises.
* The relationship between reusable exercises and workout routines.

### Workout Sessions

A workout session represents an actual training session performed by the user.

A session is created when the user starts a workout and contains information related to the execution of that workout, such as:

* Workout name
* Start time
* End time
* Duration
* Total volume
* Completed exercises

A workout template can therefore be reused to create multiple independent sessions without modifying historical data.

### Session Exercises

`session_exercises` represents the exercises actually performed during a specific workout session.

This is separated from template exercises because the user may perform a different number of sets or record different values during each session.

For example:

```text
Push Day Template
    └── Bench Press

Session #1
    └── Bench Press
        ├── Set 1 → 60 kg × 10
        ├── Set 2 → 60 kg × 8
        └── Set 3 → 65 kg × 6

Session #2
    └── Bench Press
        ├── Set 1 → 65 kg × 10
        ├── Set 2 → 65 kg × 8
        └── Set 3 → 70 kg × 5
```

The template remains unchanged while each session stores its own performance data.

### Set Entries

Each performed exercise can contain multiple sets.

A set records the actual performance of the user, including values such as:

* Weight
* Repetitions
* Completion status

This level of granularity allows the application to calculate training volume and analyze progression over time.

### Personal Records

Personal records store the user's best recorded performance for an exercise.

When a workout is completed, the application can compare the newly recorded performance against the existing personal record and identify a new record when appropriate.

This information is then displayed in the progress and workout summary sections.

---

## Database Relationships

The main relationships can be represented as follows:

```text
Exercise
   │
   ├─────────────── 1 ─── N ─── Workout Template Exercise
   │                                  │
   │                                  N
   │                                  │
   │                                  1
   │                         Workout Template
   │
   └─────────────── 1 ─── N ─── Session Exercise
                                      │
                                      │ 1
                                      │
                                      N
                                      ▼
                                  Set Entry

Exercise
   │
   └─────────────── 1 ─── 1 ─── Personal Record

Workout Template
   │
   └─────────────── 1 ─── N ─── Workout Session
```

This structure provides a clear separation between:

* **What the user plans to do** → workout templates.
* **What the user actually did** → workout sessions.
* **How the user performed** → session exercises and sets.
* **What the user's best performance is** → personal records.

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

* **Local database** — Fitness Tracker uses `expo-sqlite` to persist structured workout data directly on the device.
* **No backend required** — the application does not depend on a remote server or external API for its core functionality.
* **Reusable workout templates** — predefined templates are provided for common training splits, while users can also create custom routines.
* **Training volume** — weighted exercises calculate volume from weight and repetitions. Bodyweight exercises additionally account for the user's body weight.
* **Personal records** — completed workouts are analyzed to determine whether a new personal record has been achieved.
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
