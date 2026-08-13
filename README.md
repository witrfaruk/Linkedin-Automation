# 🤖 LinkedIn Auto Poster

<p align="center">
  <strong>Build your personal brand while you sleep. 🚀</strong>
</p>

<p align="center">
  An autonomous, AI-powered LinkedIn content engine that discovers startup news, turns it into founder-focused insights, generates visuals, and publishes directly to LinkedIn.
</p>

<p align="center">
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-ai-stack">AI Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-github-actions">GitHub Actions</a> •
  <a href="#-why-open-source">Why Open Source</a>
</p>

---

## 🚀 What Is This?

**LinkedIn Auto Poster** is a fully autonomous AI-driven content automation system built to help individuals and companies consistently build their presence on LinkedIn.

It automatically:

> 📰 Finds what's happening
> → 🧠 Understands what's important
> → ✍️ Writes the post
> → 🎨 Generates an image
> → 📢 Publishes to LinkedIn
> → 🔁 Repeats automatically

No manual content research.

No sitting down every morning wondering what to post.

No complicated server infrastructure.

Just connect your APIs, configure GitHub Actions, and let it run.

---

## 🌟 Why I Built This

Building a personal brand online takes **consistency**.

The problem is that most people don't have the time to:

* Follow dozens of startup publications
* Read hundreds of articles
* Find the most interesting story
* Understand why it matters
* Write a high-quality LinkedIn post
* Find or create a relevant image
* Publish consistently every day

So I built an automation that handles the entire workflow.

### ❤️ Why I'm Open-Sourcing It

I'm releasing this project openly because I believe **everyone should have the opportunity to build their personal brand online**.

You shouldn't need a large team or an expensive content agency to consistently share valuable ideas.

You can take this project, customize it for yourself, change the prompts, change the niche, connect your own LinkedIn account, and build your own automated content system.

**Use it. Modify it. Learn from it. Build something better.**

---

# 🧠 How It Works

The entire workflow runs automatically through **GitHub Actions**.

### 1. 📰 News Curation

**Tavily** searches the web for recent startup and technology news.

The system can look across sources such as:

* TechCrunch
* Forbes
* Y Combinator
* a16z
* Startup publications
* Technology publications
* Business news

Articles from approximately the last **48 hours** are collected for analysis.

---

### 2. 🧠 AI Evaluation

The collected articles are analyzed using **OpenAI models**.

The AI evaluates the stories based on factors such as:

* Relevance to founders
* Timeliness
* Potential engagement
* Business impact
* Interestingness
* Discussion potential
* Value for a LinkedIn audience

The goal is not to post everything.

The goal is to find **the one story worth talking about**.

---

### 3. ✍️ AI Copywriting

Once the best story is selected, OpenAI transforms it into a professional LinkedIn post.

The generated content is designed to be:

* Founder-focused
* Easy to read
* Conversational
* High-retention
* Insightful
* Suitable for LinkedIn
* Focused on adding value rather than simply repeating the news

---

### 4. 🎨 AI Image Generation

Instead of relying on a random stock image, the system can generate a relevant visual for the post using **Google Gemini**.

The workflow determines the visual context required for the post and uses Gemini to create an appropriate image.

This makes the content feel much more original and brand-focused.

---

## 🤖 AI Stack

This project uses different AI services for different parts of the workflow.

| Task                  | Technology     |
| --------------------- | -------------- |
| 📰 Web research       | Tavily         |
| 🧠 Article analysis   | OpenAI         |
| ✍️ Content generation | OpenAI         |
| 🎨 Image generation   | Google Gemini  |
| 📢 Publishing         | LinkedIn API   |
| ⚙️ Automation         | GitHub Actions |

### Why OpenAI?

OpenAI handles the core intelligence of the system — from understanding the news to deciding what is worth sharing and turning it into useful LinkedIn content.

### Why Gemini for Images?

Image generation is handled separately using Gemini so the system can create visual content specifically for each post.

---

# 🎨 My Image Generation Model

I've also open-sourced the image-generation project I use:

### 👉 [Image Generation](https://github.com/farukhetro/Image-Generation)

The model/API setup provides a very large daily token allowance — approximately **100,000 tokens per day**, depending on the current model/provider limits.

> ⚠️ This is a **token limit, not 100,000 images per day**.

That distinction is important because image generation consumes tokens based on the model and generation settings.

If you're building your own version of this project, you can use the image-generation repository as another starting point for creating visuals for your content.

---

# ⏰ When It Runs

The automation is scheduled using:

```text
.github/workflows/cron.yml
```

The default schedule is designed around common LinkedIn engagement windows.

### 🇺🇸 US Eastern Time (ET)

