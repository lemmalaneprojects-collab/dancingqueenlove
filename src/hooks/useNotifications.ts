import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useNotifications() {
  const { user } = useAuth();
  const permissionRef = useRef<NotificationPermission>("default");

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    // Register service worker
    navigator.serviceWorker.register("/sw.js").catch(() => {});

    // Request permission
    if (Notification.permission === "default") {
      Notification.requestPermission().then((p) => {
        permissionRef.current = p;
      });
    } else {
      permissionRef.current = Notification.permission;
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("push-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const msg = payload.new as any;

          // Don't notify for own messages
          if (msg.sender_id === user.id) return;

          // Don't notify if page is focused
          if (document.hasFocus()) return;

          if (permissionRef.current !== "granted") return;

          // Get sender profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, avatar")
            .eq("user_id", msg.sender_id)
            .single();

          const title = profile?.display_name || "New message";
          const body = msg.sticker
            ? `${profile?.avatar || "🧑"} sent a sticker`
            : msg.content || "New message";

          // Use service worker notification if available, fallback to Notification API
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            reg.showNotification(title, {
              body,
              icon: "/favicon.ico",
              tag: `msg-${msg.conversation_id}`,
              data: { url: `/chat/${msg.conversation_id}` },
            });
          } else {
            new Notification(title, { body, icon: "/favicon.ico" });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
}
