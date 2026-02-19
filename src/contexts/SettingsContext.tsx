import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ThemeId = "pastel" | "ocean" | "sunset" | "forest";
export type FontSize = "small" | "medium" | "large";
export type BubbleStyle = "rounded" | "sharp" | "pill";

interface AppSettings {
  // Appearance
  darkMode: boolean;
  theme: ThemeId;
  fontSize: FontSize;
  bubbleStyle: BubbleStyle;
  // Privacy
  showOnline: boolean;
  showLastSeen: boolean;
  shareLocation: boolean;
  readReceipts: boolean;
  profileVisible: boolean;
  blockStrangers: boolean;
  // Connection (from SettingsPage)
  notifications: boolean;
  sound: boolean;
  autoConnect: boolean;
  bluetooth: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  theme: "pastel",
  fontSize: "medium",
  bubbleStyle: "rounded",
  showOnline: true,
  showLastSeen: true,
  shareLocation: false,
  readReceipts: true,
  profileVisible: true,
  blockStrangers: false,
  notifications: true,
  sound: true,
  autoConnect: true,
  bluetooth: false,
};

interface SettingsContextType extends AppSettings {
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  clearChatHistory: () => void;
  exportData: () => void;
  chatHistoryCleared: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const THEME_VARS: Record<ThemeId, Record<string, string>> = {
  pastel: {
    "--primary": "330 60% 72%",
    "--accent": "270 50% 82%",
    "--secondary": "170 45% 78%",
    "--peach": "20 80% 82%",
    "--baby-blue": "200 60% 82%",
    "--mint": "160 45% 80%",
    "--lavender": "270 50% 85%",
    "--butter": "45 80% 85%",
    "--coral": "5 70% 75%",
  },
  ocean: {
    "--primary": "200 70% 55%",
    "--accent": "180 50% 70%",
    "--secondary": "210 60% 72%",
    "--peach": "190 50% 80%",
    "--baby-blue": "200 70% 78%",
    "--mint": "175 55% 72%",
    "--lavender": "220 45% 80%",
    "--butter": "50 60% 82%",
    "--coral": "195 55% 65%",
  },
  sunset: {
    "--primary": "15 75% 60%",
    "--accent": "350 65% 72%",
    "--secondary": "40 80% 68%",
    "--peach": "20 85% 78%",
    "--baby-blue": "25 50% 80%",
    "--mint": "45 60% 75%",
    "--lavender": "340 55% 80%",
    "--butter": "40 90% 78%",
    "--coral": "5 75% 68%",
  },
  forest: {
    "--primary": "140 40% 48%",
    "--accent": "80 35% 68%",
    "--secondary": "120 35% 65%",
    "--peach": "90 40% 80%",
    "--baby-blue": "160 35% 75%",
    "--mint": "140 45% 72%",
    "--lavender": "100 30% 78%",
    "--butter": "70 50% 80%",
    "--coral": "130 35% 60%",
  },
};

const DARK_OVERRIDES: Record<string, string> = {
  "--background": "260 20% 10%",
  "--foreground": "260 10% 90%",
  "--card": "260 18% 14%",
  "--card-foreground": "260 10% 90%",
  "--popover": "260 18% 14%",
  "--popover-foreground": "260 10% 90%",
  "--muted": "260 15% 20%",
  "--muted-foreground": "260 10% 55%",
  "--border": "260 15% 22%",
  "--input": "260 15% 22%",
};

const LIGHT_OVERRIDES: Record<string, string> = {
  "--background": "330 30% 97%",
  "--foreground": "280 30% 20%",
  "--card": "0 0% 100%",
  "--card-foreground": "280 30% 20%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "280 30% 20%",
  "--muted": "260 20% 93%",
  "--muted-foreground": "260 10% 50%",
  "--border": "330 20% 90%",
  "--input": "330 20% 90%",
};

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem("sea-u-settings");
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [chatHistoryCleared, setChatHistoryCleared] = useState(false);

  // Persist settings
  useEffect(() => {
    localStorage.setItem("sea-u-settings", JSON.stringify(settings));
  }, [settings]);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const themeVars = THEME_VARS[settings.theme];
    const modeVars = settings.darkMode ? DARK_OVERRIDES : LIGHT_OVERRIDES;

    // Apply theme colors
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    // Apply light/dark overrides
    Object.entries(modeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    // Ring follows primary
    root.style.setProperty("--ring", themeVars["--primary"]);

    // Font size
    root.style.fontSize = FONT_SIZE_MAP[settings.fontSize];
  }, [settings.theme, settings.darkMode, settings.fontSize]);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const clearChatHistory = () => {
    setChatHistoryCleared(true);
  };

  const exportData = () => {
    const data = {
      profile: { exported: new Date().toISOString() },
      settings,
      note: "This is a demo export from SEA-U",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sea-u-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SettingsContext.Provider
      value={{ ...settings, update, clearChatHistory, exportData, chatHistoryCleared }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
