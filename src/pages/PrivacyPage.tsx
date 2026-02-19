import { ArrowLeft, Eye, EyeOff, MapPin, Clock, Trash2, Download, ShieldCheck, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

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

export default function PrivacyPage() {
  const navigate = useNavigate();
  const settings = useSettings();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = () => {
    settings.exportData();
    toast({ title: "Data exported! 📥", description: "Your SEA-U data has been downloaded." });
  };

  const handleClearHistory = () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }
    settings.clearChatHistory();
    setShowClearConfirm(false);
    toast({ title: "Chat history cleared 🗑️", description: "All messages have been removed." });
  };

  const handleDeleteAccount = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    localStorage.clear();
    setShowDeleteConfirm(false);
    toast({ title: "Account deleted", description: "All data has been removed. Restarting..." });
    setTimeout(() => window.location.reload(), 1500);
  };

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
          enabled={settings.showOnline}
          onToggle={() => settings.update("showOnline", !settings.showOnline)}
        />
        <ToggleRow
          icon={<Clock className="w-5 h-5 text-lavender" />}
          label="Show Last Seen"
          description="Display your last active time"
          enabled={settings.showLastSeen}
          onToggle={() => settings.update("showLastSeen", !settings.showLastSeen)}
        />
        <ToggleRow
          icon={<MapPin className="w-5 h-5 text-coral" />}
          label="Share Location"
          description="Show approximate location to nearby users"
          enabled={settings.shareLocation}
          onToggle={() => settings.update("shareLocation", !settings.shareLocation)}
        />
        <ToggleRow
          icon={<EyeOff className="w-5 h-5 text-mint" />}
          label="Read Receipts"
          description="Show when you've read messages"
          enabled={settings.readReceipts}
          onToggle={() => settings.update("readReceipts", !settings.readReceipts)}
        />

        {/* Profile */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mt-4">Profile</p>
        <ToggleRow
          icon={<ShieldCheck className="w-5 h-5 text-mint" />}
          label="Profile Visible in Directory"
          description="Allow users to find you in the global directory"
          enabled={settings.profileVisible}
          onToggle={() => settings.update("profileVisible", !settings.profileVisible)}
        />
        <ToggleRow
          icon={<UserX className="w-5 h-5 text-butter" />}
          label="Block Unknown Users"
          description="Only allow contacts to message you"
          enabled={settings.blockStrangers}
          onToggle={() => settings.update("blockStrangers", !settings.blockStrangers)}
        />

        {/* Data Controls */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mt-4">Data Controls</p>
        
        <button
          onClick={handleExport}
          className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cute-shadow hover:bg-muted/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Download className="w-5 h-5 text-baby-blue" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display font-bold text-sm text-foreground">Export My Data</p>
            <p className="text-[10px] text-muted-foreground">Download all your chats and profile info</p>
          </div>
        </button>

        <button
          onClick={handleClearHistory}
          className="w-full bg-card border border-destructive/30 rounded-2xl p-4 flex items-center gap-3 cute-shadow hover:bg-destructive/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display font-bold text-sm text-destructive">
              {showClearConfirm ? "Tap again to confirm" : "Clear All Chat History"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {showClearConfirm ? "This action cannot be undone!" : "Permanently delete all messages"}
            </p>
          </div>
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full bg-card border border-destructive/30 rounded-2xl p-4 flex items-center gap-3 cute-shadow hover:bg-destructive/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display font-bold text-sm text-destructive">
              {showDeleteConfirm ? "Tap again to DELETE everything" : "Delete My Account"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {showDeleteConfirm ? "⚠️ All data will be permanently lost!" : "Remove all data and deactivate your SEA-U ID"}
            </p>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
