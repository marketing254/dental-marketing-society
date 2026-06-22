"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { fetchTranscript, parseTranscript, type TranscriptLine } from "@/lib/transcript";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "transcript";

function highlight(text: string, q: string) {
  if (!q) return text;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${esc})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded bg-gold-400/30 text-ivory">{p}</mark>
    ) : (
      p
    )
  );
}

export default function Transcript({ url, title }: { url: string; title: string }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [raw, setRaw] = useState("");
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let alive = true;
    setState("loading");
    fetchTranscript(url)
      .then((text) => {
        if (!alive) return;
        setRaw(text);
        setLines(parseTranscript(text));
        setState("ready");
      })
      .catch(() => {
        if (alive) setState("error");
      });
    return () => {
      alive = false;
    };
  }, [url]);

  const filtered = useMemo(() => {
    if (!q.trim()) return lines;
    const needle = q.toLowerCase();
    return lines.filter((l) => l.text.toLowerCase().includes(needle));
  }, [lines, q]);

  const words = useMemo(() => raw.split(/\s+/).filter(Boolean).length, [raw]);
  const readMins = Math.max(1, Math.round(words / 200));

  function download() {
    const blob = new Blob([raw], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${slug(title)}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="glass overflow-hidden !rounded-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 p-5 sm:p-6">
        <div>
          <h2 className="h-display text-2xl">Transcript</h2>
          {state === "ready" && (
            <p className="mt-1 text-xs text-mist">
              ~{words.toLocaleString()} words · {readMins} min read
            </p>
          )}
        </div>
        {state === "ready" && (
          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-sm">
              <Icon name="search" size={14} className="text-mist" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-28 bg-transparent text-ivory placeholder:text-mist-dark outline-none sm:w-40"
              />
            </label>
            <button onClick={download} className="btn-ghost btn-md" aria-label="Download transcript">
              <Icon name="download" size={14} /> <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        {state === "loading" && (
          <div className="flex items-center justify-center gap-3 py-12 text-sm text-mist">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
            Loading transcript…
          </div>
        )}

        {state === "error" && (
          <div className="py-8 text-center">
            <p className="text-sm text-mist">
              The transcript couldn&apos;t be loaded automatically.
            </p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-md mt-4">
              <Icon name="book" size={14} /> Open transcript document
            </a>
          </div>
        )}

        {state === "ready" && (
          <>
            <div
              className="space-y-4 overflow-hidden pr-1 transition-[max-height] duration-500"
              style={{ maxHeight: expanded ? "none" : "32rem" }}
            >
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-mist">No lines match “{q}”.</p>
              ) : (
                filtered.map((l, i) => (
                  <div
                    key={i}
                    className={
                      l.speaker
                        ? "rounded-xl border-l-2 border-gold-500/40 bg-white/[0.02] px-4 py-3"
                        : "px-1"
                    }
                  >
                    {(l.speaker || l.time) && (
                      <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                        {l.speaker && (
                          <span className="text-sm font-bold tracking-wide text-gold-300">
                            {l.speaker}
                          </span>
                        )}
                        {l.time && (
                          <span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[0.68rem] text-mist">
                            {l.time}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-[0.95rem] leading-relaxed text-ivory/85">
                      {highlight(l.text, q)}
                    </p>
                  </div>
                ))
              )}
            </div>
            {!q && lines.length > 6 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200"
              >
                {expanded ? "Collapse transcript" : "Show full transcript"}
                <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
                  <svg width="12" height="8" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
