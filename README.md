# my-expo-app

A mobile app built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/).

## Overview

This project is a mobile app featuring components such as login, registration, media upload, media list, and user profile.

## Requirements
- Node.js
- npm or yarn
- Expo CLI (install globally: `npm install -g expo-cli`)

## Installation

```bash
npm install


## Running the App

```bash
npx expo start
```

Expo Dev Tools will open in your browser. You can run the app on an emulator or your phone using the Expo Go app.

## Project Structure

- `src/components/` — UI components (e.g., LoginForm, RegisterForm, MediaList)
- `src/views/` — Main app screens (Home, Login, Profile, Upload, ...)
- `src/contexts/` — State management and contexts (UserContext, UpdateContext)
- `src/hooks/` — Custom hooks for data and context
- `src/lib/` — Helper functions
- `src/utils/` — Utilities for data fetching
- `assets/` — Images and static files

## Testing

```bash
npm test
```

## Additional Info
- You can edit Expo settings in `app.json`.
- Typescript settings are in `tsconfig.json`.
