import type { Message } from "@/data/chatData";
import { useSettings } from "@/contexts/SettingsContext";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { bubbleStyle, readReceipts } = useSettings();
  const isSticker = !!message.sticker && !message.text;

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

  if (isSticker) {
    return (
      <div className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2`}>
        <div className="flex flex-col items-center">
          <span className="text-5xl" style={{ animation: "bounce-in 0.4s ease-out" }}>
            {message.sticker}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">
            {message.timestamp}
            {message.isMe && readReceipts && " ✓✓"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 ${getBubbleRadius(message.isMe)} ${
          message.isMe
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border bubble-shadow"
        }`}
        style={{ animation: "pop-in 0.3s ease-out" }}
      >
        <p className="text-sm font-body leading-relaxed">{message.text}</p>
        <p className={`text-[10px] mt-1 ${message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {message.timestamp}
          {message.isMe && readReceipts && " ✓✓"}
        </p>
      </div>
    </div>
  );
}
