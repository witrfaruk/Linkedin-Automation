<p align="center">
  <img src="assets/logos/logo.png" width="520" alt="LinkedIn Automation Logo">
</p>

<p align="center">
  <strong>Autonomous AI-powered LinkedIn content pipeline. Discover trending tech news, analyze insights with Claude Fable, and publish high-engagement posts on schedule via GitHub Actions.</strong>
</p>

<p align="center">
  <a href="https://github.com/farukhetro/Linkedin-automation"><img src="https://img.shields.io/badge/Release-v2.0-a6ff00?style=for-the-badge&logo=github&labelColor=000000" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-00d2ff?style=for-the-badge&labelColor=000000" alt="License"></a>
  <a href="https://github.com/farukhetro/Linkedin-automation/actions"><img src="https://img.shields.io/badge/GitHub%20Actions-Automated-ffe600?style=for-the-badge&logo=githubactions&logoColor=black&labelColor=000000" alt="Actions"></a>
  <a href="https://www.anthropic.com"><img src="https://img.shields.io/badge/AI%20Model-Claude%20Fable-c084fc?style=for-the-badge&logo=anthropic&labelColor=000000" alt="Claude"></a>
  <a href="https://ko-fi.com/U4B028M2CY"><img src="https://img.shields.io/badge/Support%20Us-Ko--fi-ff5e5b?style=for-the-badge&logo=kofi&logoColor=white&labelColor=000000" alt="Support on Ko-fi"></a>
</p>

---

## ⚡ What is LinkedIn Automation?

Building consistency on LinkedIn takes hours of daily research, evaluation, and drafting. **LinkedIn Automation** solves this by creating an autonomous 24/7 content engine that runs 100% free inside your personal GitHub repository.

```text
┌────────────────┐     ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│   🔍 DISCOVER   │ ──> │   🧠 ANALYZE   │ ──> │   ✍️ COMPOSE   │ ──> │   📢 PUBLISH   │
│  Tavily Search │     │  Claude Fable  │     │ Custom Skills  │     │  LinkedIn API  │
└────────────────┘     └────────────────┘     └────────────────┘     └────────────────┘
```

---

## 📊 Manual Content vs. LinkedIn Automation

| Feature | Manual Process | LinkedIn Automation |
| :--- | :--- | :--- |
| **Research Time** | 45–60 mins daily scrolling news feeds | **0 seconds** (Tavily fetches live high-signal stories) |
| **Topic Selection** | Guesswork on what will perform | **Claude Fable scores viral & engagement potential** |
| **Writing Style** | Repetitive or robotic draft struggles | **Custom tone, rules, and skills from `skills/`** |
| **Hosting Cost** | Third-party SaaS ($30–$99/month) | **$0/month** (Free GitHub Actions runners) |
| **Privacy & Security**| Shared with external platforms | **100% Self-Hosted & Encrypted in GitHub Secrets** |

---

## 🗂️ Clean Modular Architecture

The repository is organized into 3 clean modules with zero root clutter:

```text
Linkedin-Automation/
├── .github/          # assets/ (logos), pages/ (GitHub Pages), workflows/, README.md, LICENSE, FUNDING.yml
├── code/             # Executable TypeScript project (src/, package.json, tsconfig.json, .gitignore)
└── skills/           # Blank directory ready for user custom skills & guidelines
```

---

## 🚀 3-Minute Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/farukhetro/Linkedin-automation.git
cd Linkedin-automation/code
npm install
```

### 2. Generate LinkedIn Refresh Token
Create `code/.env.local` with your LinkedIn Developer App credentials:
```env
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
```

Then run the interactive OAuth helper:
```bash
npm run auth
```
This launches a local callback server, authenticates via your browser, and outputs your long-lived `LINKEDIN_REFRESH_TOKEN`.

### 3. Test Locally
```bash
npm run start
```

---

## ⚙️ GitHub Actions Automation (24/7 Autopilot)

Navigate to **Settings > Secrets and variables > Actions > New repository secret** in your GitHub repository and add:

| Secret Name | Description | Required |
| :--- | :--- | :--- |
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key | Yes |
| `TAVILY_API_KEY` | Tavily Search API Key | Yes |
| `LINKEDIN_CLIENT_ID` | LinkedIn Developer App Client ID | Yes |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn Developer App Client Secret | Yes |
| `LINKEDIN_REFRESH_TOKEN` | Long-lived OAuth Token from `npm run auth` | Yes |
| `LINKEDIN_ORGANIZATION_ID`| LinkedIn Company Page or Organization ID | Yes |

### Optimal Posting Windows
Configured inside `.github/workflows/cron.yml` across 5 peak engagement windows:
- `4:50 AM ET` — Commuter morning feed
- `12:59 PM ET` — Lunchtime mobile browsing
- `4:45 PM ET` — Afternoon industry wrap-up
- `7:45 PM ET` — Evening developer discussions
- `9:07 PM ET` — Late night tech community catch-up

---

## 🎯 Custom Skills (`skills/`)

The root `skills/` directory is deliberately blank so you can drop your own personal guidelines into it:
- Add `skills.txt`, `profile.json`, or `guidelines.md` with your core expertise, tone of voice, target audience, and forbidden buzzwords.
- Claude automatically detects and parses any files placed in `skills/` without requiring any code edits.

---

## ☕ Support This Open-Source Project

If this tool saves you hours of writing and research, consider buying us a coffee on Ko-fi. Your contributions keep the project actively maintained and updated with the latest AI models!

<p align="center">
  <a href="https://ko-fi.com/U4B028M2CY">
    <img src="https://storage.ko-fi.com/cdn/brandasset/kofi_button_stroke.png" height="50" alt="Support Us on Ko-fi">
  </a>
</p>

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.
