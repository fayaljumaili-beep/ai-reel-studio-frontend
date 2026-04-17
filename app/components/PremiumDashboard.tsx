"use client";

import { useState } from "react";

export default function PremiumDashboard() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleGenerateScript = async () => {
    try {
      setLoading(true);
      setScript("");

      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setScript(data.script);
    } catch (err) {
      console.error(err);
      setScript("❌ Failed to generate script");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceover = async () => {
    try {
      if (!script) return alert("Generate a script first");

      setPlaying(true);

      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audio.play();

      audio.onended = () => setPlaying(false);
    } catch (err) {
      console.error(err);
      alert("❌ Voice failed");
      setPlaying(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!script) return alert("Generate a script first");

      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "voiceover.mp3";
      a.click();
    } catch (err) {
      console.error(err);
      alert("❌ Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-4xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Reel Studio
          </h1>
          <p className="text-zinc-400 mt-2">
            Turn ideas into viral short-form content ⚡
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">

          {/* INPUT */}
          <input
            type="text"
            placeholder="Enter topic (e.g. how to become successful)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 mb-4 outline-none focus:ring-2 focus:ring-white/20"
          />

          {/* BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">

            <button
              onClick={handleGenerateScript}
              className="bg-white text-black font-semibold py-3 rounded-xl hover:scale-[1.02] transition"
            >
              {loading ? "Generating..." : "Generate Script"}
            </button>

            <button
              onClick={handleVoiceover}
              className="bg-blue-600 hover:bg-blue-500 font-semibold py-3 rounded-xl transition"
            >
              {playing ? "Playing..." : "Generate Voice"}
            </button>

            <button
              onClick={handleDownload}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl transition"
            >
              Download MP3
            </button>

          </div>

          {/* OUTPUT */}
          {script && (
            <div className="bg-black/40 border border-white/10 rounded-xl p-5 whitespace-pre-wrap text-sm leading-relaxed">
              {script}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}