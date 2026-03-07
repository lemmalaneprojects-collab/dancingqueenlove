import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

export interface ReactionGroup {
  emoji: string;
  count: number;
  includesMe: boolean;
}

export function useReactions(conversationId: string | undefined) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    if (!conversationId || !user) return;

    const fetchReactions = async () => {
      // Get all message IDs for this conversation first
      const { data: msgs } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId);

      if (!msgs || msgs.length === 0) return;

      const msgIds = msgs.map((m) => m.id);
      const { data } = await supabase
        .from("message_reactions")
        .select("*")
        .in("message_id", msgIds);

      setReactions(data || []);
    };

    fetchReactions();

    // Realtime for reactions
    const channel = supabase
      .channel(`reactions-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_reactions" },
        (payload) => {
          setReactions((prev) => [...prev, payload.new as Reaction]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "message_reactions" },
        (payload) => {
          setReactions((prev) => prev.filter((r) => r.id !== (payload.old as any).id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const getReactionsForMessage = useCallback(
    (messageId: string): ReactionGroup[] => {
      const msgReactions = reactions.filter((r) => r.message_id === messageId);
      const grouped: Record<string, { count: number; includesMe: boolean }> = {};

      for (const r of msgReactions) {
        if (!grouped[r.emoji]) grouped[r.emoji] = { count: 0, includesMe: false };
        grouped[r.emoji].count++;
        if (r.user_id === user?.id) grouped[r.emoji].includesMe = true;
      }

      return Object.entries(grouped).map(([emoji, data]) => ({
        emoji,
        ...data,
      }));
    },
    [reactions, user]
  );

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!user) return;

      const existing = reactions.find(
        (r) => r.message_id === messageId && r.user_id === user.id && r.emoji === emoji
      );

      if (existing) {
        await supabase.from("message_reactions").delete().eq("id", existing.id);
        setReactions((prev) => prev.filter((r) => r.id !== existing.id));
      } else {
        const { data } = await supabase
          .from("message_reactions")
          .insert({ message_id: messageId, user_id: user.id, emoji })
          .select()
          .single();

        if (data) setReactions((prev) => [...prev, data]);
      }
    },
    [user, reactions]
  );

  return { getReactionsForMessage, toggleReaction };
}
