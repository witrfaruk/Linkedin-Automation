# 🤖 LinkedIn Auto Poster

<p align="center">
  <img src="./assets/linkedin-auto-poster.svg" alt="LinkedIn Auto Poster animated banner" width="100%">
</p>

<p align="center">
  <strong>Build your personal brand while you sleep. 🚀</strong>
</p>

<p align="center">
  An autonomous AI content engine that discovers startup news, turns it into founder-focused insights, generates visuals, and publishes directly to LinkedIn.
</p>

<p align="center">
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-ai-stack">AI Stack</a> •
  <a href="#-setup">Setup</a> •
  <a href="#-automation">Automation</a> •
  <a href="#-why-open-source">Why Open Source</a>
</p>

---

## ⚡ What This Does

**LinkedIn Auto Poster** automates the repetitive parts of building a professional presence online.

```text
📰 Discover
   ↓
🧠 Analyze
   ↓
✍️ Write
   ↓
🎨 Generate
   ↓
📢 Publish
   ↓
🔁 Repeat
```

The entire workflow can run automatically through **GitHub Actions**, without keeping a server running.

---

## 🌍 Why I Built This

Building a personal brand takes consistency.

But consistency is difficult when you also have to:

* Read dozens of news articles
* Find the story that actually matters
* Understand why it matters
* Write a useful post
* Create a visual
* Publish it
* Repeat the process every day

I wanted to automate the boring parts while keeping the important part — **your ideas, your expertise, and your voice**.

### ❤️ Why I'm Making It Open Source

I'm releasing this project because I believe **more people should be able to build their personal brand online**.

You don't need a huge team.

You don't need an expensive content agency.

You don't need to spend hours every day searching for something to post.

Take this project, change the prompts, change the niche, connect your own accounts, and build something that works for **you**.

> **The goal isn't to automate people.
> The goal is to give people more time to create.**

---

# 🧠 How It Works

## 01 — 📰 News Discovery

**Tavily** searches the web for recent startup, technology, and business news.

The workflow can search sources such as:

* TechCrunch
* Forbes
* Y Combinator
* a16z
* Startup publications
* Technology publications
* Business publications

The system focuses on recent stories so the generated content stays relevant.

---

## 02 — 🧠 AI Evaluation

The collected articles are analyzed using **OpenAI**.

The AI looks for stories with strong potential for a founder-focused audience.

It considers things like:

* Relevance
* Timeliness
* Business impact
* Founder interest
* Discussion potential
* Engagement potential

Instead of blindly posting every article, the workflow tries to identify the **best story worth discussing**.

---

## 03 — ✍️ AI Copywriting

Once a story is selected, **OpenAI** transforms it into a LinkedIn-ready post.

The writing is designed to be:

* Professional
* Conversational
* Founder-focused
* Easy to scan
* High-retention
* Insightful
* Native to LinkedIn

The goal is not simply to summarize the article.

The goal is to turn the news into something **worth reading**.

---

## 04 — 🎨 AI Image Generation

Visuals are generated using **Google Gemini**.

The workflow determines what kind of visual fits the content and generates an image for the LinkedIn post.

This means the automation can produce a complete content package:

```text
📰 Story
     +
✍️ Post
     +
🎨 Visual
     =
📢 Ready to Publish
```

---

## 05 — 🔗 LinkedIn Publishing

The generated image and post are sent through the **LinkedIn API** and published to the configured LinkedIn Organization/Company Page.

Once configured, the process can happen without manual intervention.

---

# 🤖 AI Stack

| Job                 | Tool           |
| ------------------- | -------------- |
| 🔎 Web research     | Tavily         |
| 🧠 Analysis         | OpenAI         |
| ✍️ Copywriting      | OpenAI         |
| 🎨 Image generation | Google Gemini  |
| 📢 Publishing       | LinkedIn API   |
| ⚙️ Scheduling       | GitHub Actions |

### Why Multiple AI Services?

Each part of the workflow has a different job.

**OpenAI** handles the reasoning and writing.

**Gemini** handles image generation.

This keeps the system modular, so you can replace individual components with other models or providers.

---

# 🎨 Image Generation

I also built and open-sourced the image-generation project used with this workflow.

### 🔗 Image Generation

https://github.com/farukhetro/Image-Generation

The image-generation setup can provide approximately **100,000 tokens per day**, depending on the current provider/model limits.

> ⚠️ **Important:** 100,000 tokens does **not** mean 100,000 images.
>
> Image generation consumes tokens based on the model, prompt, resolution, and generation settings.

You can use the image-generation repository as a separate starting point for building your own AI visual workflow.

---

# ⏰ Automation Schedule

The workflow is controlled by:

```text
.github/workflows/cron.yml
```

The default schedule is designed around common LinkedIn engagement windows.

### 🇺🇸 US Eastern Time

