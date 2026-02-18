import { useState } from "react";
import { Search, Plus, Globe, Wifi, Bluetooth } from "lucide-react";
import { DEMO_CONTACTS } from "@/data/chatData";
import ChatListItem from "@/components/ChatListItem";
import BottomNav from "@/components/BottomNav";
import AddFriendDialog from "@/components/AddFriendDialog";
import logo from "@/assets/sea-u-logo.png";

type ChatMode = "all" | "nearby" | "global";

export default function ChatsPage() {
  const [search, setSearch] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [mode, setMode] = useState<ChatMode>("all");

  const filtered = DEMO_CONTACTS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.uid.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (mode === "nearby") return c.connectionType === "hotspot" || c.connectionType === "bluetooth";
    if (mode === "global") return c.connectionType === "uid";
    return true;
  });

  const onlineCount = DEMO_CONTACTS.filter((c) => c.online).length;
  const globalCount = DEMO_CONTACTS.filter((c) => c.connectionType === "uid").length;
  const nearbyCount = DEMO_CONTACTS.filter((c) => c.connectionType !== "uid").length;

  const modes: { key: ChatMode; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "all", label: "All", icon: null, count: DEMO_CONTACTS.length },
    { key: "nearby", label: "Nearby", icon: <Wifi className="w-3 h-3" />, count: nearbyCount },
    { key: "global", label: "Global", icon: <Globe className="w-3 h-3" />, count: globalCount },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SEA-U" className="w-9 h-9 rounded-xl" />
            <div>
              <h1 className="font-display font-extrabold text-xl text-foreground">SEA-U</h1>
              <p className="text-[10px] text-muted-foreground font-body">{onlineCount} nearby • {globalCount} global</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddFriend(true)}
            className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Mode switcher */}
        <div className="flex gap-1.5 mb-3">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-display font-bold text-xs transition-all duration-200 ${
                mode === m.key
                  ? "bg-primary text-primary-foreground cute-shadow"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {m.icon}
              {m.label}
              <span className={`ml-0.5 text-[10px] ${mode === m.key ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
                {m.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={mode === "global" ? "Search by name or SEA-U ID..." : "Search chats..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </header>

      {/* Global mode banner */}
      {mode === "global" && (
        <div className="mx-4 mt-3 bg-primary/5 border border-primary/15 rounded-2xl p-3 flex items-center gap-3" style={{ animation: "pop-in 0.3s ease-out" }}>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-xs text-foreground">Global Mode 🌏</p>
            <p className="text-[10px] text-muted-foreground">Chat across countries using SEA-U IDs — no proximity needed!</p>
          </div>
        </div>
      )}

      {/* Nearby mode banner */}
      {mode === "nearby" && (
        <div className="mx-4 mt-3 bg-mint/10 border border-mint/20 rounded-2xl p-3 flex items-center gap-3" style={{ animation: "pop-in 0.3s ease-out" }}>
          <div className="w-10 h-10 rounded-2xl bg-mint/20 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-xs text-foreground">Nearby Mode 📡</p>
            <p className="text-[10px] text-muted-foreground">Connected via Hotspot or Bluetooth — fully offline!</p>
          </div>
        </div>
      )}

      {/* Online avatars - show in all & nearby modes */}
      {mode !== "global" && (
        <div className="px-4 py-3">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {DEMO_CONTACTS.filter((c) => c.online).map((c, i) => (
              <div key={c.id} className="flex flex-col items-center gap-1 min-w-fit" style={{ animation: `pop-in 0.3s ease-out ${i * 0.08}s both` }}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 p-0.5">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl">
                    {c.avatar}
                  </div>
                </div>
                <span className="text-[10px] font-display font-semibold text-foreground">{c.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global mode: country grouping */}
      {mode === "global" && (
        <div className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["🇵🇭", "🇻🇳", "🇮🇩", "🇹🇭", "🇲🇾", "🇰🇭", "🇸🇬", "🇲🇲", "🇱🇦", "🇧🇳"].map((flag, i) => (
              <div
                key={flag}
                className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center text-xl cute-shadow hover:scale-110 active:scale-95 transition-all cursor-pointer"
                style={{ animation: `pop-in 0.3s ease-out ${i * 0.05}s both` }}
              >
                {flag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat list */}
      <div className="px-2">
        {filtered.map((contact, i) => (
          <div key={contact.id} style={{ animation: `pop-in 0.3s ease-out ${i * 0.05}s both` }}>
            <ChatListItem contact={contact} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">{mode === "global" ? "🌏" : "🔍"}</p>
            <p className="font-display text-muted-foreground">
              {mode === "global" ? "No global chats yet" : "No chats found"}
            </p>
            {mode === "global" && (
              <button
                onClick={() => setShowAddFriend(true)}
                className="mt-3 px-4 py-2 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
              >
                Add friend by ID ✨
              </button>
            )}
          </div>
        )}
      </div>

      <AddFriendDialog open={showAddFriend} onClose={() => setShowAddFriend(false)} />
      <BottomNav />
    </div>
  );
}