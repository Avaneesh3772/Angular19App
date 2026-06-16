# Angular19App — CQRS Enterprise Dashboard

An **Angular 19** standalone application that combines a **role-based enterprise dashboard** (Admin, Role, Restatement, Templates) with interactive **RxJS** and **Angular Signals** learning modules. It uses Angular Material, lazy-loaded routes, route guards, and mock JSON / JSONPlaceholder APIs for local development.

---

## Overview

The app simulates a corporate **CQRS** portal (*Global Knowledge. Local Support.*) where users access features based on roles loaded at startup. Alongside business modules, it includes dedicated sandboxes to learn RxJS operators and Angular Signals through practical, step-by-step exercises.

**Default route:** `/dashboard`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 19 (standalone components) |
| UI | Angular Material 19, Bootstrap 5 |
| Reactive | RxJS 7.8 |
| HTTP | `HttpClient` + custom `WebApiService` base class |
| Dates | Moment.js (Material date adapter) |
| Tests | Jasmine + Karma |
| CLI | Angular CLI 19.2 |

---

## Application Modules

### Business modules (role-guarded)

| Module | Route | Guard role | Description |
|--------|-------|------------|-------------|
| **Dashboard** | `/dashboard` | `dashboard` | User list from JSONPlaceholder; row click opens user info dialog |
| **Templates** | `/templates` | `templates` | CRUD demo (GET/POST/PUT/DELETE) against JSONPlaceholder posts |
| **Admin** | `/admin/*` | `admin` | Close Quarter, LE Calculation, Rounding Model Calculation |
| **Role** | `/role/*` | `rolemanagement` | Role Definition (monthly/quarterly tabs), Role Assignment |
| **Restatement** | `/restatement/*` | `restatement` | Initiate & Define, Track & Action, dynamic track detail |

### Learning modules (open access)

| Module | Route | Topics |
|--------|-------|--------|
| **RxJS Learning** | `/rxjs-learning/*` | Creation, Filtering, Transformation, Combination, Error Handling, Subjects |
| **Signals Learning** | `/signals-learning/*` | Basic, Computed, Effects, toSignal, toObservable, linkedSignal, resource, mutate |

Each RxJS topic uses a **real-world exercise** (clinic scheduling, HR shortlisting, order fulfilment, etc.) with intro text, live demos, stream logs, and a rules table. Transformation, Combination, and Error Handling use **Material accordions** per operator.

---

## RxJS Learning Exercises (summary)

| Route | Theme | Operators |
|-------|-------|-----------|
| `creation` | Doctor Appointment Clinic | `of`, `from`, `fromEvent`, `toArray` |
| `filtering` | HR Promotion Shortlisting | `filter`, `take`, `debounceTime`, `distinctUntilChanged`, `shareReplay` |
| `transformation` | E-Commerce Order Fulfillment | `map`, `mergeMap`, `concatMap`, `switchMap` |
| `combination` | Executive Business Dashboard | `forkJoin`, `combineLatest`, `zip`, `merge` |
| `error-handling` | Checkout Resilience Hub | `throwError`, `catchError`, `retry` |
| `subjects` | Component communication | `Subject`, `BehaviorSubject` (Publisher → Service → Header + Inbox) |

---

## Signals Learning (summary)

| Route | Concept |
|-------|---------|
| `basic-signals` | `signal()`, `set()`, `update()` |
| `computed-signals` | Derived state with `computed()` |
| `effects-signals` | Side effects with `effect()` |
| `to-signal` | Observable → Signal |
| `to-observable` | Signal → Observable |
| `linked-signal` | `linkedSignal()` |
| `resource-signal` | `resource()` async data |
| `mutate-signal` | Deprecated `mutate()` (removed in modern Angular) |

---

## Architecture

