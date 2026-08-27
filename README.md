# CodeAlpha — App Development Internship

This repository contains the projects submitted for the [CodeAlpha](https://www.codealpha.tech) App Development internship. The program requires completing **2 to 3 tasks** out of 4 possible ones (Flashcard Quiz App, Random Quote Generator, Fitness Tracker App, Language Learning App). Recall and Quotidian satisfy the minimum submission criteria on their own; LiftLog extends coverage to a third task.

## Projects

| Project | Task | Description | Stack |
|---|---|---|---|
| [**Recall**](./CodeAlpha_Flashcards_Quiz_App) | Task 1 — Flashcard Quiz App | Create flashcard collections, review them with a flip/swipe interaction, and track your score. | React Native (Expo) · TypeScript · Expo SQLite |
| [**Quotidian**](./CodeAlpha_QuoteApp) | Task 2 — Random Quote Generator | Get a random quote on demand, filter by category, and save favorites. | React Native (Expo) · JavaScript · AsyncStorage |
| [**LiftLog**](./CodeAlpha_FitnessTracker) | Task 3 — Fitness Tracker  | Log workouts from templates or custom routines, track sets/reps/weight, and review progress and personal records. | React Native (Expo) · TypeScript · Expo SQLite + AsyncStorage |

Each project has its own README covering setup, architecture, and task-requirement coverage in detail — see the links above.

## Common Conventions

All apps share the same layered architecture, kept consistent across the internship regardless of stack differences:

```
UI layer  →  hooks  →  services / context  →  repositories  →  storage (SQLite / AsyncStorage)
```

No component talks to storage or performs business logic directly — everything routes through a repository, keeping each app testable and easy to extend.

## Repository Structure

```
.
├── CodeAlpha_Flashcards_Quiz_App/   # Recall — Task 1
│   └── README.md
├── CodeAlpha_QuoteApp/               # Quotidian — Task 2
│   └── README.md
├── CodeAlpha_FitnessTracker/          # LiftLog — Task 3
│   └── README.md
└── README.md                           # you are here
```

## Running a Project

Each subfolder is an independent Expo project with its own `package.json`. From within the project folder:

```bash
npm install
npx expo start
```

See the individual READMEs for project-specific environment setup.

## About CodeAlpha

CodeAlpha is a software development company running project-based internships in web/app development, data science, and related fields, pairing interns with real-world project briefs and mentorship. More info: [www.codealpha.tech](https://www.codealpha.tech).