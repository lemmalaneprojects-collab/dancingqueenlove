import { useState } from "react";
import { Search, Plus, Globe, Wifi } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import AddFriendDialog from "@/components/AddFriendDialog";
import logo from "@/assets/sea-u-logo.png";
import { formatDistanceToNow } from "date-fns";

export default function ChatsPage() {
  const [search, setSearch] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const { conversations, loading } = useConversations();
  const { showOnline, showLastSeen } = useSettings();
  const navigate = useNavigate();

  const filtered = conversations.filter((c) =>
    c.otherUser.display_name.toLowerCase().includes(search.toLowerCase()) ||
    c.otherUser.sea_id.toLowerCase().includes(search.toLowerCase())
  );

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: false });
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SEA-U" className="w-9 h-9 rounded-xl" />
            <div>
              <h1 className="font-display font-extrabold text-xl text-foreground">SEA-U</h1>
              <p className="text-[10px] text-muted-foreground font-body">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddFriend(true)}
            className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or SEA-U ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </header>

      <div className="px-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🌏</p>
            <p className="font-display text-muted-foreground">
              {search ? "No chats found" : "No conversations yet"}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddFriend(true)}
                className="mt-3 px-4 py-2 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
              >
                Start chatting ✨
              </button>
            )}
          </div>
        ) : (
          filtered.map((conv, i) => (
            <button
              key={conv.id}
              onClick={() => navigate(`/chat/${conv.id}`)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted/80 transition-all duration-150 rounded-2xl"
              style={{ animation: `pop-in 0.3s ease-out ${i * 0.05}s both` }}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-lavender flex items-center justify-center text-2xl cute-shadow">
                  {conv.otherUser.avatar}
                </div>
                {showOnline && conv.otherUser.show_online && conv.otherUser.last_seen && (
                  (() => {
                    const lastSeen = new Date(conv.otherUser.last_seen);
                    const isOnline = (Date.now() - lastSeen.getTime()) < 5 * 60 * 1000;
                    return isOnline ? (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-mint border-2 border-card" />
                    ) : null;
                  })()
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-foreground truncate">{conv.otherUser.display_name}</h3>
                  <Globe className="w-3 h-3 text-primary flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground/70 font-mono">{conv.otherUser.sea_id}</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || "No messages yet"}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {showLastSeen && conv.lastMessageTime && (
                  <span className="text-[10px] text-muted-foreground">{timeAgo(conv.lastMessageTime)}</span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      <AddFriendDialog open={showAddFriend} onClose={() => setShowAddFriend(false)} />
      <BottomNav />
    </div>
  );
}
