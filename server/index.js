import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const port = process.env.PORT || 8080;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const escapeDrawtext = (text = "") =>
  String(text)
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\\\'")
    .replace(/,/g, "\\,");

app.post("/generate", async (req, res) => {
  try {
    const { topic, style = "Motivational", tone = "Rich Mindset" } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Write a viral faceless reel script about ${topic}.
Format exactly:
HOOK
SCENES
CTA`,
        },
      ],
    });

    const script = completion.choices[0].message.content;
    res.json({ script });
  } catch (error) {
    console.error("Generate route error:", error);
    res.status(500).json({
      error: "Script generation failed",
      details: error.message,
    });
  }
});

app.post("/generate-voice", async (req, res) => {
  try {
    const { script } = req.body;

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: script,
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const audioPath = "/app/voiceover.mp3";

    fs.writeFileSync(audioPath, audioBuffer);

    res.json({
      success: true,
      audioUrl: "/voiceover.mp3",
      audioPath,
      bytes: audioBuffer.length,
    });
  } catch (error) {
    console.error("Voice route error:", error);
    res.status(500).json({
      error: "Voice generation failed",
      details: error.message,
    });
  }
});

app.post("/generate-video", async (req, res) => {
  try {
    const { script = "", captionText } = req.body;

    const audioPath = "/app/voiceover.mp3";
    const outputPath = "/app/final-reel.mp4";

    const safeCaption = escapeDrawtext(
      captionText || script.split("\n")[0] || "Success starts now"
    );

    ffmpeg()
      .input("color=c=black:s=1080x1920:d=6")
      .inputFormat("lavfi")
      .input(audioPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-pix_fmt yuv420p",
        "-movflags +faststart",
        "-shortest",
        `-vf drawtext=fontcolor=white:fontsize=42:text='${safeCaption}':x=(w-text_w)/2:y=h-220`,
      ])
      .save(outputPath)
      .on("end", () => {
        res.download(outputPath, "viral-reel.mp4");
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        res.status(500).json({
          error: "Video generation failed",
          details: err.message,
        });
      });
  } catch (error) {
    console.error("Video route crash:", error);
    res.status(500).json({
      error: "Video generation failed",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});