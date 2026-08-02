# Mermaid Resort App Roadmap

This roadmap keeps the current React Native app as the production reference while preparing a safe Android/Kotlin migration. Content updates and low-connectivity reliability come before the rewrite.

## 1. Stabilize the Current Release

- [ ] Distinguish “no booked dates” from an availability API/network failure.
- [ ] Prevent booking submission until live availability has been confirmed.
- [ ] Fix the post-bKash navigation target and add a clear payment-status screen.
- [ ] Add request timeouts and user-friendly retry states for every API call.
- [ ] Add server-side idempotency keys so retries cannot create duplicate bookings.
- [ ] Test availability, booking, bKash, NID/selfie upload, admin login, listing and deletion end to end.
- [ ] Configure a private production signing key; never publish a release signed with the debug key.
- [ ] Build an optimized arm64 APK and Android App Bundle with R8/resource shrinking enabled.
- [ ] Record actual APK, AAB and estimated Play download sizes before deciding whether size alone justifies migration.

## 2. Dynamic Rooms and Restaurant Content

- [ ] Move room data out of `src/data/rooms.js` into the backend database.
- [ ] Move restaurant categories/items out of `RestaurantScreen.js` into the backend database.
- [ ] Give every room, category and menu item a permanent stable ID.
- [ ] Store `active`, `sortOrder`, `updatedAt` and content-version fields.
- [ ] Archive records with `active: false` instead of deleting anything referenced by bookings.
- [ ] Store room name and price snapshots on each booking so later edits do not rewrite booking history.
- [ ] Add public read-only rooms, menu and content-version API endpoints.
- [ ] Add authenticated admin create, edit, reorder, publish and archive endpoints.
- [ ] Add admin UI for rooms, photos, prices, features, menu categories and item availability.
- [ ] Add API schema validation, authorization and an audit log for administrative changes.
- [ ] Keep API changes backward-compatible with the currently released app.

## 3. Low-Data and Offline-First UX

- [ ] Cache the room catalog, menu, prices and last-known availability locally.
- [ ] Show cached content immediately, then refresh it in the background.
- [ ] Add ETag/content-version checks and download only changed records.
- [ ] Serve responsive WebP thumbnails and cache images on disk.
- [ ] Provide a bundled first-launch fallback when the device starts offline.
- [ ] Autosave incomplete booking drafts locally.
- [ ] Label offline drafts as “Saved offline,” never as confirmed bookings.
- [ ] Revalidate price and availability online immediately before submission.
- [ ] Compress NID/selfie images while keeping documents readable.
- [ ] Replace Base64 JSON attachments with streaming multipart uploads.
- [ ] Show upload size, progress, failure reason and retry controls.
- [ ] Queue safe network work with connectivity constraints and exponential backoff.
- [ ] Delete sensitive temporary attachment files after confirmed upload.

## 4. UX Redesign

- [ ] Replace the long booking form with steps: dates, guest details, documents, review and payment.
- [ ] Preserve form state when navigating backward, backgrounding or restarting the app.
- [ ] Add clear loading, empty, offline, stale-data and error states to every screen.
- [ ] Show a final price breakdown before submission.
- [ ] Add booking states: Draft, Waiting for connection, Uploading, Awaiting payment, Confirmed and Failed.
- [ ] Add a payment return/status flow instead of assuming that opening bKash means payment succeeded.
- [ ] Add accessible touch targets, labels, contrast and text scaling.
- [ ] Consider an English/Bangla language switch after the core flow is stable.

## 5. Admin Access and Security

- [ ] Remove the visible Admin tab from the customer navigation.
- [ ] Register the admin portal as a hidden root-stack screen for the temporary in-app staff flow.
- [ ] Keep the five-tap logo gesture only as a temporary staff entry; do not treat obscurity as authentication.
- [ ] Require valid backend authorization on every `/api/admin/*` endpoint regardless of how the screen is opened.
- [ ] Add login rate limiting, generic failure messages and short-lived staff sessions.
- [ ] Remove bearer tokens from attachment query strings and URLs so they cannot leak through logs or history.
- [ ] Serve private attachments through authorization headers or short-lived, single-object signed URLs.
- [ ] Replace permanent booking deletion with cancelled/archived states and preserve an audit trail.
- [ ] Build a separate web admin dashboard protected by Cloudflare Access and backend authentication.
- [ ] Remove admin screens and sensitive administrative code from the customer APK after the web dashboard reaches parity.

## 6. Kotlin and Jetpack Compose Migration

- [ ] Keep the React Native version working as the behavioral reference.
- [ ] Create the Kotlin app on a separate branch; do not replace `main` during development.
- [ ] Document every API endpoint, request, response and error contract before rebuilding screens.
- [ ] Use Compose, Navigation Compose, ViewModel, coroutines and repository-based data access.
- [ ] Use Room as the local source of truth and WorkManager for persistent synchronization.
- [ ] Use Retrofit/OkHttp multipart uploads with progress and retry support.
- [ ] Store tokens and sensitive local metadata using Android Keystore-backed protection.
- [ ] Rebuild one flow at a time: catalog, details, booking, uploads, payment and admin.
- [ ] Run parity tests against the same production-compatible backend.
- [ ] Compare startup time, memory, APK/download size and weak-network behavior with React Native.
- [ ] Switch production only after every critical flow passes and rollback remains possible.

## Release Gate

- [ ] No confirmed booking can be lost or duplicated during network interruption.
- [ ] Existing bookings remain correct after room/menu edits or archival.
- [ ] Users can browse cached resort content without connectivity.
- [ ] Sensitive documents are protected locally and removed when no longer needed.
- [ ] The production build is signed correctly, optimized and tested on a real low-bandwidth device.
