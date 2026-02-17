import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer, Sparkles, Music } from "lucide-react";

const MAX_SECONDS = 3 * 60 * 60; // 3 hours

const MOTIVATIONAL_MESSAGES = [
  "You're doing amazing! 💃",
  "Keep dancing through those notes! 🎶",
  "You can feel the beat of success! ✨",
  "Queen of studying right here! 👑",
  "The rhythm of knowledge flows! 🌟",
  "Dancing Queen energy activated! 💖",
  "You've got this, superstar! ⭐",
  "Groove into greatness! 🎵",
];

const PRESET_MINUTES = [25, 45, 60, 90, 120, 180];

export default function StudyTimer() {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [motivationalMsg, setMotivationalMsg] = useState(MOTIVATIONAL_MESSAGES[0]);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setSessionsCompleted((s) => s + 1);
            setMotivationalMsg("Session complete! You're a Dancing Queen! 🎉👑");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remainingSeconds]);

  // Cycle motivational messages every 30s while running
  useEffect(() => {
    if (!isRunning) return;
    const msgInterval = setInterval(() => {
      setMotivationalMsg(
        MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
      );
    }, 30000);
    return () => clearInterval(msgInterval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePreset = (mins: number) => {
    const secs = Math.min(mins * 60, MAX_SECONDS);
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(false);
  };

  const handleReset = () => {
    setRemainingSeconds(totalSeconds);
    setIsRunning(false);
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Motivational Message */}
      <div
        className="glass rounded-2xl px-6 py-3 text-center transition-all duration-500"
        style={{ animation: "float 3s ease-in-out infinite" }}
      >
        <p className="font-display text-lg text-accent flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {motivationalMsg}
          <Sparkles className="w-5 h-5" />
        </p>
      </div>

      {/* Timer Ring */}
      <div className="relative flex items-center justify-center">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="hsl(330 20% 22%)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(340 80% 60%)" />
              <stop offset="50%" stopColor="hsl(45 100% 60%)" />
              <stop offset="100%" stopColor="hsl(170 60% 45%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-display text-5xl md:text-6xl text-foreground text-glow tabular-nums">
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-muted-foreground text-sm mt-1">
            {progress > 0 && progress < 100 ? `${Math.round(progress)}% done` : remainingSeconds === 0 ? "Complete!" : "Ready to study"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleReset}
          className="glass rounded-full p-4 hover:bg-muted/80 transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-6 h-6 text-muted-foreground" />
        </button>
        <button
          onClick={() => {
            if (remainingSeconds === 0) {
              handleReset();
            }
            setIsRunning(!isRunning);
          }}
          className="rounded-full p-6 bg-primary text-primary-foreground transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ animation: isRunning ? "pulse-glow 2s ease-in-out infinite" : "none" }}
          aria-label={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <div className="glass rounded-full p-4 flex items-center gap-2">
          <Timer className="w-5 h-5 text-accent" />
          <span className="text-sm text-foreground font-medium">{sessionsCompleted}</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESET_MINUTES.map((mins) => (
          <button
            key={mins}
            onClick={() => handlePreset(mins)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
              totalSeconds === mins * 60
                ? "bg-primary text-primary-foreground glow-pink"
                : "glass text-foreground hover:bg-muted/80"
            }`}
          >
            {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
          </button>
        ))}
      </div>

      {/* Progress bar (visual learner extra) */}
      <div className="w-full max-w-sm">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(340 80% 60%), hsl(45 100% 60%), hsl(170 60% 45%))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
