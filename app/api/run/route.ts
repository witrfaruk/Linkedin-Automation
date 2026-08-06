import { NextResponse } from "next/server";
import { getArticles } from "@/lib/tavily";
import { chooseBestArticle, generateLinkedInPost, generatePexelsKeyword } from "@/lib/openrouter";
import { searchImages, downloadImageBuffer } from "@/lib/pexels";
import { uploadAndPublishPost } from "@/lib/linkedin";
import { withTimeout } from "@/lib/utils";

export const maxDuration = 60; 

export async function POST(req: Request) {
  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(msg);
    console.log(msg);
  };

  try {
    const { password } = await req.json();
    const manualSecret = process.env.MANUAL_RUN_SECRET;

    if (!manualSecret || password !== manualSecret) {
      log("Authentication failed. Invalid password.");
      return NextResponse.json({ success: false, error: "Unauthorized", logs }, { status: 401 });
    }

    const globalTimeout = withTimeout(new AbortController().signal, 55000);

    log("Fetching top 5 articles via Tavily...");
    const articles = await getArticles();
    log(`Fetched ${articles.length} articles.`);

    log("Evaluating articles via One Chooser AI to find the best...");
    const evaluations = await Promise.allSettled(
      articles.map(async (article) => {
        const result = await chooseBestArticle(article, globalTimeout);
        if (result.trim().toUpperCase() === "SKIP") return null;
        try {
          const parsed = JSON.parse(result);
          return { article, parsed };
        } catch (e) {
          return null; 
        }
      })
    );

    const validEvaluations = evaluations
      .filter((e): e is PromiseFulfilledResult<{ article: any, parsed: any }> => e.status === "fulfilled" && e.value !== null)
      .map(e => e.value);

    if (validEvaluations.length === 0) {
      log("All 5 articles were rejected (SKIP). Stopping automation.");
      return NextResponse.json({ success: true, skipped: true, logs });
    }

    validEvaluations.sort((a, b) => (b.parsed.viral_score || 0) - (a.parsed.viral_score || 0));
    const bestEval = validEvaluations[0];
    const bestArticle = bestEval.article;
    const enhancedContext = `Summary: ${bestEval.parsed.summary}\nWhy it matters: ${bestEval.parsed.why_it_matters}`;
    
    log(`Selected article: "${bestArticle.title}" with score ${bestEval.parsed.viral_score}`);

    log("Generating LinkedIn post via OpenRouter (Writer)...");
    const postContent = await generateLinkedInPost(bestArticle, enhancedContext, globalTimeout);
    log("Post content generated.");

    log("Generating Pexels keyword...");
    const keyword = await generatePexelsKeyword(postContent, globalTimeout);
    log(`Generated keyword: ${keyword}`);

    log("Searching exactly 1 image from Pexels...");
    const images = await searchImages(keyword);
    const bestImage = images[0];

    log("Downloading image buffer...");
    let imageBuffer: Buffer | null = await downloadImageBuffer(bestImage.src.large);

    log("Uploading image and publishing to LinkedIn...");
    const postId = await uploadAndPublishPost(postContent, imageBuffer);
    
    // Release memory buffer explicitly
    imageBuffer = null;
    
    log(`Successfully published to LinkedIn! Post ID: ${postId}`);

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    if (error.name === "AbortError") {
      log("Error: Vercel Execution Timeout Exceeded (55s)");
      return NextResponse.json({ success: false, error: "Vercel Execution Timeout Exceeded", logs }, { status: 504 });
    }
    log(`Error: ${(error as Error).message}`);
    return NextResponse.json({ success: false, error: (error as Error).message, logs }, { status: 500 });
  }
}
