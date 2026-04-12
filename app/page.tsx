"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const generateScript = async () => {
    if (!prompt.trim()) return alert("Enter a prompt");
    setLoading(true);

    try {
      const res = await fetch(`${API}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setScript(data.script || "No script generated");
    } catch {
      alert("Script generation failed");
    }

    setLoading(false);
  };

  const generateVoice = async () => {
    if (!script.trim()) return alert("Generate a script first");

    try {
      const res = await fetch(`${API}/voiceover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: script }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "voiceover.mp3";
      a.click();
    } catch {
      alert("Voice generation failed");
    }
  };

  const downloadVideo = async () => {
    if (!script.trim()) return alert("Generate a script first");

    try {
      const res = await fetch(`${API}/generate-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: script }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "viral-reel.mp4";
      a.click();
    } catch {
      alert("Video generation failed");
    }
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Faceless Reel Scripts in 5 Seconds</h1>

      <p>LIVE SAAS MODE 🚀</p>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your reel topic"
        style={{ width: 400, padding: 10 }}
      />

      <br />
      <br />

      <button onClick={generateScript} disabled={loading}>
        {loading ? "Generating..." : "✨ Generate Premium Reel Script"}
      </button>

      <button onClick={generateVoice} style={{ marginLeft: 10 }}>
        🎙 Generate AI Voiceover
      </button>

      <button onClick={downloadVideo} style={{ marginLeft: 10 }}>
        🎬 Download Narrated Reel
      </button>

      <h2 style={{ marginTop: 40 }}>Generated Output</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{script}</pre>
    </main>
  );
}