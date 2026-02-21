import { Wifi, Bluetooth, Globe, RefreshCw, Search, Copy, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { findOrCreateConversation } from "@/hooks/useConversations";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Tab = "nearby" | "global";

export default function NearbyPage() {
  const [scanning, setScanning] = useState(false);
  const [tab, setTab] = useState<Tab>("nearby");
  const [globalSearch, setGlobalSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [globalUsers, setGlobalUsers] = useState<Profile[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  const copyUID = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.sea_id).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch global directory
  useEffect(() => {
    if (tab !== "global") return;
    setLoadingGlobal(true);

    const fetchUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("show_in_directory", true)
        .neq("user_id", user?.id || "")
        .limit(50);

      setGlobalUsers(data || []);
      setLoadingGlobal(false);
    };

    fetchUsers();
  }, [tab, user]);

  const filteredGlobal = globalUsers.filter(
    (u) =>
      u.display_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      u.sea_id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      u.country.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const handleChatUser = async (otherUserId: string) => {
    if (!user) return;
    try {
      const convId = await findOrCreateConversation(user.id, otherUserId);
      navigate(`/chat/${convId}`);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4">
        <h1 className="font-display font-extrabold text-xl text-foreground mb-1">Discover</h1>
        <p className="text-xs text-muted-foreground font-body">Find people nearby or across SEA 🌏</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTab("nearby")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl font-display font-bold text-xs transition-all duration-200 ${
              tab === "nearby"
                ? "bg-secondary/30 text-secondary-foreground border border-secondary/40"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            Nearby
          </button>
          <button
            onClick={() => setTab("global")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl font-display font-bold text-xs transition-all duration-200 ${
              tab === "global"
                ? "bg-primary/15 text-primary border border-primary/25"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Global
          </button>
        </div>
      </header>

      {tab === "nearby" ? (
        <>
          <div className="px-4 py-4 grid grid-cols-2 gap-3">
            <button className="bg-card border border-border rounded-3xl p-4 flex flex-col items-center gap-2 cute-shadow hover:scale-105 active:scale-95 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/30 flex items-center justify-center">
                <Wifi className="w-6 h-6 text-secondary-foreground" />
              </div>
              <span className="font-display font-bold text-xs text-foreground">Hotspot</span>
              <span className="text-[10px] text-muted-foreground">WiFi Direct</span>
            </button>
            <button className="bg-card border border-border rounded-3xl p-4 flex flex-col items-center gap-2 cute-shadow hover:scale-105 active:scale-95 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-baby-blue/30 flex items-center justify-center">
                <Bluetooth className="w-6 h-6 text-foreground" />
              </div>
              <span className="font-display font-bold text-xs text-foreground">Bluetooth</span>
              <span className="text-[10px] text-muted-foreground">Short range</span>
            </button>
          </div>

          <div className="px-4 mb-4">
            <button
              onClick={handleScan}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scanning..." : "Scan for Devices"}
            </button>
          </div>

          <div className="px-4">
            <div className="bg-muted/40 rounded-2xl p-6 text-center">
              <p className="text-3xl mb-2">📡</p>
              <h3 className="font-display font-bold text-sm text-foreground mb-1">Native Scanning Required</h3>
              <p className="text-[10px] text-muted-foreground">
                Bluetooth & WiFi Direct scanning requires the native app (Capacitor).
                Export this project and build with Capacitor to enable real device scanning.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Your ID card */}
          {profile && (
            <div className="px-4 pt-4 pb-2">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/15 rounded-2xl p-4 cute-shadow">
                <p className="text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1">Your SEA-U ID</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-lg text-primary tracking-widest">{profile.sea_id}</span>
                  <button
                    onClick={copyUID}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-display font-bold text-[10px] hover:bg-primary/20 transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {profile.show_in_directory
                    ? "You're visible in the directory 🌏"
                    : "You're hidden from the directory 🔒"}
                </p>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="px-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, ID, or country..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Users directory */}
          <div className="px-4 mt-1">
            <h2 className="font-display font-bold text-sm text-foreground mb-3">SEA-U Directory 🌸</h2>
            {loadingGlobal ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {filteredGlobal.map((u, i) => (
                  <div
                    key={u.id}
                    className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3 cute-shadow"
                    style={{ animation: `pop-in 0.3s ease-out ${i * 0.08}s both` }}
                  >
                    <div className="w-11 h-11 rounded-full bg-lavender flex items-center justify-center text-xl">
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-sm text-foreground truncate">{u.display_name}</h3>
                      <p className="text-[10px] text-muted-foreground truncate">{u.status || "No status"}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Globe className="w-2.5 h-2.5 text-primary" />
                        <span className="text-[9px] text-muted-foreground/70 font-mono">{u.sea_id}</span>
                        <span className="text-[9px] text-muted-foreground/50">·</span>
                        <span className="text-[9px] text-muted-foreground/70">{u.country}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleChatUser(u.user_id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-display font-bold text-[10px] hover:bg-primary/20 transition-colors active:scale-95"
                    >
                      <Globe className="w-3 h-3" />
                      Chat
                    </button>
                  </div>
                ))}
                {filteredGlobal.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2">🌏</p>
                    <p className="text-xs font-display text-muted-foreground">
                      {globalSearch ? "No users found" : "No users in directory yet"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
