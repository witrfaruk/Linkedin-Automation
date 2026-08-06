# LinkedIn Auto Poster

Fully autonomous, AI-driven startup news curation and publishing automation. This runs entirely in the background using GitHub Actions, analyzing trending startup news and posting high-quality, founder-focused insights directly to a LinkedIn Company Page.

## 🚀 How It Works

1. **News Curation (Tavily):** Scrapes top-tier startup publications (TechCrunch, Forbes, YC, a16z, etc.) for the best news published in the last 48 hours.
2. **AI Evaluation (OpenRouter/Nemotron):** Analyzes up to 30 articles in a single pass to identify the *single best story* with the highest viral and engagement potential for founders.
3. **Copywriting (OpenRouter/Nemotron):** Transforms the chosen article into a professional, engaging, and high-retention LinkedIn post.
4. **Image Generation (Pexels):** Dynamically generates a highly relevant business keyword based on the post and downloads a professional stock image.
5. **Publishing (LinkedIn API):** Uploads the image and publishes the post directly to a LinkedIn Organization page.

All of this happens autonomously, 5 times a day, with ZERO human intervention.

---

## ⏰ When It Runs

This automation is scheduled via GitHub Actions (`.github/workflows/cron.yml`) to run at the absolute best times for LinkedIn engagement. 

**Scheduled Times (US Eastern Time - ET):**
- 8:00 AM ET 
- 10:00 AM ET
- 12:00 PM ET
- 2:00 PM ET
- 5:00 PM ET

---

## 💻 How to Run Locally

If you want to manually test the script on your own computer:

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
5. Run the automation script:
   ```bash
   npm start
   ```

### 🔐 Generating a LinkedIn Refresh Token
LinkedIn requires a Refresh Token (3-legged OAuth) to post to an Organization page. If you need a new token, run the built-in generator script:
```bash
npm run auth
```
Follow the terminal instructions to instantly get a new token securely.

---

## ☁️ How to Deploy on GitHub Actions

You do **not** need Vercel, AWS, or any server. This runs 100% free on GitHub.

1. Push this code to a public or private GitHub repository.
2. Go to your repository **Settings > Secrets and variables > Actions**.
3. Click **New repository secret** and add the following 7 secrets:
   - `OPENROUTER_API_KEY`
   - `TAVILY_API_KEY`
   - `PEXELS_API_KEY`
   - `LINKEDIN_CLIENT_ID`
   - `LINKEDIN_CLIENT_SECRET`
   - `LINKEDIN_ORGANIZATION_ID`
   - `LINKEDIN_REFRESH_TOKEN`

That's it. The GitHub Action will automatically wake up and run the script on the scheduled hours.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
