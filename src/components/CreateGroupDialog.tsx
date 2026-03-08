import { useState, useEffect } from "react";
import { X, Users, Search, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
}

interface UserProfile {
  user_id: string;
  display_name: string;
  avatar: string;
  sea_id: string;
  country: string;
}

export default function CreateGroupDialog({ open, onClose }: CreateGroupDialogProps) {
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || !user) return;
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar, sea_id, country")
        .neq("user_id", user.id)
        .eq("show_in_directory", true)
        .limit(50);
      setUsers(data || []);
    };
    fetchUsers();
  }, [open, user]);

  const filtered = users.filter(
    (u) =>
      u.display_name.toLowerCase().includes(search.toLowerCase()) ||
      u.sea_id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!user || selected.length < 2 || !groupName.trim()) return;
    setCreating(true);
    try {
      const { data: conv } = await supabase
        .from("conversations")
        .insert({ name: groupName.trim(), is_group: true })
        .select("id")
        .single();

      if (!conv) throw new Error("Failed to create group");

      // Add creator first
      await supabase.from("conversation_participants").insert({
        conversation_id: conv.id,
        user_id: user.id,
      });

      // Add members one by one
      for (const memberId of selected) {
        await supabase.from("conversation_participants").insert({
          conversation_id: conv.id,
          user_id: memberId,
        });
      }

      onClose();
      setGroupName("");
      setSelected([]);
      setSearch("");
      navigate(`/chat/${conv.id}`);
    } catch {
      toast({ title: "Failed to create group", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    onClose();
    setGroupName("");
    setSelected([]);
    setSearch("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative w-full max-w-sm mx-4 mb-4 bg-card rounded-3xl border border-border cute-shadow overflow-hidden max-h-[80vh] flex flex-col"
        style={{ animation: "slide-up 0.3s ease-out" }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-display font-extrabold text-base text-foreground">New Group</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 mb-3">
          <input
            type="text"
            placeholder="Group name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-muted/60 text-sm font-display font-bold text-foreground placeholder:text-muted-foreground placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {selected.length > 0 && (
          <div className="px-5 mb-3 flex gap-1.5 flex-wrap">
            {selected.map((id) => {
              const u = users.find((u) => u.user_id === id);
              return u ? (
                <span
                  key={id}
                  onClick={() => toggleUser(id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-xs font-display font-bold text-foreground cursor-pointer hover:bg-primary/25 transition-colors"
                >
                  {u.avatar} {u.display_name}
                  <X className="w-3 h-3" />
                </span>
              ) : null;
            })}
          </div>
        )}

        <div className="px-5 mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3 min-h-[120px] max-h-[240px]">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-6">No users found</p>
          ) : (
            filtered.map((u) => (
              <button
                key={u.user_id}
                onClick={() => toggleUser(u.user_id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 rounded-2xl transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-xl">
                  {u.avatar}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-display font-bold text-sm text-foreground truncate">{u.display_name}</p>
                  <p className="text-[10px] text-muted-foreground">{u.sea_id}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected.includes(u.user_id)
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {selected.includes(u.user_id) && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-5 pb-5 pt-2 border-t border-border">
          <button
            onClick={handleCreate}
            disabled={selected.length < 2 || !groupName.trim() || creating}
            className="w-full py-2.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm disabled:opacity-40 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {creating ? "Creating..." : `Create Group (${selected.length} members)`}
          </button>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Select at least 2 members</p>
        </div>
      </div>
    </div>
  );
}
