import { getArticles } from "../lib/tavily";
import { chooseBestArticle, generateLinkedInPost, generatePexelsKeyword } from "../lib/openrouter";
import { searchImages, downloadImageBuffer } from "../lib/pexels";
import { uploadAndPublishPost } from "../lib/linkedin";

async function run() {
  const log = (msg: string) => {
    console.log(`[${new Date().toISOString()}] ${msg}`);
  };

  try {
    log("Fetching top 30 articles via Tavily...");
    const articles = await getArticles();
    log(`Fetched ${articles.length} articles.`);

    log("Evaluating all articles via One Chooser AI in a single pass to find the absolute best...");
    
    // No timeout limits inside GitHub Actions
    const result = await chooseBestArticle(articles);
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
  } catch (error: any) {
    log(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

run();
