# BilQuiz — Play Store checklist

## Completed in the project

- A public privacy-policy route is available at `/privacy`.
- A privacy-policy link appears inside the app footer.
- The policy states that game progress and sound preference are stored locally only.
- The policy discloses the current Google Fonts and Google AdSense integrations, and the absence of accounts and analytics SDKs.

## Still required before upload

1. Deploy the latest GitHub `main` branch to a public HTTPS URL. Copy the final URL of `/privacy`; it is required in Play Console.
2. Create or complete a Google Play Console developer account, including identity and Android-device verification if requested.
3. Provide a public support email address. Replace the GitHub issue contact in `src/pages/privacy.tsx` with that address before production if you have one.
4. Decide the permanent Android package name, for example `com.bilalelhamri.bilquiz`. It cannot be reused after it is registered.
5. Build an Android App Bundle (`.aab`) with target SDK/API 36 and upload it through Play App Signing.
6. Prepare store assets: a 512×512 app icon, 1024×500 feature graphic, and at least two real in-app phone screenshots.
7. Create the store listing: app name, Arabic short/long descriptions, category `Game > Trivia`, support email, and the `/privacy` URL.
8. In **App content**, accurately complete Data safety, ads declaration (no ads), content rating, target audience, app access (no login), and privacy policy.
9. If the personal developer account was created after 13 November 2023, run a closed test with at least 12 testers opted in for 14 consecutive days, then apply for production access.

## Data Safety guidance for the current code

The game itself stores progress and sound preference locally and has no accounts, analytics SDK, or server-side data storage. Google AdSense is integrated for advertising. Re-check this declaration whenever you add a library, advertisements, analytics, login, or online gameplay.
