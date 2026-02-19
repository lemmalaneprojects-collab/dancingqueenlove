import { ArrowLeft, Heart, Globe, Github, Mail, Star, Shield, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/sea-u-logo.png";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings")} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="font-display font-extrabold text-xl text-foreground">About SEA-U</h1>
            <p className="text-xs text-muted-foreground font-body">Learn more about this app</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-5">
        {/* Hero Card */}
        <div className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center gap-3 cute-shadow text-center">
          <img src={logo} alt="SEA-U" className="w-20 h-20 rounded-3xl" />
          <h2 className="font-display font-extrabold text-2xl text-foreground">SEA-U</h2>
          <p className="text-xs text-muted-foreground font-body max-w-[260px]">
            Offline-first chat for Southeast Asia. Connect with anyone nearby via hotspot, Bluetooth, or globally with your unique SEA-U ID 🌏
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-primary/15 text-primary font-display font-bold text-[10px] px-3 py-1 rounded-full">v1.0.0</span>
            <span className="bg-mint/30 text-foreground font-display font-bold text-[10px] px-3 py-1 rounded-full">Stable</span>
          </div>
        </div>

        {/* Features */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">Key Features</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Wifi className="w-5 h-5 text-mint" />, title: "Offline Chat", desc: "No internet needed" },
            { icon: <Globe className="w-5 h-5 text-baby-blue" />, title: "Global ID", desc: "Chat across countries" },
            { icon: <Shield className="w-5 h-5 text-lavender" />, title: "Private", desc: "End-to-end secure" },
            { icon: <Heart className="w-5 h-5 text-coral" />, title: "Free Forever", desc: "No ads, no fees" },
          ].map((f, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 cute-shadow text-center">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">{f.icon}</div>
              <p className="font-display font-bold text-xs text-foreground">{f.title}</p>
              <p className="text-[10px] text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Credits */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">Credits</p>
        <div className="bg-card border border-border rounded-2xl p-4 cute-shadow space-y-3">
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4 text-butter" />
            <p className="text-xs text-foreground font-body">
              <span className="font-display font-bold">Made with </span>
              <Heart className="w-3 h-3 inline text-coral" />
              <span className="font-display font-bold"> for SEA communities</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-baby-blue" />
            <p className="text-xs text-muted-foreground font-body">🇵🇭 🇻🇳 🇮🇩 🇹🇭 🇲🇾 🇰🇭 🇲🇲 🇸🇬 🇱🇦 🇧🇳</p>
          </div>
        </div>

        {/* Links */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">Links</p>
        <div className="space-y-2">
          {[
            { icon: <Github className="w-5 h-5 text-foreground" />, label: "Source Code", desc: "Open source on GitHub" },
            { icon: <Mail className="w-5 h-5 text-baby-blue" />, label: "Contact Us", desc: "hello@sea-u.app" },
            { icon: <Star className="w-5 h-5 text-butter" />, label: "Rate SEA-U", desc: "Leave a review ⭐" },
          ].map((link, i) => (
            <button key={i} className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cute-shadow hover:bg-muted/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">{link.icon}</div>
              <div className="flex-1 text-left">
                <p className="font-display font-bold text-sm text-foreground">{link.label}</p>
                <p className="text-[10px] text-muted-foreground">{link.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-[10px] text-muted-foreground font-display">© 2026 SEA-U • All rights reserved</p>
          <p className="text-[10px] text-muted-foreground font-display mt-1">Made with 💖 in Southeast Asia</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
