import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type Message = Tables<"messages">;

export function useMessages(conversationId: string | undefined) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!conversationId || !user) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      setLoading(false);
    };

    fetchMessages();

    // Realtime subscription for new messages + updates (read receipts)
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === (payload.new as Message).id ? (payload.new as Message) : m))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== (payload.old as any).id));
        }
      )
      .subscribe();

    // Presence channel for typing indicators
    const presenceChannel = supabase.channel(`typing-${conversationId}`, {
      config: { presence: { key: user.id } },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const someoneElseTyping = Object.keys(state).some(
          (key) => key !== user.id && (state[key] as any)?.[0]?.typing
        );
        setOtherTyping(someoneElseTyping);
      })
      .subscribe();

    channelRef.current = presenceChannel;

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(presenceChannel);
    };
  }, [conversationId, user]);

  const sendMessage = async (content?: string, sticker?: string) => {
    if (!user || !conversationId || (!content && !sticker)) return;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content || null,
      sticker: sticker || null,
    });
  };

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!channelRef.current) return;
      channelRef.current.track({ typing: isTyping });

      if (isTyping) {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
          channelRef.current?.track({ typing: false });
        }, 3000);
      }
    },
    []
  );

  const markAsRead = useCallback(async () => {
    if (!user || !conversationId) return;
    // Mark all unread messages from the other person as read
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .is("read_at", null);
  }, [user, conversationId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user) return;
    await supabase.from("messages").delete().eq("id", messageId).eq("sender_id", user.id);
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, [user]);

  return { messages, loading, sendMessage, otherTyping, setTyping, markAsRead, deleteMessage };
}
