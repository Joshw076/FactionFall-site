# Privacy data audit — October 12, 2026

Scope: read-only review of C:/Users/jjwil/backend-auth source at commit 026fc2e9c9a48803da81efcef49d7ec513fcb99e and relevant CardFall client integrations. No production database, player records, credentials, provider dashboards, or production logs were accessed. Source behavior does not prove the deployed server runs this version or every feature is enabled.

| Category | Stored / processed data and purpose | Source |
| --- | --- | --- |
| Accounts | Email, username, avatar URL, password hash, verification/reset hashes and expiry, timestamps, token version; authenticate and manage accounts | src/models/User.js; src/controllers/authController.js; src/utils/generateTokens.js |
| Google sign-in | Email/name/picture persisted; verified Google payload and tokens processed; temporary sign-in sessions expire in five minutes or are consumed | src/controllers/authController.js |
| Email | Address and verification/reset messages sent through configured SMTP service | src/utils/sendEmail.js |
| Inventory/decks | Account IDs, card counts/qualities, shards, deck names/slots/instance IDs, favorites, usage/wins | src/models/PlayerInventory.js; src/models/Deck.js |
| Matchmaking/parties | Account/member IDs, codes, deck selection, host, mode/region/build, ping, timestamps, status and connection information | src/models/MatchTicket.js; src/models/Party.js; src/models/Match.js |
| Match integrity | Participant reports, winner, duration, card/resource events, event hashes, spawn observations, validation/rejection | src/services/peerResultService.js; src/services/economyEvidenceService.js; src/models/Match.js |
| Competition | Ratings including hidden MMR/uncertainty, result and rating transactions, seasons, standings, cosmetics, safety/status and visibility preferences | src/models/Competitive.js; src/models/User.js |
| Voluntary region | Country/region and change/eligibility timestamps; user selected, not GPS-derived | src/services/competitiveSocialService.js |
| Play Games | Own verified player ID/link time persisted; fresh code/token and Google friends IDs/names processed without backend persistence | src/services/playGamesService.js |
| Legacy friendships | Schema remains, actions return 410 directing players to Play Games; historical records can remain | src/models/Competitive.js; src/services/competitiveSocialService.js |
| Leaderboard snapshots | Owner, player IDs/points, filters and region; five-minute validity and MongoDB TTL deletion, which is asynchronous | src/models/Competitive.js; src/config/ranked.js; src/services/competitiveSocialService.js |
| Purchases | Raw purchase token processed with Google; SHA-256 token hash and entitlement persisted; obfuscated account ID sent for ownership check; revocation notification processed | src/controllers/fluxController.js; src/services/googlePlayFluxService.js; src/services/googlePlayRevocationService.js; src/services/fluxRules.js |
| Rewarded ads | Random client session ID; signed offer includes account/reward IDs and goes to LevelPlay; completion event ID and reward data persisted | src/controllers/fluxController.js; src/models/FluxReward.js; CardFall Assets/Scripts/Backend/FluxService.cs |
| Wallet | Authenticated wallet-link endpoint stores network/address/link time; NFT fields exist but do not establish active NFT features | src/routes/users.js; src/controllers/userController.js; src/models/User.js; src/models/PlayerInventory.js |
| Technical | IP rate limiting; non-production Morgan request logging and operational errors; provider logs unknown | src/index.js |
| Multiplayer providers | Unity anonymous authentication and Relay traffic; separate provider-held identities/data | CardFall Assets/Scripts/Networking/RelayConnector.cs |
| Hosting/storage | MongoDB database; website API setting points to Render; Wrangler config specifies Cloudflare assets. Actual deployments/locations not verified | src/config/db.js; src/config/databaseSecurity.js; website site.config.json and wrangler.jsonc |

## Retention and deletion findings

- Most persistent schemas have no TTL or age-based cleanup. Do not invent inactive-account, match-evidence, log, or backup retention periods.
- Token/link expiry controls validity; it does not establish physical erasure of database fields. MatchTicket expiresAt is an ordinary index, not a TTL index.
- eraseAccount deletes user, decks, inventory, Flux rewards (including ad event IDs), ratings/transactions/cosmetics/standings, affected ranked results, legacy friendships, owned leaderboard snapshots, and applicable tickets/parties; removes rows from other snapshots and updates party membership.
- Affected matches strip the deleted participant's ID/name/avatar/deck cards and clear connection info, join code and peer reports. Match IDs/timestamps, team/deck index, validation metadata and other participants can remain. Assess indirect identification before claiming anonymity. Confirm historical/malformed records are covered by the matching query.
- Combined erasedGameplayTotals stores only aggregate counters with no per-player row. This does not make every retained match anonymous.
- Backend has no separate tax/accounting ledger. Its purchase token hash is on User and is deleted with the account. Any legally retained financial exports need an independent inventory and a concrete retention rule.
- Provider erasure and backup/log expiry are not implemented by the active-database transaction itself. Verify live MongoDB transactions, concurrent match updates/callbacks, token invalidation, and provider erasure.
- Non-production request logging may expose URL parameters (verification email/token, OAuth callback code/state, rewarded-ad callback fields). Verify production environment and provider log redaction.
- Client consent=false and do_not_sell=true settings do not establish complete SDK data practices or child/consent compliance.

## Publication checks

Google Play expects a policy describing actual access, collection, use, sharing, retention and deletion, including SDK practices. Align Data safety and runtime disclosures with the shipped build rather than this backend inventory alone.

References reviewed: https://support.google.com/googleplay/android-developer/answer/10144311?hl=en and https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
