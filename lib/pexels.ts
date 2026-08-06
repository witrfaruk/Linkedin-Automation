import { fetchWithRetry } from "./utils";

export async function searchImages(keyword: string) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error("PEXELS_API_KEY is not set");

  const searchRes = await fetchWithRetry(`https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`, {
    headers: {
      "Authorization": apiKey
    }
  });

  if (!searchRes.ok) {
    throw new Error(`Pexels Search API error: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  if (!searchData.photos || searchData.photos.length === 0) {
    throw new Error("No images found on Pexels for keyword: " + keyword);
  }

  return searchData.photos;
}

export async function downloadImageBuffer(imageUrl: string) {
  const imgRes = await fetchWithRetry(imageUrl, {});
  if (!imgRes.ok) {
    throw new Error(`Failed to download image from Pexels: ${imgRes.statusText}`);
  }

  const arrayBuffer = await imgRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
