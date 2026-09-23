# 🤖 LinkedIn Auto Poster

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:2563eb,100:7c3aed&height=180&section=header&text=LinkedIn%20Auto%20Poster&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35" width="100%" alt="LinkedIn Auto Poster">
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=20&duration=2800&pause=900&color=60A5FA&center=true&vCenter=true&width=700&lines=Build+your+personal+brand+while+you+sleep+%F0%9F%9A%80;Discover+%E2%86%92+Analyze+%E2%86%92+Write+%E2%86%92+Publish;Fully+automated+AI-powered+LinkedIn+content;Powered+by+Anthropic+Claude+%2B+Tavily" alt="Typing animation">
</p>

<p align="center">
  <a href="https://github.com/farukhetro/Linkedin-automation">
    <img src="https://img.shields.io/github/stars/farukhetro/Linkedin-automation?style=for-the-badge&logo=github&label=Stars" alt="GitHub Stars">
  </a>
  <a href="https://github.com/farukhetro/Linkedin-automation/network/members">
    <img src="https://img.shields.io/github/forks/farukhetro/Linkedin-automation?style=for-the-badge&logo=github&label=Forks" alt="GitHub Forks">
  </a>
  <img src="https://img.shields.io/badge/AI-Powered-7C3AED?style=for-the-badge" alt="AI Powered">
  <img src="https://img.shields.io/badge/GitHub%20Actions-Automated-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions">
</p>

<p align="center">
  <strong>📰 Discover news → 🧠 Understand it → ✍️ Write it → 🎨 Create visuals → 📢 Publish it</strong>
</p>

<p align="center">
  <a href="https://github.com/farukhetro/Linkedin-automation">⭐ Star this project</a>
  •
  <a href="https://github.com/farukhetro/Linkedin-automation/issues">🐛 Report an Issue</a>
  •
  <a href="https://github.com/farukhetro/Linkedin-automation/forks">🍴 Fork It</a>
</p>

---

## ⚡ What Is This?

**LinkedIn Auto Poster** is an autonomous AI content engine designed to help creators, founders, developers, and businesses build their presence on LinkedIn without spending hours every day researching and writing content.

It runs automatically using **GitHub Actions** and can handle the complete content pipeline:

```text
┌──────────────┐
│   📰 NEWS    │
└──────┬───────┘
       ↓
┌──────────────┐
│  🔎 RESEARCH │
└──────┬───────┘
       ↓
┌──────────────┐
│  🧠 ANALYZE  │
└──────┬───────┘
       ↓
┌──────────────┐
│   ✍️ WRITE   │
└──────┬───────┘
       ↓
┌──────────────┐
│  🎨 GENERATE │
└──────┬───────┘
       ↓
┌──────────────┐
│ 📢 LINKEDIN  │
└──────────────┘
```

### The result?

**Consistent content without manually doing the repetitive work.**

---

# 🚀 The Philosophy

> ### Build your brand. Automate the boring parts. Keep creating.

Building a personal brand requires consistency.

But consistency becomes difficult when you have to:

* Read dozens of articles every day
* Decide which story is worth posting
* Understand the story
* Write a good LinkedIn post
* Create a relevant image
* Publish it
* Repeat everything tomorrow

This project automates that workflow.

**You provide the direction.
AI handles the repetitive work.**

---

# 🌟 Features

<table>
<tr>
<td width="50%">

### 📰 Intelligent News Discovery

Searches recent startup, technology, and business news using **Tavily**.

</td>
<td width="50%">

### 🧠 AI Story Selection

Uses **Anthropic Claude (`claude-fable-5-1`)** to determine which story has the strongest value and engagement potential.

</td>
</tr>

<tr>
<td>

### ✍️ AI Copywriting

Turns the selected story into a professional, founder-focused LinkedIn post.

</td>
<td>

### 🧐 AI Validation & Auto-Retry

A strict AI editor reviews the draft. If it's too generic or boring, the system automatically forces a rewrite to guarantee high-quality posts.

</td>
</tr>

<tr>
<td>

### 📢 Automatic Publishing

Publishes the final content directly through the **LinkedIn API**.

</td>
<td>

### ⏰ Scheduled Automation

Runs automatically using **GitHub Actions** — no server required.

</td>
</tr>
</table>

---

# 🧠 AI Stack

<p align="center">

<img src="https://img.shields.io/badge/Anthropic-Claude%20Fable-D97706?style=for-the-badge&logo=anthropic&logoColor=white" alt="Anthropic Claude">

