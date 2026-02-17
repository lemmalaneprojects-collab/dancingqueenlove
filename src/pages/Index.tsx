import dancingBg from "@/assets/dancing-bg.jpg";
import StudyTimer from "@/components/StudyTimer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { Music, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dancingBg})` }}
      />
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Decorative sparkles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="fixed w-2 h-2 rounded-full bg-accent/40 pointer-events-none"
          style={{
            left: `${15 + i * 15}%`,
            top: `${10 + (i % 3) * 30}%`,
            animation: `sparkle ${2 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-foreground text-glow flex items-center gap-3 justify-center">
            <Music className="w-8 h-8 text-primary" style={{ animation: "float 2s ease-in-out infinite" }} />
            Study & Groove
            <Sparkles className="w-8 h-8 text-accent" style={{ animation: "float 2s ease-in-out infinite 0.5s" }} />
          </h1>
          <p className="text-muted-foreground mt-2 font-body text-lg">
            Dance your way through studying — max 3 hours of focused vibes!
          </p>
        </header>

        {/* Main layout */}
        <main className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full max-w-5xl justify-center">
          {/* Timer */}
          <section className="flex-1 flex justify-center w-full max-w-lg">
            <StudyTimer />
          </section>

          {/* YouTube + Tips */}
          <aside className="flex flex-col items-center gap-6 w-full max-w-md">
            <YouTubeEmbed />

            {/* Study tips card */}
            <div className="glass rounded-2xl p-5 w-full">
              <h2 className="font-display text-lg text-accent mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Study Tips
              </h2>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">♫</span>
                  <span>Use 25-min sessions (Pomodoro) for max focus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">♫</span>
                  <span>Take a 5-min dance break between sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">♫</span>
                  <span>Stay hydrated — dancing queens need water!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">♫</span>
                  <span>Track your completed sessions to stay motivated</span>
                </li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Index;
