# Privacy Policy

**Draft revised:** October 12, 2026
**Effective Date:** [Confirm publication effective date]
**Game:** [Game Name]
**Developer:** [Developer or Company Name]
**Contact Email:** [Privacy Contact Email]

## 1. About This Policy

This policy describes how Arbor Studios handles information in FactionFall to provide accounts, gameplay, multiplayer, competition, purchases, and optional rewarded ads. This draft reflects the current backend implementation. Features requiring provider configuration may not be enabled in every build.

**Before publication:** [Confirm the deployed server version, enabled features, release SDKs, and outstanding release checklist items.]

## 2. Accounts and Sign-In

We store your email address, player nickname, profile image URL if provided, internal account identifier, account creation and update times, and email verification status. Settings > Account lets you change your nickname once every 30 days. We store the last successful change time to enforce that limit. Initial assignment is separate from a nickname change. Nicknames can be visible to other players; avoid using your real name or contact details.

For email/password accounts, we process your password to authenticate you and store a password hash rather than the password itself. Email verification and password reset use stored token hashes and expiry times. Verification links are valid for 24 hours and password reset links for 30 minutes; expiry does not itself erase the stored fields. Our email delivery service receives your address and message contents.

Google sign-in requests email and profile access. We verify Google's response and use the verified email to create or find your account. New Google accounts receive a generated player nickname; we do not automatically use the Google profile name as their nickname. Existing account nicknames are preserved, and existing accounts' profile image URLs may be updated from Google. Google profile information, identifiers and authentication tokens are processed during verification. The backend does not have a persistent Google sign-in token field. Temporary sign-in sessions hold authentication state and completed game tokens; deletion verification can also temporarily hold a Google ID token. Sessions are consumed when retrieved or expire after five minutes.

When Apple sign-in is enabled, we request email access and verify Apple's identity token. We store your app/developer-scoped Apple user identifier and verified email, which may be an Apple private-relay address if you choose Hide My Email. New Apple accounts receive a generated nickname; we do not request your Apple profile name. Matching an email alone does not link Apple to an existing game account. Authentication codes and Apple tokens are processed to verify your sign-in. Normal sign-in does not persist Apple access or refresh tokens. Deletion verification temporarily retains a provider refresh token on the server with an account-bound authorization proof, expiring after five minutes, so we can revoke Apple authorization. Game sign-in tokens are returned once from a temporary session. Apple's privacy policy: https://www.apple.com/legal/privacy/

**Before publication:** [Confirm Apple Developer configuration, real sign-in and private-relay behavior, token revocation, and which released platforms enable Apple.]

We issue game access and refresh tokens and store an account token version to control session validity. Google's privacy policy: https://policies.google.com/privacy

## 3. Gameplay and Multiplayer Information

We store account-linked card inventory, card quantities and qualities, shards, saved deck names and contents, selected and favorite decks, deck usage and win statistics, Flux balances, purchase entitlements, and unlocked or equipped card frames.

Multiplayer records include player identifiers, names and profile image URLs, teams, selected decks and relevant deck contents, party membership, invitation and match codes, host assignment, connection information, game build version, matchmaking region, reported latency, match status, results, disconnects, and timestamps. These records support finding matches, connecting players, tracking progress, and awarding rewards.

To validate results and prevent invalid rewards, we store player-submitted results and bounded gameplay evidence: reported duration, card and resource events, sequence and timing, team, amounts, source identifiers, unit spawn identifiers and types, evidence hashes, and validation outcomes or rejection reasons. These reports are linked to participants. Gameplay analytics are not automatically anonymous.

Other participants receive information needed to join and play matches, including player profile and connection information. The client integrates Unity Authentication and Relay for multiplayer identity and traffic routing. Unity's processing is separate from our game account database.

**Before publication:** [Confirm the released multiplayer configuration, Unity data categories and privacy link, retention, and provider deletion procedures.]

## 4. Competition, Friends, and Region Preferences