<img src="https://img.shields.io/badge/Tavily-Web%20Research-111827?style=for-the-badge" alt="Tavily">

<img src="https://img.shields.io/badge/LinkedIn-Publishing-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">

</p>

| Purpose               | Technology         |
| --------------------- | ------------------ |
| 🔎 Web research       | **Tavily**         |
| 🧠 Article analysis   | **Anthropic Claude** (`claude-fable-5-1`) |
| ✍️ Content generation | **Anthropic Claude** (`claude-fable-5-1`) |
| 📢 Publishing         | **LinkedIn API**   |
| ⏰ Automation          | **GitHub Actions** |

---

# 🔄 How It Works

## 01 — 🔎 Discover (Insert Your Search Query & Sources!)

Buddy, there are no locked-down or predefined sources! You insert your own search query and domain filters in `.env` (or GitHub Secrets) so we can start:

* **Your Niche / Query**: Set `SEARCH_QUERY` to whatever topic you want (e.g. AI, Crypto, Finance, Engineering, Healthcare, Real Estate).
* **Your Sources (Optional)**: Set `INCLUDE_DOMAINS` to your favorite publications or leave it empty to search the entire web.
* **Filter Out Noise (Optional)**: Set `EXCLUDE_DOMAINS` to block any websites you don't like.

---

## 02 — 🧠 Think & Choose (Insert Your Selection Prompt!)

The fetched articles are evaluated using **Anthropic Claude (`claude-fable-5-1`)**.

Buddy, you insert your own detailed evaluation prompt inside [`lib/claude.ts`](lib/claude.ts) so Claude knows exactly what kind of stories to look for:

```text
✓ Relevance to your specific niche
✓ High discussion and engagement value
✓ Timeliness and credibility
✓ Unique insights that your audience cares about
```

Instead of spamming everything, Claude picks the **single best story** according to your instructions.

---

## 03 — ✍️ Write & Style (Insert Your Writing Prompt!)

Claude transforms the selected story into an engaging LinkedIn post tailored to your brand.

Buddy, open [`lib/claude.ts`](lib/claude.ts) and insert your own detailed writing prompt, tone guidelines, and structure:

* Set your own voice (conversational, authoritative, bold, technical, etc.)
* Define your ideal post length and structure
* Add your rules on formatting, hooks, and questions

---

## 04 — 📢 Publish

The generated LinkedIn post is published automatically through the **LinkedIn API** to your personal profile or organization page.

---

# ⏰ Automated Posting

The project can run up to **5 times per day**.

### 🇺🇸 Default Schedule — US Eastern Time

|        Time | Run |
| ----------: | :-: |
| 🕗 08:00 AM |  ✅  |
| 🕙 10:00 AM |  ✅  |
| 🕛 12:00 PM |  ✅  |
| 🕑 02:00 PM |  ✅  |
| 🕔 05:00 PM |  ✅  |

The schedule lives inside:

```text
.github/workflows/cron.yml
```

> ⚠️ GitHub Actions uses **UTC** for cron schedules. Adjust the schedule for daylight-saving changes when necessary.

---

# ☁️ Zero Server Required

One of the best parts of this project:

```text
❌ No VPS
❌ No AWS server
❌ No Vercel server
❌ No database
❌ No always-running process

        ↓

✅ GitHub Actions
```

GitHub wakes the automation up when the scheduled workflow runs.

---

# 🎨 Image Generation Project

I also built an open-source image-generation project that can be used alongside this automation.

### 👉 [Image Generation](https://github.com/farukhetro/Image-Generation)

The setup can provide approximately **100,000 tokens per day**, depending on the current model/provider limits.

> ⚠️ **Important:** 100,000 tokens does **not** mean 100,000 images.
>
> Image generation consumes tokens based on the model, prompt, resolution, and generation settings.

You can use that repository independently if you want to build your own AI image-generation workflow.

---

# 💡 Why Open Source?

I am making this project open source for one simple reason:

## **Everyone should have the opportunity to build a personal brand online.**

You shouldn't need:

* 💰 An expensive content agency
* 👥 A social media team
* ⏰ Hours of manual research
* 🧑‍💻 A dedicated server
* 🤯 Complicated infrastructure

You can fork this project and make it yours.

Change:

```text
🔎 What you search
🧠 How AI thinks
✍️ How AI writes
🎨 How images look
🎯 Who you're targeting
⏰ When you publish
```

