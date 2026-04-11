import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ReadReceipt {
  user_id: string;
  read_at: string;
}

export function useGroupReadReceipts(conversationId: string | undefined, isGroup: boolean) {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<Map<string, ReadReceipt[]>>(new Map());

  useEffect(() => {
    if (!conversationId || !isGroup || !user) return;

    const fetchReceipts = async () => {
      const { data } = await supabase
        .from("message_read_receipts")
        .select("message_id, user_id, read_at")
        .eq("message_id", conversationId); // We'll fetch per-message instead

      // Actually we need to fetch all receipts for this conversation's messages
      // Let's do it via a join approach
    };

    // Fetch all message IDs for this conversation, then their receipts
    const fetchAll = async () => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId);

      if (!msgs || msgs.length === 0) return;

      const msgIds = msgs.map((m) => m.id);
      const { data: receiptData } = await supabase
        .from("message_read_receipts" as any)
        .select("message_id, user_id, read_at")
        .in("message_id", msgIds);

      if (!receiptData) return;

      const map = new Map<string, ReadReceipt[]>();
      for (const r of receiptData as any[]) {
        const existing = map.get(r.message_id) || [];
        existing.push({ user_id: r.user_id, read_at: r.read_at });
        map.set(r.message_id, existing);
      }
      setReceipts(map);
    };

    fetchAll();
  }, [conversationId, isGroup, user]);

  const getReceiptsForMessage = useCallback(
    (messageId: string): ReadReceipt[] => {
      return receipts.get(messageId) || [];
    },
    [receipts]
  );

  const markMessageRead = useCallback(
    async (messageId: string) => {
      if (!user || !isGroup) return;
      await supabase.from("message_read_receipts" as any).upsert(
        { message_id: messageId, user_id: user.id } as any,
        { onConflict: "message_id,user_id" }
      );
    },
    [user, isGroup]
  );

  const markAllRead = useCallback(
    async (messageIds: string[]) => {
      if (!user || !isGroup || messageIds.length === 0) return;
      const rows = messageIds.map((id) => ({ message_id: id, user_id: user.id }));
      await supabase.from("message_read_receipts" as any).upsert(rows as any, {
        onConflict: "message_id,user_id",
      });
    },
    [user, isGroup]
  );

  return { getReceiptsForMessage, markAllRead };
}
