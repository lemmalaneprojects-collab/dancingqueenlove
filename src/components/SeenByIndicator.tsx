import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";

interface SeenByIndicatorProps {
  messageId: string;
  senderId: string;
  isGroup: boolean;
  isMe: boolean;
}

export default function SeenByIndicator({ messageId, senderId, isGroup, isMe }: SeenByIndicatorProps) {
  const [seenBy, setSeenBy] = useState<Array<{ display_name: string; avatar: string }>>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isGroup || !isMe) return;

    const fetchSeenBy = async () => {
      const { data: receipts } = await supabase
        .from("message_read_receipts" as any)
        .select("user_id, read_at")
        .eq("message_id", messageId);

      if (!receipts || (receipts as any[]).length === 0) return;

      const userIds = (receipts as any[]).map((r: any) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar")
        .in("user_id", userIds);

      if (profiles) {
        setSeenBy(profiles.map((p) => ({ display_name: p.display_name, avatar: p.avatar })));
      }
    };

    fetchSeenBy();
  }, [messageId, isGroup, isMe]);

  if (!isGroup || !isMe || seenBy.length === 0) return null;

  return (
    <div className="mt-0.5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <Eye className="w-3 h-3" />
        <span>Seen by {seenBy.length}</span>
      </button>
      {expanded && (
        <div
          className="mt-1 bg-card border border-border rounded-xl px-2.5 py-1.5 shadow-lg z-10"
          style={{ animation: "pop-in 0.15s ease-out" }}
        >
          {seenBy.map((person, i) => (
            <div key={i} className="flex items-center gap-1.5 py-0.5">
              <span className="text-sm">{person.avatar}</span>
              <span className="text-[11px] text-foreground">{person.display_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
