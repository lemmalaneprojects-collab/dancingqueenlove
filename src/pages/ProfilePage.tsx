import { Camera, Edit3, Copy, Check, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { profile, signOut, updateProfile } = useAuth();

  if (!profile) return null;

  const copyUID = () => {
    navigator.clipboard.writeText(profile.sea_id).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = async () => {
    if (!editingField) return;
    await updateProfile({ [editingField]: editValue });
    setEditingField(null);
    setEditValue("");
  };

  const fields = [
    { key: "display_name", label: "Display Name", value: profile.display_name, icon: "✨" },
    { key: "status", label: "Status", value: profile.status || "No status set", icon: "💬" },
    { key: "country", label: "Country", value: profile.country || "Not set", icon: "🌏" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4 flex items-center justify-between">
        <h1 className="font-display font-extrabold text-xl text-foreground">Profile</h1>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive font-display font-bold text-xs hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </header>

      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 p-1 cute-shadow">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-5xl">
              {profile.avatar}
            </div>
          </div>
        </div>
        <h2 className="font-display font-extrabold text-lg mt-3 text-foreground">{profile.display_name}</h2>
        <p className="text-xs text-muted-foreground font-body">SEA-U member</p>

        <button
          onClick={copyUID}
          className="mt-3 flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all active:scale-95"
        >
          <span className="text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider">Your ID</span>
          <span className="font-display font-extrabold text-sm text-primary tracking-widest">{profile.sea_id}</span>
          {copied ? <Check className="w-3.5 h-3.5 text-mint" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
        </button>
        <p className="text-[10px] text-muted-foreground mt-1">Share this ID so friends can chat you from anywhere! 🌏</p>
      </div>

      <div className="px-4 space-y-3">
        {fields.map((field, i) => (
          <div
            key={field.key}
            className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between cute-shadow"
            style={{ animation: `pop-in 0.3s ease-out ${i * 0.06}s both` }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xl">{field.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground font-display font-semibold uppercase tracking-wider">{field.label}</p>
                {editingField === field.key ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="flex-1 px-2 py-1 rounded-lg bg-muted/60 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-display font-bold">
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-body font-medium text-foreground truncate">{field.value}</p>
                )}
              </div>
            </div>
            {editingField !== field.key && (
              <button onClick={() => startEdit(field.key, field.value)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <Edit3 className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
