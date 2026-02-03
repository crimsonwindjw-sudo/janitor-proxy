import express from "express";
import cors from "cors";

const app = express();

// Allow all origins (for testing with Janitor/browser)
app.use(cors());
app.use(express.json());

// Use your API key from Railway environment variables
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error("ERROR: DEEPSEEK_API_KEY is missing!");
  process.exit(1);
}

app.post("/v1/chat/completions", async (req, res) => {
  try {
    console.log("Incoming request:", req.body);

    // Minimal DeepSeek payload for testing
    const payload = {
      model: "salad",
      messages: req.body.messages || [{ role: "user", content: "Hello" }],
      temperature: 0.7,
      max_tokens: 100,
    };

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("DeepSeek status:", response.status);

    // Safely parse response
    let data;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text();
      console.error("Failed to parse JSON, raw response:", text);
      return res.status(502).json({ error: "DeepSeek returned invalid JSON", raw: text });
    }

    res.json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Salad proxy running on port ${PORT}`));
