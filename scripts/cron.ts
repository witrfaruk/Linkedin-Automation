import { getArticles } from "../lib/tavily";
import { chooseBestArticle, generateLinkedInPost, generatePexelsKeyword } from "../lib/openrouter";
import { searchImages, downloadImageBuffer } from "../lib/pexels";
import { uploadAndPublishPost } from "../lib/linkedin";
import fs from "fs";
import path from "path";

async function run() {
  const log = (msg: string) => {
    console.log(`[${new Date().toISOString()}] ${msg}`);
  };

  try {
    log("Fetching top 30 articles via Tavily...");
    const articles = await getArticles();
    log(`Fetched ${articles.length} articles.`);

    const historyPath = path.join(process.cwd(), "data", "history.json");
    let history: { url: string, timestamp: number }[] = [];
    if (fs.existsSync(historyPath)) {
      const parsed = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
      // Handle backward compatibility if previous history was just an array of strings
      history = parsed.map((item: any) => 
        typeof item === "string" ? { url: item, timestamp: Date.now() } : item
      );
    }

    // Keep only history from the last 24 hours
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    history = history.filter(item => (Date.now() - item.timestamp) < ONE_DAY_MS);

    // If history is completely empty after filtering out old posts, delete the file to keep project clean
    if (history.length === 0 && fs.existsSync(historyPath)) {
      fs.unlinkSync(historyPath);
      log("Deleted old history.json completely to prevent project size from growing.");
    }

    const historyUrls = history.map(h => h.url);
    const newArticles = articles.filter(a => !historyUrls.includes(a.url));
    log(`Filtered out ${articles.length - newArticles.length} previously posted articles. ${newArticles.length} new articles remaining.`);
    
    if (newArticles.length === 0) {
      log("No new articles to post right now.");
      process.exit(0);
    }

    log("Evaluating all articles via One Chooser AI in a single pass to find the absolute best...");
    
    // No timeout limits inside GitHub Actions
    const result = await chooseBestArticle(newArticles);
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch(e) {
      throw new Error("One Chooser AI failed to return valid JSON");
    }

    if (parsed.best_article_index === undefined || parsed.best_article_index < 0 || parsed.best_article_index >= newArticles.length) {
      throw new Error("One Chooser AI returned an invalid article index");
    }

    const bestArticle = newArticles[parsed.best_article_index];
    const enhancedContext = `Summary: ${parsed.summary}\nWhy it matters: ${parsed.why_it_matters}`;
    
    log(`Selected article: "${bestArticle.title}" with score ${parsed.viral_score}`);

    log("Generating LinkedIn post via OpenRouter (Writer)...");
    const postContent = await generateLinkedInPost(bestArticle, enhancedContext);
    log("Post content generated.");

    log("Generating Pexels keyword...");
    const keyword = await generatePexelsKeyword(postContent);
    log(`Generated keyword: ${keyword}`);

    log("Searching exactly 1 image from Pexels...");
    const images = await searchImages(keyword);
    const bestImage = images[0];

    log("Downloading image buffer...");
    let imageBuffer: Buffer | null = await downloadImageBuffer(bestImage.src.large);

    log("Uploading image and publishing to LinkedIn...");
    const postId = await uploadAndPublishPost(postContent, imageBuffer);
    
    imageBuffer = null;
    
    log(`Successfully published to LinkedIn! Post ID: ${postId}`);

    if (!fs.existsSync(path.dirname(historyPath))) {
      fs.mkdirSync(path.dirname(historyPath), { recursive: true });
    }
    history.push({ url: bestArticle.url, timestamp: Date.now() });
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    log("Saved article URL and timestamp to history.json to prevent duplicate posts within 24 hours.");

  } catch (error: any) {
    log(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

run();
