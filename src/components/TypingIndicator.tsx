export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1 bubble-shadow">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
