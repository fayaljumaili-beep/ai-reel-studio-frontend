const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// 🎯 GENERATE SCRIPT (NOW RETURNS SCENE JSON)
app.post("/generate", async (req, res) => {
  try {
    const { topic, voice, template } = req.body;

    const prompt = `
Create a viral faceless reel script about: ${topic}
Style: ${voice}
Template: ${template}

Make it:
- strong hook (1 line)
- 4 short punchy body lines
- strong CTA (last line)

Each line on a new line.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const script = completion.choices[0].message.content;

    const lines = script
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

    const hook = lines[0] || "";
    const cta = lines[lines.length - 1] || "";
    const scenes = lines.slice(1, -1);

    res.json({
      hook,
      scenes,
      cta,
      fullScript: script
    });

  } catch (error) {
    console.error("❌ Generate error:", error);
    res.status(500).json({ error: "Failed to generate script" });
  }
});


// 🎬 VIDEO DOWNLOAD (SAMPLE FOR NOW)
app.post("/generate-video", (req, res) => {
  try {
    const filePath = path.join(__dirname, "sample.mp4");

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: "sample.mp4 missing in server folder"
      });
    }

    return res.download(filePath, "viral-reel.mp4");

  } catch (error) {
    console.error("❌ Video error:", error);
    res.status(500).json({ error: "Video generation failed" });
  }
});


// 🚀 START SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});