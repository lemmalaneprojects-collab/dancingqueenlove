import { useState } from "react";
import { STICKERS, STICKER_CATEGORIES, type Sticker } from "@/data/stickers";

interface StickerPickerProps {
  onSelect: (sticker: string) => void;
  onClose: () => void;
}

export default function StickerPicker({ onSelect, onClose }: StickerPickerProps) {
  const [activeCategory, setActiveCategory] = useState<Sticker["category"]>("love");

  const filtered = STICKERS.filter((s) => s.category === activeCategory);

  return (
    <div
      className="bg-card border-t border-border rounded-t-3xl shadow-lg"
      style={{ animation: "slide-up 0.3s ease-out" }}
    >
      {/* Category tabs */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex gap-2">
          {STICKER_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all duration-200 ${
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
          className="text-xs font-display font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-xl bg-muted"
        >
          Close
        </button>
      </div>

      {/* Sticker grid */}
      <div className="grid grid-cols-6 gap-1 px-3 pb-4 max-h-48 overflow-y-auto">
        {filtered.map((sticker, i) => (
          <button
            key={sticker.id}
            onClick={() => onSelect(sticker.emoji)}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-muted/80 active:scale-90 transition-all duration-150"
            style={{ animation: `pop-in 0.3s ease-out ${i * 0.04}s both` }}
            title={sticker.label}
          >
            <span className="text-3xl">{sticker.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
