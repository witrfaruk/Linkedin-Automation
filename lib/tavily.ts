import { fetchWithRetry } from "./utils";

export type Article = { title: string; url: string; content: string; published_date?: string };

export async function getArticles(): Promise<Article[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("TAVILY_API_KEY is not set");

  const response = await fetchWithRetry("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: '("SaaS churn" OR "B2B pricing" OR "cold email" OR "SaaS funding" OR "B2B automation" OR "sales AI" OR "CRM tools" OR "lead generation" OR "SaaS layoffs" OR "enterprise AI" OR "B2B marketing" OR "SaaS acquisition" OR "AI agents" OR "sales automation" OR "B2B startups" OR "SaaS metrics" OR "customer churn" OR "cold outreach" OR "B2B SaaS" OR "sales tech" OR "SaaS pricing" OR "B2B growth" OR "AI sales" OR "lead scoring" OR "SaaS retention" OR "B2B leads" OR "AI automation" OR "sales pipeline" OR "SaaS valuation" OR "B2B software" OR "AI chatbots" OR "sales outreach" OR "SaaS startups" OR "B2B buyers" OR "AI workflows" OR "SaaS founders" OR "B2B deals" OR "sales teams" OR "AI receptionist" OR "SaaS growth" OR "B2B clients" OR "cold calling" OR "AI voice agents" OR "SaaS tools" OR "B2B market" OR "sales conversion" OR "AI CRM" OR "SaaS revenue" OR "B2B operations" OR "AI lead gen") AND ("United States" OR "USA" OR "Canada" OR "United Kingdom" OR "UK" OR "Australia")',
      topic: "news",
      search_depth: "advanced",
      days: 1,
      max_results: 30,
      include_answer: true,
      include_raw_content: false,
      include_images: false,
      include_domains: [
        "techcrunch.com",
        "theinformation.com",
        "businessinsider.com",
        "forbes.com",
        "fortune.com",
        "ycombinator.com",
        "a16z.com",
        "sequoiacap.com"
      ],
      exclude_domains: [
        "yourstory.com",
        "inc42.com",
        "entrepreneur.com",
        "reddit.com",
        "quora.com",
        "medium.com"
      ]
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Tavily API error: ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("No articles found");
  }

  return data.results.map((r: any) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    published_date: r.published_date,
  }));
}
