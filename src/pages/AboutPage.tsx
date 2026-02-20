import { useState } from "react";
import { ArrowLeft, Heart, Globe, ExternalLink, Mail, Star, Shield, Wifi, Users, Code, Sparkles, MessageCircle, Zap, ChevronDown, ChevronUp, Copy, Check, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/sea-u-logo.png";
import { toast } from "@/hooks/use-toast";
import CommunityGallery from "@/components/about/CommunityGallery";
import InteractiveTimeline from "@/components/about/InteractiveTimeline";

const TEAM = [
  { name: "Lemuel", role: "Founder & Lead Developer", country: "🇵🇭", avatar: "👨‍💻", bio: "Visionary behind SEA-U. Passionate about connecting Southeast Asian communities through technology.", socials: "@lemuel.dev" },
  { name: "Lane", role: "Co-Founder & Creative Director", country: "🇵🇭", avatar: "🎨", bio: "Designs every pixel with love. Believes great apps should feel like home.", socials: "@lane.creates" },
];

const MILESTONES_REMOVED = true; // moved to InteractiveTimeline component

const FAQ = [
  { q: "Is SEA-U really free?", a: "Yes! 100% free, no ads, no subscriptions, no hidden fees. Forever." },
  { q: "How does offline chat work?", a: "SEA-U uses WiFi hotspot and Bluetooth to create direct peer-to-peer connections — no internet required!" },
  { q: "Is my data safe?", a: "Absolutely. Messages are stored locally on your device. We don't have servers that store your chats." },
  { q: "Can I chat with people in other countries?", a: "Yes! Use your unique SEA-U ID to connect with anyone globally, even without being nearby." },
];

const STATS = [
  { label: "Countries", value: "10+", icon: "🌏" },
  { label: "Languages", value: "15+", icon: "🗣️" },
  { label: "Downloads", value: "50K+", icon: "📲" },
  { label: "Messages Sent", value: "2M+", icon: "💬" },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);
  const [likeCount, setLikeCount] = useState(1247);
  const [liked, setLiked] = useState(false);

  const handleLink = (label: string, url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener");
    } else {
      toast({ title: `${label}`, description: "Coming soon! Stay tuned 🌸" });
    }
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText("SEA-U App by Lemma Lane");
    setCopiedUid(true);
    toast({ title: "Copied! 📋", description: "Share SEA-U with your friends!" });
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    if (!liked) toast({ title: "Thanks for the love! 💖" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings")} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="font-display font-extrabold text-xl text-foreground">About SEA-U</h1>
            <p className="text-xs text-muted-foreground font-body">Built with 💖 by Lemma Lane</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-5">
        {/* Hero Card */}
        <div className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center gap-3 cute-shadow text-center relative overflow-hidden">
          <div className="absolute top-2 right-3 text-lg" style={{ animation: "float 3s ease-in-out infinite" }}>✨</div>
          <div className="absolute top-8 left-4 text-sm" style={{ animation: "float 4s ease-in-out 1s infinite" }}>🌺</div>
          <img src={logo} alt="SEA-U" className="w-20 h-20 rounded-3xl" style={{ animation: "pop-in 0.5s ease-out" }} />
          <h2 className="font-display font-extrabold text-2xl text-foreground">SEA-U</h2>
          <p className="text-[10px] font-display font-bold text-primary tracking-widest uppercase">by Lemma Lane</p>
          <p className="text-xs text-muted-foreground font-body max-w-[280px]">
            Offline-first chat for Southeast Asia. Connect with anyone nearby via hotspot, Bluetooth, or globally with your unique SEA-U ID 🌏
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-primary/15 text-primary font-display font-bold text-[10px] px-3 py-1 rounded-full">v1.0.0</span>
            <span className="bg-secondary/40 text-foreground font-display font-bold text-[10px] px-3 py-1 rounded-full">Stable</span>
          </div>
          {/* Like & Share */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-display font-bold transition-all duration-200 active:scale-95 ${
                liked ? "bg-coral/20 text-coral" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Heart className={`w-4 h-4 transition-all ${liked ? "fill-current scale-110" : ""}`} />
              {likeCount.toLocaleString()}
            </button>
            <button
              onClick={handleCopyUid}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-muted text-muted-foreground text-xs font-display font-bold hover:bg-muted/80 transition-all active:scale-95"
            >
              {copiedUid ? <Check className="w-4 h-4 text-mint" /> : <Copy className="w-4 h-4" />}
              Share
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event("sea-u-restart-tour"))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-muted text-muted-foreground text-xs font-display font-bold hover:bg-muted/80 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Tour
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-2">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center gap-1 cute-shadow text-center"
              style={{ animation: `pop-in 0.3s ease-out ${i * 0.1}s both` }}
            >
              <span className="text-xl">{stat.icon}</span>
              <p className="font-display font-extrabold text-sm text-foreground">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">
          <Sparkles className="w-3 h-3 inline mr-1" />Key Features
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Wifi className="w-5 h-5 text-mint" />, title: "Offline Chat", desc: "No internet needed", detail: "WiFi Direct & Bluetooth" },
            { icon: <Globe className="w-5 h-5 text-baby-blue" />, title: "Global ID", desc: "Chat across countries", detail: "Unique SEA-U ID system" },
            { icon: <Shield className="w-5 h-5 text-lavender" />, title: "Private", desc: "End-to-end secure", detail: "Local-first architecture" },
            { icon: <Heart className="w-5 h-5 text-coral" />, title: "Free Forever", desc: "No ads, no fees", detail: "Community-driven project" },
            { icon: <MessageCircle className="w-5 h-5 text-primary" />, title: "Stickers", desc: "Express yourself", detail: "100+ cute stickers" },
            { icon: <Zap className="w-5 h-5 text-butter" />, title: "Instant", desc: "Lightning fast", detail: "Real-time P2P messaging" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 cute-shadow text-center hover:scale-[1.02] transition-transform duration-200"
              style={{ animation: `pop-in 0.3s ease-out ${i * 0.06}s both` }}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">{f.icon}</div>
              <p className="font-display font-bold text-xs text-foreground">{f.title}</p>
              <p className="text-[10px] text-muted-foreground">{f.desc}</p>
              <p className="text-[9px] text-muted-foreground/60 italic">{f.detail}</p>
            </div>
          ))}
        </div>

        {/* Team — Lemma Lane */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">
          <Users className="w-3 h-3 inline mr-1" />Lemma Lane
        </p>
        <div className="space-y-2">
          {TEAM.map((member, i) => (
            <button
              key={i}
              onClick={() => setExpandedMember(expandedMember === i ? null : i)}
              className="w-full bg-card border border-border rounded-2xl p-3 cute-shadow text-left transition-all duration-200 hover:bg-muted/20 active:scale-[0.98]"
              style={{ animation: `pop-in 0.3s ease-out ${i * 0.08}s both` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-lavender flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-sm text-foreground">{member.name} {member.country}</p>
                  <p className="text-[10px] text-primary font-display font-semibold">{member.role}</p>
                </div>
                {expandedMember === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
              {expandedMember === i && (
                <div className="mt-3 pt-3 border-t border-border space-y-2" style={{ animation: "slide-up 0.2s ease-out" }}>
                  <p className="text-xs text-muted-foreground font-body">{member.bio}</p>
                  <p className="text-[10px] text-primary/80 font-mono">{member.socials}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Interactive Timeline */}
        <InteractiveTimeline />

        {/* Community Gallery */}
        <CommunityGallery />

        {/* FAQ */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">
          <MessageCircle className="w-3 h-3 inline mr-1" />FAQ
        </p>
        <div className="space-y-2">
          {FAQ.map((faq, i) => (
            <button
              key={i}
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              className="w-full bg-card border border-border rounded-2xl p-4 cute-shadow text-left transition-all duration-200 hover:bg-muted/20 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-display font-bold text-xs text-foreground">{faq.q}</p>
                {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </div>
              {expandedFaq === i && (
                <p className="text-xs text-muted-foreground font-body mt-2 pt-2 border-t border-border" style={{ animation: "slide-up 0.2s ease-out" }}>
                  {faq.a}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Credits */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">Credits & Tech</p>
        <div className="bg-card border border-border rounded-2xl p-4 cute-shadow space-y-3">
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4 text-butter" />
            <p className="text-xs text-foreground font-body">
              <span className="font-display font-bold">Made with </span>
              <Heart className="w-3 h-3 inline text-coral" />
              <span className="font-display font-bold"> by Lemma Lane</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-baby-blue" />
            <p className="text-xs text-muted-foreground font-body">🇵🇭 🇻🇳 🇮🇩 🇹🇭 🇲🇾 🇰🇭 🇲🇲 🇸🇬 🇱🇦 🇧🇳</p>
          </div>
          <div className="flex items-center gap-3">
            <Code className="w-4 h-4 text-lavender" />
            <p className="text-xs text-muted-foreground font-body">React • TypeScript • Tailwind CSS • Vite</p>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-mint" />
            <p className="text-xs text-muted-foreground font-body">Privacy-first • No tracking • No analytics</p>
          </div>
        </div>

        {/* Links */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">Links</p>
        <div className="space-y-2">
          {[
            { icon: <ExternalLink className="w-5 h-5 text-foreground" />, label: "Source Code", desc: "Open source on GitHub", action: () => handleLink("Source Code", "https://github.com") },
            { icon: <Mail className="w-5 h-5 text-baby-blue" />, label: "Contact Lemma Lane", desc: "hello@lemmalane.dev", action: () => handleLink("Contact", "mailto:hello@lemmalane.dev") },
            { icon: <Star className="w-5 h-5 text-butter" />, label: "Rate SEA-U", desc: "Leave a review ⭐", action: () => handleLink("Rate SEA-U") },
            { icon: <Globe className="w-5 h-5 text-mint" />, label: "Visit Website", desc: "lemmalane.dev", action: () => handleLink("Website") },
          ].map((link, i) => (
            <button
              key={i}
              onClick={link.action}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cute-shadow hover:bg-muted/30 active:scale-[0.98] transition-all duration-150"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">{link.icon}</div>
              <div className="flex-1 text-left">
                <p className="font-display font-bold text-sm text-foreground">{link.label}</p>
                <p className="text-[10px] text-muted-foreground">{link.desc}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 space-y-1">
          <p className="text-[10px] text-muted-foreground font-display">© 2026 Lemma Lane • All rights reserved</p>
          <p className="text-[10px] text-muted-foreground font-display">SEA-U — Connecting Southeast Asia, one chat at a time 💖</p>
          <p className="text-[10px] text-muted-foreground/50 font-mono mt-2">v1.0.0 • Build 2026.02.20</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
