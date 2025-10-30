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


