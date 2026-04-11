import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Trash2, SmilePlus, FileText, Download, Forward, Reply, Pencil } from "lucide-react";
import ForwardMessageDialog from "@/components/ForwardMessageDialog";
import AudioPlayer from "@/components/AudioPlayer";
import type { ReactionGroup } from "@/hooks/useReactions";
import SeenByIndicator from "@/components/SeenByIndicator";

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
  senderName?: string;
  senderAvatar?: string;
  isGroup?: boolean;
  editedAt?: string | null;
  replyTo?: {
    senderName: string;
    content?: string;
    sticker?: string;
  };
}

interface MessageBubbleProps {
  message: MessageProps;
  onDelete?: (id: string) => void;
  onReply?: () => void;
  onEdit?: (id: string, newContent: string) => void;
  reactions?: ReactionGroup[];
  onReact?: (messageId: string, emoji: string) => void;
  highlighted?: boolean;
}

const QUICK_REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function MessageBubble({ message, onDelete, onReply, onEdit, reactions = [], onReact, highlighted }: MessageBubbleProps) {
  const { bubbleStyle, readReceipts } = useSettings();
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showForward, setShowForward] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || "");
  const isSticker = !!message.sticker && !message.text && !message.fileUrl;
  const isImage = message.fileType?.startsWith("image/");
  const isAudio = message.fileType?.startsWith("audio/");
  const isFile = !!message.fileUrl && !isImage && !isAudio;

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

  const highlightClass = highlighted
    ? "ring-2 ring-primary/50 bg-primary/5 rounded-2xl transition-all duration-300"
    : "";

  const renderReactions = () => {
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

  const renderActions = () => {
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
        <button
          onClick={(e) => { e.stopPropagation(); onReply?.(); setShowActions(false); }}
          className="p-1.5 rounded-xl hover:bg-muted transition-colors"
        >
          <Reply className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowForward(true); setShowActions(false); }}
          className="p-1.5 rounded-xl hover:bg-muted transition-colors"
        >
          <Forward className="w-4 h-4 text-muted-foreground" />
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

  const renderForwardDialog = () => {
    if (!showForward) return null;
    return (
      <ForwardMessageDialog
        messageContent={message.text}
        messageSticker={message.sticker}
        fileUrl={message.fileUrl}
        fileName={message.fileName}
        fileType={message.fileType}
        onClose={() => setShowForward(false)}
      />
    );
  };

  const renderReactionPicker = () => {
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

  const renderTimestamp = () => (
    <p className={`text-[10px] mt-1 ${message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
      {message.timestamp}
      {readIcon && (
        <span className={message.readAt ? (message.isMe ? " text-primary-foreground" : " text-primary") : ""}>
          {readIcon}
        </span>
      )}
    </p>
  );

  const renderFile = () => {
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

    if (isAudio) {
      return (
        <div className="mb-1">
          <AudioPlayer src={message.fileUrl} isMe={message.isMe} />
        </div>
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

  const showGroupSender = message.isGroup && !message.isMe;

  const senderLabel = showGroupSender ? (
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-base">{message.senderAvatar || "🧑"}</span>
      <span className="text-[11px] font-display font-semibold text-muted-foreground">{message.senderName || "User"}</span>
    </div>
  ) : null;

  if (isSticker) {
    return (
      <>
        {renderForwardDialog()}
        <div className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2 ${highlightClass}`}>
          <div className="relative flex flex-col items-center" onClick={handleTap}>
            {renderActions()}
            {renderReactionPicker()}
            {senderLabel}
            <span className="text-5xl" style={{ animation: "bounce-in 0.4s ease-out" }}>
              {message.sticker}
            </span>
            <span className="text-[10px] text-muted-foreground mt-1">
              {message.timestamp}
              {readIcon && <span className={message.readAt ? "text-primary" : ""}>{readIcon}</span>}
            </span>
            {renderReactions()}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {renderForwardDialog()}
      <div className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2 ${highlightClass}`}>
        <div className="relative flex flex-col" onClick={handleTap}>
          {renderActions()}
          {renderReactionPicker()}
          {senderLabel}
          <div
            className={`max-w-[75%] px-4 py-2.5 ${getBubbleRadius(message.isMe)} ${
              message.isMe
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border bubble-shadow"
            }`}
            style={{ animation: "pop-in 0.3s ease-out" }}
          >
            {message.replyTo && (
              <div className={`mb-1.5 px-2.5 py-1.5 rounded-lg border-l-2 ${
                message.isMe
                  ? "bg-primary-foreground/10 border-primary-foreground/40"
                  : "bg-muted/60 border-primary/40"
              }`}>
                <p className={`text-[10px] font-semibold ${message.isMe ? "text-primary-foreground/80" : "text-primary"}`}>
                  {message.replyTo.senderName}
                </p>
                <p className={`text-[11px] truncate ${message.isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {message.replyTo.sticker || message.replyTo.content || "Attachment"}
                </p>
              </div>
            )}
            {renderFile()}
            {message.text && <p className="text-sm font-body leading-relaxed">{message.text}</p>}
            {renderTimestamp()}
          </div>
          {renderReactions()}
          <SeenByIndicator
            messageId={message.id}
            senderId={message.senderId}
            isGroup={!!message.isGroup}
            isMe={message.isMe}
          />
        </div>
      </div>
    </>
  );
}
