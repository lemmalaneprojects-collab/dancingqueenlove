import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Trash2, SmilePlus, FileText, Download } from "lucide-react";
import type { ReactionGroup } from "@/hooks/useReactions";

interface MessageProps {
  id: string;
  senderId: string;
  text?: string;
  sticker?: string;
  timestamp: string;
  isMe: boolean;
  readAt?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
}

interface MessageBubbleProps {
  message: MessageProps;
  onDelete?: (id: string) => void;
  reactions?: ReactionGroup[];
  onReact?: (messageId: string, emoji: string) => void;
}

const QUICK_REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function MessageBubble({ message, onDelete, reactions = [], onReact }: MessageBubbleProps) {
  const { bubbleStyle, readReceipts } = useSettings();
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const isSticker = !!message.sticker && !message.text && !message.fileUrl;
  const isImage = message.fileType?.startsWith("image/");
  const isFile = !!message.fileUrl && !isImage;

  const getBubbleRadius = (isMe: boolean) => {
    switch (bubbleStyle) {
      case "sharp":
        return isMe ? "rounded-md rounded-br-none" : "rounded-md rounded-bl-none";
      case "pill":
        return "rounded-full";
      case "rounded":
      default:
        return isMe ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md";
    }
  };

  const readIcon = message.isMe && readReceipts
    ? message.readAt ? " ✓✓" : " ✓"
    : "";

  const handleTap = () => {
    if (showReactionPicker) {
      setShowReactionPicker(false);
      setShowActions(false);
      return;
    }
    setShowActions(!showActions);
  };

  const handleReact = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowReactionPicker(false);
    setShowActions(false);
  };

  const ReactionBar = () => {
    if (reactions.length === 0) return null;
    return (
      <div className={`flex gap-1 mt-1 flex-wrap ${message.isMe ? "justify-end" : "justify-start"}`}>
        {reactions.map((r) => (
          <button
            key={r.emoji}
            onClick={(e) => { e.stopPropagation(); handleReact(r.emoji); }}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] border transition-all ${
              r.includesMe
                ? "bg-primary/15 border-primary/30 text-foreground"
                : "bg-muted/60 border-border text-muted-foreground hover:bg-muted"
            }`}
            style={{ animation: "pop-in 0.2s ease-out" }}
          >
            <span>{r.emoji}</span>
            <span className="font-semibold text-[10px]">{r.count}</span>
          </button>
        ))}
      </div>
    );
  };

  const ActionButtons = () => {
    if (!showActions) return null;
    return (
      <div
        className={`absolute ${message.isMe ? "right-0" : "left-0"} -top-10 flex items-center gap-1 bg-card border border-border rounded-2xl px-1.5 py-1 shadow-lg z-10`}
        style={{ animation: "pop-in 0.15s ease-out" }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setShowReactionPicker(!showReactionPicker); }}
          className="p-1.5 rounded-xl hover:bg-muted transition-colors"
        >
          <SmilePlus className="w-4 h-4 text-muted-foreground" />
        </button>
        {message.isMe && onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(message.id); setShowActions(false); }}
            className="p-1.5 rounded-xl hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        )}
      </div>
    );
  };

  const ReactionPicker = () => {
    if (!showReactionPicker) return null;
    return (
      <div
        className={`absolute ${message.isMe ? "right-0" : "left-0"} -top-[72px] flex items-center gap-0.5 bg-card border border-border rounded-2xl px-2 py-1.5 shadow-lg z-20`}
        style={{ animation: "pop-in 0.15s ease-out" }}
      >
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={(e) => { e.stopPropagation(); handleReact(emoji); }}
            className="text-lg hover:scale-125 active:scale-95 transition-transform p-0.5"
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  };

  const TimestampLine = () => (
    <p className={`text-[10px] mt-1 ${message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
      {message.timestamp}
      {readIcon && (
        <span className={message.readAt ? (message.isMe ? " text-primary-foreground" : " text-primary") : ""}>
          {readIcon}
        </span>
      )}
    </p>
  );

  const FileAttachment = () => {
    if (!message.fileUrl) return null;

    if (isImage) {
      return (
        <img
          src={message.fileUrl}
          alt={message.fileName || "Image"}
          className="rounded-xl max-w-full max-h-60 object-cover mb-1"
          loading="lazy"
        />
      );
    }

    return (
      <a
        href={message.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-1 transition-colors ${
          message.isMe ? "bg-primary-foreground/10 hover:bg-primary-foreground/20" : "bg-muted/60 hover:bg-muted"
        }`}
      >
        <FileText className="w-5 h-5 flex-shrink-0" />
        <span className="text-xs truncate flex-1">{message.fileName || "File"}</span>
        <Download className="w-4 h-4 flex-shrink-0 opacity-60" />
      </a>
    );
  };

  if (isSticker) {
    return (
      <div className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2`}>
        <div className="relative flex flex-col items-center" onClick={handleTap}>
          <ActionButtons />
          <ReactionPicker />
          <span className="text-5xl" style={{ animation: "bounce-in 0.4s ease-out" }}>
            {message.sticker}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">
            {message.timestamp}
            {readIcon && <span className={message.readAt ? "text-primary" : ""}>{readIcon}</span>}
          </span>
          <ReactionBar />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div className="relative flex flex-col" onClick={handleTap}>
        <ActionButtons />
        <ReactionPicker />
        <div
          className={`max-w-[75%] px-4 py-2.5 ${getBubbleRadius(message.isMe)} ${
            message.isMe
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border bubble-shadow"
          }`}
          style={{ animation: "pop-in 0.3s ease-out" }}
        >
          <FileAttachment />
          {message.text && <p className="text-sm font-body leading-relaxed">{message.text}</p>}
          <TimestampLine />
        </div>
        <ReactionBar />
      </div>
    </div>
  );
}
