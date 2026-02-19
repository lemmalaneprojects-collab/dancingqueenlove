import { ArrowLeft, Eye, EyeOff, MapPin, Clock, Trash2, Download, ShieldCheck, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({ icon, label, description, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cute-shadow">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <p className="font-display font-bold text-sm text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center px-0.5 ${enabled ? "bg-primary" : "bg-muted"}`}
      >
        <div className={`w-6 h-6 rounded-full bg-card shadow-sm transition-all duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function ActionRow({ icon, label, description, destructive, onClick }: {
  icon: React.ReactNode; label: string; description: string; destructive?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-card border rounded-2xl p-4 flex items-center gap-3 cute-shadow transition-colors ${
        destructive ? "border-destructive/30 hover:bg-destructive/5" : "border-border hover:bg-muted/30"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${destructive ? "bg-destructive/10" : "bg-muted"}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`font-display font-bold text-sm ${destructive ? "text-destructive" : "text-foreground"}`}>{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

export default function PrivacyPage() {
  const navigate = useNavigate();
  const [showOnline, setShowOnline] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(true);
  const [showLocation, setShowLocation] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [blockStrangers, setBlockStrangers] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings")} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="font-display font-extrabold text-xl text-foreground">Privacy</h1>
            <p className="text-xs text-muted-foreground font-body">Visibility & data controls</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* Visibility */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">Visibility</p>
        <ToggleRow
          icon={<Eye className="w-5 h-5 text-baby-blue" />}
          label="Show Online Status"
          description="Let others see when you're online"
          enabled={showOnline}
          onToggle={() => setShowOnline(!showOnline)}
        />
        <ToggleRow
          icon={<Clock className="w-5 h-5 text-lavender" />}
          label="Show Last Seen"
          description="Display your last active time"
          enabled={showLastSeen}
          onToggle={() => setShowLastSeen(!showLastSeen)}
        />
        <ToggleRow
          icon={<MapPin className="w-5 h-5 text-coral" />}
          label="Share Location"
          description="Show approximate location to nearby users"
          enabled={showLocation}
          onToggle={() => setShowLocation(!showLocation)}
        />
        <ToggleRow
          icon={<EyeOff className="w-5 h-5 text-mint" />}
          label="Read Receipts"
          description="Show when you've read messages"
          enabled={readReceipts}
          onToggle={() => setReadReceipts(!readReceipts)}
        />

        {/* Profile */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mt-4">Profile</p>
        <ToggleRow
          icon={<ShieldCheck className="w-5 h-5 text-mint" />}
          label="Profile Visible in Directory"
          description="Allow users to find you in the global directory"
          enabled={profileVisible}
          onToggle={() => setProfileVisible(!profileVisible)}
        />
        <ToggleRow
          icon={<UserX className="w-5 h-5 text-butter" />}
          label="Block Unknown Users"
          description="Only allow contacts to message you"
          enabled={blockStrangers}
          onToggle={() => setBlockStrangers(!blockStrangers)}
        />

        {/* Data Controls */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mt-4">Data Controls</p>
        <ActionRow
          icon={<Download className="w-5 h-5 text-baby-blue" />}
          label="Export My Data"
          description="Download all your chats and profile info"
        />
        <ActionRow
          icon={<Trash2 className="w-5 h-5 text-destructive" />}
          label="Clear All Chat History"
          description="Permanently delete all messages"
          destructive
        />
        <ActionRow
          icon={<Trash2 className="w-5 h-5 text-destructive" />}
          label="Delete My Account"
          description="Remove all data and deactivate your SEA-U ID"
          destructive
        />
      </div>

      <BottomNav />
    </div>
  );
}
