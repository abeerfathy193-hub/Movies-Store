### AngFilms — Setup and Installation Guide

This document helps you set up, run, and build the AngFilms project locally, along with a quick overview of the key packages used.

## Prerequisites
- **Node.js**: 18.x or 20.x recommended
- **npm**: 9+ (bundled with Node)
- **Angular CLI**: 20.3.x

Install Angular CLI globally if you don’t have it:

```bash
npm install -g @angular/cli@20.3.4
```

## Getting Started
1) Install dependencies:

```bash
npm install
```

2) Start the dev server:

```bash
npm start
# or
ng serve
```

Visit `http://localhost:4200/`.

## Building for Production

```bash
ng build
```

Artifacts are emitted to `dist/`.

## Environment / Configuration
- If the app integrates with external APIs (e.g., movie databases or payment providers), set the appropriate keys in your Angular environment files (e.g., `src/environments/environment.ts`).
- For Stripe integration, you will typically need a publishable key. Consult your team’s secure secrets storage for keys and add them to environment files as needed.

Example snippet (adjust to your project’s needs):

```ts
export const environment = {
  production: false,
  stripePublishableKey: 'pk_test_xxx',
  // tmdbApiKey: '...',
};
```

## Scripts
- `npm start`: run dev server
- `npm run build`: production build
- `npm run watch`: watch-mode build (development configuration)
- `npm test`: run unit tests

## Key Packages
- @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router: core Angular framework libraries (v20.3.x)
- rxjs: reactive programming utilities used throughout Angular apps
- zone.js: Angular change detection support library
- tslib: TypeScript helpers used by Angular builds
- bootstrap: CSS framework for UI styling
- chart.js: charting library (used in dashboard/reports, if applicable)
- crypto-js: cryptographic utilities (e.g., hashing/encoding client-side data)
- @stripe/stripe-js and ngx-stripe: Stripe payment integration libraries

## Dev Tooling
- @angular/cli, @angular/build, @angular/compiler-cli: Angular build tooling
- typescript: TypeScript compiler (5.9.x)
- jasmine, karma and related launchers/reporters: unit testing stack
- @types/crypto-js: Type definitions for `crypto-js`

## Troubleshooting
- If `ng` is not recognized, ensure Angular CLI is installed globally and your shell PATH includes npm’s global bin.
- If styles don’t load, confirm `bootstrap` is referenced in `angular.json` or imported in global styles.
- For API-related errors, verify environment keys and network access.

## Helpful Links
- Angular CLI docs: https://angular.dev/tools/cli
- Angular docs: https://angular.dev/
- RxJS docs: https://rxjs.dev/
- Stripe docs: https://stripe.com/docs/js
- Chart.js docs: https://www.chartjs.org/docs/

## Demo:
- Link: https://movies-store-y9dg.vercel.app/MainHome

### AngFilms — Project Structure Overview

A high-level map of folders and important files to help you navigate the codebase.

## Root
- `angular.json`: Angular workspace/build configuration (assets, styles, budgets, build targets).
- `package.json` / `package-lock.json`: Dependencies and npm scripts.
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.spec.json`: TypeScript configs for app and tests.
- `README.md`: General Angular CLI usage.
- `README-SETUP.md`: Setup, install, build, and required packages.
- `README-STRUCTURE.md`: This document.
- `public/`: Static assets copied as-is to the build output.

## public/
- `favicon.ico`, images, and backgrounds used by the app.

## src/
- `index.html`: App host page; Angular mounts the root application here.
- `main.ts`: Bootstraps the Angular application.
- `styles.css`: Global styles for the project.
- `app/`: Main application source.

## src/app/
- `app.ts`: Root application component (standalone).
- `app.html` / `app.css`: Template and styles for the root app component.
- `app.routes.ts`: Application routes; defines navigation to pages and features.
- `app.config.ts`: Providers and application-wide configuration.
- `app.spec.ts`: Root component tests (if used).

### src/app/components/
Feature and UI components organized by domain. Notable groups:

- `main-home/`: Landing area and home features
  - `home/`, `hero-slider/`, `hero-card/`, `movie-card/`, `aside/`, `about/`
  - Each folder contains `*.ts` (component logic), `*.html` (template), and `*.css` (styles).

- `moviedetails/`: Movie detail page features
  - `castlist/`, `reviews/`, `videoplayer/`

- `favourite-movies/`: Favorites listing and `favourite-movie-card/` component.

- `purchased-movies/`: Purchased listing and `purchased-movie-card/` component.

- `dashboard/`: Admin/metrics area
  - `dashboard-home/`, `dashboard-movies/`, `dashboard-reports/`, plus container `dashboard.*` files.

- `login/`: Authentication UI
  - `google-login/`, `facebook-login/`, and `login.*` files.

- `register/`: Registration page.

- `navbar/`, `footer/`, `not-found/`, `payment/`: Shared layout and pages.

Each component folder typically follows:
- `component.ts`: Standalone component with metadata, inputs/outputs, lifecycle.
- `component.html`: HTML template.
- `component.css`: Component-scoped styles.
- `*.spec.ts`: Unit tests when present.

### src/app/services/
Application services for data-fetching and business logic:
- `auth.service.ts`: Authentication, tokens, and user session logic.
- `movie.service.ts` / `movies-tmdb.ts`: Movie data and TMDB API integrations.
- `data-services.ts`: Generalized data access helpers.
- `favourite-services.ts`: Favorites CRUD and state handling.
- `purchased-services.ts`: Purchased movies CRUD and state.
- `shared-services.ts`: Cross-cutting utilities shared across features.

### src/app/guards/
Route guards controlling navigation:
- `auth-guard.ts`: Blocks routes requiring authentication.
- `dashboard-guard.ts`: Restricts dashboard access.
- `home-guard.ts`, `login-guard.ts`: Home/login specific flows.

### src/app/Interface/
Type interfaces for app models:
- `IUser.ts`, `IMovie.ts`, `IGenre.ts`, `IFavourite.ts`, `IPurchased.ts`.

### src/app/utilities/
- `Token.ts`: Token helpers (reading/writing/validation), used by auth flows.

### src/app/Database/
- `db.json`: Local mock data or reference dataset for development/testing.

### src/app/helper/
- `validitor/`: Validation helpers (naming implies validators; used by forms/components).

## Conventions
- Components are standalone and grouped by feature to keep templates, styles, and logic close together.
- Services encapsulate API calls and state transitions; components consume them via dependency injection.
- Guards centralize navigation rules based on authentication and roles.
- Interfaces define strong typing for movie, user, and other domain entities.

## Where to Start
1) Review `app.routes.ts` to understand navigation and feature boundaries.
2) Explore feature folders under `src/app/components/` to locate page-specific code.
3) Check services under `src/app/services/` for data sources and side effects.
4) Verify guards in `src/app/guards/` to understand route access rules.


