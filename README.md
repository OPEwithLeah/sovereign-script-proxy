# Sovereign Self Script Builder, API Proxy

This tiny project holds your Anthropic API key privately and forwards
script-generation requests from your public tool to Anthropic's API.
It exists because a static GitHub Pages site cannot hold a secret key
without exposing it to anyone who views the page source.

## Deploy steps (one time)

1. **Create a new GitHub repo** (already done, this one).

2. **Go to vercel.com → Add New Project → Import** your
   `sovereign-script-proxy` repo. Vercel auto-detects the `/api`
   folder as serverless functions, you don't need to configure
   anything else. Click **Deploy**.

3. **Add your API key as an environment variable:**
   In the Vercel project → **Settings → Environment Variables**, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com (starts with `sk-ant-`)

   Then redeploy (Vercel prompts you to after adding a variable).

4. **Copy your new function's URL.** It will look like:
   `https://sovereign-script-proxy.vercel.app/api/generate-script`

   Send that URL back and the HTML tool's fetch call will be updated
   to use it instead of calling Anthropic directly.

5. **Confirm the allowed origin.** Inside `api/generate-script.js`,
   `ALLOWED_ORIGIN` is set to `https://opewithleah.github.io`, this
   is what lets your GitHub Pages site (and only that site) call this
   function. If your tools ever move to a different domain, this line
   needs to be updated too.

## What this does NOT do

- It does not store any of your clients' answers or scripts anywhere.
  It only relays a single request and response, then forgets it.
- It does not touch your GitHub Pages hosting at all, your tools
  stay exactly where they are.