```text
08:00 AM
10:00 AM
12:00 PM
02:00 PM
05:00 PM
```

That's up to **5 automated posts per day**.

You can easily change the schedule inside the GitHub Actions workflow.

---

# ☁️ GitHub Actions

One of the best parts of this project is that you don't need to maintain a server.

You don't need:

* ❌ Vercel
* ❌ AWS
* ❌ VPS
* ❌ Database
* ❌ Always-running server

The automation runs through **GitHub Actions**.

Once configured, GitHub automatically starts the workflow according to your schedule.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/farukhetro/Linkedin-automation.git
```

Then:

```bash
cd Linkedin-automation
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then add your API credentials.

---

# 🔐 Required API Keys

The project requires the following environment variables:

```text
OPENAI_API_KEY
TAVILY_API_KEY
GEMINI_API_KEY
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
LINKEDIN_ORGANIZATION_ID
LINKEDIN_REFRESH_TOKEN
```

Depending on your implementation, additional configuration may be required.

**Never commit your `.env.local` file or API keys to GitHub.**

---

# 🧪 Run Locally

To manually test the automation:

```bash
npm start
```

This allows you to test the workflow locally before enabling the GitHub Actions automation.

---

# 🔑 LinkedIn Authentication

LinkedIn requires OAuth credentials to publish content to an Organization/Company Page.

If you need to generate a new refresh token, run:

```bash
npm run auth
```

Follow the instructions displayed in your terminal.

Once authentication is complete, add the generated credentials to your environment variables or GitHub repository secrets.

---

# ⚙️ Deploy with GitHub Actions

After pushing the project to GitHub:

### 1. Open your repository

Go to:

**Settings → Secrets and variables → Actions**

### 2. Add your secrets

Add the required credentials:

```text
OPENAI_API_KEY
TAVILY_API_KEY
GEMINI_API_KEY
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
LINKEDIN_ORGANIZATION_ID
LINKEDIN_REFRESH_TOKEN
```

### 3. Push your workflow

Make sure the workflow exists:

```text
.github/
└── workflows/
    └── cron.yml
```

GitHub Actions will then automatically run the automation according to the configured schedule.

---

# 🏗️ Automation Pipeline

```text
┌─────────────────────┐
│   📰 Tavily Search  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  🧠 OpenAI Analysis │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  ⭐ Best Story      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ ✍️ OpenAI Writing   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 🎨 Gemini Image     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 🔗 LinkedIn API     │
└──────────┬──────────┘
           ↓
        🚀 POST
```

All of this can run automatically through GitHub Actions.

---

# 💡 Customize It For Yourself

This project isn't limited to startup news.

You can modify the prompts and workflow to create content around almost any niche.

For example:

### 👨‍💻 Developers

```text
AI news
Open-source projects
Programming trends
Developer tools
```

### 🚀 Founders

```text
Startup news
Fundraising
Product launches
Business strategy
```

### 📈 Marketing

```text
Marketing trends
Growth strategies
Social media
Brand building
```

### 🤖 AI

```text
AI research
New models
AI tools
AI startups
```

### 💼 Personal Brand

You can also completely change the workflow to create content around **your own expertise and interests**.

That's where this project becomes much more powerful.

---

# 🌍 Build Your Personal Brand

You don't need to copy the exact workflow.

Use it as a foundation.

Change:

* 🔎 Search queries
* 🧠 AI prompts
* ✍️ Writing style
* 🎨 Image style
* ⏰ Posting schedule
* 🎯 Target audience
* 📚 Content sources
* 🔗 LinkedIn destination

Build an automation that sounds like **you**.

---

# ⚠️ Important

This project is intended to help automate content creation and publishing.

You should always review your platform's API policies, content policies, and automation rules before deploying it.

Also make sure the content you publish is accurate and adds genuine value.

**Automation should save time — not replace judgment.**

---

# 🤝 Contributing

Contributions, improvements, issues, and ideas are welcome.

If you have an idea that could make the automation better:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the workflow.
5. Commit your changes.
6. Push your branch.
7. Open a Pull Request.

---

# ⭐ Support the Project

If this project helps you build your personal brand, consider giving the repository a ⭐.

It helps other people discover the project and motivates me to keep improving it.

---

# 📜 License

This project is completely open-source under the **MIT License**.

You are free to:

* Use it
* Copy it
* Modify it
* Learn from it
* Build your own version

See the [`LICENSE`](LICENSE) file for the complete license.

---

<p align="center">

## 🚀 Build your brand. Automate the boring parts. Keep creating.

**Open source • AI powered • Fully automated**

</p>

<p align="center">
  Made with ❤️ to help more people build their presence online.
</p>