We store ranked points, internal matchmaking ratings and uncertainty, season results and standings, wins, losses, draws, streaks, recent results, rating changes, titles and badges, and competition eligibility or restriction status. These records operate matchmaking, rankings, rewards, and integrity checks.

Public, friends, and regional rank visibility depend on account preferences and eligibility checks. Eligible players who enable sharing can have their player name, rank, points, and equipped competitive cosmetics shown in the relevant standings.

Country and optional region are choices you provide in competition settings. We store these preferences and change/eligibility times; they are not temporary location data. You can clear your selection or disable visibility. This feature does not require GPS or derive your selected country from your IP address. Matchmaking region is also processed to group matches. Network providers can separately process IP addresses.

If you connect Google Play Games, we store your verified app-scoped player identifier and link time until you disconnect or delete your account. When you request a friends comparison, we process a fresh authorization code, Google access token, friends' player identifiers and display names, and friends-sharing status to retrieve the list and compare eligible friends who share their ranks. The backend does not persist the Google friends list or those authorization tokens. Disconnecting Play Games also disables friends rank sharing.

Leaderboard pagination stores account-linked snapshots containing player identifiers and points and your country/region filters. Snapshots become unusable after five minutes and are scheduled for automatic database deletion; physical removal can occur later. Legacy in-game friendship records may remain from earlier versions, although current friendship actions direct players to Play Games.

## 5. Purchases and Optional Rewarded Ads

When Google Play purchases are enabled, we process your purchase token to verify the purchase with Google and acknowledge it. Google receives an obfuscated game-account identifier for ownership matching. We store your entitlement status and a hash of the purchase token to prevent duplicate linking and handle revocation. This hash remains account-linked personal information. The current backend does not persist the raw purchase token or a separate order/accounting ledger.

Arbor Studios' purchase integration does not request or store payment card numbers, card security codes, or bank account details. Google processes payments under its own policies.

When rewarded ads are enabled, Unity LevelPlay receives a generated ad session identifier and a signed reward offer containing game-account and reward identifiers. We process signed ad-completion callbacks and store the completion event identifier, whether the reward was doubled, reward amounts, and account/match links. This validates completion and prevents duplicate rewards.

The advertising SDK and enabled advertising partners may process additional device, network, and advertising information. The client sets consent to false and a do-not-sell setting before initializing LevelPlay; these settings alone do not establish that the SDK collects no personal information or that all required consent is satisfied.

**Before publication:** [Confirm enabled ads and purchases, actual LevelPlay partners and SDK data categories, provider privacy links, applicable consent and age controls, and provider retention/deletion.]

Payment/accounting records outside this backend, such as Google Play financial reports, may need retention for taxation or auditing. Deleting a game account does not delete Google's records or restore the deleted account.

**Before publication:** [Identify accounting records Arbor Studios actually retains outside the game database, their fields and legal basis, applicable jurisdiction, retention period, access restrictions, and removal of unnecessary account links. Do not describe an unimplemented separate ledger as an existing retention system.]

## 6. Optional Wallet Information

The backend supports submitting a wallet address and network and stores them with your account and link time if you use this feature. Wallet addresses can identify or link activity and are not assumed anonymous. The data model also supports card token identifiers and deck instance identifiers; their presence does not establish that blockchain or NFT features are active.

**Before publication:** [Confirm whether wallet linking or token-linked cards are accessible in the release; remove inactive-feature descriptions or explain actual blockchain sharing and public ledger implications.]

## 7. Technical Processing and Service Providers

Our backend uses MongoDB to store account and game records. The website currently points to a Render backend address and is configured for Cloudflare asset hosting. Hosting, network, database, and email providers process information needed to deliver their services, which can include IP addresses and request metadata. The backend uses IP-based rate limits to prevent abuse; this is separate from gameplay analytics.

The backend enables development request logging outside production and can log operational errors. Request URLs can contain personal information, including email verification parameters or ad callback data. Disabling development logging does not establish that hosting providers keep no logs.

