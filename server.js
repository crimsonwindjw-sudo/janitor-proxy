// server.js
import express from "express";
import cors from "cors";

const app = express();

// Allow browser requests
app.use(cors());
app.use(express.json());

// Use environment variable for API key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error("ERROR: DEEPSEEK_API_KEY is not set in environment variables!");
  process.exit(1);
}

// Proxy route
app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    console.log("DeepSeek status:", response.status);

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Salad proxy running on port ${PORT}`));
