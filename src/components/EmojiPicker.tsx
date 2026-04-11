import { useState } from "react";

const EMOJI_CATEGORIES = [
  { key: "smileys", label: "😀", emojis: ["😀","😂","🤣","😊","😍","🥰","😘","😜","🤪","😎","🥳","😇","🤩","😋","😛","🤔","🤗","🫡","😶","😏","😌","🥹","😢","😭","😤","🤬","🤯","😱","🥶","🥵","😴","🤮","🤧","😷"] },
  { key: "gestures", label: "👋", emojis: ["👋","👍","👎","👏","🙌","🤝","✌️","🤞","🫶","💪","👊","✊","🤙","👌","🫰","☝️","👆","👇","👈","👉","🙏","💅","🤳","🫂"] },
  { key: "hearts", label: "❤️", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💕","💞","💓","❤️‍🔥","💔","❣️","💘","💝","♥️"] },
  { key: "animals", label: "🐱", emojis: ["🐱","🐶","🐻","🐼","🐨","🦊","🐰","🐸","🐵","🦁","🐯","🐮","🐷","🐔","🐧","🐦","🦄","🐝","🦋","🐙","🐠","🐬","🐳","🦈"] },
  { key: "food", label: "🍕", emojis: ["🍕","🍔","🍟","🌮","🍣","🍜","🍩","🍰","🧁","🍪","🍫","🍦","🍓","🍑","🍒","🥑","🍌","🍎","🍇","☕","🧋","🍵","🥤","🍺"] },
  { key: "objects", label: "⭐", emojis: ["⭐","🌟","✨","💫","🔥","💥","🎉","🎊","🎵","🎶","💡","📱","💻","🎮","📸","🎬","📚","✏️","💰","🎁","🏆","🥇","🔔","⏰"] },
  { key: "flags", label: "🏳️", emojis: ["🏳️","🏴","🇺🇸","🇬🇧","🇫🇷","🇩🇪","🇯🇵","🇰🇷","🇨🇳","🇮🇳","🇧🇷","🇦🇺","🇨🇦","🇲🇽","🇮🇹","🇪🇸","🇵🇭","🇹🇭","🇻🇳","🇮🇩","🇲🇾","🇸🇬"] },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("smileys");

  const category = EMOJI_CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <div
      className="bg-card border-t border-border rounded-t-3xl shadow-lg"
      style={{ animation: "slide-up 0.3s ease-out" }}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex gap-1.5 overflow-x-auto">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat.key
                  ? "bg-primary/20 scale-110"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="text-xs font-display font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-xl bg-muted ml-2 flex-shrink-0"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-8 gap-0.5 px-3 pb-4 max-h-48 overflow-y-auto">
        {category?.emojis.map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            onClick={() => onSelect(emoji)}
            className="flex items-center justify-center p-1.5 rounded-xl hover:bg-muted/80 active:scale-90 transition-all duration-150 text-2xl"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
