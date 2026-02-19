import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Smile, Send, Bluetooth, Wifi, Globe, MoreVertical } from "lucide-react";
import { DEMO_CONTACTS, DEMO_MESSAGES, type Message } from "@/data/chatData";
import { useSettings } from "@/contexts/SettingsContext";
import MessageBubble from "@/components/MessageBubble";
import StickerPicker from "@/components/StickerPicker";

export default function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contact = DEMO_CONTACTS.find((c) => c.id === id);
  const { showOnline, showLastSeen, chatHistoryCleared } = useSettings();
  const [messages, setMessages] = useState<Message[]>(
    chatHistoryCleared ? [] : (DEMO_MESSAGES[id || "1"] || [])
  );
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!contact) {
    navigate("/");
    return null;
  }

  const sendMessage = (text?: string, sticker?: string) => {
    if (!text && !sticker) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      text,
      sticker,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setShowStickers(false);
  };

  const handleSend = () => {
    if (input.trim()) sendMessage(input.trim());
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-3 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-xl">
            {contact.avatar}
          </div>
          {showOnline && contact.online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-mint border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-sm text-foreground truncate">{contact.name}</h2>
          <div className="flex items-center gap-1">
            {contact.connectionType === "bluetooth" ? (
              <Bluetooth className="w-3 h-3 text-baby-blue" />
            ) : contact.connectionType === "uid" ? (
              <Globe className="w-3 h-3 text-primary" />
            ) : (
              <Wifi className="w-3 h-3 text-mint" />
            )}
            <span className="text-[10px] text-muted-foreground">
              {showOnline && contact.online
                ? "Connected"
                : showLastSeen
                ? "Last seen " + contact.lastTime + " ago"
                : ""}
            </span>
            <span className="text-[10px] text-muted-foreground/60 font-mono ml-1">{contact.uid}</span>
          </div>
        </div>
        <button className="p-2 rounded-xl hover:bg-muted transition-colors">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {/* Connection banner */}
        <div className="flex justify-center mb-4">
          <div className="bg-muted/60 rounded-full px-4 py-1.5 text-[10px] font-display font-semibold text-muted-foreground flex items-center gap-1.5">
            {contact.connectionType === "bluetooth" ? (
              <><Bluetooth className="w-3 h-3 text-baby-blue" /> Connected via Bluetooth</>
            ) : contact.connectionType === "uid" ? (
              <><Globe className="w-3 h-3 text-primary" /> Connected via SEA-U ID 🌏</>
            ) : (
              <><Wifi className="w-3 h-3 text-mint" /> Connected via Hotspot</>
            )}
          </div>
        </div>

        {chatHistoryCleared && messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">🗑️</p>
            <p className="text-xs font-display text-muted-foreground">Chat history was cleared</p>
            <p className="text-[10px] text-muted-foreground mt-1">Send a message to start a new conversation!</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Sticker Picker */}
      {showStickers && (
        <StickerPicker
          onSelect={(emoji) => sendMessage(undefined, emoji)}
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
