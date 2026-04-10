const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", (req, res) => {
  const { topic, voice, template } = req.body;

  const script = `Hook: Want to know ${topic}?

Main:
Here are 3 mindset shifts used by highly successful people.
1. Stay disciplined
2. Think long term
3. Execute daily

CTA:
Follow for more ${template} content.`;

  return res.json({
    success: true,
    script,
    topic,
    voice,
    template,
  });
});

app.post("/generate-video", (req, res) => {
  const outputPath = "/tmp/viral-reel.mp4";

  const cmd =
    `ffmpeg -y -f lavfi -i color=c=black:s=1080x1920:d=8 ` +
    `-pix_fmt yuv420p ${outputPath}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("FFMPEG ERROR:", stderr);
      return res.status(500).json({
        error: "Video generation failed",
        details: stderr,
      });
    }

    return res.download(outputPath, "viral-reel.mp4");
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});