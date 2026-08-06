# LinkedIn Auto Poster

AI-driven autonomous startup news curation and publishing built with Next.js, OpenRouter, Tavily, and Pexels. Designed to exactly mirror automated n8n workflows in a robust, serverless environment.

## 🚀 How to Install

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in all required keys in `.env.local`.

## 💻 How to Run Locally

Start the development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## 🧪 How to Test Endpoints Locally

### 1. Manual Trigger (`/api/run`)
- Open the UI at `http://localhost:3000`.
- Click **Run Now**.
- Enter your `MANUAL_RUN_SECRET` (configured in `.env.local`) into the password modal.
- The UI will stream live logs as it evaluates articles and publishes to LinkedIn.

### 2. Cron Trigger (`/api/cron`)
You can simulate the GitHub Actions cron job locally via cURL or Postman:
```bash
curl -X POST http://localhost:3000/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE"
```

---

## ☁️ How to Deploy to Vercel

1. Push this code to a new GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section.
5. Paste all key-value pairs from `.env.local` into the Vercel dashboard.
6. Click **Deploy**.

### Required Vercel Environment Variables
- `CRON_SECRET`
- `MANUAL_RUN_SECRET`
- `OPENROUTER_API_KEY`
- `TAVILY_API_KEY`
- `PEXELS_API_KEY`
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `LINKEDIN_REFRESH_TOKEN`
- `LINKEDIN_ORGANIZATION_ID`

---

## ⚙️ How to Configure GitHub Actions (Cron)

This project uses a GitHub Actions workflow to run 5 times a day corresponding to peak LinkedIn engagement.

1. Go to your repository on GitHub.
2. Navigate to **Settings > Secrets and variables > Actions**.
3. Click **New repository secret** and add:
   - Name: `CRON_URL`
   - Value: `https://your-vercel-deployment-url.vercel.app/api/cron`
4. Click **New repository secret** again and add:
   - Name: `CRON_SECRET`
   - Value: (The exact string you put for `CRON_SECRET` in Vercel)

The `.github/workflows/cron.yml` file will automatically start pinging your app on the scheduled UTC times.

---

## 🔐 LinkedIn OAuth Refresh Instructions

Your `LINKEDIN_REFRESH_TOKEN` has a strict lifespan of **1 year**. 

If the application begins failing with `401 Unauthorized` errors from LinkedIn, your refresh token has expired.

**To renew:**
1. Generate a new Authorization Code from the LinkedIn Developer Portal.
2. Exchange the Authorization Code for a new Access Token and Refresh Token.
3. Update the `LINKEDIN_REFRESH_TOKEN` in your Vercel Environment Variables.
4. Redeploy Vercel to apply the new environment variable.

## 🚑 Common Troubleshooting

- **504 Gateway Timeout on Vercel:** OpenRouter latency is high. The application gracefully aborted to prevent crashing. It will try again on the next cron run.
- **Duplicate Images:** Ensure `per_page=1` is maintained in `lib/pexels.ts`.
- **Unauthorized on Manual Run:** Double check that the password entered exactly matches the `MANUAL_RUN_SECRET` in Vercel.
