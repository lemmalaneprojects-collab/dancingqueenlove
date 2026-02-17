// Cute sticker data for SEA-U chat
export interface Sticker {
  id: string;
  emoji: string;
  label: string;
  category: "love" | "happy" | "food" | "greet" | "react";
}

export const STICKERS: Sticker[] = [
  // Love
  { id: "s1", emoji: "💖", label: "Sparkle Heart", category: "love" },
  { id: "s2", emoji: "🥰", label: "Love Face", category: "love" },
  { id: "s3", emoji: "💕", label: "Two Hearts", category: "love" },
  { id: "s4", emoji: "😘", label: "Kiss", category: "love" },
  { id: "s5", emoji: "🫶", label: "Heart Hands", category: "love" },
  { id: "s6", emoji: "💗", label: "Growing Heart", category: "love" },

  // Happy
  { id: "s7", emoji: "✨", label: "Sparkles", category: "happy" },
  { id: "s8", emoji: "🌟", label: "Star", category: "happy" },
  { id: "s9", emoji: "🎉", label: "Party", category: "happy" },
  { id: "s10", emoji: "😆", label: "Laughing", category: "happy" },
  { id: "s11", emoji: "🤗", label: "Hug", category: "happy" },
  { id: "s12", emoji: "💃", label: "Dance", category: "happy" },

  // Food (SEA food!)
  { id: "s13", emoji: "🍜", label: "Noodles", category: "food" },
  { id: "s14", emoji: "🍚", label: "Rice", category: "food" },
  { id: "s15", emoji: "🥥", label: "Coconut", category: "food" },
  { id: "s16", emoji: "🧋", label: "Boba", category: "food" },
  { id: "s17", emoji: "🍡", label: "Dango", category: "food" },
  { id: "s18", emoji: "🥭", label: "Mango", category: "food" },

  // Greet
  { id: "s19", emoji: "👋", label: "Wave", category: "greet" },
  { id: "s20", emoji: "🙏", label: "Wai/Namaste", category: "greet" },
  { id: "s21", emoji: "😊", label: "Smile", category: "greet" },
  { id: "s22", emoji: "🌺", label: "Flower", category: "greet" },
  { id: "s23", emoji: "🫡", label: "Salute", category: "greet" },
  { id: "s24", emoji: "🌴", label: "Palm Tree", category: "greet" },

  // React
  { id: "s25", emoji: "😂", label: "LOL", category: "react" },
  { id: "s26", emoji: "😮", label: "Wow", category: "react" },
  { id: "s27", emoji: "😭", label: "Crying", category: "react" },
  { id: "s28", emoji: "🔥", label: "Fire", category: "react" },
  { id: "s29", emoji: "👀", label: "Eyes", category: "react" },
  { id: "s30", emoji: "🫣", label: "Peek", category: "react" },
];

export const STICKER_CATEGORIES = [
  { key: "love" as const, label: "💖" },
  { key: "happy" as const, label: "✨" },
  { key: "food" as const, label: "🍜" },
  { key: "greet" as const, label: "👋" },
  { key: "react" as const, label: "😂" },
];
