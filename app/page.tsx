"use client";

import { useState } from "react";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [voice, setVoice] = useState("Motivational");
  const [template, setTemplate] = useState("Rich Mindset");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch(
        "https://ai-reel-studio-frontend-production.up.railway.app/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic, voice, template }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b1020 0%, #111827 100%)",
        color: "white",
        padding: "40px 24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <section style={{ textAlign: "center", marginBottom: 50 }}>
          <p style={{ color: "#a78bfa", fontWeight: 700, letterSpacing: 1 }}>
            🚀 AI REEL STUDIO
          </p>
          <h1
            style={{
              fontSize: "56px",
              lineHeight: 1.05,
              fontWeight: 800,
              maxWidth: 900,
              margin: "20px auto",
            }}
          >
            Create Viral Faceless Reel Scripts in 5 Seconds
          </h1>
          <p
            style={{
              color: "#cbd5e1",
              fontSize: 20,
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            Generate scroll-stopping hooks, engaging body scripts, and powerful CTAs
            that feel premium enough to compete with top creator tools.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 24,
              padding: 28,
              backdropFilter: "blur(8px)",
            }}
          >
            <h2 style={{ fontSize: 28, marginBottom: 20 }}>🎬 Generate Your Next Viral Script</h2>

            <label style={{ display: "block", marginBottom: 10, color: "#cbd5e1" }}>
              Reel topic
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How discipline creates wealth"
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 14,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white",
                marginBottom: 18,
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 10, color: "#cbd5e1" }}>
                  Voice
                </label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 16,
                    borderRadius: 14,
                    border: "1px solid #334155",
                    background: "#0f172a",
                    color: "white",
                  }}
                >
                  <option>Motivational</option>
                  <option>Luxury</option>
                  <option>Storytelling</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 10, color: "#cbd5e1" }}>
                  Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 16,
                    borderRadius: 14,
                    border: "1px solid #334155",
                    background: "#0f172a",
                    color: "white",
                  }}
                >
                  <option>Rich Mindset</option>
                  <option>Success Story</option>
                  <option>Faceless CTA</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                marginTop: 22,
                width: "100%",
                padding: 18,
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                color: "white",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "Generating your viral reel..." : "✨ Generate Premium Reel Script"}
            </button>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
              padding: 28,
              minHeight: 420,
            }}
          >
            <h3 style={{ fontSize: 24, marginBottom: 16 }}>🏆 Why creators will pay</h3>
            <div style={{ color: "#cbd5e1", lineHeight: 1.9, fontSize: 18 }}>
              <p>✅ Viral hooks optimized for retention</p>
              <p>✅ CTA engineered for follows + sales</p>
              <p>✅ Perfect for TikTok, Reels, Shorts</p>
              <p>✅ Built for faceless theme pages</p>
              <p>✅ Agency-ready workflow</p>
            </div>
          </div>
        </section>

        {result && (
          <section
            style={{
              marginTop: 30,
              background: "white",
              color: "#111827",
              borderRadius: 24,
              padding: 28,
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <h2 style={{ fontSize: 30, marginBottom: 16 }}>🎬 Generated Reel Script</h2>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: 18 }}>
              {result.script}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
