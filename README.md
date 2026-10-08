# FactionFall player information website

Static Cloudflare Pages site. No JavaScript, cookies, analytics, external fonts, or form backend is included. Email links open the player's email app; requests must be handled by the developer.

## Edit and build

1. Fill in `site.config.json` with your public developer identity, monitored contact email, HTTPS website, and business mailing address if applicable. Avoid publishing a home address unnecessarily; confirm what your actual operation requires.
2. Edit `privacy-policy.md` to describe the released game, including confirmed providers and retention practices. The original supplied draft is preserved here, with placeholders replaced during the build.
3. Complete `RELEASE-CHECKLIST.md`, then set `readyToPublish` to `true`.
4. Run from this folder:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\build.ps1 -ForPublication
```

This uses a process-only execution policy and generates `dist/` and `factionfall-pages.zip`. Without `-ForPublication`, the default configuration builds a clearly labeled draft with search indexing disabled. The publication flag refuses a draft configuration. Setting the flag to true is your confirmation of the policy's accuracy; the build cannot inspect the game.

## Publish with Cloudflare Pages

For a small site maintained by ZIP uploads:

1. Sign in to Cloudflare, open **Workers & Pages**, create an application, choose **Pages**, then **Use direct upload** (dashboard wording can vary).
2. Name the project, for example `factionfall-legal`, and upload the contents of `dist/` or `factionfall-pages.zip`.
3. Deploy and open the assigned `https://<project>.pages.dev` address.
4. Open the project's **Custom domains** section and add your domain or `legal.yourdomain.com`. Follow Cloudflare's DNS instructions and wait for HTTPS activation. Associate the domain in Pages before adding a CNAME manually. An apex domain requires a Cloudflare zone/nameservers; a subdomain can use an external DNS provider.
5. Check `/privacy`, `/support`, and `/delete-account` from a signed-out browser and phone. Do not put these pages behind Cloudflare Access or a login.
6. Put the final `/privacy` URL in Play Console and inside the game. If account creation is supported, supply `/delete-account` in Play Console and implement the in-app deletion path too.

Choose Git integration instead if you want automatic deployments: commit the generated static output in a deployment repository and point Pages at that directory. This repository uses a PowerShell build, so do not assume Cloudflare's Linux build environment will run it directly. Cloudflare does not let a Direct Upload project switch to Git integration later; choose the workflow before creating the project.

## Verify before release

Check every page loads over HTTPS, navigation works, the monitored email opens correctly, no placeholders or draft labels remain, and deletion requests can actually be completed. Hosting these pages alone does not implement account deletion or prove the game meets Google Play requirements.

Official references:

- [Cloudflare Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Google Play User Data](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- [Google Play account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
