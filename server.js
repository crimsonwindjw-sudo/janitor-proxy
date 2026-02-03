import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = "sk-66781992d71e483fa0f31442eb8dbc9e";

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

    // debug
    console.log("DeepSeek status:", response.status);

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Salad proxy running on port ${PORT}`));
