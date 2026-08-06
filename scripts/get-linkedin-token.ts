import fs from 'fs';
import http from 'http';

// 1. Read credentials manually from .env.local so we don't need any extra dependencies
const envFile = fs.readFileSync('.env.local', 'utf-8');
let CLIENT_ID = '';
let CLIENT_SECRET = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('LINKEDIN_CLIENT_ID=')) CLIENT_ID = line.substring('LINKEDIN_CLIENT_ID='.length).trim();
  if (line.startsWith('LINKEDIN_CLIENT_SECRET=')) CLIENT_SECRET = line.substring('LINKEDIN_CLIENT_SECRET='.length).trim();
});

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET in .env.local");
  process.exit(1);
}

const REDIRECT_URI = "http://localhost:3000/callback";

// 2. We request the specific scopes needed to post to an organization
const SCOPE = "openid profile email w_organization_social w_member_social"; 

const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=123456&scope=${encodeURIComponent(SCOPE)}`;

console.log("\n========================================================");
console.log("STEP 1: ADD REDIRECT URI TO LINKEDIN");
console.log("========================================================");
console.log("Go to your LinkedIn Developer Portal -> Your App -> 'Auth' tab");
console.log(`Find 'OAuth 2.0 settings' and add this EXACT URL to the Authorized redirect URIs:\n`);
console.log(`➡️  ${REDIRECT_URI}  ⬅️\n`);
console.log("(Make sure to click the 'Update' button to save it!)\n");

console.log("========================================================");
console.log("STEP 2: AUTHORIZE THE APP");
console.log("========================================================");
console.log("Click this link (or copy-paste it into your browser) to log in to LinkedIn:\n");
console.log(authUrl + "\n");
console.log("Waiting for you to log in in your browser...\n");

// 3. Start local server to catch the redirect
const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url || '', `http://localhost:3000`);
  
  if (reqUrl.pathname === '/callback') {
    const code = reqUrl.searchParams.get('code');
    const error = reqUrl.searchParams.get('error');

    if (error) {
      res.writeHead(400);
      res.end(`OAuth Error: ${error}`);
      console.error(`OAuth Error: ${error}`);
      process.exit(1);
    }

    if (code) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end("<h1>Success!</h1><p>You can close this tab and check your VS Code terminal for your Refresh Token.</p>");
      
      console.log("✅ Received authorization code! Exchanging for refresh token...\n");
      
      try {
        const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
          })
        });

        const tokenData = await tokenRes.json();
        
        if (tokenData.refresh_token) {
          console.log("🎉 SUCCESS! Here is your brand new Refresh Token:\n");
          console.log("========================================================");
          console.log(tokenData.refresh_token);
          console.log("========================================================\n");
          console.log("Copy this massive string and add it to your GitHub Secrets as LINKEDIN_REFRESH_TOKEN!");
        } else {
          console.error("❌ Failed to get refresh token. LinkedIn responded with:\n", tokenData);
        }
      } catch (err) {
        console.error("Error exchanging token:", err);
      }
      
      process.exit(0);
    }
  }
});

server.listen(3000, () => {
  // Server is running and waiting
});
