"use client";

import { useState } from "react";

const BACKEND_URL =
  "https://ai-reel-studio-frontend-production.up.railway.app";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState("");
  const [voiceUrl, setVoiceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const generateScript = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setScript(data.script || "");
    } catch (error) {
      console.error("SCRIPT ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateVoice = async () => {
    try {
      setVoiceLoading(true);

      const response = await fetch(`${BACKEND_URL}/voiceover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: script,
        }),
      });

      const data = await response.json();
      setVoiceUrl(data.audioUrl || "");
    } catch (error) {
      console.error("VOICE ERROR:", error);
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setVideoLoading(true);

      const response = await fetch(`${BACKEND_URL}/generate-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          audioUrl: voiceUrl,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DOWNLOAD ERROR:", errorText);
        alert("Video generation failed. Check Railway logs.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "viral-reel.mp4";
      a.click();
    } catch (error) {
      console.error("VIDEO ERROR:", error);
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>Faceless Reel Scripts in 5 Seconds</h1>

      <p>LIVE SAAS MODE 🚀</p>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter topic"
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          fontSize: 16,
        }}
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={generateScript} disabled={loading}>
          {loading ? "Generating..." : "✨ Generate Premium Reel Script"}
        </button>

        <button onClick={generateVoice} disabled={voiceLoading || !script}>
          {voiceLoading ? "Generating Voice..." : "🎙 Generate AI Voiceover"}
        </button>

        <button
          onClick={handleDownload}
          disabled={videoLoading || !voiceUrl}
        >
          {videoLoading ? "Rendering..." : "🎬 Download Narrated Reel"}
        </button>
      </div>

      <h2>Generated Output</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: 1.6,
          fontSize: 16,
        }}
      >
        {script}
      </pre>

      {voiceUrl && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={voiceUrl} />
        </div>
      )}
    </main>
  );
}