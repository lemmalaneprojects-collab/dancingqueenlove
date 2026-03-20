import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { X, Send, Users, Search } from "lucide-react";
import { toast } from "sonner";

interface ForwardTarget {
  conversationId: string;
  label: string;
  avatar: string;
  isGroup: boolean;
}

interface ForwardMessageDialogProps {
  messageContent?: string;
  messageSticker?: string;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  onClose: () => void;
}

export default function ForwardMessageDialog({
  messageContent,
  messageSticker,
  fileUrl,
  fileName,
  fileType,
  onClose,
}: ForwardMessageDialogProps) {
  const { user } = useAuth();
  const [targets, setTargets] = useState<ForwardTarget[]>([]);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: parts } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id);
      if (!parts) return;

      const convIds = parts.map((p) => p.conversation_id);
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, name, is_group")
        .in("id", convIds);

      const { data: others } = await supabase
        .from("conversation_participants")
        .select("conversation_id, user_id")
        .in("conversation_id", convIds)
        .neq("user_id", user.id);

      const otherIds = [...new Set((others || []).map((o) => o.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar")
        .in("user_id", otherIds);

      const result: ForwardTarget[] = [];
      for (const conv of convs || []) {
        const convOthers = (others || []).filter((o) => o.conversation_id === conv.id);
        if (conv.is_group) {
          result.push({
            conversationId: conv.id,
            label: conv.name || "Group Chat",
            avatar: "👥",
            isGroup: true,
          });
        } else {
          const profile = profiles?.find((p) => p.user_id === convOthers[0]?.user_id);
          if (profile) {
            result.push({
              conversationId: conv.id,
              label: profile.display_name,
              avatar: profile.avatar,
              isGroup: false,
            });
          }
        }
      }
      setTargets(result);
    })();
  }, [user]);

  const filtered = targets.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleForward = async (target: ForwardTarget) => {
    if (!user) return;
    setSending(target.conversationId);
    const { error } = await supabase.from("messages").insert({
      conversation_id: target.conversationId,
      sender_id: user.id,
      content: messageContent ? `↪ ${messageContent}` : null,
      sticker: messageSticker || null,
      file_url: fileUrl || null,
      file_name: fileName || null,
      file_type: fileType || null,
    });
    setSending(null);
    if (error) {
      toast.error("Failed to forward message");
    } else {
      toast.success(`Forwarded to ${target.label}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-border shadow-xl max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "pop-in 0.2s ease-out" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-display font-bold text-sm text-foreground">Forward to…</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8">No conversations found</p>
          ) : (
            filtered.map((t) => (
              <button
                key={t.conversationId}
                onClick={() => handleForward(t)}
                disabled={sending === t.conversationId}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <div className="w-9 h-9 rounded-full bg-lavender flex items-center justify-center text-lg">
                  {t.isGroup ? <Users className="w-4 h-4 text-accent-foreground" /> : t.avatar}
                </div>
                <span className="flex-1 text-left text-sm font-body text-foreground truncate">{t.label}</span>
                <Send className="w-4 h-4 text-muted-foreground" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
