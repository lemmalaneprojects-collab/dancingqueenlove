import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConversationWithDetails {
  id: string;
  otherUser: {
    user_id: string;
    display_name: string;
    avatar: string;
    sea_id: string;
    country: string;
    show_online: boolean;
    last_seen: string | null;
  };
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;

    // Get all conversation IDs for this user
    const { data: participations } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (!participations || participations.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const convIds = participations.map((p) => p.conversation_id);

    // Get other participants for each conversation
    const { data: allParticipants } = await supabase
      .from("conversation_participants")
      .select("conversation_id, user_id")
      .in("conversation_id", convIds)
      .neq("user_id", user.id);

    if (!allParticipants) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const otherUserIds = [...new Set(allParticipants.map((p) => p.user_id))];

    // Get profiles of other users
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", otherUserIds);

    // Get latest message for each conversation
    const results: ConversationWithDetails[] = [];
    for (const convId of convIds) {
      const otherParticipant = allParticipants.find((p) => p.conversation_id === convId);
      if (!otherParticipant) continue;

      const otherProfile = profiles?.find((p) => p.user_id === otherParticipant.user_id);
      if (!otherProfile) continue;

      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, sticker, created_at")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      results.push({
        id: convId,
        otherUser: {
          user_id: otherProfile.user_id,
          display_name: otherProfile.display_name,
          avatar: otherProfile.avatar,
          sea_id: otherProfile.sea_id,
          country: otherProfile.country,
          show_online: otherProfile.show_online,
          last_seen: otherProfile.last_seen,
        },
        lastMessage: lastMsg?.content || (lastMsg?.sticker ? `Sticker ${lastMsg.sticker}` : null),
        lastMessageTime: lastMsg?.created_at || null,
        unreadCount: 0,
      });
    }

    // Sort by last message time
    results.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });

    setConversations(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Listen for new messages to refresh
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("conversations-refresh")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return { conversations, loading, refresh: fetchConversations };
}

export async function findOrCreateConversation(currentUserId: string, otherUserId: string): Promise<string> {
  // Check if a conversation already exists between these two users
  const { data: myConvs } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", currentUserId);

  if (myConvs) {
    for (const mc of myConvs) {
      const { data: otherP } = await supabase
        .from("conversation_participants")
        .select("id")
        .eq("conversation_id", mc.conversation_id)
        .eq("user_id", otherUserId)
        .single();

      if (otherP) return mc.conversation_id;
    }
  }

  // Create new conversation
  const { data: conv } = await supabase
    .from("conversations")
    .insert({})
    .select("id")
    .single();

  if (!conv) throw new Error("Failed to create conversation");

  // Add both participants
  await supabase.from("conversation_participants").insert([
    { conversation_id: conv.id, user_id: currentUserId },
    { conversation_id: conv.id, user_id: otherUserId },
  ]);

  return conv.id;
}
