import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Smile, Send, Globe, Search, Users, X, Reply } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { useReactions } from "@/hooks/useReactions";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import MessageBubble from "@/components/MessageBubble";
import StickerPicker from "@/components/StickerPicker";
import TypingIndicator from "@/components/TypingIndicator";
import FileUploadButton from "@/components/FileUploadButton";
import VoiceRecorder from "@/components/VoiceRecorder";
import MessageSearch from "@/components/MessageSearch";
import DateSeparator from "@/components/DateSeparator";

export default function ChatRoom() {
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, loading, sendMessage, otherTyping, setTyping, markAsRead, deleteMessage } = useMessages(conversationId);
  const { getReactionsForMessage, toggleReaction } = useReactions(conversationId);
  const { showOnline, showLastSeen } = useSettings();
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<{ id: string; content?: string; sticker?: string; senderName?: string } | null>(null);
  const [conversationMeta, setConversationMeta] = useState<{
    isGroup: boolean;
    name: string | null;
    members: Array<{ user_id: string; display_name: string; avatar: string; sea_id: string; show_online: boolean; last_seen: string | null }>;
  } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherTyping]);

  useEffect(() => {
    if (messages.length > 0) markAsRead();
  }, [messages, markAsRead]);

  // Scroll to highlighted message
  useEffect(() => {
    if (highlightedMessageId) {
      const el = messageRefs.current.get(highlightedMessageId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightedMessageId]);

  useEffect(() => {
    if (!conversationId || !user) return;
    const fetch = async () => {
      const { data: conv } = await supabase
        .from("conversations")
        .select("name, is_group")
        .eq("id", conversationId)
        .single();

      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conversationId)
        .neq("user_id", user.id);

      if (!participants) return;

      const userIds = participants.map((p) => p.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar, sea_id, show_online, last_seen")
        .in("user_id", userIds);

      setConversationMeta({
        isGroup: conv?.is_group || false,
        name: conv?.name || null,
        members: (profiles || []) as any,
      });
    };
    fetch();
  }, [conversationId, user]);

  const handleSend = async () => {
    if (input.trim()) {
      setTyping(false);
      await sendMessage(input.trim(), undefined, undefined, replyTo?.id);
      setInput("");
      setReplyTo(null);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setTyping(value.length > 0);
  };

  const handleStickerSend = async (emoji: string) => {
    await sendMessage(undefined, emoji, undefined, replyTo?.id);
    setShowStickers(false);
    setReplyTo(null);
  };

  const handleReply = (msg: any) => {
    const senderProfile = conversationMeta?.members.find((m) => m.user_id === msg.sender_id);
    setReplyTo({
      id: msg.id,
      content: msg.content || undefined,
      sticker: msg.sticker || undefined,
      senderName: msg.sender_id === user?.id ? "You" : senderProfile?.display_name || "User",
    });
  };

  const handleFileUploaded = async (fileUrl: string, fileName: string, fileType: string) => {
    await sendMessage(undefined, undefined, { url: fileUrl, name: fileName, type: fileType });
  };

  const firstMember = conversationMeta?.members[0];
  const isOnline = firstMember?.show_online && firstMember?.last_seen
    ? (Date.now() - new Date(firstMember.last_seen).getTime()) < 5 * 60 * 1000
    : false;

  const headerTitle = conversationMeta?.isGroup
    ? conversationMeta.name || "Group Chat"
    : firstMember?.display_name || "Loading...";

  const headerSubtitle = () => {
    if (otherTyping) return "typing...";
    if (conversationMeta?.isGroup) {
      return `${(conversationMeta.members.length + 1)} members`;
    }
    if (showOnline && isOnline) return "Online";
    if (showLastSeen && firstMember?.last_seen) return "Last seen recently";
    return "";
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-3 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="relative">
          {conversationMeta?.isGroup ? (
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-foreground" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-xl">
              {firstMember?.avatar || "🧑"}
            </div>
          )}
          {!conversationMeta?.isGroup && showOnline && isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-mint border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-sm text-foreground truncate">{headerTitle}</h2>
          <div className="flex items-center gap-1">
            {conversationMeta?.isGroup ? (
              <Users className="w-3 h-3 text-primary" />
            ) : (
              <Globe className="w-3 h-3 text-primary" />
            )}
            <span className="text-[10px] text-muted-foreground">{headerSubtitle()}</span>
            {!conversationMeta?.isGroup && firstMember && (
              <span className="text-[10px] text-muted-foreground/60 font-mono ml-1">{firstMember.sea_id}</span>
            )}
          </div>
        </div>
        <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {showSearch && (
        <MessageSearch
          messages={messages}
          onHighlight={setHighlightedMessageId}
          onClose={() => { setShowSearch(false); setHighlightedMessageId(null); }}
        />
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <div className="flex justify-center mb-4">
          <div className="bg-muted/60 rounded-full px-4 py-1.5 text-[10px] font-display font-semibold text-muted-foreground flex items-center gap-1.5">
            {conversationMeta?.isGroup ? (
              <><Users className="w-3 h-3 text-primary" /> Group Chat 👥</>
            ) : (
              <><Globe className="w-3 h-3 text-primary" /> Connected via SEA-U ID 🌏</>
            )}
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
          messages.map((msg, idx) => {
            const msgDate = new Date(msg.created_at).toDateString();
            const prevDate = idx > 0 ? new Date(messages[idx - 1].created_at).toDateString() : null;
            const showDate = idx === 0 || msgDate !== prevDate;

            const senderProfile = conversationMeta?.isGroup
              ? conversationMeta.members.find((m) => m.user_id === msg.sender_id)
              : undefined;

            const replyMsg = (msg as any).reply_to ? messages.find((m) => m.id === (msg as any).reply_to) : undefined;
            const replySender = replyMsg ? (replyMsg.sender_id === user?.id ? "You" : conversationMeta?.members.find((m) => m.user_id === replyMsg.sender_id)?.display_name || "User") : undefined;

            return (
              <div key={msg.id}>
                {showDate && <DateSeparator date={msg.created_at} />}
                <div ref={(el) => { if (el) messageRefs.current.set(msg.id, el); }}>
                  <MessageBubble
                    message={{
                      id: msg.id,
                      senderId: msg.sender_id,
                      text: msg.content || undefined,
                      sticker: msg.sticker || undefined,
                      timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      isMe: msg.sender_id === user?.id,
                      readAt: msg.read_at,
                      fileUrl: msg.file_url || undefined,
                      fileName: msg.file_name || undefined,
                      fileType: msg.file_type || undefined,
                      isGroup: conversationMeta?.isGroup,
                      senderName: senderProfile?.display_name,
                      senderAvatar: senderProfile?.avatar,
                      replyTo: replyMsg ? {
                        senderName: replySender || "User",
                        content: replyMsg.content || undefined,
                        sticker: replyMsg.sticker || undefined,
                      } : undefined,
                    }}
                    onDelete={deleteMessage}
                    onReply={() => handleReply(msg)}
                    reactions={getReactionsForMessage(msg.id)}
                    onReact={toggleReaction}
                    highlighted={highlightedMessageId === msg.id}
                  />
                </div>
              </div>
            );
          })
        )}
        {otherTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {showStickers && (
        <StickerPicker onSelect={handleStickerSend} onClose={() => setShowStickers(false)} />
      )}

      {replyTo && (
        <div className="bg-card/90 backdrop-blur-lg border-t border-border px-4 py-2 flex items-center gap-2">
          <Reply className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0 border-l-2 border-primary/40 pl-2">
            <p className="text-[11px] font-semibold text-primary">{replyTo.senderName}</p>
            <p className="text-[11px] text-muted-foreground truncate">{replyTo.sticker || replyTo.content || "Attachment"}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}
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
          {conversationId && (
            <>
              <FileUploadButton
                conversationId={conversationId}
                onUploaded={handleFileUploaded}
              />
              <VoiceRecorder
                conversationId={conversationId}
                onRecorded={handleFileUploaded}
              />
            </>
          )}
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
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
