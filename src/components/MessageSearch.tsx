import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";

interface MessageSearchProps {
  messages: Array<{ id: string; content?: string | null }>;
  onHighlight: (messageId: string | null) => void;
  onClose: () => void;
}

export default function MessageSearch({ messages, onHighlight, onClose }: MessageSearchProps) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setMatches([]);
      onHighlight(null);
      return;
    }
    const lower = query.toLowerCase();
    const found = messages
      .filter((m) => m.content?.toLowerCase().includes(lower))
      .map((m) => m.id);
    setMatches(found);
    setCurrentIndex(0);
    if (found.length > 0) onHighlight(found[0]);
    else onHighlight(null);
  }, [query, messages]);

  const navigate = (dir: 1 | -1) => {
    if (matches.length === 0) return;
    const next = (currentIndex + dir + matches.length) % matches.length;
    setCurrentIndex(next);
    onHighlight(matches[next]);
  };

  const handleClose = () => {
    onHighlight(null);
    onClose();
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border">
      <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search messages..."
        className="flex-1 bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {matches.length > 0 && (
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {currentIndex + 1}/{matches.length}
        </span>
      )}
      {query && matches.length === 0 && (
        <span className="text-[10px] text-muted-foreground">No results</span>
      )}
      <button onClick={() => navigate(-1)} className="p-1 rounded hover:bg-muted transition-colors" disabled={matches.length === 0}>
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      </button>
      <button onClick={() => navigate(1)} className="p-1 rounded hover:bg-muted transition-colors" disabled={matches.length === 0}>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>
      <button onClick={handleClose} className="p-1 rounded hover:bg-muted transition-colors">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
