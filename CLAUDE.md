# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AppCounters: a React Native 0.86 (TypeScript, React 19) app for creating and resetting named counters. Targets Android/iOS phones and also smartwatches (Wear OS-style small screens). Node >= 22.11 required.

## Commands

- `npm start` — Metro bundler
- `npm run android` / `npm run ios` — build and run on a device/emulator (needs Metro running)
- `npm run lint` — ESLint (`@react-native/eslint-config`)
- `npx tsc` — type-check (no npm script for it)
- `npm test` — Jest (preset `@react-native/jest-preset`); single test: `npx jest __tests__/App.test.tsx -t "renders correctly"`
- Release APK: `cd android && ./gradlew assembleRelease`
- Android SDK env vars are in `android-env-vars.txt` (`ANDROID_HOME=$HOME/Android/Sdk`); source/export them before building from a shell.

## Architecture

- `index.js` registers `App` (root `App.tsx`); there is no router config beyond a native-stack navigator with two routes, `Home` and `Settings` (`RootStackParamList` is exported from `App.tsx` and imported by screens for typed props).
- **Watch vs phone UI**: `src/hooks/useIsWatch.ts` treats any window narrower than 300dp as a watch. `App.tsx` uses it to swap each route's component (`HomeScreen`/`SettingsScreen` vs `WatchHomeScreen`/`WatchSettingsScreen`), hide the status bar, and hide headers. Any feature change to counters UI usually must be made in both the phone and watch screen variants.
- **State**: `src/context/CountersContext.tsx` is the single source of truth (`useCounters()` hook). It loads counters from AsyncStorage (key `@app_counters/counters`) on mount and writes back on every change once loaded. Counter values are clamped at 0 on decrement; ids are `Date.now()` strings. `Counter` type is in `src/types/Counter.ts`.
- UI strings are in English (a prior commit migrated from another language); screens use `StyleSheet` inline in each file.
