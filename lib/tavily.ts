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
      query: "(trending startup OR trending AI startup OR startup funding OR venture capital OR Series A OR Series B OR acquisition OR IPO OR startup launch OR founder news OR startup ecosystem) AND (United States OR USA OR Canada OR United Kingdom OR UK OR Australia)",
      topic: "news",
      search_depth: "advanced",
      days: 2,
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
