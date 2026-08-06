# Production Deployment Checklist

Follow this checklist precisely to ensure a flawless deployment of the LinkedIn Auto Poster to Vercel.

## 1. Local Verification
- [ ] Run `npm install` to ensure lockfile is synced.
- [ ] Run `npm run lint` and verify zero critical errors.
- [ ] Run `npm run typecheck` to verify TypeScript validity.
- [ ] Run `npm run build` to verify the Next.js production build succeeds locally.
- [ ] Push all code changes to your main branch on GitHub.

## 2. Vercel Configuration
- [ ] Import the GitHub repository into a new Vercel project.
- [ ] Go to **Settings > Environment Variables**.
- [ ] Add `CRON_SECRET` (Generate a secure random string).
- [ ] Add `MANUAL_RUN_SECRET` (Generate a different secure string).
- [ ] Add `OPENROUTER_API_KEY`.
- [ ] Add `TAVILY_API_KEY`.
- [ ] Add `PEXELS_API_KEY`.
- [ ] Add `LINKEDIN_CLIENT_ID`.
- [ ] Add `LINKEDIN_CLIENT_SECRET`.
- [ ] Add `LINKEDIN_REFRESH_TOKEN`.
- [ ] Add `LINKEDIN_ORGANIZATION_ID`.
- [ ] Ensure Vercel Framework Preset is set to "Next.js".
- [ ] Trigger the deployment.

## 3. GitHub Actions Configuration
- [ ] Copy the production URL of your Vercel app (e.g., `https://my-app.vercel.app/api/cron`).
- [ ] Go to your GitHub Repository **Settings > Secrets and variables > Actions**.
- [ ] Add Repository Secret: `CRON_URL` = (Your copied Vercel URL).
- [ ] Add Repository Secret: `CRON_SECRET` = (The exact same string you put in Vercel).

## 4. Final Live Test
- [ ] Visit your live Vercel frontend URL.
- [ ] Click the **Run Now** button.
- [ ] Enter the `MANUAL_RUN_SECRET` into the modal.
- [ ] Wait for the live logs to stream.
- [ ] Verify a new post appears on your LinkedIn organization page.
- [ ] Go to the **Actions** tab in GitHub and manually trigger the `.github/workflows/cron.yml` workflow.
- [ ] Verify the GitHub Action succeeds and a second post appears on LinkedIn (note: this will pull the next best article from the 30 evaluated).

## 5. Maintenance
- [ ] Set a calendar reminder 11 months from today to refresh the LinkedIn OAuth token.
