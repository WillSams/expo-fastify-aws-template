# @template/mobile

React Native mobile app built with Expo SDK 56, Expo Router, and NativeWind.

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

## Testing

Jest + `@testing-library/react-native`, with tests in `specs/*.spec.ts(x)`:

```bash
npm run test:mobile            # from the monorepo root
# or, from apps/mobile:
npm test
npm run test:coverage
```

`jest.setup.js` sets the React 19 `IS_REACT_ACT_ENVIRONMENT` flag (required for
`render`/`renderHook`). Note that in `@testing-library/react-native` v14 **both
`render` and `renderHook` are async** — `await` them, or `screen.getBy*` will
throw and `result.current` will be `undefined`.

## Debugging

### Reading a native crash (standalone builds)

Expo Go surfaces JS errors directly, but a standalone `eas build` that crashes on
launch dies silently. Pull the stack trace with `adb logcat`:

```bash
adb logcat -c
adb shell monkey -p <your.android.package> -c android.intent.category.LAUNCHER 1
adb logcat -d | grep -iE "FATAL EXCEPTION|ReactNativeJS|JavascriptException"
```

Two connection gotchas:

- **Old `adb` can't see modern phones.** The Ubuntu apt `adb` (1.0.39) often fails
  to enumerate Android 10+ devices and lacks `adb pair`. Use Google's current
  [platform-tools](https://developer.android.com/tools/releases/platform-tools).
- **Charge-only USB cables** won't expose the device (`lsusb` shows nothing). Use a
  data cable, or skip USB with wireless debugging (`adb pair <ip:port> <code>`
  then `adb connect <ip:port>`).

### App crashes on launch with "Incompatible React versions"

`react` and `react-dom` must be the **exact** version Expo expects (matching the
`react-native-renderer` in `react-native`). A web build hides a mismatch; native
crashes on launch. Keep `react-test-renderer` pinned to the **exact** same version
too — a `^` caret can pull a patch whose peer dependency conflicts on a fresh
install. Check with:

```bash
npx expo install react react-dom --check
npx expo install --check        # confirm everything matches the SDK
```

### Web bundling fails to resolve a module

`react-native-web` must be installed for the web render path. If you see
`Unable to resolve module react-native-web/...`, run `npx expo install react-native-web`.
