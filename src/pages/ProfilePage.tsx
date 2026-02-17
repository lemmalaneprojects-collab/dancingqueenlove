import { ArrowLeft, Camera, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4 flex items-center gap-3">
        <h1 className="font-display font-extrabold text-xl text-foreground">Profile</h1>
      </header>

      {/* Avatar section */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 p-1 cute-shadow">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-5xl">
              🧑‍💻
            </div>
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-card">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <h2 className="font-display font-extrabold text-lg mt-3 text-foreground">You</h2>
        <p className="text-xs text-muted-foreground font-body">SEA-U member since 2025</p>
      </div>

      {/* Profile fields */}
      <div className="px-4 space-y-3">
        {[
          { label: "Display Name", value: "CuteUser_123", icon: "✨" },
          { label: "Status", value: "Vibing with SEA friends~ 🌺", icon: "💬" },
          { label: "Country", value: "Philippines 🇵🇭", icon: "🌏" },
          { label: "Language", value: "English, Filipino", icon: "🗣️" },
          { label: "Favorite Sticker", value: "🧋", icon: "⭐" },
        ].map((field, i) => (
          <div
            key={field.label}
            className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between cute-shadow"
            style={{ animation: `pop-in 0.3s ease-out ${i * 0.06}s both` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{field.icon}</span>
              <div>
                <p className="text-[10px] text-muted-foreground font-display font-semibold uppercase tracking-wider">{field.label}</p>
                <p className="text-sm font-body font-medium text-foreground">{field.value}</p>
              </div>
            </div>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors">
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="px-4 mt-6">
        <h3 className="font-display font-bold text-sm text-foreground mb-3">Your Stats ✨</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Messages", value: "142", color: "bg-peach/40" },
            { label: "Stickers", value: "38", color: "bg-lavender/40" },
            { label: "Friends", value: "6", color: "bg-mint/40" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-3 text-center cute-shadow`}>
              <p className="font-display font-extrabold text-xl text-foreground">{stat.value}</p>
              <p className="text-[10px] font-display font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
