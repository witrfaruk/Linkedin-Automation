import { NextResponse } from "next/server";
import { getArticles } from "@/lib/tavily";
import { chooseBestArticle, generateLinkedInPost, generatePexelsKeyword } from "@/lib/openrouter";
import { searchImages, downloadImageBuffer } from "@/lib/pexels";
import { uploadAndPublishPost } from "@/lib/linkedin";
import { withTimeout } from "@/lib/utils";

export const maxDuration = 60; // Max execution time for Vercel Hobby tier

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Abort entire process if it gets close to Vercel's 60s limit (55s)
  const globalTimeout = withTimeout(new AbortController().signal, 55000);

  try {
    console.log("CRON: Fetching top 30 articles via Tavily...");
    const articles = await getArticles();
    console.log(`CRON: Fetched ${articles.length} articles.`);

    console.log("CRON: Evaluating articles via One Chooser AI to find the best...");
    
    // Evaluate concurrently. fetchWithRetry handles any 429 rate limits automatically.
    const evaluations = await Promise.allSettled(
      articles.map(async (article) => {
        const result = await chooseBestArticle(article, globalTimeout);
        if (result.trim().toUpperCase() === "SKIP") return null;
        
        try {
          const parsed = JSON.parse(result);
          return { article, parsed };
        } catch (e) {
          return null; // Ignore invalid JSON
        }
      })
    );

    const validEvaluations = evaluations
      .filter((e): e is PromiseFulfilledResult<{ article: any, parsed: any }> => e.status === "fulfilled" && e.value !== null)
      .map(e => e.value);

    if (validEvaluations.length === 0) {
      console.log("CRON: All 30 articles were rejected (SKIP). Stopping automation.");
      return NextResponse.json({ success: true, skipped: true });
    }

    // Sort by viral_score descending and pick the absolute best
    validEvaluations.sort((a, b) => (b.parsed.viral_score || 0) - (a.parsed.viral_score || 0));
    const bestEval = validEvaluations[0];
    const bestArticle = bestEval.article;
    const enhancedContext = `Summary: ${bestEval.parsed.summary}\nWhy it matters: ${bestEval.parsed.why_it_matters}`;
    
    console.log(`CRON: Selected article: "${bestArticle.title}" with score ${bestEval.parsed.viral_score}`);

    console.log("CRON: Generating LinkedIn post via OpenRouter...");
    const postContent = await generateLinkedInPost(bestArticle, enhancedContext, globalTimeout);

    console.log("CRON: Generating Pexels keyword...");
    const keyword = await generatePexelsKeyword(postContent, globalTimeout);
    console.log(`CRON: Keyword: ${keyword}`);

    console.log("CRON: Searching 1 image from Pexels...");
    const images = await searchImages(keyword);
    const bestImage = images[0];
    
    console.log("CRON: Downloading image buffer...");
    let imageBuffer: Buffer | null = await downloadImageBuffer(bestImage.src.large);

    console.log("CRON: Uploading image and publishing to LinkedIn...");
    const postId = await uploadAndPublishPost(postContent, imageBuffer);

    // Explicitly release the memory buffer after publishing to enforce memory constraints
    imageBuffer = null;

    console.log(`CRON: Successfully published to LinkedIn! Post ID: ${postId}`);

    return NextResponse.json({ success: true, postId });
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("CRON Error: Vercel Timeout Exceeded (55s)");
      return NextResponse.json({ success: false, error: "Vercel Execution Timeout Exceeded" }, { status: 504 });
    }
    console.error(`CRON Error: ${(error as Error).message}`);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
