import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (_, res) => {
  res.send("AI Reel backend running 🚀");
});

// ✅ STEP 1: generate script
app.post("/generate-script", async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Write a viral faceless reel script with hook, 5 scenes, CTA, captions, and voiceover lines.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const script = completion.choices[0].message.content;
    res.json({ script });
  } catch (error) {
    console.error(error);
    res.status(400).send("Script generation failed");
  }
});

// ✅ STEP 2: generate voiceover
app.post("/voiceover", async (req, res) => {
  try {
    const fakeVoiceUrl =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    res.json({ voiceUrl: fakeVoiceUrl });
  } catch (error) {
    console.error(error);
    res.status(400).send("Voice generation failed");
  }
});

// ✅ STEP 3: generate video
app.post("/generate-video", async (req, res) => {
  try {
    const { prompt, audioUrl, voiceUrl, audio, url } = req.body;

    const finalAudioUrl = audioUrl || voiceUrl || audio || url;

    if (!finalAudioUrl) {
      return res.status(400).send("Missing voice URL");
    }

    const stockVideoPath = "/tmp/stock-video.mp4";
    const outputPath = `/tmp/viral-reel-${Date.now()}.mp4`;

    if (!fs.existsSync(stockVideoPath)) {
      return res.status(400).send("Missing stock video file");
    }

    ffmpeg()
      .input(stockVideoPath)
      .input(finalAudioUrl)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-preset veryfast",
        "-movflags +faststart",
        "-pix_fmt yuv420p",
        "-shortest",
      ])
      .size("720x1280")
      .on("end", () => {
        console.log("VIDEO CREATED SUCCESSFULLY");
        return res.download(outputPath);
      })
      .on("error", (err) => {
        console.error("VIDEO ERROR:", err);
        return res.status(400).send(`FFmpeg failed: ${err.message}`);
      })
      .save(outputPath);
  } catch (error) {
    console.error("ROUTE ERROR:", error);
    return res.status(400).send(`Route failed: ${error.message}`);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});