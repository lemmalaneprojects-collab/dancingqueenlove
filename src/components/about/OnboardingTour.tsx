import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Wifi, Globe, Shield, Heart, Sparkles } from "lucide-react";
import logo from "@/assets/sea-u-logo.png";

const STEPS = [
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Welcome to SEA-U! 🌏",
    desc: "The offline-first messenger built for Southeast Asia by Lemma Lane.",
    detail: "SEA-U lets you chat with anyone — even without internet. Whether you're on a boat in the Philippines, a train in Thailand, or a café in Vietnam, you're always connected.",
    bg: "from-primary/10 to-accent/10",
  },
  {
    icon: <Wifi className="w-8 h-8 text-mint" />,
    title: "Offline-First Magic ✨",
    desc: "No internet? No problem. Chat via WiFi hotspot or Bluetooth.",
    detail: "SEA-U creates direct peer-to-peer connections between devices. Turn on your hotspot, and nearby SEA-U users can find and message you instantly. Bluetooth works too — up to 10 meters!",
    bg: "from-mint/10 to-baby-blue/10",
  },
  {
    icon: <Globe className="w-8 h-8 text-baby-blue" />,
    title: "Your Unique SEA-U ID 🆔",
    desc: "A global identity that works across all 10+ SEA countries.",
    detail: "Your SEA-U ID is yours forever. Share it with friends in any country — when you're both online or nearby, you'll connect instantly. No phone number required.",
    bg: "from-baby-blue/10 to-lavender/10",
  },
  {
    icon: <Shield className="w-8 h-8 text-lavender" />,
    title: "Privacy by Design 🔒",
    desc: "Your messages stay on your device. We never see them.",
    detail: "SEA-U is built with a local-first architecture. There are no servers storing your chats. No tracking, no analytics, no ads. Your conversations are truly private.",
    bg: "from-lavender/10 to-coral/10",
  },
  {
    icon: <Heart className="w-8 h-8 text-coral" />,
    title: "Made by Lemma Lane 💖",
    desc: "Lemuel & Lane — two dreamers connecting Southeast Asia.",
    detail: "We're a tiny team from the Philippines who believe everyone deserves beautiful, private communication tools — regardless of internet access or income. SEA-U is, and always will be, free.",
    bg: "from-coral/10 to-primary/10",
  },
];

const TOUR_KEY = "sea-u-tour-completed";

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem(TOUR_KEY, "true");
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  // Also expose a way to re-trigger the tour
  useEffect(() => {
    const handler = () => {
      setStep(0);
      setIsOpen(true);
    };
    window.addEventListener("sea-u-restart-tour", handler);
    return () => window.removeEventListener("sea-u-restart-tour", handler);
  }, []);

  if (!isOpen) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "pop-in 0.3s ease-out" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={close} />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl cute-shadow overflow-hidden" key={step}>
        {/* Close */}
        <button onClick={close} className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/40" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 pt-4 flex flex-col items-center text-center space-y-4" style={{ animation: "slide-up 0.3s ease-out" }}>
          {step === 0 ? (
            <img src={logo} alt="SEA-U" className="w-16 h-16 rounded-2xl" />
          ) : (
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${current.bg} flex items-center justify-center`}>
              {current.icon}
            </div>
          )}

          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-lg text-foreground">{current.title}</h2>
            <p className="text-xs text-primary font-display font-semibold">{current.desc}</p>
            <p className="text-[11px] text-muted-foreground font-body leading-relaxed max-w-[280px]">
              {current.detail}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 pt-0">
          <button
            onClick={prev}
            disabled={step === 0}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-display font-bold transition-all active:scale-95 ${
              step === 0 ? "opacity-0 pointer-events-none" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>

          <button
            onClick={next}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-display font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
          >
            {isLast ? "Get Started! 🎉" : "Next"} {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Skip */}
        <div className="text-center pb-4">
          <button onClick={close} className="text-[10px] text-muted-foreground/60 font-display hover:text-muted-foreground transition-colors">
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
