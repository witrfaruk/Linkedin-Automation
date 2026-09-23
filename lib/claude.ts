import { fetchWithRetry } from "./utils";
import { Article } from "./tavily";

const CLAUDE_MODELS = [
  process.env.ANTHROPIC_MODEL || "claude-fable-5-1",
  "claude-fable-5",
];

async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  expectJson: boolean = false,
  signal?: AbortSignal,
  modelIndex = 0
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Please set ANTHROPIC_API_KEY in your .env or GitHub Secrets."
    );
  }

  if (modelIndex >= CLAUDE_MODELS.length) {
    throw new Error("All configured Claude models failed. Please verify your API key and model access.");
  }

  const currentModel = CLAUDE_MODELS[modelIndex];
  console.log(`[Claude] Using model: ${currentModel}`);

  const body: any = {
    model: currentModel,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  };

  // 90-second timeout
  const timeoutSignal = AbortSignal.timeout(90000);
  const fetchSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  try {
    const response = await fetchWithRetry("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: fetchSignal,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Claude API error (${response.status}): ${response.statusText} - ${errText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Claude returned error: ${JSON.stringify(data.error)}`);
    }

    if (!data.content || data.content.length === 0) {
      console.error("Claude empty content error. Full response:", JSON.stringify(data, null, 2));
      throw new Error("Claude returned empty content array");
    }

    const textBlock = data.content.find((block: any) => block.type === "text");
    let content = textBlock ? textBlock.text.trim() : "";

    if (expectJson) {
      content = content
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    return content;
  } catch (error) {
    console.warn(
      `[Claude] Error with model ${currentModel}: ${(error as Error).message}. Falling back to next model...`
    );
    if (modelIndex + 1 < CLAUDE_MODELS.length) {
      return callClaude(systemPrompt, userPrompt, expectJson, signal, modelIndex + 1);
    }
    throw error;
  }
}

// =========================================================================
// PROMPT 1: ARTICLE EVALUATOR / CHOOSER
// =========================================================================
// (Buddy, insert your detailed prompt so we can start!!!!)
export async function chooseBestArticle(articles: Article[], signal?: AbortSignal) {
  const formattedArticles = articles
    .map(
      (a, i) =>
        `[Article ${i}]\nTitle: ${a.title}\nContent: ${a.content}\nURL: ${a.url}\nPublished: ${
          a.published_date || "N/A"
        }`
    )
    .join("\n\n");

  const prompt = `(insert your detailed prompt so we can start!!!!)

Here are ${articles.length} news articles:

${formattedArticles}

Evaluate the articles and select the single best story with highest value, discussion, and engagement potential.

Output ONLY valid JSON matching this exact format:

{
  "best_article_index": 0,
  "summary": "Brief summary of why this article was selected",
  "why_it_matters": "Key takeaway or impact",
  "viral_score": 98
}`;

  return await callClaude("You are an executive editorial director.", prompt, true, signal);
}

// =========================================================================
// PROMPT 2: LINKEDIN POST GENERATOR / WRITER
// =========================================================================
// (Buddy, insert your detailed prompt so we can start!!!!)
export async function generateLinkedInPost(
  article: Article,
  enhancedContext?: string,
  signal?: AbortSignal
) {
  let reference = article.content;
  if (enhancedContext) {
    reference = `${enhancedContext}\n\nOriginal Content:\n${article.content}`;
  }

  const prompt = `(insert your detailed prompt so we can start!!!!)

Reference:
<article>
${reference}
</article>

Transform the reference article above into an engaging, high-retention LinkedIn post.

Output ONLY the final LinkedIn post as plain text. Do not wrap in markdown or JSON.`;

  return await callClaude(
    "You are a professional LinkedIn content writer.",
    prompt,
    false,
    signal
  );
}
