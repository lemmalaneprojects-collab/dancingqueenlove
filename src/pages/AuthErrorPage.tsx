import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import logo from "@/assets/sea-u-logo.png";

const ERROR_INFO: Record<string, { title: string; description: string; emoji: string }> = {
  access_denied: {
    title: "Access Denied",
    description: "You don't have permission to access this page. Please log in with the correct account.",
    emoji: "🚫",
  },
  session_expired: {
    title: "Session Expired",
    description: "Your session has expired. Please log in again to continue.",
    emoji: "⏰",
  },
  email_not_confirmed: {
    title: "Email Not Confirmed",
    description: "Please check your inbox and click the confirmation link we sent you.",
    emoji: "📧",
  },
  default: {
    title: "Something Went Wrong",
    description: "We encountered an issue with your authentication. Please try again.",
    emoji: "😕",
  },
};

export default function AuthErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const errorType = searchParams.get("type") || "default";
  const errorMessage = searchParams.get("message");
  
  const info = ERROR_INFO[errorType] || ERROR_INFO.default;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <img src={logo} alt="SEA-U" className="w-16 h-16 rounded-2xl cute-shadow mx-auto mb-6" />
        
        <div className="text-5xl mb-4" style={{ animation: "bounce-in 0.5s ease-out" }}>
          {info.emoji}
        </div>

        <h1 className="font-display font-extrabold text-xl text-foreground mb-2">{info.title}</h1>
        <p className="text-sm text-muted-foreground font-body mb-2">{info.description}</p>
        
        {errorMessage && (
          <div className="mt-3 p-3 rounded-2xl bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-2 justify-center">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs font-body text-destructive">{decodeURIComponent(errorMessage)}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-8">
          <button
            onClick={() => navigate("/auth")}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-2xl bg-muted/60 text-muted-foreground font-display font-bold text-sm hover:bg-muted transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
