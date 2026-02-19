import { ArrowLeft, Sun, Moon, Sparkles, Type, Maximize } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const THEMES = [
  { id: "pastel", label: "Pastel Dream 🌸", colors: ["hsl(330 60% 72%)", "hsl(270 50% 85%)", "hsl(200 60% 82%)"] },
  { id: "ocean", label: "Ocean Breeze 🌊", colors: ["hsl(200 70% 60%)", "hsl(180 50% 70%)", "hsl(210 60% 80%)"] },
  { id: "sunset", label: "Sunset Glow 🌅", colors: ["hsl(20 80% 65%)", "hsl(40 90% 70%)", "hsl(350 70% 70%)"] },
  { id: "forest", label: "Forest Calm 🌿", colors: ["hsl(140 40% 55%)", "hsl(120 30% 70%)", "hsl(80 40% 75%)"] },
];

const FONT_SIZES = [
  { id: "small", label: "Small", size: "text-xs" },
  { id: "medium", label: "Medium", size: "text-sm" },
  { id: "large", label: "Large", size: "text-base" },
];

export default function AppearancePage() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState("pastel");
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [chatBubbleStyle, setChatBubbleStyle] = useState("rounded");

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
            onClick={() => setDarkMode(!darkMode)}
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
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`bg-card border-2 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all duration-200 cute-shadow ${
                  selectedTheme === theme.id ? "border-primary scale-[1.02]" : "border-border"
                }`}
              >
                <div className="flex gap-1.5">
                  {theme.colors.map((color, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="font-display font-bold text-xs text-foreground">{theme.label}</p>
                {selectedTheme === theme.id && (
                  <span className="text-[10px] text-primary font-bold">✓ Active</span>
                )}
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
                onClick={() => setFontSize(fs.id)}
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
            {[
              { id: "rounded", label: "Rounded", radius: "rounded-2xl" },
              { id: "sharp", label: "Sharp", radius: "rounded-md" },
              { id: "pill", label: "Pill", radius: "rounded-full" },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setChatBubbleStyle(style.id)}
                className={`flex-1 bg-card border-2 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all cute-shadow ${
                  chatBubbleStyle === style.id ? "border-primary" : "border-border"
                }`}
              >
                <div className={`w-full h-6 bg-primary/20 ${style.radius}`} />
                <p className="text-[10px] text-muted-foreground font-display">{style.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