Then build a content engine around **your own expertise**.

---

# 🎯 Build Your Own Niche

This doesn't have to be about startup news.

### 👨‍💻 Developer Brand

```text
AI
Open Source
Programming
Developer Tools
Engineering
```

### 🚀 Founder Brand

```text
Startups
Fundraising
Product
Business Strategy
Venture Capital
```

### 📈 Marketing Brand

```text
Growth
Marketing
Branding
Social Media
Customer Acquisition
```

### 🤖 AI Brand

```text
AI Models
AI Tools
AI Research
AI Startups
Automation
```

### 💼 Personal Brand

Replace the news sources and prompts with content related to **your own skills and experience**.

---

# 🛠️ Setup

## 1. Clone

```bash
git clone https://github.com/farukhetro/Linkedin-automation.git
cd Linkedin-automation
```

## 2. Install

```bash
npm install
```

## 3. Environment Variables

```bash
cp .env.example .env.local
```

Then configure `.env.local`:

```env
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-fable-5-1 # Optional
TAVILY_API_KEY=

# Define your niche topic or search keywords (Required)
SEARCH_QUERY="Artificial Intelligence OR Machine Learning OR LLMs"

# Specific domains to include/exclude (Optional)
INCLUDE_DOMAINS=
EXCLUDE_DOMAINS=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ORGANIZATION_ID=
LINKEDIN_REFRESH_TOKEN=
```

> 🔒 Never commit API keys or `.env.local` to GitHub.

---

# 🧪 Run Locally

Test the automation manually:

```bash
npm start
```

If your project includes the LinkedIn authentication helper:

```bash
npm run auth
```

Follow the terminal instructions to generate the required OAuth credentials.

---

# ⚙️ GitHub Actions

After pushing the repository to GitHub:

**Settings → Secrets and variables → Actions**

Add:

```text
ANTHROPIC_API_KEY
ANTHROPIC_MODEL (optional, defaults to claude-fable-5-1)
TAVILY_API_KEY
SEARCH_QUERY
INCLUDE_DOMAINS (optional)
EXCLUDE_DOMAINS (optional)
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
LINKEDIN_ORGANIZATION_ID
LINKEDIN_REFRESH_TOKEN
```

Then make sure the workflow exists:

```text
.github/
└── workflows/
    └── cron.yml
```

Once configured, GitHub handles the scheduled execution.

---

# 🧩 Customize Everything

| Component     | Customize                |
| ------------- | ------------------------ |
| 🔎 Research   | Search queries & sources |
| 🧠 AI         | Models & prompts         |
| ✍️ Writing    | Tone & structure         |
| 🎨 Images     | Model & visual style     |
| 🎯 Audience   | Your niche               |
| ⏰ Schedule    | Posting frequency        |
| 📢 Publishing | LinkedIn destination     |
| 🏷️ Branding  | Your voice & identity    |

---

# ⚠️ Responsible Automation

This project is designed to automate repetitive content work — not to blindly publish AI-generated information.

Before using it:

* Verify important information.
* Review LinkedIn's API and automation policies.
* Follow your AI provider's terms.
* Respect copyright and attribution.
* Protect API keys and OAuth credentials.
* Avoid misleading or fabricated content.
* Review your content strategy regularly.

> **Automation should save time — not replace judgment.**

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a branch.
3. Make your changes.
4. Test the workflow.
5. Commit your changes.
6. Push your branch.
7. Open a Pull Request.

Have an idea?

**Open an issue and let's build it. 🚀**

---

# ⭐ Support

If this project helps you build your personal brand, you can support us!

If you want to support development and send us a present, you can do so here:
**[👉 Send a Present via PayPal](https://www.paypal.com/paypalme/arifpayment)**

<p align="center">

### ⭐ Star the repository

### 🍴 Fork it

### 🛠️ Build something with it

### 📢 Share it with someone who needs it

</p>

---

# 📜 License

This project is open source under the **MIT License**.

You are free to:

* Use it
* Copy it
* Modify it
* Learn from it
* Build your own version

See [`LICENSE`](LICENSE) for the complete license.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:7c3aed,50:2563eb,100:0f172a&height=120&section=footer&animation=fadeIn" width="100%" alt="Footer">
</p>

<p align="center">
  <strong>🚀 Build your brand while you sleep.</strong>
</p>

<p align="center">
  Made with ❤️ to help more people build their presence online.
</p>
