import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { DEMO_CONTACTS } from "@/data/chatData";
import ChatListItem from "@/components/ChatListItem";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/sea-u-logo.png";

export default function ChatsPage() {
  const [search, setSearch] = useState("");
  const filtered = DEMO_CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const onlineCount = DEMO_CONTACTS.filter((c) => c.online).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SEA-U" className="w-9 h-9 rounded-xl" />
            <div>
              <h1 className="font-display font-extrabold text-xl text-foreground">SEA-U</h1>
              <p className="text-[10px] text-muted-foreground font-body">{onlineCount} nearby • offline chat</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </header>

      {/* Online avatars */}
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

      {/* Chat list */}
      <div className="px-2">
        {filtered.map((contact, i) => (
          <div key={contact.id} style={{ animation: `pop-in 0.3s ease-out ${i * 0.05}s both` }}>
            <ChatListItem contact={contact} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🔍</p>
            <p className="font-display text-muted-foreground">No chats found</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
