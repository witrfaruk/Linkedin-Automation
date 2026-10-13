import { fetchWithRetry } from "./utils";

export type Article = { title: string; url: string; content: string; published_date?: string };

export async function getArticles(): Promise<Article[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("TAVILY_API_KEY is not set");

  const searchQuery = process.env.SEARCH_QUERY?.trim();
  if (!searchQuery) {
    throw new Error(
      "SEARCH_QUERY is not set. Please configure SEARCH_QUERY in your .env file or environment variables (e.g., SEARCH_QUERY=\"Artificial Intelligence OR Machine Learning\")."
    );
  }

  const includeDomains = process.env.INCLUDE_DOMAINS
    ? process.env.INCLUDE_DOMAINS.split(",").map((d) => d.trim()).filter(Boolean)
    : [];

  const excludeDomains = process.env.EXCLUDE_DOMAINS
    ? process.env.EXCLUDE_DOMAINS.split(",").map((d) => d.trim()).filter(Boolean)
    : [];

  const days = process.env.SEARCH_DAYS ? parseInt(process.env.SEARCH_DAYS, 10) : 1;
  const maxResults = process.env.SEARCH_MAX_RESULTS ? parseInt(process.env.SEARCH_MAX_RESULTS, 10) : 30;
  const topic = process.env.SEARCH_TOPIC || "news";

  const requestBody: Record<string, any> = {
    api_key: apiKey,
    query: searchQuery,
    topic: topic,
    search_depth: "advanced",
    days: isNaN(days) ? 1 : days,
    max_results: isNaN(maxResults) ? 30 : maxResults,
    include_answer: true,
    include_raw_content: false,
    include_images: false,
  };

  if (includeDomains.length > 0) {
    requestBody.include_domains = includeDomains;
  }

  if (excludeDomains.length > 0) {
    requestBody.exclude_domains = excludeDomains;
  }

  const response = await fetchWithRetry("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Tavily API error: ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("No articles found for the provided SEARCH_QUERY");
  }

  return data.results.map((r: any) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    published_date: r.published_date,
  }));
}
