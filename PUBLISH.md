# Publishing to Google Play Store

This guide covers everything from setting up EAS Build to promoting a release to production on the Google Play Store. It assumes you have already built and tested your app locally with Expo Go or a simulator.

## Prerequisites

- [Expo account](https://expo.dev/signup) — free
- [EAS CLI](https://docs.expo.dev/build/setup/) installed: `npm install -g eas-cli`
- [Google Play Console account](https://play.google.com/console/) — one-time $25 registration fee
- Your app's `package` name decided (e.g. `com.yourcompany.yourapp`) — **this cannot be changed after you publish**

---

## Step 1 — Configure your app identity

Update `apps/mobile/app.json` with your real values:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.yourapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

Rules:
- `version` is the human-readable version shown in the store (e.g. `1.0.0`)
- `versionCode` is an integer that must increment with every upload to the Play Store — start at `1`
- `package` must be unique across all apps on Google Play and must follow reverse-domain notation

---

## Step 2 — Set up EAS Build

From the `apps/mobile/` directory:

```bash
cd apps/mobile
eas login          # log in to your Expo account
eas build:configure
```

This creates an `eas.json` file. A minimal production-ready `eas.json`:

```json
{
  "cli": {
    "version": ">= 13.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## Step 3 — Create a Google Play Console app

1. Go to [Google Play Console](https://play.google.com/console/) and sign in
2. Click **Create app**
3. Fill in the app name, default language, and whether it is a game or app
4. Accept the declarations and click **Create app**

Keep the browser tab open — you will need the app's package name and track names in later steps.

---

## Step 4 — Create a Google service account for automated uploads

EAS Submit needs API access to upload builds on your behalf.

1. In Google Play Console, go to **Setup → API access**
2. Click **Link to a Google Cloud project** (create one if prompted)
3. In Google Cloud Console, go to **IAM & Admin → Service Accounts**
4. Click **Create service account**, give it a name (e.g. `eas-submit`)
5. Grant the role **Service Account User**, then click **Done**
6. Click the new service account → **Keys** → **Add key → Create new key → JSON** → **Create**
7. Save the downloaded JSON file as `apps/mobile/google-service-account.json`
8. Back in Google Play Console, click **Grant access** next to the new service account
9. Set permissions: **Release manager** (or at minimum: **Releases → Manage production releases**)
10. Click **Apply** and **Save changes**

Add `google-service-account.json` to `.gitignore` — it is a secret:

```
apps/mobile/google-service-account.json
```

---

## Step 5 — Build a production AAB

An Android App Bundle (`.aab`) is required for Play Store submission. EAS Cloud builds it for you:

```bash
cd apps/mobile
eas build --platform android --profile production
```

EAS will:
1. Upload your source to Expo's build servers
2. Generate a signing keystore on first run (save the credentials — you need the same key for every future update)
3. Return a download link when the build finishes (~10–15 minutes)

To manage your own keystore instead of letting EAS generate one:

```bash
eas credentials --platform android
```

---

## Step 6 — Upload your first build manually (required once)

Google Play requires you to upload the **first** release through the web UI before automated uploads will work.

1. In Play Console, go to **Testing → Internal testing → Create new release**
2. Click **Upload** and select the `.aab` file you downloaded from EAS
3. Add release notes, click **Save**, then **Review release**, then **Start rollout to Internal testing**

After this first manual upload, all future releases can be automated with `eas submit`.

---

## Step 7 — Submit future builds with EAS

Once the first manual upload is done, subsequent uploads are one command:

```bash
cd apps/mobile
eas submit --platform android --profile production
```

EAS will use the `google-service-account.json` and the `track` you set in `eas.json` (`internal` by default) to upload and create a new release draft.

---

## Step 8 — Promote through tracks

Google Play has four tracks. Work through them in order:

| Track | Audience | Purpose |
|---|---|---|
| **Internal testing** | Up to 100 testers | Fast distribution, no review, instant availability |
| **Closed testing (Alpha)** | Invite-only testers | Broader group, still no public access |
| **Open testing (Beta)** | Anyone who opts in | Pre-release feedback |
| **Production** | All users | Full rollout |

To promote a release from Internal to Production in Play Console:
1. Go to the track (e.g. **Internal testing**)
2. Find the release and click **Promote release → Production**
3. Set a rollout percentage (start with 10–20% for major releases)
4. Click **Start rollout to Production**

Or via Google Play Developer API with `eas submit --track production`.

---

## Step 9 — Increment the version for every update

Before each new build, bump both values in `app.json`:

```json
"version": "1.0.1",
"versionCode": 2
```

`versionCode` must be strictly higher than the last uploaded build — Google Play will reject duplicates.

---

## App Store Checklist

Before submitting to Production, make sure you have:

- [ ] App icon (1024×1024 px, PNG, no alpha)
- [ ] Feature graphic (1024×500 px)
- [ ] At least 2 screenshots per device type (phone required, tablet optional)
- [ ] Short description (80 characters max)
- [ ] Full description (4000 characters max)
- [ ] Privacy policy URL (required for apps that collect any data)
- [ ] Content rating questionnaire completed (in Play Console → **Policy → App content**)
- [ ] Target audience and content settings filled in
- [ ] `versionCode` incremented from the last submission

---

## Expo Updates (optional — OTA patches without a store release)

For JS-only changes (no native code changes), you can push updates directly to users without going through the Play Store review cycle:

```bash
cd apps/mobile
eas update --branch production --message "Fix typo on home screen"
```

Users get the update the next time they open the app. This only works for changes within the JS bundle — any change to native modules, permissions, or `app.json` fields still requires a full store release.

See the [Expo Updates docs](https://docs.expo.dev/eas-update/introduction/) for branch strategy and rollback.
