# Refrain — Android

Kotlin + Jetpack Compose app. Analogous to the iOS app in structure and behaviour.

## Project structure

```
android/
├── app/src/main/
│   ├── assets/                    ← quotes.json and lyrics.json (see below)
│   ├── res/font/                  ← IM Fell English TTF files (see below)
│   ├── java/com/nattygsmith/refrain/
│   │   ├── RefrainApplication.kt  ← initialises DataStore
│   │   ├── MainActivity.kt        ← entry point, deep link handling
│   │   ├── data/
│   │   │   ├── Models.kt          ← Quote, LyricsEntry
│   │   │   └── DataStore.kt       ← JSON loader and index
│   │   ├── clock/
│   │   │   ├── TimeAndSeason.kt   ← TimeOfDay, Season enums
│   │   │   └── QuoteClock.kt      ← ViewModel: pool, rotation, timer
│   │   ├── theme/
│   │   │   ├── Theme.kt           ← 16-theme table (matches iOS + web exactly)
│   │   │   └── Typography.kt      ← IM Fell English FontFamily
│   │   └── ui/
│   │       ├── MainScreen.kt      ← quote display
│   │       ├── LyricsSheet.kt     ← bottom sheet
│   │       ├── AboutScreen.kt     ← about / credits
│   │       └── widget/
│   │           ├── RefrainWidget.kt         ← Glance widget UI
│   │           └── RefrainWidgetReceiver.kt ← receiver + WorkManager refresh
```

---

## First-time setup

### 1. Font files

Download IM Fell English from Google Fonts:
https://fonts.google.com/specimen/IM+Fell+English

Copy the TTF files into `app/src/main/res/font/`:
- `im_fell_english_regular.ttf`
- `im_fell_english_italic.ttf`

Android resource filenames must be lowercase with underscores — rename if needed.

### 2. App icon

Place launcher icons in the standard `res/mipmap-*` directories, or use
Android Studio's Image Asset Studio (right-click `res` → New → Image Asset).
The 1024×1024 source icon used for the iOS App Store is a suitable source image.

### 3. Quote and lyrics JSON

See "Updating quote content" below.

---

## Updating quote content

⚠️  The Android app bundles `quotes.json` and `lyrics.json` in `assets/`.
Unlike the web app, content changes require a new Play Store build and release.

After updating the quote library and running the generate scripts:

```bash
# From the repo root
python3 scripts/generate_quotes.py       # writes src/quotes.js (web)
python3 scripts/generate_quotes_json.py  # writes quotes.json for iOS/Android

python3 scripts/generate_lyrics.py       # writes src/lyrics.js (web)
python3 scripts/generate_lyrics_json.py  # writes lyrics.json for iOS/Android

# Copy into Android assets
cp quotes.json android/app/src/main/assets/
cp lyrics.json android/app/src/main/assets/
```

Then build and submit a new Play Store release.

---

## Building

Open `android/` in Android Studio (File → Open). Gradle will sync automatically.

- **Debug build**: Run → Run 'app'
- **Release build**: Build → Generate Signed Bundle / APK
  - Choose "Android App Bundle" (.aab) for Play Store submission
  - You'll need a keystore — generate one in Android Studio if you don't have one yet

---

## Play Store

- Package ID: `com.nattygsmith.refrain`
- Support email: support@refrainapp.com
- Privacy policy: https://refrainapp.com/privacy
- Status: not yet listed (add Play Store badge to AboutScreen.kt once live)

---

## Widget

The home screen widget (Glance) shows the current quote on the themed background.
It updates every 15 minutes via WorkManager, aligned to clock boundaries (:00, :15,
:30, :45) — the same interval as the iOS widget and the main app's auto-refresh.

Note: Glance does not support custom fonts. The widget uses the system serif font
as a fallback. The main app uses IM Fell English throughout.

Widget taps open the main app. If the quote has lyrics available, a deep link
carries the lyricsKey/stanzaIndex/quoteId so the lyrics sheet opens immediately —
mirroring iOS widget behaviour.

---

## Theme consistency

All 16 time × season themes in `theme/Theme.kt` use identical hex values to
`constants.js` (web) and `Theme.swift` (iOS). If a colour is ever changed,
update all three files.
