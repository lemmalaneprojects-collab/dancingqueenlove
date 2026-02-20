import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronDown, ChevronUp, Zap } from "lucide-react";

const MILESTONES = [
  {
    version: "v0.1.0", date: "Aug 2025", title: "The Idea 💡",
    desc: "Lemuel & Lane dream up offline-first chat for SEA.",
    detail: "It started over late-night coffee in Manila. Lemuel, frustrated by dropped connections during typhoon season, sketched the first wireframe on a napkin. Lane immediately saw the vision — a beautiful, private messenger that doesn't depend on cell towers.",
    emoji: "💡",
  },
  {
    version: "v0.5.0", date: "Nov 2025", title: "Alpha Build 🔨",
    desc: "Core messaging engine, sticker system, and UID networking.",
    detail: "Three months of intense coding. The P2P engine was rewritten twice before it felt right. Lane crafted 100+ stickers inspired by SEA culture — from tuk-tuks to tropical flowers. The unique ID system was born so users could find each other across borders.",
    emoji: "🔨",
  },
  {
    version: "v0.9.0", date: "Jan 2026", title: "Beta Release 🧪",
    desc: "500+ beta testers across 6 SEA countries.",
    detail: "Real users, real feedback, real tears of joy. Testers in the Philippines, Vietnam, Indonesia, Thailand, Malaysia, and Cambodia helped squash 200+ bugs. The offline Bluetooth feature was the crowd favorite — people couldn't believe it actually worked.",
    emoji: "🧪",
  },
  {
    version: "v1.0.0", date: "Feb 2026", title: "Launch Day 🚀",
    desc: "SEA-U goes live! Offline chat via hotspot & Bluetooth.",
    detail: "The moment Lemma Lane had been working toward. SEA-U launched across all platforms — completely free, no ads, no tracking. Within the first week, communities in rural areas started adopting it as their primary communication tool.",
    emoji: "🚀",
  },
];

export default function InteractiveTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setProgress(0);
    const tick = 50; // ms
    const duration = 3000; // ms per milestone
    let elapsed = 0;

    intervalRef.current = setInterval(() => {
      elapsed += tick;
      setProgress((elapsed / duration) * 100);

      if (elapsed >= duration) {
        elapsed = 0;
        setProgress(0);
        setActiveIndex(prev => {
          const next = prev + 1;
          if (next >= MILESTONES.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }
    }, tick);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, activeIndex]);

  const reset = () => {
    setIsPlaying(false);
    setActiveIndex(0);
    setProgress(0);
    setExpandedIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider">
          <Zap className="w-3 h-3 inline mr-1" />Interactive Journey
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center hover:bg-primary/25 transition-colors active:scale-90"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <button
            onClick={reset}
            className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-90"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5">
        {MILESTONES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActiveIndex(i); setIsPlaying(false); setProgress(0); }}
            className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted transition-all"
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: i < activeIndex ? "100%" : i === activeIndex ? `${progress}%` : "0%",
                background: `hsl(var(--primary))`,
              }}
            />
          </button>
        ))}
      </div>

      {/* Active milestone card */}
      <div
        className="bg-card border border-border rounded-2xl cute-shadow overflow-hidden"
        style={{ animation: "pop-in 0.3s ease-out" }}
        key={activeIndex}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              {MILESTONES[activeIndex].emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary/15 text-primary font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {MILESTONES[activeIndex].version}
                </span>
                <span className="text-[10px] text-muted-foreground">{MILESTONES[activeIndex].date}</span>
              </div>
              <p className="font-display font-bold text-sm text-foreground">{MILESTONES[activeIndex].title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{MILESTONES[activeIndex].desc}</p>
            </div>
          </div>

          {/* Expandable detail */}
          <button
            onClick={() => setExpandedIndex(expandedIndex === activeIndex ? null : activeIndex)}
            className="w-full flex items-center justify-center gap-1 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-[10px] font-display font-bold text-muted-foreground"
          >
            {expandedIndex === activeIndex ? (
              <>Read less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Read the full story <ChevronDown className="w-3 h-3" /></>
            )}
          </button>

          {expandedIndex === activeIndex && (
            <div className="pt-2 border-t border-border" style={{ animation: "slide-up 0.2s ease-out" }}>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                {MILESTONES[activeIndex].detail}
              </p>
            </div>
          )}
        </div>

        {/* Milestone nav dots */}
        <div className="flex items-center justify-center gap-3 py-3 bg-muted/30 border-t border-border/40">
          {MILESTONES.map((m, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); setIsPlaying(false); setProgress(0); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
                i === activeIndex
                  ? "bg-primary/20 scale-125 ring-2 ring-primary/30"
                  : i < activeIndex
                  ? "bg-primary/10 opacity-80"
                  : "bg-muted opacity-50"
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
