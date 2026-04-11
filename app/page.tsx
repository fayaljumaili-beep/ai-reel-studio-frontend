"use client";

import { useState } from "react";

const API_BASE = "http://localhost:8080";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [voice, setVoice] = useState("Motivational");
  const [template, setTemplate] = useState("Rich Mindset");
  const [scriptResult, setScriptResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [audioUrl, setAudioUrl] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setAudioUrl("");

      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          voice,
          template,
        }),
      });

      if (!res.ok) throw new Error("Script generation failed");

      const data = await res.json();
      setScriptResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate script");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    try {
      if (!scriptResult) {
        alert("Generate a script first");
        return;
      }

      setVoiceLoading(true);

      const narration = [
        scriptResult.hook,
        ...(scriptResult.scenes || []),
        scriptResult.cta,
      ].join(". ");

      const res = await fetch(`${API_BASE}/generate-voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: narration }),
      });

      if (!res.ok) throw new Error("Voiceover failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      setAudioUrl(url);
    } catch (error) {
      console.error(error);
      alert("Voice generation failed");
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!scriptResult) {
        alert("Generate a script first");
        return;
      }

      const narration = [
        scriptResult.hook,
        ...(scriptResult.scenes || []),
        scriptResult.cta,
      ].join(". ");

      const res = await fetch(`${API_BASE}/generate-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: narration }),
      });

      if (!res.ok) throw new Error("Video failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "viral-reel.mp4";
      a.click();
    } catch (error) {
      console.error(error);
      alert("Video generation failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-white flex justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl bg-[#111827] p-8 shadow-2xl border border-white/10">
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Faceless Reel Scripts in 5 Seconds
          </h1>

          <p className="text-red-400 font-bold mb-4">
            LOCAL BACKEND TEST MODE
          </p>

          <p className="text-gray-300 mb-8 text-lg">
            Generate scroll-stopping hooks, body scripts, CTAs, and export them
            as downloadable MP4 reels with AI narration.
          </p>

          <div className="space-y-4">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your reel topic..."
              className="w-full rounded-2xl bg-[#1F2937] p-4 outline-none border border-white/10"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="rounded-2xl bg-[#1F2937] p-4 border border-white/10"
              >
                <option>Motivational</option>
                <option>Luxury</option>
                <option>Authority</option>
              </select>

              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="rounded-2xl bg-[#1F2937] p-4 border border-white/10"
              >
                <option>Rich Mindset</option>
                <option>Discipline</option>
                <option>Luxury</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 py-4 font-bold text-lg"
            >
              {loading ? "Generating..." : "✨ Generate Premium Reel Script"}
            </button>

            <button
              onClick={handleGenerateVoiceover}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 font-bold text-lg"
            >
              {voiceLoading
                ? "Generating Voice..."
                : "🎙️ Generate AI Voiceover"}
            </button>

            <button
              onClick={handleDownload}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-4 font-bold text-lg"
            >
              🎬 Download Narrated Reel Video
            </button>
          </div>
        </div>

        {scriptResult && (
          <div className="mt-6 rounded-3xl bg-[#111827] p-8 shadow-2xl border border-white/10">
            <h2 className="text-3xl font-bold mb-6">Generated Output</h2>

            <div className="space-y-6">
              <div>
                <p className="text-purple-400 font-bold mb-2">HOOK</p>
                <p className="text-lg">{scriptResult.hook}</p>
              </div>

              <div>
                <p className="text-blue-400 font-bold mb-2">SCENES</p>
                <ul className="space-y-2">
                  {scriptResult.scenes?.map((scene: string, i: number) => (
                    <li key={i} className="bg-white/5 rounded-xl p-3">
                      {scene}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-orange-400 font-bold mb-2">CTA</p>
                <p>{scriptResult.cta}</p>
              </div>

              {audioUrl && (
                <div>
                  <p className="text-green-400 font-bold mb-2">VOICEOVER</p>

                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                  </audio>

                  <a
                    href={audioUrl}
                    download="voiceover.mp3"
                    className="inline-block mt-4 rounded-xl bg-green-500 px-4 py-2 font-bold"
                  >
                    ⬇ Download Voiceover
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}