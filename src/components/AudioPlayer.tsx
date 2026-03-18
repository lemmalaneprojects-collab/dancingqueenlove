import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  isMe: boolean;
}

export default function AudioPlayer({ src, isMe }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => { setPlaying(false); setProgress(0); };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play();
    setPlaying(!playing);
  };

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        className={`p-1.5 rounded-full transition-colors ${
          isMe ? "hover:bg-primary-foreground/20" : "hover:bg-muted"
        }`}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="h-1.5 rounded-full bg-current/20 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isMe ? "bg-primary-foreground/70" : "bg-primary/70"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[9px] opacity-70 font-mono">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
