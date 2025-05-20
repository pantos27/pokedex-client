# Poke-Front

A React application for browsing and capturing Pokemon. Built with React, TypeScript, and Vite.

See server project [here](https://github.com/pantos27/pokedex-server)

## Features

- User registration and authentication
- Browse Pokemon with virtualized scrolling for performance
- Filter Pokemon by name and type
- Light and dark mode support
- Capture Pokemon and view your collection

## Technologies

- React 19
- TypeScript
- Vite
- TanStack Query for data fetching
- TanStack Table for table functionality
- TanStack Virtual for virtualized scrolling
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

## Testing

The project uses Vitest and React Testing Library for testing. Tests are located in the `src/__tests__` directory.

### Running Tests

To run all tests:

```bash
yarn test
```

To run tests in watch mode:

```bash
yarn test:watch
```

To run a specific test file:

```bash
yarn test src/__tests__/login.test.tsx
```

### Test Coverage

The tests cover the following key features:

- Login flow
- Virtualized scrolling
- Table filtering
- Light/dark mode transitions
- Pokemon capture

For more details about the testing infrastructure, see the [Testing README](src/__tests__/README.md).

## Building for Production

To build the application for production:

```bash
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Preview Production Build

To preview the production build locally:

```bash
yarn preview
```
