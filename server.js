app.post("/v1/chat/completions", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    console.log("DeepSeek response status:", response.status);
    const data = await response.text(); // use text first for debugging
    console.log("DeepSeek response data:", data);

    res.send(data); // just forward raw text for now
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Salad proxy running on port ${PORT}`));
