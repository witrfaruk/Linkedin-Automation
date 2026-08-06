import { fetchWithRetry } from "./utils";

export async function uploadAndPublishPost(postContent: string, imageBuffer: Buffer) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const refreshToken = process.env.LINKEDIN_REFRESH_TOKEN;
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

  if (!clientId || !clientSecret || !refreshToken || !orgId) {
    throw new Error("LinkedIn credentials are not fully set");
  }

  // 1. Get Access Token via Refresh Token Flow (3-legged OAuth required for Organization posting)
  const tokenRes = await fetchWithRetry("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`LinkedIn Token error: ${tokenRes.statusText}`);
  }
  
  const tokenData = await tokenRes.json();
  const validAccessToken = tokenData.access_token;
  const author = `urn:li:organization:${orgId}`;

  // 2. Register Upload
  const initRes = await fetchWithRetry("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${validAccessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: author,
        serviceRelationships: [
          {
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent"
          }
        ]
      }
    })
  });

  if (!initRes.ok) {
    throw new Error(`LinkedIn Init Upload error: ${initRes.statusText}`);
  }

  const initData = await initRes.json();
  const uploadUrl = initData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
  const asset = initData.value.asset;

  // 3. Upload Image
  const uploadRes = await fetchWithRetry(uploadUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${validAccessToken}`,
      "Content-Type": "application/octet-stream",
    },
    body: imageBuffer as any,
  });

  if (!uploadRes.ok) {
    throw new Error(`LinkedIn Image Upload error: ${uploadRes.statusText}`);
  }

  // LinkedIn requires the asset to process before publishing.
  // We use fetchWithRetry specifically on the publish endpoint, which handles 400s if the asset isn't ready.
  const publishOptions = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${validAccessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: postContent
          },
          shareMediaCategory: "IMAGE",
          media: [
            {
              status: "READY",
              description: {
                text: "Auto-generated image"
              },
              media: asset
            }
          ]
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    })
  };

  // We write a custom retry loop specifically for the race condition (400 Bad Request)
  let retries = 3;
  let publishRes;
  while (retries > 0) {
    publishRes = await fetch("https://api.linkedin.com/v2/ugcPosts", publishOptions);
    if (publishRes.ok) break;
    
    // If it's a 400 (likely asset not ready), we wait and retry
    if (publishRes.status === 400 || publishRes.status === 422) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      retries--;
    } else {
      throw new Error(`LinkedIn Publish error: ${publishRes.statusText} - ${await publishRes.text()}`);
    }
  }

  if (!publishRes || !publishRes.ok) {
    throw new Error(`LinkedIn Publish failed after retries: ${publishRes?.statusText}`);
  }

  const publishData = await publishRes.json();
  return publishData.id;
}
