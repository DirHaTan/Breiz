"use client";

import { useEffect, useRef, useState } from "react";

type Labels = {
  title: string;
  note: string;
  minutes: string;
  play: string;
  pause: string;
  resume: string;
  restart: string;
  speed: string;
};

const SPEEDS = [0.75, 1, 1.25, 1.5];

// Picks the device's best voice for the language: "natural" / online voices first.
function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang));
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online|premium|enhanced/i.test(v.name) ? 4 : 0) +
    (/google/i.test(v.name) ? 2 : 0) +
    (lang === "fr" && /fr-fr/i.test(v.lang) ? 1 : 0) +
    (lang === "en" && /en-gb/i.test(v.lang) ? 1 : 0);
  return [...voices].sort((a, b) => score(b) - score(a))[0];
}

// "Listen to this article": the reader's own browser reads the text aloud.
// Shown only when the device has a voice for the language (no browser has
// a Breton voice, so Breton articles use an uploaded recording instead).
export function ReadAloud({ parts, lang, labels }: { parts: string[]; lang: "fr" | "en"; labels: Labels }) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | undefined>();
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = useState(1);
  const index = useRef(0);
  const run = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const update = () => setVoice(pickVoice(lang));
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", update);
      window.speechSynthesis.cancel();
    };
  }, [lang]);

  // Reads the pieces one by one from `from` (long texts in one go are cut off by some browsers).
  function speakFrom(from: number, speed = rate) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const current = ++run.current;
    const next = (i: number) => {
      if (current !== run.current) return;
      if (i >= parts.length) {
        index.current = 0;
        setState("idle");
        return;
      }
      index.current = i;
      const u = new SpeechSynthesisUtterance(parts[i]);
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? lang;
      u.rate = speed;
      u.onend = () => next(i + 1);
      u.onerror = () => {
        if (current === run.current) setState("idle");
      };
      synth.speak(u);
    };
    setState("playing");
    next(from);
  }

  function toggle() {
    const synth = window.speechSynthesis;
    if (state === "playing") {
      synth.pause();
      setState("paused");
    } else if (state === "paused") {
      synth.resume();
      setState("playing");
    } else {
      speakFrom(index.current);
    }
  }

  function restart() {
    index.current = 0;
    speakFrom(0);
  }

  function changeSpeed(value: number) {
    setRate(value);
    if (state !== "idle") speakFrom(index.current, value);
  }

  if (!voice) return null;
  const words = parts.join(" ").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 160));

  return (
    <section aria-label={labels.title} className="mt-6 border-y border-ink py-3">
      <p className="text-xs font-bold uppercase tracking-widest">{labels.title}</p>
      <p className="mt-1 text-sm text-muted">
        {labels.minutes.replace("{n}", String(minutes))} · {labels.note}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <button type="button" onClick={toggle} className="bg-ink px-4 py-2 font-semibold text-paper hover:opacity-80">
          {state === "playing" ? `❚❚ ${labels.pause}` : state === "paused" ? `▶ ${labels.resume}` : `▶ ${labels.play}`}
        </button>
        <button type="button" onClick={restart} className="border-2 border-ink px-4 py-1.5 font-semibold">
          ↻ {labels.restart}
        </button>
        <label className="flex items-center gap-2 border-2 border-ink px-3 py-1.5 font-semibold">
          {labels.speed}
          <select value={rate} onChange={(e) => changeSpeed(Number(e.target.value))} className="bg-transparent">
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
