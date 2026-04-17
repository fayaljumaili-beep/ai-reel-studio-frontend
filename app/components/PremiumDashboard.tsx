"use client";

import { useState } from "react";

export default function PremiumDashboard() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <section className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">AI Reel Studio</h1>
        <p className="text-zinc-400 mb-6">
          Generate viral short-form scripts instantly
        </p>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Enter topic (e.g. how to become successful)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 mb-4"
        />

        {/* BUTTON */}
        <button
          onClick={handleGenerateScript}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition"
        >
          {loading ? "Generating..." : "Generate Premium Script"}
        </button>

        {/* OUTPUT */}
        {script && (
          <div className="mt-6 bg-zinc-900 border border-zinc-800 p-6 rounded-xl whitespace-pre-wrap">
            {script}
          </div>
        )}

      </div>
    </section>
  );
}