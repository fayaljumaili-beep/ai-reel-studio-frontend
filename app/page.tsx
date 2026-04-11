"use client";

import { useState } from "react";

const API_BASE =
  "https://ai-reel-studio-frontend-production.up.railway.app";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [voice, setVoice] = useState("Motivational");
  const [template, setTemplate] = useState("Rich Mindset");

  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);

  const [scriptResult, setScriptResult] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState("");

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

      if (!res.ok) throw new Error("Failed to generate script");

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
      const res = await fetch(`${API_BASE}/generate-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: scriptResult?.hook || "AI reel",
        }),
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
    <main style={{ padding: 40 }}>
      <h1>Faceless Reel Scripts in 5 Seconds</h1>
      <p>LIVE SAAS MODE 🚀</p>

      <p>
        Generate scroll-stopping hooks, body scripts, CTAs, and export
        downloadable MP4 reels with AI narration.
      </p>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your topic..."
      />

      <br />
      <br />

      <select value={voice} onChange={(e) => setVoice(e.target.value)}>
        <option>Motivational</option>
        <option>Luxury</option>
        <option>Storytelling</option>
      </select>

      <select value={template} onChange={(e) => setTemplate(e.target.value)}>
        <option>Rich Mindset</option>
        <option>Success Secrets</option>
        <option>Luxury Lifestyle</option>
      </select>

      <br />
      <br />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "✨ Generate Premium Reel Script"}
      </button>

      <button
        onClick={handleGenerateVoiceover}
        disabled={voiceLoading}
        style={{ marginLeft: 10 }}
      >
        {voiceLoading ? "Generating Voice..." : "🎙️ Generate AI Voiceover"}
      </button>

      <button onClick={handleDownload} style={{ marginLeft: 10 }}>
        🎬 Download Narrated Reel Video
      </button>

      {scriptResult && (
        <div style={{ marginTop: 30 }}>
          <h2>Generated Output</h2>

          <p>
            <strong>HOOK</strong>
          </p>
          <p>{scriptResult.hook}</p>

          <p>
            <strong>SCENES</strong>
          </p>
          <ul>
            {(scriptResult.scenes || []).map(
              (scene: string, index: number) => (
                <li key={index}>{scene}</li>
              )
            )}
          </ul>

          <p>
            <strong>CTA</strong>
          </p>
          <p>{scriptResult.cta}</p>

          {audioUrl && (
            <div>
              <p>
                <strong>VOICEOVER</strong>
              </p>

              <audio controls src={audioUrl} />

              <br />

              <a href={audioUrl} download="voiceover.mp3">
                ⬇ Download Voiceover
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}