require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

/**
 * Global CORS
 */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/**
 * Health route
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Reel Studio backend running",
  });
});

/**
 * Generate route
 */
app.options("/generate", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.sendStatus(200);
});

app.post("/generate", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const { topic, voice, template } = req.body;

    return res.json({
      success: true,
      message: "Generate route is working",
      topic,
      voice,
      template,
    });
  } catch (error) {
    console.error("Generate route error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
✅ ALSO ADD THIS RIGHT ABOVE IT

Place this above the POST route:

app.options("/generate", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.sendStatus(200);
});
🚀 THEN PUSH IMMEDIATELY

Run:

git add server/index.js
git commit -m "force cors headers inside generate route"
git push origin main
🎯 WHY THIS SHOULD FINALLY WORK

Your middleware CORS is probably loading, but Railway’s proxy/preflight path is stripping it.

By setting the headers inside both OPTIONS and POST, we force the browser-required headers on the exact route being called.

This usually kills the final stubborn CORS issue.

After Railway turns green, test the newest Vercel deployment again.

This should be the real last fix 🚀

/**
 * Railway server start
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});