const express = require("express");
const fetch = require("node-fetch"); // only needed if Node < 18
const app = express();

app.use(express.json());

// OpenRouter API key (replace with your own)
const OPENROUTER_API_KEY = "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";

// Proxy route
app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await fetch("https://api.openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy failed" });
  }
});

// Use Railway assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
