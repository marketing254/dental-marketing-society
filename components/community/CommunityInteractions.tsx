"use client";

// Interactions for the /community Member Network page (ported from the
// original page's inline script): the typewriter hero demo, the nine-doors
// panel switcher, and the scroll-reveal observer. Scenario copy is the DMS
// variant from the rollout addendum (tab labels: They do not accept /
// No-shows / Front desk).

import { useEffect } from "react";

const SCENARIOS = [
  {
    q: "New patients are booking but half of them never accept the treatment plan.",
    a: "That is a case presentation gap, not a marketing one, and it is very fixable. Here are the steps, plus two experts who rebuilt exactly this.",
    c: ["Case acceptance SOP", "Consult script", "Two vetted experts", "Conversion worksheet"],
  },
  {
    q: "My no-show rate is climbing and the morning schedule falls apart by ten.",
    a: "No-shows are a confirmation and value gap, and both are fixable. Here is the sequence that protects tomorrow's schedule, and who can help you run it.",
    c: ["Confirmation script", "Schedule protection SOP", "Two vetted experts", "No-show worksheet"],
  },
  {
    q: "My front desk is overwhelmed and new-patient calls are going to voicemail.",
    a: "The phone is the most valuable seat in the practice, and it can be steadied fast. Here is the call flow, the coverage plan, and who has fixed this before.",
    c: ["Phone call flow", "Front desk SOP", "Two vetted experts", "Call tracking worksheet"],
  },
];

export default function CommunityInteractions() {
  useEffect(() => {
    const qt = document.getElementById("qt");
    const plan = document.getElementById("plan");
    const pbody = document.getElementById("pbody");
    const pchips = document.getElementById("pchips");
    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".dmn .tab"));
    if (!qt || !plan || !pbody || !pchips || !tabs.length) return;

    let cur = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let typeTimer: ReturnType<typeof setTimeout> | null = null;
    let cycleTimer: ReturnType<typeof setTimeout> | null = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function fill(i: number) {
      pbody!.textContent = SCENARIOS[i].a;
      pchips!.innerHTML = "";
      SCENARIOS[i].c.forEach((t) => {
        const s = document.createElement("span");
        s.textContent = t;
        pchips!.appendChild(s);
      });
    }

    function show(i: number) {
      cur = i;
      tabs.forEach((t, j) => t.setAttribute("aria-selected", j === i ? "true" : "false"));
      if (timer) clearTimeout(timer);
      if (typeTimer) clearTimeout(typeTimer);
      plan!.classList.remove("on");
      fill(i);
      if (reduce) {
        qt!.textContent = SCENARIOS[i].q;
        plan!.classList.add("on");
        return;
      }
      qt!.textContent = "";
      let k = 0;
      (function type() {
        if (k <= SCENARIOS[i].q.length) {
          qt!.textContent = SCENARIOS[i].q.slice(0, k);
          k++;
          typeTimer = setTimeout(type, 34);
        } else {
          timer = setTimeout(() => plan!.classList.add("on"), 350);
          cycleTimer = setTimeout(() => show((cur + 1) % SCENARIOS.length), 9000);
        }
      })();
    }

    const onTab = (t: HTMLButtonElement) => () => {
      if (cycleTimer) clearTimeout(cycleTimer);
      show(parseInt(t.getAttribute("data-s") || "0", 10));
    };
    const tabHandlers = tabs.map((t) => {
      const h = onTab(t);
      t.addEventListener("click", h);
      return h;
    });
    show(0);

    // Nine-doors panel switcher
    const items = Array.from(document.querySelectorAll<HTMLButtonElement>(".dmn .mitem"));
    const itemHandlers = items.map((m) => {
      const h = () => {
        items.forEach((x) => x.setAttribute("aria-selected", "false"));
        m.setAttribute("aria-selected", "true");
        document.querySelectorAll(".dmn .sp").forEach((p) => p.classList.remove("on"));
        const t = document.getElementById(m.getAttribute("data-p") || "");
        if (t) t.classList.add("on");
      };
      m.addEventListener("click", h);
      return h;
    });

    // Scroll reveal
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && !reduce) {
      io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io!.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      document.querySelectorAll(".dmn .rv").forEach((el) => io!.observe(el));
    } else {
      document.querySelectorAll(".dmn .rv").forEach((el) => el.classList.add("in"));
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (typeTimer) clearTimeout(typeTimer);
      if (cycleTimer) clearTimeout(cycleTimer);
      tabs.forEach((t, i) => t.removeEventListener("click", tabHandlers[i]));
      items.forEach((m, i) => m.removeEventListener("click", itemHandlers[i]));
      if (io) io.disconnect();
    };
  }, []);

  return null;
}
