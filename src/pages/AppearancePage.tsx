import { ArrowLeft, Sun, Moon, Sparkles, Type, Maximize } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useSettings, type ThemeId, type FontSize, type BubbleStyle } from "@/contexts/SettingsContext";
import { toast } from "@/hooks/use-toast";

const THEMES: { id: ThemeId; label: string; colors: string[] }[] = [
  { id: "pastel", label: "Pastel Dream 🌸", colors: ["hsl(330 60% 72%)", "hsl(270 50% 85%)", "hsl(200 60% 82%)"] },
  { id: "ocean", label: "Ocean Breeze 🌊", colors: ["hsl(200 70% 55%)", "hsl(180 50% 70%)", "hsl(210 60% 72%)"] },
  { id: "sunset", label: "Sunset Glow 🌅", colors: ["hsl(15 75% 60%)", "hsl(40 80% 68%)", "hsl(350 65% 72%)"] },
  { id: "forest", label: "Forest Calm 🌿", colors: ["hsl(140 40% 48%)", "hsl(120 35% 65%)", "hsl(80 35% 68%)"] },
];

const FONT_SIZES: { id: FontSize; label: string; size: string }[] = [
  { id: "small", label: "Small", size: "text-xs" },
  { id: "medium", label: "Medium", size: "text-sm" },
  { id: "large", label: "Large", size: "text-base" },
];

const BUBBLE_STYLES: { id: BubbleStyle; label: string; radius: string }[] = [
  { id: "rounded", label: "Rounded", radius: "rounded-2xl" },
  { id: "sharp", label: "Sharp", radius: "rounded-md" },
  { id: "pill", label: "Pill", radius: "rounded-full" },
];

export default function AppearancePage() {
  const navigate = useNavigate();
  const { darkMode, theme, fontSize, bubbleStyle, update } = useSettings();

  const handleTheme = (id: ThemeId) => {
    update("theme", id);
    toast({ title: "Theme applied! ✨", description: `Switched to ${THEMES.find(t => t.id === id)?.label}` });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings")} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="font-display font-extrabold text-xl text-foreground">Appearance</h1>
            <p className="text-xs text-muted-foreground font-body">Theme & display options</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-5">
        {/* Dark Mode */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cute-shadow">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            {darkMode ? <Moon className="w-5 h-5 text-lavender" /> : <Sun className="w-5 h-5 text-butter" />}
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-sm text-foreground">Dark Mode</p>
            <p className="text-[10px] text-muted-foreground">Easier on the eyes at night 🌙</p>
          </div>
          <button
            onClick={() => update("darkMode", !darkMode)}
            className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center px-0.5 ${darkMode ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`w-6 h-6 rounded-full bg-card shadow-sm transition-all duration-300 ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Theme Picker */}
        <div>
          <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mb-3">
            <Sparkles className="w-3 h-3 inline mr-1" />Color Theme
          </p>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTheme(t.id)}
                className={`bg-card border-2 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all duration-200 cute-shadow ${
                  theme === t.id ? "border-primary scale-[1.02]" : "border-border"
                }`}
              >
                <div className="flex gap-1.5">
                  {t.colors.map((color, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="font-display font-bold text-xs text-foreground">{t.label}</p>
                {theme === t.id && <span className="text-[10px] text-primary font-bold">✓ Active</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mb-3">
            <Type className="w-3 h-3 inline mr-1" />Font Size
          </p>
          <div className="flex gap-2">
            {FONT_SIZES.map((fs) => (
              <button
                key={fs.id}
                onClick={() => update("fontSize", fs.id)}
                className={`flex-1 bg-card border-2 rounded-2xl p-3 flex flex-col items-center gap-1 transition-all duration-200 cute-shadow ${
                  fontSize === fs.id ? "border-primary" : "border-border"
                }`}
              >
                <span className={`font-display font-bold text-foreground ${fs.size}`}>Aa</span>
                <p className="text-[10px] text-muted-foreground font-display">{fs.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Bubble Style */}
        <div>
          <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mb-3">
            <Maximize className="w-3 h-3 inline mr-1" />Chat Bubble Style
          </p>
          <div className="flex gap-2">
            {BUBBLE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => update("bubbleStyle", style.id)}
                className={`flex-1 bg-card border-2 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all cute-shadow ${
                  bubbleStyle === style.id ? "border-primary" : "border-border"
                }`}
              >
                <div className={`w-full h-6 bg-primary/20 ${style.radius}`} />
                <p className="text-[10px] text-muted-foreground font-display">{style.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mb-3">Preview</p>
          <div className="bg-card border border-border rounded-2xl p-4 cute-shadow space-y-2">
            <div className="flex justify-start">
              <div className={`bg-muted border border-border px-4 py-2.5 ${
                bubbleStyle === "rounded" ? "rounded-2xl rounded-bl-md" :
                bubbleStyle === "sharp" ? "rounded-md rounded-bl-none" :
                "rounded-full"
              }`}>
                <p className="text-sm font-body text-foreground">Hello! How are you? 😊</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className={`bg-primary px-4 py-2.5 ${
                bubbleStyle === "rounded" ? "rounded-2xl rounded-br-md" :
                bubbleStyle === "sharp" ? "rounded-md rounded-br-none" :
                "rounded-full"
              }`}>
                <p className="text-sm font-body text-primary-foreground">I'm great! 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
