require("dotenv").config({
  path: require("path").resolve(__dirname, ".env"),
});

const OpenAI = require("openai").default;
const path = require("path");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const app = express();

// --- middleware ---
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());

app.use(express.json());

// --- clients ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- helpers ---
function createVideo(audioPath, videoPath) {
  const outputPath = path.join(__dirname, `output-${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions(["-map 0:v", "-map 1:a", "-shortest", "-y"])
      .videoCodec("libx264")
      .audioCodec("aac")
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => {
        console.error("FFMPEG ERROR:", err.message);
        reject(err);
      })
      .run();
  });
}

// --- routes ---
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

app.options("/generate, cors());" 

app.post("/generate", cors(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const { topic, voice, template } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // Example starter response (safe test mode)
    // Replace this later with your OpenAI + ffmpeg logic
    return res.json({
      success: true,
      message: "Generate route is working",
      topic,
      voice,
      template
    });

  } catch (error) {
    console.error("Generate route error:", error);
    return res.status(500).json({
      error: "Failed to generate reel"
    });
  }
});
    console.log("STEP 2: script generated");

    const script =
      completion.choices?.[0]?.message?.content ||
      `Stay focused on ${topic} and never give up.`;

    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: script,
        model_id: "eleven_multilingual_v2",
      },
      {
        headers: {
          "xi-api-key": process.env.API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
      }
    );

    console.log("STEP 3: audio generated");

    const audioPath = path.join(__dirname, "output.mp3");
    fs.writeFileSync(audioPath, ttsResponse.data);

    let selectedVideo = "bg.mp4";

    if (lowerTopic.includes("money")) {
      selectedVideo = "mindset.mp4";
    } else if (lowerTopic.includes("gym")) {
      selectedVideo = "gym.mp4";
    } else if (lowerTopic.includes("love")) {
      selectedVideo = "love.mp4";
    } else if (lowerTopic.includes("business")) {
      selectedVideo = "business.mp4";
    }

    const videoPath = path.join(__dirname, "assets", selectedVideo);
    const outputPath = await createVideo(audioPath, videoPath);

    console.log("STEP 4: video created");

    return res.download(outputPath);
  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Video generation failed",
      details: error.message,
    });
  }
});

// --- start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
