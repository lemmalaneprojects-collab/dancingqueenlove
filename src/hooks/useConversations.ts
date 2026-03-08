import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConversationWithDetails {
  id: string;
  isGroup: boolean;
  groupName: string | null;
  otherUser: {
    user_id: string;
    display_name: string;
    avatar: string;
    sea_id: string;
    country: string;
    show_online: boolean;
    last_seen: string | null;
  };
  memberCount: number;
  memberAvatars: string[];
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

    // Get conversation metadata
    const { data: convData } = await supabase
      .from("conversations")
      .select("id, name, is_group")
      .in("id", convIds);

    const convMap = new Map((convData || []).map((c) => [c.id, c]));

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

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", otherUserIds);

    const results: ConversationWithDetails[] = [];
    for (const convId of convIds) {
      const convMeta = convMap.get(convId);
      const convParticipants = allParticipants.filter((p) => p.conversation_id === convId);
      if (convParticipants.length === 0) continue;

      const firstParticipant = convParticipants[0];
      const otherProfile = profiles?.find((p) => p.user_id === firstParticipant.user_id);
      if (!otherProfile) continue;

      const memberAvatars = convParticipants
        .map((p) => profiles?.find((pr) => pr.user_id === p.user_id)?.avatar || "🧑")
        .slice(0, 3);

      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, sticker, created_at, file_name")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", convId)
        .neq("sender_id", user.id)
        .is("read_at", null);

      let lastMessage = lastMsg?.content || null;
      if (!lastMessage && lastMsg?.sticker) lastMessage = `Sticker ${lastMsg.sticker}`;
      if (!lastMessage && (lastMsg as any)?.file_name) lastMessage = `📎 ${(lastMsg as any).file_name}`;

      results.push({
        id: convId,
        isGroup: convMeta?.is_group || false,
        groupName: convMeta?.name || null,
        otherUser: {
          user_id: otherProfile.user_id,
          display_name: otherProfile.display_name,
          avatar: otherProfile.avatar,
          sea_id: otherProfile.sea_id,
          country: otherProfile.country,
          show_online: otherProfile.show_online,
          last_seen: otherProfile.last_seen,
        },
        memberCount: convParticipants.length + 1,
        memberAvatars,
        lastMessage,
        lastMessageTime: lastMsg?.created_at || null,
        unreadCount: unreadCount || 0,
      });
    }

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

  // Generate ID client-side to avoid SELECT-after-INSERT RLS conflict
  const convId = crypto.randomUUID();
  const { error } = await supabase
    .from("conversations")
    .insert({ id: convId });

  if (error) throw new Error("Failed to create conversation");

  await supabase.from("conversation_participants").insert({
    conversation_id: convId, user_id: currentUserId,
  });
  await supabase.from("conversation_participants").insert({
    conversation_id: convId, user_id: otherUserId,
  });

  return conv.id;
}
