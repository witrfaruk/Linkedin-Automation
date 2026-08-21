import { fetchWithRetry } from "./utils";

export async function publishPost(postContent: string) {
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
          shareMediaCategory: "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    })
  };

  const publishRes = await fetchWithRetry("https://api.linkedin.com/v2/ugcPosts", publishOptions);

  if (!publishRes.ok) {
    throw new Error(`LinkedIn Publish error: ${publishRes.statusText} - ${await publishRes.text()}`);
  }

  const publishData = await publishRes.json();
  return publishData.id;
}
