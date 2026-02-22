import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, BookOpen, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const MODES: Record<TimerMode, { label: string; minutes: number; emoji: string; color: string; icon: typeof BookOpen }> = {
  focus: { label: "Focus Time", minutes: 25, emoji: "📚", color: "primary", icon: BookOpen },
  shortBreak: { label: "Short Break", minutes: 5, emoji: "☕", color: "mint", icon: Coffee },
  longBreak: { label: "Long Break", minutes: 15, emoji: "🌸", color: "lavender", icon: Sparkles },
};

export default function StudyTimerPage() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMode = MODES[mode];
  const totalSeconds = currentMode.minutes * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setSecondsLeft(MODES[newMode].minutes * 60);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === "focus") {
        setCompletedSessions((prev) => prev + 1);
        // Auto-switch to break
        const nextMode = (completedSessions + 1) % 4 === 0 ? "longBreak" : "shortBreak";
        switchMode(nextMode);
      } else {
        switchMode("focus");
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft, mode, completedSessions, switchMode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(currentMode.minutes * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // SVG circle dimensions
  const size = 240;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-display font-extrabold text-xl text-foreground">Study Timer</h1>
            <p className="text-[10px] text-muted-foreground font-body">{completedSessions} session{completedSessions !== 1 ? "s" : ""} completed today ✨</p>
          </div>
        </div>
      </header>

      <div className="px-6 pt-6">
        {/* Mode selector */}
        <div className="flex gap-2 mb-8">
          {(Object.entries(MODES) as [TimerMode, typeof MODES.focus][]).map(([key, m]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-2.5 rounded-2xl font-display font-bold text-xs transition-all ${
                mode === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <div className="flex justify-center mb-8">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`hsl(var(--${currentMode.color === "primary" ? "primary" : currentMode.color}))`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl mb-1">{currentMode.emoji}</span>
              <span className="font-display font-extrabold text-4xl text-foreground tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-display font-semibold text-muted-foreground mt-1">
                {currentMode.label}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:bg-muted transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center cute-shadow hover:opacity-90 transition-all active:scale-95"
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
          <div className="w-12 h-12" /> {/* Spacer for symmetry */}
        </div>

        {/* Session dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < completedSessions % 4
                  ? "bg-primary scale-110"
                  : "bg-muted"
              }`}
            />
          ))}
          <span className="text-[10px] font-display text-muted-foreground ml-2">
            {4 - (completedSessions % 4)} until long break
          </span>
        </div>

        {/* Tips card */}
        <div className="bg-card rounded-3xl border border-border p-4 cute-shadow">
          <h3 className="font-display font-bold text-sm text-foreground mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            Study Tips
          </h3>
          <div className="space-y-2">
            {[
              { emoji: "🎯", text: "Focus on one task at a time" },
              { emoji: "💧", text: "Stay hydrated during breaks" },
              { emoji: "🧘", text: "Stretch between sessions" },
              { emoji: "📱", text: "Put your phone on silent" },
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                <span>{tip.emoji}</span>
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
