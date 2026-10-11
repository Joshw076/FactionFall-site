# Account deletion setup

## Implemented locally

Game Settings now includes **Delete account**, opening `https://factionfall.com/delete-account` without sending account credentials in the URL. The website independently verifies password or fresh Google sign-in and requires `DELETE MY ACCOUNT`. Google explicitly allows this web-based in-app path: https://support.google.com/googleplay/android-developer/answer/13327111?hl=en

Website `apiBaseUrl` now matches the game's existing backend: `https://arbor-cardfall-backend.onrender.com`. The website remains a draft; this is not evidence the deployed backend or domain is ready.

## Settings needed from the owner

1. **Render/backend:** deploy the current `backend-auth` source. Set `WEBSITE_ORIGINS=https://factionfall.com,https://www.factionfall.com` (include the actual alternate hosting origin if used). Keep `NODE_ENV=production` to avoid the development request logger. Do not share secrets in chat.
2. **MongoDB:** use MongoDB Atlas or another replica set supporting transactions. Confirm the deployed `MONGODB_URI` points to that database. Deletion intentionally fails rather than performing partial deletion without transactions.
3. **Google OAuth:** configure the backend's `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and actual redirect URI used by its existing Google sign-in configuration. Register that exact callback in Google Cloud. Use the normal account sign-in OAuth client, not a Play Games application ID. Website Google deletion needs a fresh verified ID token for the same account.
4. **Cloudflare/site:** build with `npm run build` before deployment. Publish the generated `dist` files at the domain the game's deletion URL points to. Confirm HTTPS and `/delete-account` routing. The current release flag remains false until policy placeholders and retention decisions are resolved.
5. **Provider access:** identify the Unity project/environment, active LevelPlay app and mediation networks, and the actual purchase-service implementation. Configure server-side deletion access/procedures for provider data; credentials belong in secret storage. A Google purchase verification token alone does not implement deletion.
6. **Retention decisions:** supply actual backup/log expiry periods, payment-record fields and retention requirements. Determine where purchase tokens/order IDs are stored. We cannot promise complete immediate erasure across providers or backups based on the active-database deletion transaction.

## Before enabling the release declaration

- Use disposable accounts to test password and Google deletion from Android Settings and a signed-out browser.
- Wrong password, wrong Google account and missing confirmation must reject deletion without changing data.
- Successful deletion must remove profile, decks, inventory and ranked identifiers; cancel outstanding matchmaking and remove leaderboard entries. Check affected match records for indirect identity.
- Both old access and refresh tokens must fail after deletion. A deleted account must not regain old progress by registering again.
- Test replica-set transaction rollback and concurrent gameplay writes against a disposable production-equivalent database. Local mock tests do not verify these properties.
- Complete provider erasure and retention checks. Do not claim these have been implemented by this initial change.
- Update the privacy/deletion policy to describe verified behavior and justified retention exceptions; publish and verify the URLs on a phone before putting the deletion URL into Play Console.

No deployment, real-account deletion or Console submission was performed by this initial setup change.
