// api/generate-script.js
//
// This is a Vercel serverless function. It sits between your public
// tool (on GitHub Pages) and Anthropic's API. Your real API key lives
// only here, as a private environment variable in Vercel, it is
// never visible in the tool's HTML/JS and never committed to GitHub.
//
// The tool calls THIS endpoint instead of api.anthropic.com directly.

export default async function handler(req, res) {
  // Allow requests from your GitHub Pages site only.
  // Replace the value below with your actual GitHub Pages origin.
  const ALLOWED_ORIGIN = "https://opewithleah.github.io";

  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browsers send a preflight OPTIONS request before the real POST.
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  try {
    const { system, messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Missing messages in request body." });
    }

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
       model: "claude-sonnet-5",
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      console.error("Anthropic API error:", data);
      return res.status(anthropicResponse.status).json({
        error: data.error?.message || "The script generator returned an error."
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Something went wrong generating the script." });
  }
}
