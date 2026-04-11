import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
Create a short viral faceless reel script about: "${topic}"

Format:
HOOK
SCENES (3 short scenes)
CTA
VOICEOVER

Make it punchy, motivational, and TikTok style.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const script = response.choices[0].message.content;
    res.json({ script });
  } catch (error) {
    console.error("❌ Script generation error:", error);
    res.status(500).json({
      error: "Failed to generate script",
      details: error.message,
    });
  }
});

app.post("/generate-voice", async (req, res) => {
  try {
    const { text } = req.body;

    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text || "This is your AI generated faceless reel.",
    });

    const audioBuffer = Buffer.from(await mp3.arrayBuffer());
    const audioPath = path.join(process.cwd(), "voiceover.mp3");

    fs.writeFileSync(audioPath, audioBuffer);

    res.json({
      success: true,
      audioUrl: "/voiceover.mp3",
    });
  } catch (error) {
    console.error("❌ Voice generation error:", error);
    res.status(500).json({
      error: "Voice generation failed",
      details: error.message,
    });
  }
});

app.get("/voiceover.mp3", (req, res) => {
  const audioPath = path.join(process.cwd(), "voiceover.mp3");

  if (!fs.existsSync(audioPath)) {
    return res.status(404).json({ error: "Voice file not found" });
  }

  res.sendFile(audioPath);
});

app.post("/generate-video", async (req, res) => {
  try {
    const audioPath = path.join(process.cwd(), "voiceover.mp3");
    const outputPath = path.join(process.cwd(), "final-reel.mp4");

    console.log("🎵 audio path:", audioPath);
    console.log("📦 output path:", outputPath);

    ffmpeg()
      .input("color=c=black:s=1080x1920:d=30")
      .inputFormat("lavfi")
      .input(audioPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-pix_fmt yuv420p",
        "-movflags +faststart",
        "-shortest",
      ])
      .save(outputPath)
      .on("end", () => {
        console.log("✅ video created:", outputPath);

        setTimeout(() => {
          if (!fs.existsSync(outputPath)) {
            return res.status(500).json({
              error: "Output file missing after render",
            });
          }

          res.download(outputPath, "viral-reel.mp4");
        }, 500);
      })
      .on("error", (err, stdout, stderr) => {
        console.error("❌ FFMPEG ERROR:", err.message);
        console.error("📤 STDOUT:", stdout);
        console.error("📥 STDERR:", stderr);

        res.status(500).json({
          error: "FFmpeg merge failed",
          details: stderr || err.message,
        });
      });
  } catch (error) {
    console.error("❌ Video route crash:", error);
    res.status(500).json({
      error: "Video generation failed",
      details: error.message,
    });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});