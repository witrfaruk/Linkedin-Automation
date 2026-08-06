import { NextResponse } from "next/server";
import { getArticles } from "@/lib/tavily";
import { chooseBestArticle, generateLinkedInPost, generatePexelsKeyword } from "@/lib/openrouter";
import { searchImages, downloadImageBuffer } from "@/lib/pexels";
import { uploadAndPublishPost } from "@/lib/linkedin";
import { withTimeout } from "@/lib/utils";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = body.password;
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const manualSecret = process.env.MANUAL_RUN_SECRET;

  if (!manualSecret || password !== manualSecret) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const log = (msg: string) => {
        console.log(msg);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ log: msg })}\n\n`));
      };
      
      const sendSuccess = () => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ success: true })}\n\n`));
      };

      const sendError = (error: string) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error })}\n\n`));
      };

      try {
        const globalTimeout = withTimeout(new AbortController().signal, 55000);

        log("Fetching top 30 articles via Tavily...");
        const articles = await getArticles();
        log(`Fetched ${articles.length} articles.`);

        log("Evaluating all articles via One Chooser AI in a single pass to find the absolute best...");
        const result = await chooseBestArticle(articles, globalTimeout);
        let parsed;
        try {
          parsed = JSON.parse(result);
        } catch(e) {
          throw new Error("One Chooser AI failed to return valid JSON");
        }

        if (parsed.best_article_index === undefined || parsed.best_article_index < 0 || parsed.best_article_index >= articles.length) {
          throw new Error("One Chooser AI returned an invalid article index");
        }

        const bestArticle = articles[parsed.best_article_index];
        const enhancedContext = `Summary: ${parsed.summary}\nWhy it matters: ${parsed.why_it_matters}`;
        
        log(`Selected article: "${bestArticle.title}" with score ${parsed.viral_score}`);

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

        sendSuccess();
        controller.close();
      } catch (error: any) {
        if (error.name === "AbortError") {
          const msg = "Error: Vercel Execution Timeout Exceeded (55s)";
          log(msg);
          sendError(msg);
        } else {
          const msg = `Error: ${(error as Error).message}`;
          log(msg);
          sendError(msg);
        }
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
