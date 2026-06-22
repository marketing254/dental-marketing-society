"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { fetchTranscript, parseDoc, type DocBlock } from "@/lib/transcript";

/**
 * Fetches a Google Doc (write-up / description) and renders it as formatted
 * content — section headings, sub-headings, paragraphs and bullet lists.
 */
export default function RichDoc({ url, fallback }: { url: string; fallback?: string }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [blocks, setBlocks] = useState<DocBlock[]>([]);

  useEffect(() => {
    let alive = true;
    setState("loading");
    fetchTranscript(url)
      .then((text) => {
        if (!alive) return;
        const b = parseDoc(text);
        if (!b.length) throw new Error("empty");
        setBlocks(b);
        setState("ready");
      })
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, [url]);

  if (state === "loading") {
    return (
      <div className="flex items-center gap-3 py-6 text-sm text-mist">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
        Loading details…
      </div>
    );
  }

  if (state === "error") {
    return (
      <div>
        {fallback && <p className="leading-relaxed text-mist">{fallback}</p>}
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-md mt-4">
          <Icon name="book" size={14} /> Open full write-up
        </a>
      </div>
    );
  }

  // Group consecutive <li> into a single list.
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: string) => {
    if (!list.length) return;
    out.push(
      <ul key={key} className="mt-3 space-y-2.5">
        {list.map((t, i) => (
          <li key={i} className="flex gap-3 text-mist">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
            <span className="leading-relaxed">{t}</span>
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  blocks.forEach((b, i) => {
    if (b.type === "li") {
      list.push(b.text);
      return;
    }
    flush(`ul-${i}`);
    if (b.type === "h2")
      out.push(
        <h3 key={i} className="h-display mt-8 text-2xl text-ivory first:mt-0">
          {b.text}
        </h3>
      );
    else if (b.type === "h3")
      out.push(
        <h4 key={i} className="mt-6 text-base font-semibold text-gold-300">
          {b.text}
        </h4>
      );
    else
      out.push(
        <p key={i} className="mt-3 leading-relaxed text-mist">
          {b.text}
        </p>
      );
  });
  flush("ul-end");

  return <div className="text-[0.95rem]">{out}</div>;
}
