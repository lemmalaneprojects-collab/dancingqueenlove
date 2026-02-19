import { Moon, Bell, Shield, Palette, Info, ChevronRight, Wifi, Bluetooth, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import logo from "@/assets/sea-u-logo.png";

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
        className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center px-0.5 ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full bg-card shadow-sm transition-all duration-300 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function LinkRow({ icon, label, description, onClick }: { icon: React.ReactNode; label: string; description: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cute-shadow hover:bg-muted/30 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">{icon}</div>
      <div className="flex-1 text-left">
        <p className="font-display font-bold text-sm text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4">
        <h1 className="font-display font-extrabold text-xl text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground font-body">Customize your SEA-U experience</p>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* Connection */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1">Connection</p>
        <ToggleRow
          icon={<Wifi className="w-5 h-5 text-mint" />}
          label="Auto-connect Hotspot"
          description="Automatically connect to nearby devices"
          enabled={autoConnect}
          onToggle={() => setAutoConnect(!autoConnect)}
        />
        <ToggleRow
          icon={<Bluetooth className="w-5 h-5 text-baby-blue" />}
          label="Bluetooth Discovery"
          description="Allow others to find you via Bluetooth"
          enabled={bluetooth}
          onToggle={() => setBluetooth(!bluetooth)}
        />

        {/* Notifications */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mt-4">Notifications</p>
        <ToggleRow
          icon={<Bell className="w-5 h-5 text-coral" />}
          label="Notifications"
          description="Get notified of new messages"
          enabled={notifications}
          onToggle={() => setNotifications(!notifications)}
        />
        <ToggleRow
          icon={<Volume2 className="w-5 h-5 text-butter" />}
          label="Message Sounds"
          description="Play sound for incoming messages"
          enabled={sound}
          onToggle={() => setSound(!sound)}
        />

        {/* General */}
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider px-1 mt-4">General</p>
        <LinkRow icon={<Palette className="w-5 h-5 text-lavender" />} label="Appearance" description="Theme and display options" onClick={() => navigate("/settings/appearance")} />
        <LinkRow icon={<Shield className="w-5 h-5 text-mint" />} label="Privacy" description="Visibility and data controls" onClick={() => navigate("/settings/privacy")} />
        <LinkRow icon={<Info className="w-5 h-5 text-baby-blue" />} label="About SEA-U" description="Version 1.0.0 • Made with 💖" onClick={() => navigate("/settings/about")} />
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center py-8 gap-2">
        <img src={logo} alt="SEA-U" className="w-12 h-12 rounded-2xl opacity-60" />
        <p className="text-[10px] text-muted-foreground font-display">SEA-U v1.0 • Offline Chat for SEA 🌏</p>
      </div>

      <BottomNav />
    </div>
  );
}
