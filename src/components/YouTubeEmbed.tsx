export default function YouTubeEmbed() {
  return (
    <div className="glass rounded-2xl overflow-hidden w-full max-w-md">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
        <div className="w-3 h-3 rounded-full bg-primary" style={{ animation: "sparkle 2s ease-in-out infinite" }} />
        <span className="font-display text-sm text-accent">🎵 Dancing Queen — Study Vibes</span>
      </div>
      <div className="aspect-video">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/QRoWiTcO7dk?autoplay=1&loop=1&playlist=QRoWiTcO7dk&mute=0"
          title="Dancing Queen"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="border-0"
        />
      </div>
    </div>
  );
}
