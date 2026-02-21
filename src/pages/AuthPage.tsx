import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/sea-u-logo.png";
import { toast } from "@/hooks/use-toast";

const COUNTRIES = [
  "Philippines 🇵🇭", "Vietnam 🇻🇳", "Indonesia 🇮🇩", "Thailand 🇹🇭",
  "Malaysia 🇲🇾", "Cambodia 🇰🇭", "Singapore 🇸🇬", "Myanmar 🇲🇲", "Laos 🇱🇦", "Brunei 🇧🇳",
];

const AVATARS = ["🧑", "👩", "👨", "🧑‍💻", "👩‍💻", "👨‍💻", "🧑‍🎨", "👩‍🎤", "🧑‍🚀", "🦊", "🐱", "🐰"];

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [avatar, setAvatar] = useState("🧑");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "signup") {
      if (!displayName.trim()) {
        toast({ title: "Please enter a display name", variant: "destructive" });
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, displayName.trim(), country, avatar);
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email! 📧", description: "We sent a confirmation link. Please verify your email to log in." });
        setMode("login");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="SEA-U" className="w-20 h-20 rounded-3xl cute-shadow mb-4" />
          <h1 className="font-display font-extrabold text-3xl text-foreground">SEA-U</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Connect across Southeast Asia 🌏</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 rounded-2xl font-display font-bold text-sm transition-all ${
              mode === "login" ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 rounded-2xl font-display font-bold text-sm transition-all ${
              mode === "signup" ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              {/* Avatar picker */}
              <div>
                <label className="text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider">Pick your avatar</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${
                        avatar === a ? "bg-primary/20 ring-2 ring-primary scale-110" : "bg-muted/60 hover:bg-muted"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-muted/60 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? "Please wait..." : mode === "login" ? "Log In ✨" : "Create Account 🌸"}
          </button>
        </form>

        {mode === "signup" && (
          <p className="text-[10px] text-muted-foreground text-center mt-4">
            You'll get a unique SEA-U ID after signing up! 🎉
          </p>
        )}
      </div>
    </div>
  );
}
