export interface ChatContact {
  id: string;
  uid: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  connectionType: "hotspot" | "bluetooth" | "uid";
  country: string;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  sticker?: string;
  timestamp: string;
  isMe: boolean;
}

export const MY_PROFILE = {
  uid: "SEA-810042",
  name: "CuteUser_123",
  avatar: "🧑‍💻",
  country: "Philippines 🇵🇭",
  status: "Vibing with SEA friends~ 🌺",
};

export const DEMO_CONTACTS: ChatContact[] = [
  { id: "1", uid: "SEA-290178", name: "Aira 🇵🇭", avatar: "🧑‍🦱", lastMessage: "Kamusta ka? 😊", lastTime: "2m", unread: 3, online: true, connectionType: "hotspot", country: "Philippines" },
  { id: "2", uid: "SEA-537261", name: "Minh 🇻🇳", avatar: "👩", lastMessage: "Sent a sticker 🧋", lastTime: "15m", unread: 1, online: true, connectionType: "bluetooth", country: "Vietnam" },
  { id: "3", uid: "SEA-418930", name: "Putri 🇮🇩", avatar: "👧", lastMessage: "Ayo kita makan!", lastTime: "1h", unread: 0, online: true, connectionType: "uid", country: "Indonesia" },
  { id: "4", uid: "SEA-602847", name: "Somchai 🇹🇭", avatar: "🧑", lastMessage: "Sawasdee krub 🙏", lastTime: "2h", unread: 0, online: false, connectionType: "bluetooth", country: "Thailand" },
  { id: "5", uid: "SEA-753194", name: "Lina 🇲🇾", avatar: "👩‍🦰", lastMessage: "Jom lepak!", lastTime: "3h", unread: 0, online: false, connectionType: "uid", country: "Malaysia" },
  { id: "6", uid: "SEA-884562", name: "Dara 🇰🇭", avatar: "👱‍♀️", lastMessage: "See you later! 🌺", lastTime: "5h", unread: 0, online: false, connectionType: "bluetooth", country: "Cambodia" },
];

export const DEMO_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "m1", senderId: "1", text: "Hiii! Are you nearby? 📡", timestamp: "10:30 AM", isMe: false },
    { id: "m2", senderId: "me", text: "Yes! Connected via hotspot 🎉", timestamp: "10:31 AM", isMe: true },
    { id: "m3", senderId: "1", text: "Yay! Let's chat!", timestamp: "10:31 AM", isMe: false },
    { id: "m4", senderId: "1", sticker: "💖", timestamp: "10:32 AM", isMe: false },
    { id: "m5", senderId: "me", sticker: "🧋", timestamp: "10:33 AM", isMe: true },
    { id: "m6", senderId: "1", text: "Kamusta ka? 😊", timestamp: "10:35 AM", isMe: false },
  ],
  "2": [
    { id: "m7", senderId: "2", text: "Xin chào! 🌸", timestamp: "9:00 AM", isMe: false },
    { id: "m8", senderId: "me", text: "Hey Minh! Connected via BT!", timestamp: "9:02 AM", isMe: true },
    { id: "m9", senderId: "2", sticker: "🧋", timestamp: "9:05 AM", isMe: false },
  ],
  "3": [
    { id: "m10", senderId: "3", text: "Hai hai! 🌺", timestamp: "8:00 AM", isMe: false },
    { id: "m11", senderId: "me", text: "Putri! Apa kabar?", timestamp: "8:05 AM", isMe: true },
    { id: "m12", senderId: "3", text: "Ayo kita makan!", timestamp: "8:10 AM", isMe: false },
  ],
};
