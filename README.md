# Mermaid Resort Mobile App

React Native mobile application built with Expo for the Mermaid Resort booking system.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the Expo server**
   ```bash
   npm start
   ```

## Build APK

Use Java 17 for Gradle builds.

1. **Generate the ignored Android project**
   ```bash
   npx expo prebuild --platform android --no-install
   ```

   Run this again whenever native settings, permissions, icons, or splash configuration change.

2. **Build the smaller release APK**
   ```bash
   cd android
   JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew assembleRelease
   ```

   Output:
   ```bash
   android/app/build/outputs/apk/release/app-release.apk
   ```

3. **Build a debug APK for testing**
   ```bash
   cd android
   JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew assembleDebug
   ```

   Output:
   ```bash
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

Debug APKs are much larger because they keep debug-friendly native libraries and less optimization. Use `assembleRelease` when you want the smaller APK to share or install normally.

## Project Structure

```
Resort-app/
├── src/
│   ├── navigation/     # React Navigation stacks and tabs
│   ├── screens/        # Screen components (Home, Details, Booking, Admin)
│   │   ├── HomeScreen.js
│   │   ├── RoomDetailsScreen.js
│   │   ├── BookingFormScreen.js
│   │   └── AdminDashboardScreen.js
│   ├── theme/          # Shared colors and navigation theme
│   ├── data/           # Local static datasets (rooms.js)
│   └── api.js          # API service caller
├── assets/             # Images, logos, icons, and photos
├── App.js              # Entrypoint and loading wrapper
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## API Config

The app fetches database queries and registers bookings at:
`https://mermaid.trionine.xyz`

- **Booked Dates**: `GET /api/booked-dates?room=...`
- **Booking Submission**: `POST /api/bookings`
- **Admin Bookings List**: `GET /api/admin/bookings`
- **Booking Deletion**: `DELETE /api/admin/bookings/:id`

## Features

- **Redirection to bKash**: Successful booking submissions automatically trigger external browser redirection to initialize bKash checkout (`/api/bkash/initiate?bookingId=...`).
- **NID & Selfie Uploads**: Support for double document upload (ID card PDF/Image and Selfie image).
- **Secure Admin Dashboard**: 
  - Accessible by tapping the "Mermaid Resort" header title 5 times rapidly.
  - Requires credentials verified by backend server auth.
  - View bookings stats, guest records, and uploaded ID/Selfie documents.
  - Delete or cancel reservations directly.