**Before publication:** [Confirm active hosting/database providers, storage locations, SMTP provider, production logging and URL redaction, access controls, provider privacy links, and additional analytics or crash-reporting services in the shipped build.]

## 8. Storage, Security, and Retention

Account and gameplay records are stored in the backend database for the purposes described above. The code uses password hashing, authentication and ownership checks, signed tokens and provider callbacks, rate limits, and database TLS requirements in production. These measures reduce risk but do not guarantee security.

Most account, match, rating, deck, inventory, and reward records do not have automatic age-based deletion schedules in the current code. Authentication session and leaderboard snapshot expiry are described above. Queue ticket expiry controls matchmaking eligibility and does not by itself prove records are erased. Account deletion removes or updates the records described below.

**Before publication:** [Establish and disclose actual retention periods or criteria for active/inactive accounts, historical matches and evidence, expired queue records, support messages, diagnostics, backups, and legal/accounting records. Verify deployed HTTPS, database settings, storage locations, and backup access/expiry.]

## 9. Account and Data Deletion

Open Settings > Delete account in FactionFall, or use [Account Deletion URL] without installing the game. Verify ownership with your password or a fresh Google or Apple sign-in and type DELETE MY ACCOUNT. Apple-linked accounts require fresh Apple verification so that Apple authorization can be revoked as part of deletion. Deletion does not require a support email.

Once the backend confirms successful deletion, removal from the active game database is immediate and final, with no account recovery period. Signing up again creates a new account. This does not mean every provider-held copy, backup, or log is instantly erased.

The deletion implementation removes the user profile, email, nickname and last-change time, Apple user identifier, password hash, stored verification/reset token hashes, wallets, linked Play Games identifier, purchase-token hash and entitlement, balances, card frames, decks, inventory, Flux reward and ad-event records, ratings, rating transactions, competitive cosmetics and standings, affected ranked results, legacy friendships, and owned leaderboard snapshots. It removes your rows from other leaderboard snapshots and removes or updates matchmaking and party references.

Affected match records have your player identifier, name, profile image URL, and deck contents removed. Connection information, join codes, and peer evidence reports are cleared. Match metadata, team and deck index, timestamps, and other participants' records can remain. These records must not be described as fully anonymous without assessing indirect identification.

Separately, deletion adds gameplay totals to combined counters without player identifiers, deck contents, or individual player timestamps. Existing game access and refresh tokens stop working when the account record is removed. Deleting FactionFall does not delete your Google account or Play Games profile.

**Before publication:** [Verify deployed in-app/web flows, live database transactions, concurrent gameplay/callback behavior, indirect identification in retained matches, backups/logs, Unity and advertising-provider erasure, and accounting retention. State provider erasure and backup expiry times separately.]

## 10. Audience, Choices, and Contact

The intended audience includes children under 13 with parental consent. The current build does not yet implement verified parental consent, parent controls, or age screening. It must not be released for under-13 accounts until those protections and the related provider/SDK practices are implemented and verified.

**Before publication:** [Replace this draft status with the actual age screening, verified parental-consent method, parental choices/access/revocation/deletion process, and child-data retention rules after implementation. Competition eligibility flags and Google/Apple sign-in are not proof of parental consent.]

You can update your player profile, change sharing preferences, clear your chosen region, disconnect Play Games, or delete your account. For information questions or requests, contact [Privacy Contact Email]. We may need to verify ownership before acting on a request.

If you email us, we receive your email address and information you choose to provide. Do not send passwords or sign-in codes. Website hosting also processes requests to deliver these pages.

**Before publication:** [Confirm support-email retention, applicable privacy rights and request procedures, and website cookies or analytics actually enabled.]

## 11. Policy Changes

We will post updates here with an updated effective date when our practices change.

**Developer:** [Developer or Company Name]
**Email:** [Privacy Contact Email]
**Website:** [Developer Website]
