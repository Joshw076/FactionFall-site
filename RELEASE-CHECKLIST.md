# Confirm before publishing

The policy remains a draft. The October 12, 2026 source review is recorded in PRIVACY-DATA-AUDIT.md. It replaces the earlier name-only sign-in assumption: the backend stores email, profile name/image, and substantial account-linked gameplay and competition information. Source inspection does not confirm deployment or provider settings.

- [x] Inventory backend account, gameplay, competitive, social, purchase, ad, wallet, and technical processing from source.
- [x] Update policy and deletion-page disclosures to distinguish persistent data, temporary processing, expiry, and actual deletion.
- [x] Preserve original supplied policy in privacy-policy.original-draft.md.
- [ ] Confirm deployed backend commit and enabled features, especially Google Play Games, purchases, LevelPlay ads, wallet linking, and multiplayer modes. Remove inactive feature descriptions from the final release policy.
- [ ] Confirm Arbor Studios identity matches the store listing, Admin@factionfall.com receives requests, and any applicable business contact address.
- [ ] Inventory the shipped client SDKs and provider-held data: Google, Unity Authentication/Relay, LevelPlay and every enabled ad partner, database host, Render, Cloudflare, SMTP, analytics/crash services. Add verified provider privacy links and storage locations.
- [ ] Intended audience now includes children under 13 with parental consent. Implement and verify age screening, genuine verified parental consent, parent controls and revocation, server gates, child-data retention and SDK/ad-partner configuration before releasing to that audience. Eligibility flags and social-provider sign-in alone are insufficient evidence. See backend Docs/ChildSafetyReview.md.
- [ ] Enable and test Apple Developer Services ID/key/HTTPS return URL, Hide My Email and deletion/revocation. See backend Docs/AppleSignIn.md. Code presence does not establish live Apple support.
- [ ] Configure and review Facebook/Discord apps and their allowed ages/scopes, OAuth redirect URLs and provider revocation. Do not offer them as an under-13 login/parental-consent path. See backend Docs/EmailFirstSocialLogin.md.
- [ ] Deploy backend and email-first client together. Verify live email membership lookup/rate limits, SMTP delivery, registration verification and one-time password reset/session revocation. Review the membership-discovery privacy tradeoff; distributed enumeration remains possible.
- [ ] Verify nickname Settings UI and server cooldown on-device and against the live database, including concurrent changes, legacy accounts, boundary timing and deletion.
- [ ] Establish retention periods or meaningful criteria for accounts, match/economy evidence, ratings, expired queue tickets, support messages, diagnostics and backups. Most current persistent models have no automatic age-based deletion.
- [ ] Verify production request logging/redaction, including provider logs. Verification/OAuth/ad callback URLs can contain sensitive parameters.
- [ ] Verify HTTPS, database TLS, storage/access controls and backup lifecycle on deployed infrastructure.
- [ ] Inventory financial exports and any external accounting records actually retained. Confirm legal basis/jurisdiction/duration, necessary fields, access restrictions, and account unlinking. Backend purchase hash is deleted with User; there is no separate accounting ledger in reviewed source.
- [ ] Test web and in-app deletion against live replica-set transactions, rollback, concurrent gameplay/reward callbacks, token invalidation, and historical match records. Assess retained match metadata for indirect identification.
- [ ] Implement/verify associated Unity and ad-provider erasure procedures and disclose completion times and backup expiry separately from active database deletion.
- [ ] Confirm privacy-rights request handling, support retention, and website cookies/analytics.
- [ ] Align Google Play Data safety and runtime disclosures with actual release game/SDK behavior.
- [ ] Set effective date only when the finalized policy takes effect; resolve every publication placeholder before readyToPublish=true.
- [ ] Verify public HTTPS privacy/support/deletion pages on mobile signed out and policy/deletion links inside the release app.

References: https://support.google.com/googleplay/android-developer/answer/10144311?hl=en and https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
