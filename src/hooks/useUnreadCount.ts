import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUnreadCount() {
  const { user } = useAuth();
  const [totalUnread, setTotalUnread] = useState(0);

  const fetchUnread = async () => {
    if (!user) return;

    // Get all conversation IDs for this user
    const { data: participations } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (!participations || participations.length === 0) {
      setTotalUnread(0);
      return;
    }

    const convIds = participations.map((p) => p.conversation_id);

    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .in("conversation_id", convIds)
      .neq("sender_id", user.id)
      .is("read_at", null);

    setTotalUnread(count || 0);
  };

  useEffect(() => {
    fetchUnread();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("unread-count-refresh")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        fetchUnread();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return totalUnread;
}
