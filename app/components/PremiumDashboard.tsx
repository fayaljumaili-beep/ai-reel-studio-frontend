"use client";

import { useState } from "react";

export default function PremiumDashboard() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleGenerateScript = async () => {
    setLoading(true);
    const res = await fetch("/api/generate-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setScript(data.script);
    setLoading(false);
  };

  const handleVoice = async () => {
    setPlaying(true);
    const res = await fetch("/api/generate-voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: script }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => setPlaying(false);
  };

  const handleDownload = async () => {
    const res = await fetch("/api/generate-voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: script }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "voiceover.mp3";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold mb-4">
          🚀 AI Reel Studio
        </h1>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your topic..."
          className="w-full p-3 mb-4 rounded-lg bg-black/40 border border-white/10 outline-none"
        />

        <div className="flex gap-3 mb-4">
          <button
            onClick={handleGenerateScript}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
          >
            {loading ? "Generating..." : "Generate Script"}
          </button>

          <button
            onClick={handleVoice}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            {playing ? "Playing..." : "Generate Voiceover"}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
          >
            Download MP3
          </button>
        </div>

        <div className="bg-black/40 p-4 rounded-lg whitespace-pre-wrap text-sm">
          {script || "Your generated script will appear here..."}
        </div>
      </div>
    </div>
  );
}