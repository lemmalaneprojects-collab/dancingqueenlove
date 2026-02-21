import { useState } from "react";
import { X, UserPlus, Globe, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { findOrCreateConversation } from "@/hooks/useConversations";
import { toast } from "@/hooks/use-toast";

interface AddFriendDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddFriendDialog({ open, onClose }: AddFriendDialogProps) {
  const [uid, setUid] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "found" | "not-found">("idle");
  const [foundUser, setFoundUser] = useState<{ user_id: string; display_name: string; avatar: string; country: string; sea_id: string } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!uid.trim()) return;
    setStatus("searching");

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar, country, sea_id")
      .ilike("sea_id", uid.trim().toUpperCase())
      .single();

    if (data && data.user_id !== user?.id) {
      setFoundUser(data);
      setStatus("found");
    } else {
      setFoundUser(null);
      setStatus("not-found");
    }
  };

  const handleChat = async () => {
    if (!foundUser || !user) return;

    try {
      const conversationId = await findOrCreateConversation(user.id, foundUser.user_id);
      onClose();
      setUid("");
      setStatus("idle");
      setFoundUser(null);
      navigate(`/chat/${conversationId}`);
    } catch {
      toast({ title: "Failed to start chat", variant: "destructive" });
    }
  };

  const handleClose = () => {
    onClose();
    setUid("");
    setStatus("idle");
    setFoundUser(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative w-full max-w-sm mx-4 mb-4 bg-card rounded-3xl border border-border cute-shadow overflow-hidden"
        style={{ animation: "slide-up 0.3s ease-out" }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-display font-extrabold text-base text-foreground">Find by SEA-U ID</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="px-5 text-xs text-muted-foreground font-body mb-4">
          Enter a friend's unique SEA-U ID to start chatting 🌏
        </p>

        <div className="px-5 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. SEA-290178"
              value={uid}
              onChange={(e) => { setUid(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-muted/60 text-sm font-mono font-bold text-foreground placeholder:text-muted-foreground placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/30 tracking-wider"
            />
            <button
              onClick={handleSearch}
              disabled={!uid.trim() || status === "searching"}
              className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 min-h-[80px]">
          {status === "searching" && (
            <div className="flex flex-col items-center py-4 gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-xs text-muted-foreground font-display">Searching...</p>
            </div>
          )}
          {status === "found" && foundUser && (
            <div className="bg-muted/40 rounded-2xl p-4 flex items-center gap-3" style={{ animation: "pop-in 0.3s ease-out" }}>
              <div className="w-12 h-12 rounded-full bg-lavender flex items-center justify-center text-2xl cute-shadow">
                {foundUser.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-sm text-foreground">{foundUser.display_name}</h3>
                <p className="text-[10px] text-muted-foreground">{foundUser.country} · {foundUser.sea_id}</p>
              </div>
              <button
                onClick={handleChat}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Chat
              </button>
            </div>
          )}
          {status === "not-found" && (
            <div className="text-center py-4" style={{ animation: "pop-in 0.3s ease-out" }}>
              <p className="text-2xl mb-1">😢</p>
              <p className="text-xs text-muted-foreground font-display">No user found with that ID</p>
              <p className="text-[10px] text-muted-foreground mt-1">Double-check the ID and try again!</p>
            </div>
          )}
          {status === "idle" && (
            <div className="text-center py-4">
              <p className="text-2xl mb-1">🔑</p>
              <p className="text-[10px] text-muted-foreground font-display">
                Ask your friend for their SEA-U ID<br />found on their Profile page ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
