# FactionFall Data safety audit

Reviewed 2026-10-10. Scope: current Unity project, local backend and website; intended release includes rewarded ads, purchases, ranked and Google Play Games. Purchase verification credentials remain pending. This is a source-based answer worksheet, not certification of the deployed build or a submitted declaration.

## Initial form answers

- Collects or shares user data: **Yes**.
- Account creation: email/password and Google OAuth are implemented. Select the corresponding password and OAuth methods supported in the release.
- All collected data encrypted in transit: **not yet verified**. Backend defaults to HTTPS and Relay uses DTLS; direct multiplayer transport and all enabled ad adapters still need release-build verification.
- Account deletion: backend implementation exists, but accessible in-app and working public web deletion paths have not been verified. Do not claim the complete release flow is ready.

## Category worksheet

| Google category | Current evidence | Proposed treatment and remaining checks |
|---|---|---|
| Personal information: name | Username and Google profile name stored in backend | Collected; account management and app functionality. Optional Google profile fields differ from required registration fields. Public leaderboard disclosure needs the user-initiated sharing analysis. |
| Personal information: email | Registration and Google OAuth store email | Collected, retained, account management and app functionality. IAP also documents email processing. |
| Personal information: user IDs | Backend account ID, Unity anonymous authentication ID, linked Play Games ID; ad account identifier | Collected, retained. Account management/app functionality; SDK-specific analytics and advertising purposes where applicable. Check advertiser treatment of the supplied ID. |
| Personal information: other information | Password credentials and optional profile/region fields | Review applicable Google definitions before selecting. Password hashing does not make credential collection disappear. Wallet schema alone is not evidence of active wallet collection. |
| Location: approximate | LevelPlay and IAP vendor disclosures; optional regional leaderboard selection | Collected when these features operate. LevelPlay reports sharing; no precise GPS collection found. SDK-only ephemeral processing cannot override retained regional information or advertising data. |
| Financial information: purchase history | Unity IAP 5.4.4 and client purchase-token submission | Collected when purchasing operates; app functionality and IAP analytics. Actual verification endpoint, stored transaction fields and retention must be checked in the deployed purchase service. |
| Contacts | Play Games friends queried for matching opted-in ranked players | Include when enabled. Google includes social graph information in Contacts; phone address-book permission is not necessary. Friend responses are not persisted by the new backend integration; ephemeral handling requires checking all processors/logs. |
| App activity: app interactions / other actions | Deck usage, results/rank records, rewarded-ad interactions | Collected, retained; gameplay functionality/analytics. Advertising activity has SDK-documented sharing and advertising/security purposes. Match the specific events to Google's two activity labels. |
| App activity: other user-generated content | User-created deck names/configurations | Assess under this category using Google's definition; backend stores decks. No chat system found in this audit. |
| App info/performance: crash logs, diagnostics, other performance | IAP vendor disclosure includes these; LevelPlay includes diagnostics | Include applicable SDK categories. IAP reports collection; LevelPlay diagnostics are collected but not shared in its table. Disabled Unity Analytics settings do not disable independent SDK collection. |
| Device or other IDs | Advertising/device IDs in vendor SDK disclosures | Collected; LevelPlay reports sharing. App functionality, analytics, advertising and fraud prevention as applicable per SDK. |
| Photos | Google avatar URL stored | Resolve whether storing/processing the profile-image reference qualifies; no photo upload pipeline identified. Do not infer blanket access to users' photo libraries. |

Do not select payment card/bank details solely because Google Play handles checkout. Purchase history and tokens still require disclosure. No source evidence found for precise location, health, audio, SMS, calendar or browsing-history collection. Verify enabled mediation adapters before finalizing those exclusions.

## Sharing, optionality and ephemeral answers

Transfers to a processor acting solely on our behalf may fall under Google's service-provider sharing exception. Do not mark all backend/Unity/Google transfers as shared automatically. LevelPlay's advertising disclosure explicitly lists sharing for approximate location, ad activity and device IDs. Pseudonymous identifiers still count as data.

Rewarded ads are player-initiated, and consent is set false before initialization. This does not mean the SDK collects no data. Determine optional/required from whether players can use the released app without the feature; the vendor table describes requirements within its own service. Combine every source for each category: retained email/account IDs cannot be marked wholly ephemeral because IAP processes another copy ephemerally.

## Integrity and release gaps

1. Website `site.config.json` has an empty `apiBaseUrl` and `readyToPublish: false`; deletion JavaScript explicitly disables the flow without the API. Public privacy/deletion URLs could not be verified from this session.
2. No in-app account deletion action was found in the examined Unity scripts. Verify/add the entry point and test ownership checks, token invalidation and deletion against the deployed database. Cover Unity authentication/Relay and advertising/purchase records, with explicit justified retention exceptions.
3. Client calls `/api/flux/purchase` and `/api/flux/ad-offer`, but those routes were not found in the backend checkout examined. Locate the deployed implementation before claiming purchase verification, replay prevention, reward integrity or transaction retention is audited. Never embed Google service-account secrets in the game.
4. Verify authenticated direct multiplayer connections encrypt connection tokens. Relay's DTLS configuration alone does not establish that every multiplayer route is encrypted.
5. Record the enabled LevelPlay mediation networks and audit each adapter's disclosures. Installation and contextual consent settings are not sufficient evidence of runtime behavior.
6. The local privacy policy remains a draft with unresolved placeholders and does not fully describe the current release features. Reconcile it with this worksheet before publishing.
7. Exercise the Android release build against production-equivalent endpoints: sign-in, ads, purchase verification/retry, ranked/friends and deletion. This review did not perform those live tests or submit the Console form.

## Evidence

- Game: `C:/Users/jjwil/CardFall/Packages/manifest.json`; `ProjectSettings/UnityConnectSettings.asset`; `Assets/Scripts/Backend/FluxService.cs` (consent ~337, obfuscated purchase account ~457, purchase token ~545); `Assets/Scripts/Networking/RelayConnector.cs`; `Assets/Scripts/Networking/MatchConnectionApproval.cs`; `Assets/Scripts/Backend/BackendApiClient.cs`; `Assets/Scripts/Backend/PlayGamesFriendsClient.cs`.
- Backend: `C:/Users/jjwil/OneDrive/Desktop/backend-auth/src/controllers/authController.js`; models User/Deck/Match/PlayerInventory/Competitive; `src/services/accountDeletionService.js`; `src/services/playGamesService.js`.
- Website: `site.config.json`, `delete-account.js`, `privacy-policy.md`, `RELEASE-CHECKLIST.md`.
- [Google Data safety definitions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).
- [Unity IAP 5.4+ disclosure](https://docs.unity.com/en-us/iap/privacy-and-consent/google-play-data-safety).
- [LevelPlay disclosure](https://docs.unity.com/en-us/grow/is-ads/legal-resources/google-data-safety-questionnaire).
- [Unity Relay privacy](https://docs.unity.com/en-us/mps-sdk/privacy/privacy-overview-relay).