```text
08:00 AM
10:00 AM
12:00 PM
02:00 PM
05:00 PM
```

That's up to **5 automated runs per day**.

You can change the schedule inside the GitHub Actions workflow.

> ⚠️ GitHub Actions cron uses **UTC**, so convert the desired Eastern Time schedule appropriately for daylight-saving changes.

---

# ⚙️ Automation

```text
                 ┌──────────────────┐
                 │   GitHub Actions │
                 │    ⏰ Scheduler  │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   🔎 Tavily      │
                 │   Find News      │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   🧠 OpenAI      │
                 │ Analyze Stories  │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   ✍️ OpenAI      │
                 │  Write Content   │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   🎨 Gemini      │
                 │ Generate Image   │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   🔗 LinkedIn    │
                 │      Publish     │
                 └──────────────────┘
```

---

# 🚀 Setup

## 1. Clone the repository

```bash
git clone https://github.com/farukhetro/Linkedin-automation.git
cd Linkedin-automation
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create your environment file

```bash
cp .env.example .env.local
```

Then add your credentials.

---

# 🔐 Environment Variables

The project requires credentials similar to:

```env
OPENAI_API_KEY=
TAVILY_API_KEY=
GEMINI_API_KEY=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ORGANIZATION_ID=
LINKEDIN_REFRESH_TOKEN=
```

> 🔒 **Never commit API keys, refresh tokens, or `.env.local` to GitHub.**

---

# 🧪 Run Locally

To manually test the automation:

```bash
npm start
```

Running locally is recommended before enabling the scheduled workflow.

---

# 🔑 LinkedIn Authentication

LinkedIn requires OAuth credentials for publishing to an Organization/Company Page.

If your project includes the authentication generator, run:

```bash
npm run auth
```

Follow the instructions printed in your terminal.

After authentication, store your credentials securely in your environment variables or GitHub repository secrets.

---

# ☁️ Deploy With GitHub Actions

You don't need:

* ❌ Vercel
* ❌ AWS server
* ❌ VPS
* ❌ Database
* ❌ Always-running server

The automation can run through **GitHub Actions**.

### Add Repository Secrets

Go to:

```text
Repository
→ Settings
→ Secrets and variables
→ Actions
```

Add:

```text
OPENAI_API_KEY
TAVILY_API_KEY
GEMINI_API_KEY
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
LINKEDIN_ORGANIZATION_ID
LINKEDIN_REFRESH_TOKEN
```

Then make sure your workflow exists:

```text
.github/
└── workflows/
    └── cron.yml
```

GitHub will run the automation according to your schedule.

---

# 🎯 Make It Yours

This project is a foundation.

You can turn it into an automation for almost any niche.

### 👨‍💻 Developers

```text
AI
Open source
Programming
Developer tools
Engineering
```

### 🚀 Founders

```text
Startups
Fundraising
Product launches
Business strategy
Venture capital
```

### 📈 Marketing

```text
Growth
Marketing
Branding
Social media
Customer acquisition
```

### 🤖 AI Creators

```text
AI tools
New models
AI research
AI startups
Automation
```

### 💼 Personal Brand

Change the search topics, prompts, tone, sources, image style, and schedule to create content around **your own expertise**.

---

# 🧩 Customization

| Component      | What You Can Change                   |
| -------------- | ------------------------------------- |
| 🔎 Research    | Sources and search queries            |
| 🧠 AI          | Model and prompts                     |
| ✍️ Writing     | Tone and content style                |
| 🎨 Images      | Image model and visual style          |
| ⏰ Schedule     | Posting frequency                     |
| 🎯 Audience    | Founders, developers, marketers, etc. |
| 📢 Destination | LinkedIn Organization/Page            |
| 🏷️ Branding   | Your name, niche, and voice           |

---

# ⚠️ Important

This project is designed to automate content workflows, not blindly publish low-quality AI content.

Before deploying it publicly:

* Verify generated information.
* Review your AI provider's policies.
* Review LinkedIn's API and automation policies.
* Respect copyright and attribution requirements.
* Don't publish misleading or fabricated information.
* Protect all API keys and OAuth credentials.

> **Automation should save time — not replace judgment.**

---

# 🤝 Contributing

Contributions, improvements, issues, and ideas are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the workflow.
5. Commit your changes.
6. Push your branch.
7. Open a Pull Request.

---

# ⭐ Support

If this project helps you build your personal brand, consider giving it a ⭐.

It helps other creators discover the project and motivates further development.

---

# 📜 License

This project is open source under the **MIT License**.

You are free to:

* Use it
* Copy it
* Modify it
* Learn from it
* Build your own version

See the [`LICENSE`](LICENSE) file for the complete license.

---

<p align="center">

## 🚀 Build Your Brand While You Sleep

**Discover → Think → Write → Create → Publish**

</p>

<p align="center">
  Made with ❤️ to help more people build their presence online.
</p>
