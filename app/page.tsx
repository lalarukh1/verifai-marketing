"use client";

import { useEffect, useRef, useState } from "react";

const APP_URL = "https://verifai-app.vercel.app";

/* ── Small helpers ── */
function VerdictBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
      style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = () => {
          start += Math.ceil(target / 60);
          if (start >= target) { setVal(target); return; }
          setVal(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── Floating mock result cards ── */
function MockCardFalse() {
  return (
    <div
      className="absolute rounded-2xl p-4 w-72 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(6,14,26,0.98) 100%)",
        border: "1px solid rgba(239,68,68,0.3)",
        top: "10%",
        right: "-20px",
        transform: "rotate(3deg)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(239,68,68,0.08)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10 }}>⚠</span>
        </div>
        <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>@healthguru_official</span>
      </div>
      <VerdictBadge label="FALSE" color="#EF4444" />
      <p className="text-xs mt-2.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
        "Drinking lemon water every morning boosts your metabolism by 30%"
      </p>
      <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Credibility score</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full" style={{ width: "23%", background: "linear-gradient(90deg, #EF4444, #F97316)" }} />
          </div>
          <span className="text-sm font-bold" style={{ color: "#EF4444" }}>23</span>
        </div>
      </div>
    </div>
  );
}

function MockCardTrue() {
  return (
    <div
      className="absolute rounded-2xl p-4 w-64 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(6,14,26,0.98) 100%)",
        border: "1px solid rgba(45,212,191,0.25)",
        bottom: "15%",
        right: "60px",
        transform: "rotate(-2deg)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(45,212,191,0.06)",
      }}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>@bbcnews</span>
      </div>
      <VerdictBadge label="TRUSTWORTHY" color="#2DD4BF" />
      <p className="text-xs mt-2.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
        "New study links ultra-processed foods to increased cancer risk"
      </p>
      <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full" style={{ width: "82%", background: "linear-gradient(90deg, #2DD4BF, #60A5FA)" }} />
          </div>
          <span className="text-sm font-bold" style={{ color: "#2DD4BF" }}>82</span>
        </div>
      </div>
    </div>
  );
}

/* ── Ticker items ── */
const tickerItems = [
  { platform: "TikTok", claim: "This common food causes cancer in 90% of people", verdict: "FALSE", color: "#EF4444" },
  { platform: "Instagram", claim: "NASA confirmed aliens visited Earth last month", verdict: "FALSE", color: "#EF4444" },
  { platform: "TikTok", claim: "You only use 10% of your brain capacity", verdict: "MISLEADING", color: "#F97316" },
  { platform: "Instagram", claim: "Coffee has been linked to reduced Alzheimer's risk", verdict: "TRUSTWORTHY", color: "#2DD4BF" },
  { platform: "TikTok", claim: "5G towers are causing health problems worldwide", verdict: "FALSE", color: "#EF4444" },
  { platform: "Instagram", claim: "This household plant purifies air by 87%", verdict: "MISLEADING", color: "#F97316" },
  { platform: "TikTok", claim: "Climate change is accelerating faster than models predicted", verdict: "TRUSTWORTHY", color: "#2DD4BF" },
];

/* ── Step card ── */
function StepCard({
  number, icon, title, body, rotation,
}: {
  number: string; icon: string; title: string; body: string; rotation: string;
}) {
  return (
    <div
      className="rounded-3xl p-8 relative"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        transform: rotation,
      }}
    >
      <div
        className="absolute -top-4 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
        style={{
          background: "conic-gradient(#2DD4BF, #60A5FA, #A78BFA, #2DD4BF)",
          padding: "2px",
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-sm font-black"
          style={{ background: "#060E1A", color: "#2DD4BF" }}
        >
          {number}
        </div>
      </div>
      <div className="text-4xl mb-4 mt-2">{icon}</div>
      <h3 className="text-lg font-bold mb-2" style={{ color: "#F0F9FF" }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{body}</p>
    </div>
  );
}

/* ── Platform card ── */
function PlatformCard({
  icon, platform, scenario, tag,
}: {
  icon: string; platform: string; scenario: string; tag: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-xs font-bold mb-1" style={{ color: "#2DD4BF" }}>{platform}</p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{scenario}</p>
      </div>
      <span
        className="self-start text-xs px-2.5 py-1 rounded-full font-medium"
        style={{ background: "rgba(45,212,191,0.1)", color: "#2DD4BF", border: "1px solid rgba(45,212,191,0.2)" }}
      >
        {tag}
      </span>
    </div>
  );
}

/* ── Feature row ── */
function Feature({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0"
        style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#F0F9FF" }}>{title}</p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{body}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(6,14,26,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2DD4BF, #60A5FA)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "#F0F9FF" }}>VerifAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["How it works", "Features", "Availability"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #2DD4BF, #22D3EE)", color: "#060E1A" }}
          >
            Try free
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center clip-slant-down overflow-hidden pt-24 pb-28 md:pt-[100px] md:pb-[140px]"
      >
        {/* BG blobs */}
        <div
          className="absolute animate-blob"
          style={{
            width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)",
            top: "-200px", left: "-200px", filter: "blur(60px)",
          }}
        />
        <div
          className="absolute animate-blob-2"
          style={{
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)",
            bottom: "-100px", right: "-100px", filter: "blur(60px)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: copy */}
            <div className="animate-slide-up">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
                style={{
                  background: "rgba(45,212,191,0.1)",
                  border: "1px solid rgba(45,212,191,0.25)",
                  color: "#2DD4BF",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-glow" style={{ background: "#2DD4BF" }} />
                AI fact-checking, live now on web
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6"
                style={{ color: "#F0F9FF" }}
              >
                That video<br />
                might be{" "}
                <span className="grad-text">a lie.</span>
              </h1>

              <p className="text-base sm:text-xl leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 460 }}>
                Know before you share. VerifAI fact-checks Instagram Reels and TikTok videos in seconds, using real sources you can actually read.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #2DD4BF, #22D3EE, #60A5FA)",
                    color: "#060E1A",
                    boxShadow: "0 8px 32px rgba(45,212,191,0.3)",
                  }}
                >
                  Check a video free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
                >
                  See how it works
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-10">
                {[
                  { val: "60s", label: "avg check time" },
                  { val: "5", label: "sources per claim" },
                  { val: "Free", label: "to get started" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black" style={{ color: "#2DD4BF" }}>{stat.val}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating mock cards */}
            <div className="relative h-96 lg:h-[520px] hidden lg:block">
              <MockCardFalse />
              <MockCardTrue />
              {/* Decorative ring */}
              <div
                className="absolute"
                style={{
                  width: 320, height: 320,
                  border: "1px dashed rgba(45,212,191,0.12)",
                  borderRadius: "50%",
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", background: "rgba(255,255,255,0.02)", padding: "14px 0" }}
      >
        <div className="animate-ticker flex gap-12 whitespace-nowrap" style={{ width: "max-content" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>{item.platform}</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{item.claim}</span>
              <VerdictBadge label={item.verdict} color={item.color} />
            </div>
          ))}
        </div>
      </div>

      {/* ── PAIN SECTION ── */}
      <section className="py-28 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold mb-4 tracking-widest uppercase" style={{ color: "#2DD4BF" }}>The problem</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6" style={{ color: "#F0F9FF" }}>
              Misinformation spreads because<br />
              <span className="grad-text-warm">checking is annoying.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
              You see a shocking claim in a video. You could spend 20 minutes googling. Or you just share it. We fixed that.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
            {[
              { num: 69, suffix: "%", label: "of adults get news from social media" },
              { num: 6, suffix: "x", label: "faster than truth, misinformation spreads" },
              { num: 3, suffix: "B+", label: "fake video views monthly on TikTok alone" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-3xl p-7 text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-5xl font-black mb-2 grad-text">
                  <Counter target={s.num} suffix={s.suffix} />
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Scenario cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "😬",
                title: "The group chat embarrassment",
                body: "You share a viral health tip. Someone replies with a fact-check link. 47 people saw it. That could have been avoided.",
                color: "#F97316",
              },
              {
                icon: "🤦",
                title: "The family dinner source",
                body: "\"I saw it on Instagram\" stopped being a valid source in 2016. You deserve better evidence before forming opinions.",
                color: "#EF4444",
              },
              {
                icon: "🧠",
                title: "The algorithm rabbit hole",
                body: "Engagement-bait claims get shown first. The more shocking, the more views. Truth rarely trends. That's the system you're in.",
                color: "#A78BFA",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-3xl p-7"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${card.color}22` }}
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#F0F9FF" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="py-28 px-6 clip-slant-up"
        style={{ background: "linear-gradient(180deg, rgba(45,212,191,0.04) 0%, rgba(6,14,26,0) 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold mb-4 tracking-widest uppercase" style={{ color: "#2DD4BF" }}>How it works</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: "#F0F9FF" }}>
              Paste. Wait 60 seconds.{" "}
              <span className="grad-text">Know the truth.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon="🔗"
              title="Paste any link"
              body="Copy the URL from Instagram Reels or TikTok. Paste it into VerifAI. That's all the effort you need."
              rotation="rotate(-1.5deg)"
            />
            <StepCard
              number="2"
              icon="🤖"
              title="AI reads everything"
              body="Our AI reads the caption, transcribes the audio, and finds every factual claim hidden in the video."
              rotation="rotate(1deg)"
            />
            <StepCard
              number="3"
              icon="📋"
              title="Get a verdict with sources"
              body="Each claim is rated Trustworthy, Misleading, False, or Unverified — with up to 5 real source links you can read yourself."
              rotation="rotate(-0.5deg)"
            />
          </div>

          <div className="mt-16 text-center">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #2DD4BF, #22D3EE, #60A5FA)",
                color: "#060E1A",
                boxShadow: "0 8px 32px rgba(45,212,191,0.25)",
              }}
            >
              Try it now, free
            </a>
          </div>
        </div>
      </section>

      {/* ── WHERE TO USE ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold mb-4 tracking-widest uppercase" style={{ color: "#2DD4BF" }}>Platforms</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: "#F0F9FF" }}>
              Works where misinformation lives
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <PlatformCard icon="📸" platform="Instagram Reels" scenario={"Wellness influencers, \"natural cure\" videos, diet trends, and political commentary."} tag="Supported now" />
            <PlatformCard icon="🎵" platform="TikTok" scenario="Viral news clips, health claims, conspiracy theories dressed up as entertainment." tag="Supported now" />
            <PlatformCard icon="🔜" platform="More platforms" scenario="YouTube Shorts, X, and others are on the way as we expand VerifAI's reach." tag="Coming soon" />
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section
        className="py-28 px-6"
        style={{
          background: "linear-gradient(180deg, rgba(6,14,26,0) 0%, rgba(45,212,191,0.03) 50%, rgba(6,14,26,0) 100%)",
        }}
        id="features"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Features list */}
            <div>
              <p className="text-sm font-semibold mb-4 tracking-widest uppercase" style={{ color: "#2DD4BF" }}>What you get</p>
              <h2 className="text-3xl sm:text-4xl font-black mb-12" style={{ color: "#F0F9FF" }}>
                Not just True/False.<br />
                <span className="grad-text">The full picture.</span>
              </h2>
              <div className="space-y-8">
                <Feature icon="🔍" title="Claim-by-claim breakdown" body="Every factual claim in the video is extracted and checked individually, so you know exactly which part is accurate and which isn't." />
                <Feature icon="📰" title="Real sources, not summaries" body="Up to 5 source links per claim from Google News, WHO, CDC, Reuters, AP, and BBC. Read the actual evidence yourself." />
                <Feature icon="📊" title="Credibility score 0-100" body="A single number that accounts for claim accuracy and evidence quality. Scan it instantly before sharing." />
                <Feature icon="🎙️" title="Audio transcription included" body="Claims spoken in the video, not just the caption, are transcribed by Deepgram and fact-checked too." />
              </div>
            </div>

            {/* Large mock card */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
              }}
            >
              {/* Top strip */}
              <div className="h-[3px] animate-ocean" style={{ background: "linear-gradient(90deg, #2DD4BF, #22D3EE, #60A5FA, #A78BFA, #2DD4BF)", backgroundSize: "300% auto" }} />
              <div className="p-7">
                {/* Account row */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full" style={{ background: "linear-gradient(135deg, #F97316, #EC4899)" }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#F0F9FF" }}>@naturalhealth_tips</p>
                  </div>
                  <div className="ml-auto">
                    <VerdictBadge label="MISLEADING" color="#F97316" />
                  </div>
                </div>
                {/* Score bar */}
                <div className="mb-5">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Credibility score</span>
                    <span className="text-sm font-black" style={{ color: "#F97316" }}>41 / 100</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: "41%", background: "linear-gradient(90deg, #F97316, #EC4899)" }} />
                  </div>
                </div>
                {/* Claims */}
                <div className="space-y-3">
                  {[
                    { claim: "Turmeric cures inflammation better than ibuprofen", verdict: "MISLEADING", color: "#F97316" },
                    { claim: "Big pharma suppresses natural remedies", verdict: "FALSE", color: "#EF4444" },
                    { claim: "Chronic inflammation is linked to disease", verdict: "TRUSTWORTHY", color: "#2DD4BF" },
                  ].map((c) => (
                    <div
                      key={c.claim}
                      className="flex items-start gap-3 p-3.5 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="mt-0.5 w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                      <div className="flex-1">
                        <p className="text-xs leading-relaxed mb-1.5" style={{ color: "rgba(255,255,255,0.75)" }}>{c.claim}</p>
                        <VerdictBadge label={c.verdict} color={c.color} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center mt-5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Up to 5 sources per claim
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AVAILABILITY ── */}
      <section
        id="availability"
        className="py-28 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-4 tracking-widest uppercase" style={{ color: "#2DD4BF" }}>Availability</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: "#F0F9FF" }}>
              Use it now. Everywhere soon.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Web - live */}
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(6,14,26,0.6) 100%)",
                border: "1px solid rgba(45,212,191,0.25)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)", filter: "blur(30px)" }}
              />
              <div className="text-5xl mb-5">🌐</div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-2xl font-black" style={{ color: "#F0F9FF" }}>Web App</h3>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.3)" }}
                >
                  LIVE NOW
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
                Open on any browser. Paste a link, get a full fact-check in under a minute. No download, no setup.
              </p>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2DD4BF, #22D3EE)", color: "#060E1A" }}
              >
                Open web app
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* iOS - coming soon */}
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(96,165,250,0.06) 0%, rgba(6,14,26,0.6) 100%)",
                border: "1px solid rgba(96,165,250,0.15)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)", filter: "blur(30px)" }}
              />
              <div className="text-5xl mb-5">📱</div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-2xl font-black" style={{ color: "#F0F9FF" }}>iOS App</h3>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(96,165,250,0.12)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.25)" }}
                >
                  COMING SOON
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
                Check videos directly from the share sheet without leaving the app. Built natively for iPhone. On the way.
              </p>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold cursor-not-allowed opacity-60"
                style={{ border: "1px solid rgba(96,165,250,0.3)", color: "#60A5FA" }}
                disabled
              >
                Notify me when live
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="py-32 px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(6,14,26,0) 0%, rgba(45,212,191,0.05) 50%, rgba(6,14,26,0) 100%)" }}
      >
        <div
          className="absolute animate-blob"
          style={{
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6" style={{ color: "#F0F9FF", lineHeight: 1.05 }}>
            Stop sharing things<br />
            <span className="grad-text">you can't verify.</span>
          </h2>
          <p className="text-lg sm:text-xl mb-12" style={{ color: "rgba(255,255,255,0.65)" }}>
            One paste. 60 seconds. The truth, with receipts.
          </p>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-black transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #2DD4BF, #22D3EE, #60A5FA)",
              color: "#060E1A",
              boxShadow: "0 12px 48px rgba(45,212,191,0.35)",
            }}
          >
            Check a video free
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="mt-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            No credit card. No download. Works right now.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-12 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2DD4BF, #60A5FA)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold" style={{ color: "#F0F9FF" }}>VerifAI</span>
          </div>
          <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
            AI fact-checking for Instagram and TikTok. We do not store your searches or share your data.
          </p>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold"
            style={{ color: "#2DD4BF" }}
          >
            Open app
          </a>
        </div>
      </footer>

    </div>
  );
}
