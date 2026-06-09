# @template/mobile

React Native mobile app built with Expo SDK 54, Expo Router, and NativeWind.

## Getting started

From the monorepo root:

```bash
npm run dev:mobile
```

Or directly:

```bash
cd apps/mobile
npx expo start --clear --tunnel
```

Scan the QR code in **Expo Go** (open the app first, then scan from inside it).

## Structure

```
app/
  (tabs)/         # Tab-based navigation
    _layout.tsx   # Tab bar configuration
    index.tsx     # Home tab
    explore.tsx   # Explore tab
  _layout.tsx     # Root layout — imports global.css, sets up navigation theme
  modal.tsx       # Modal screen example
components/       # Shared UI components
hooks/            # useColorScheme, useThemeColor
constants/        # Theme colours
assets/           # Icons, images, splash screen
```

## NativeWind

Styles are written as Tailwind classes via NativeWind v4. Configuration:

- `tailwind.config.js` — content paths + nativewind preset
- `global.css` — Tailwind directives, imported in `app/_layout.tsx`
- `metro.config.js` — wraps Expo default config with `withNativeWind`
- `babel.config.js` — sets `jsxImportSource: 'nativewind'`

## Resetting to blank

```bash
npm run reset-project
```

Moves the starter screens to `app-example/` and gives you a blank `app/` to start from.

## Adding screens

Create a file in `app/` — Expo Router picks it up automatically:

```
app/settings.tsx        →  /settings
app/(tabs)/profile.tsx  →  /profile (inside tab bar)
app/user/[id].tsx       →  /user/:id
```
