import type { Message } from "@/data/chatData";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isSticker = !!message.sticker && !message.text;

  if (isSticker) {
    return (
      <div className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2`}>
        <div className="flex flex-col items-center">
          <span
            className="text-5xl"
            style={{ animation: "bounce-in 0.4s ease-out" }}
          >
            {message.sticker}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">{message.timestamp}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          message.isMe
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border rounded-bl-md bubble-shadow"
        }`}
        style={{ animation: "pop-in 0.3s ease-out" }}
      >
        <p className="text-sm font-body leading-relaxed">{message.text}</p>
        <p
          className={`text-[10px] mt-1 ${
            message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}
