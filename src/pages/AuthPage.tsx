import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/sea-u-logo.png";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";

const COUNTRIES = [
  "Philippines 🇵🇭", "Vietnam 🇻🇳", "Indonesia 🇮🇩", "Thailand 🇹🇭",
  "Malaysia 🇲🇾", "Cambodia 🇰🇭", "Singapore 🇸🇬", "Myanmar 🇲🇲", "Laos 🇱🇦", "Brunei 🇧🇳",
];

const AVATARS = ["🧑", "👩", "👨", "🧑‍💻", "👩‍💻", "👨‍💻", "🧑‍🎨", "👩‍🎤", "🧑‍🚀", "🦊", "🐱", "🐰"];

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Wrong email or password. Please try again! 🔑",
  "Email not confirmed": "Please check your email and click the confirmation link first 📧",
  "User already registered": "This email is already registered. Try logging in instead! 😊",
  "Password should be at least 6 characters": "Password needs at least 6 characters 🔒",
  "Unable to validate email address: invalid format": "Please enter a valid email address 📨",
};

function friendlyError(message: string): string {
  for (const [key, friendly] of Object.entries(ERROR_MESSAGES)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return friendly;
  }
  return message;
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [avatar, setAvatar] = useState("🧑");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Show error from URL params (e.g., from auth error page redirect)
  const urlError = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    if (mode === "signup") {
      if (!displayName.trim()) {
        setErrorMsg("Please enter a display name 😊");
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password needs at least 6 characters 🔒");
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, displayName.trim(), country, avatar);
      if (error) {
        setErrorMsg(friendlyError(error.message));
      } else {
        toast({ title: "Account created! 🎉", description: "You can now log in with your credentials." });
        setMode("login");
        setPassword("");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(friendlyError(error.message));
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

        {/* URL error banner */}
        {urlError && (
          <div className="mb-4 p-3 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-xs font-body text-destructive">{decodeURIComponent(urlError)}</p>
          </div>
        )}

        {/* Inline error */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-2" style={{ animation: "pop-in 0.2s ease-out" }}>
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-xs font-body text-destructive">{errorMsg}</p>
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("login"); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-2xl font-display font-bold text-sm transition-all ${
              mode === "login" ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setMode("signup"); setErrorMsg(null); }}
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 pr-12 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? "Please wait..." : mode === "login" ? "Log In ✨" : "Create Account 🌸"}
          </button>
        </form>

        {mode === "login" && (
          <p className="text-[10px] text-muted-foreground text-center mt-4">
            Forgot your password? Contact support 💌
          </p>
        )}

        {mode === "signup" && (
          <p className="text-[10px] text-muted-foreground text-center mt-4">
            You'll get a unique SEA-U ID after signing up! 🎉
          </p>
        )}
      </div>
    </div>
  );
}
