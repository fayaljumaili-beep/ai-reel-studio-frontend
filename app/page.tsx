"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [voiceUrl, setVoiceUrl] = useState("");

  const API =
    "https://ai-reel-studio-frontend-production.up.railway.app";

  const generateScript = async () => {
    const res = await fetch(`${API}/generate-script`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setScript(data.script);
  };

  const generateVoice = async () => {
    const res = await fetch(`${API}/voiceover`, {
      method: "POST",
    });

    const data = await res.json();
    setVoiceUrl(data.voiceUrl);
  };

  const downloadVideo = async () => {
    const res = await fetch(`${API}/generate-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      alert("Video generation failed");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "viral-reel.mp4";
    a.click();
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Faceless Reel SaaS 🚀</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter reel topic"
        style={{ padding: 10, width: 400 }}
      />

      <br />
      <br />

      <button onClick={generateScript}>Generate Premium Reel Script</button>
      <button onClick={generateVoice} style={{ marginLeft: 10 }}>
        Generate AI Voiceover
      </button>
      <button onClick={downloadVideo} style={{ marginLeft: 10 }}>
        Download Narrated Reel
      </button>

      <h2>Generated Output</h2>
      <pre>{script}</pre>

      {voiceUrl && (
        <>
          <h2>Generated Voice</h2>
          <audio controls src={voiceUrl} />
        </>
      )}
    </main>
  );
}