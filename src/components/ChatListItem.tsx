import { useNavigate } from "react-router-dom";
import type { ChatContact } from "@/data/chatData";
import { Bluetooth, Wifi } from "lucide-react";

interface ChatListItemProps {
  contact: ChatContact;
}

export default function ChatListItem({ contact }: ChatListItemProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/chat/${contact.id}`)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted/80 transition-all duration-150 rounded-2xl"
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-lavender flex items-center justify-center text-2xl cute-shadow">
          {contact.avatar}
        </div>
        {contact.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-mint border-2 border-card" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display font-bold text-sm text-foreground truncate">{contact.name}</h3>
          {contact.connectionType === "bluetooth" ? (
            <Bluetooth className="w-3 h-3 text-baby-blue flex-shrink-0" />
          ) : (
            <Wifi className="w-3 h-3 text-mint flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">{contact.lastTime}</span>
        {contact.unread > 0 && (
          <span className="bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {contact.unread}
          </span>
        )}
      </div>
    </button>
  );
}
