import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Smile, Send, Globe, MoreVertical } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import MessageBubble from "@/components/MessageBubble";
import StickerPicker from "@/components/StickerPicker";

export default function ChatRoom() {
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useMessages(conversationId);
  const { showOnline, showLastSeen, readReceipts, bubbleStyle } = useSettings();
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [otherUser, setOtherUser] = useState<{
    display_name: string;
    avatar: string;
    sea_id: string;
    show_online: boolean;
    last_seen: string | null;
  } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch other user info
  useEffect(() => {
    if (!conversationId || !user) return;

    const fetchOtherUser = async () => {
      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conversationId)
        .neq("user_id", user.id);

      if (participants && participants[0]) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, avatar, sea_id, show_online, last_seen")
          .eq("user_id", participants[0].user_id)
          .single();

        if (profile) setOtherUser(profile);
      }
    };

    fetchOtherUser();
  }, [conversationId, user]);

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessage(input.trim());
      setInput("");
    }
  };

  const handleStickerSend = async (emoji: string) => {
    await sendMessage(undefined, emoji);
    setShowStickers(false);
  };

  const isOnline = otherUser?.show_online && otherUser?.last_seen
    ? (Date.now() - new Date(otherUser.last_seen).getTime()) < 5 * 60 * 1000
    : false;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-3 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-xl">
            {otherUser?.avatar || "🧑"}
          </div>
          {showOnline && isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-mint border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-sm text-foreground truncate">{otherUser?.display_name || "Loading..."}</h2>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground">
              {showOnline && isOnline ? "Online" : showLastSeen && otherUser?.last_seen ? "Last seen recently" : ""}
            </span>
            <span className="text-[10px] text-muted-foreground/60 font-mono ml-1">{otherUser?.sea_id}</span>
          </div>
        </div>
        <button className="p-2 rounded-xl hover:bg-muted transition-colors">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <div className="flex justify-center mb-4">
          <div className="bg-muted/60 rounded-full px-4 py-1.5 text-[10px] font-display font-semibold text-muted-foreground flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-primary" /> Connected via SEA-U ID 🌏
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">👋</p>
            <p className="text-xs font-display text-muted-foreground">Say hello!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={{
                id: msg.id,
                senderId: msg.sender_id,
                text: msg.content || undefined,
                sticker: msg.sticker || undefined,
                timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isMe: msg.sender_id === user?.id,
              }}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sticker Picker */}
      {showStickers && (
        <StickerPicker
          onSelect={handleStickerSend}
          onClose={() => setShowStickers(false)}
        />
      )}

      {/* Input */}
      <div className="bg-card/90 backdrop-blur-lg border-t border-border px-3 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className={`p-2.5 rounded-2xl transition-all duration-200 ${
              showStickers ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-2xl bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
