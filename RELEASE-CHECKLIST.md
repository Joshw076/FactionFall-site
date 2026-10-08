# Confirm before publishing

The supplied policy is a draft. Resolve these points against the release build before marking it ready.

Confirmed by the developer: Google sign-in; the name is the reported captured sign-in data; built-in card analytics; no demographic or location analytics. The policy has been narrowed to those facts. The original supplied text is preserved in `privacy-policy.original-draft.md`. Actual authentication processing, storage, and analytics fields remain to be verified.

- [x] Set the supplied developer identity and contact details: Arbor Studios, Admin@factionfall.com, https://factionfall.com.
- [ ] Confirm the developer identity matches Google Play, the email receives requests, and any applicable business contact address.
- [ ] List actual sign-in services. Remove Google, Play Games, or Apple if not used; identify whether providers share email, profile name, or other data in addition to identifiers.
- [ ] Confirm each gameplay, friends, leaderboard, location/region, age, and diagnostic data category. Remove planned features; describe how any IP-derived region is obtained if used.
- [ ] Name actual backend, hosting, multiplayer, analytics, crash reporting, advertising, and purchase providers. Explain data shared with each and why; add relevant provider privacy links. Replace the promise to identify providers later.
- [ ] Confirm whether ads or purchases exist and whether the draft's no-targeted-advertising statements are accurate.
- [ ] Confirm intended ages in Play Console and actual age screening/parental consent/social safeguards. “We intend to” safeguards are not proof they exist. If children are included, review the applicable Families and children's privacy requirements against the implemented game.
- [ ] Describe retention periods or meaningful criteria, including inactive accounts, diagnostics, backups, and legal/security exceptions. Establish the actual deletion response workflow and expected completion timeframe, then publish those details.
- [ ] If accounts can be created, implement a discoverable in-app deletion request option and test the external email request path. Confirm deletion reaches each relevant service; uninstalling or disconnecting Google alone is not account deletion.
- [ ] Describe the website's own hosting/contact processing where applicable: Cloudflare processes web requests and email requests contain sender information. Do not confuse the site's lack of analytics scripts with the absence of all hosting logs.
- [ ] Align Play Console's Data safety answers with actual game/SDK behavior. A privacy policy does not replace that form.
- [ ] Set the effective date to the actual date this finalized policy takes effect.
- [ ] Test the public HTTPS pages on mobile without sign-in, including contacts and deletion instructions; link the policy inside the app.

References: [Google Play User Data](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en), [account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en), [Families requirements](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en).