```
src/app/
├── app.component.*          # Shell: header, sidebar nav, footer, router-outlet
├── app.config.ts            # Router, HTTP, animations, app initializer
├── app.routes.ts            # Top-level lazy routes + guards
├── web-api.service.ts       # Base HTTP GET/POST/PUT/DELETE
│
├── dashboard/               # User table + dialog
├── templates/               # Posts CRUD + dialogs
├── admin/                   # Quarter close, LE calc, rounding model
├── role/                    # Role definition & assignment
├── restatement/             # Restatement workflow
│
├── rxjs-learning/           # 6 operator topics + shared service/models
├── signals-learning/        # 8 signal topics + shared constants/service
│
└── shared/
    ├── components/          # Header, footer, dialogs, page-not-found
    ├── guards/              # canMatch role guards per module
    ├── http-interceptor/    # Auth token interceptor
    ├── services/            # Auth, app init, authorization, RxJS shared bus
    ├── pipes/               # month-name
    ├── validators/          # age, password
    └── testing/             # Test helpers
```

### Startup flow

1. **`AppInitializerDataService`** runs via `provideAppInitializer`
2. Auth token stored in session storage
3. **`appConfiguration.json`** loaded — user name, employee number, **roles array**
4. Route guards read roles and allow or block navigation (unauthorized → dialog)

### Cross-component demo

- **`RxjsSharedService`** — `BehaviorSubject` (app notification → Header banner) + `Subject` (action events → Subject Inbox component)

---

## Mock Data & APIs

### Local JSON (`src/assets/mockData/`)

| File | Used by |
|------|---------|
| `appConfiguration.json` | App init — user info & roles |
| `doctorsData.json` | RxJS Creation, Filtering context |
| `employeeData.json` | RxJS Filtering, Combination, Error Handling |
| `artistData.json` | RxJS Subjects (legacy), Error Handling retry |
| `ordersData.json` | RxJS Transformation, Error Handling |
| `adminMockData.json` | Admin module |
| `roleMockData.json` | Role definition |
| `roleAssignmentList.json` | Role assignment |
| `roleAssignmentUsersList.json` | Role assignment users |

### External API

[JSONPlaceholder](https://jsonplaceholder.typicode.com) — users, posts, todos, comments (Dashboard, Templates, RxJS demos).

---

## Navigation

Left sidebar in `app.component.html`:

- Dashboard, Templates
- ⚙️ Admin, 👥 Role, 🔄 Restatement
- ⚡ RxJS (6 sub-routes)
- 🔔 Signals (8 sub-routes)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development server

```bash
npm start
# or: ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app redirects to `/dashboard`.

### Build

```bash
npm run build
# Development build (no strict budgets):
ng build --configuration=development
```

Output: `dist/angular19-app/`

### Unit tests

```bash
npm test
# or: ng test
```

Specs cover guards, services, Dashboard, Templates, Role, Restatement, and shared components. Admin module tests exist for some components; coverage varies by module.

---

## Role-Based Access

Roles are defined in `src/assets/mockData/appConfiguration.json`:

```json
{
  "employeeNumber": 339803934,
  "firstname": "Avaneesh",
  "lastname": "Mishra",
  "roles": ["dashboard", "templates", "admin", "rolemanagement", "restatement"]
}
```

| Role key | Module |
|----------|--------|
| `dashboard` | Dashboard |
| `templates` | Templates |
| `admin` | Admin |
| `rolemanagement` | Role |
| `restatement` | Restatement |

RxJS and Signals modules have **no guards** — always accessible for learning.

To test denied access, remove a role from the JSON and reload.

---

## Styling Conventions

- Global styles: `src/styles.scss` — layout, tables, RxJS/Signals shared classes (`.rxjs-*`, `.page-container`, `.demo-grid`, etc.)
- Module-scoped SCSS per component
- Angular Material theming with outline form fields and raised buttons

---

## Project Metadata

| Item | Value |
|------|-------|
| Project name | `angular19-app` |
| Angular CLI | 19.2.26 |
| Default user | Avaneesh Mishra (from app config) |

---

## Additional Resources

- [Angular documentation](https://angular.dev)
- [Angular CLI reference](https://angular.dev/tools/cli)
- [RxJS documentation](https://rxjs.dev)
- [Angular Signals guide](https://angular.dev/guide/signals)
