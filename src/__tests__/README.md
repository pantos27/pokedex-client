# Testing Infrastructure

This directory contains the test files for the Poke-Front application. The tests are written using Vitest and React Testing Library.

## Test Structure

The tests are organized by feature:

- `login.test.tsx`: Tests for the login flow
- `virtualized-scrolling.test.tsx`: Tests for the virtualized scrolling functionality
- `theme-toggle.test.tsx`: Tests for the light/dark mode transitions
- `pokemon-capture.test.tsx`: Tests for the Pokemon capture functionality

## Setup

The testing infrastructure is set up in the following files:

- `setup.ts`: Global setup for all tests, including mocks for browser APIs
- `test-utils.tsx`: Utility functions and components for testing, including a custom render function that wraps components with all necessary providers

## Running Tests

To run all tests:

```bash
yarn test
```

To run tests in watch mode (useful during development):

```bash
yarn test:watch
```

To run a specific test file:

```bash
yarn test src/__tests__/login.test.tsx
```

## Writing New Tests

When writing new tests:

1. Import the necessary utilities from `test-utils.tsx` instead of directly from `@testing-library/react`
2. Use the custom `render` function to ensure components are wrapped with all necessary providers
3. Use the mockUser data from `test-utils.tsx` when testing user-related functionality
4. Follow the existing test patterns for consistency

## Mocking

The tests use Vitest's mocking capabilities to mock:

- API calls
- Context providers
- Browser APIs (matchMedia, IntersectionObserver, ResizeObserver)

See the existing test files for examples of how to mock different parts of the application.
