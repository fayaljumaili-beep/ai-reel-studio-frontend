import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";

dotenv.config();

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

console.log("KEY EXISTS:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✨ SCRIPT GENERATION
app.post("/generate", async (req, res) => {
  try {
    const { topic, voice, template } = req.body;

    const prompt = `
You are an elite viral faceless reel scriptwriter.

Create a premium short-form reel script about:
Topic: ${topic}
Voice: ${voice}
Template: ${template}

Return JSON:
{
  "hook": "string",
  "scenes": ["scene 1", "scene 2", "scene 3"],
  "cta": "string"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0].message.content;
    res.json(JSON.parse(result || "{}"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate script" });
  }
});

// 🎙️ VOICE MP3
app.post("/generate-voice", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="voiceover.mp3"'
    );

    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate voice" });
  }
});

// 🎬 NARRATED MP4 EXPORT
app.post("/generate-video", async (req, res) => {
  try {
    const { text } = req.body;

    const sampleVideoPath = path.join(process.cwd(), "sample.mp4");
    const audioPath = path.join(process.cwd(), "voiceover.mp3");
    const outputPath = path.join(process.cwd(), "final-reel.mp4");

    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text || "This is your AI generated faceless reel.",
    });

    const audioBuffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(audioPath, audioBuffer);

    ffmpeg(sampleVideoPath)
      .input(audioPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions(["-movflags", "+faststart", "-shortest"])
      .save(outputPath)
      .on("end", () => {
        res.download(outputPath, "viral-reel.mp4");
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: "FFmpeg merge failed" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Video generation failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});