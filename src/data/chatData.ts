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
  { id: "1", uid: "SEA-290178", name: "Aira Santos", avatar: "👩", lastMessage: "Kamusta ka? 😊", lastTime: "2m", unread: 3, online: true, connectionType: "hotspot", country: "Philippines 🇵🇭" },
  { id: "2", uid: "SEA-537261", name: "Minh Tran", avatar: "👨", lastMessage: "Sent a sticker 🧋", lastTime: "15m", unread: 1, online: true, connectionType: "bluetooth", country: "Vietnam 🇻🇳" },
  { id: "3", uid: "SEA-418930", name: "Putri Wulandari", avatar: "👩", lastMessage: "Ayo kita makan!", lastTime: "1h", unread: 0, online: true, connectionType: "uid", country: "Indonesia 🇮🇩" },
  { id: "4", uid: "SEA-602847", name: "Somchai Rattana", avatar: "👨", lastMessage: "Sawasdee krub 🙏", lastTime: "2h", unread: 0, online: false, connectionType: "bluetooth", country: "Thailand 🇹🇭" },
  { id: "5", uid: "SEA-753194", name: "Lina Abdullah", avatar: "👩", lastMessage: "Jom lepak!", lastTime: "3h", unread: 0, online: false, connectionType: "uid", country: "Malaysia 🇲🇾" },
  { id: "6", uid: "SEA-884562", name: "Dara Sokha", avatar: "👩", lastMessage: "See you later! 🌺", lastTime: "5h", unread: 0, online: false, connectionType: "bluetooth", country: "Cambodia 🇰🇭" },
  { id: "7", uid: "SEA-120395", name: "Rizal Abidin", avatar: "👨", lastMessage: "Apa khabar bro!", lastTime: "6h", unread: 2, online: true, connectionType: "uid", country: "Malaysia 🇲🇾" },
  { id: "8", uid: "SEA-667821", name: "Mei Lin Tan", avatar: "👩", lastMessage: "Dinner later? 🍜", lastTime: "8h", unread: 0, online: true, connectionType: "uid", country: "Singapore 🇸🇬" },
  { id: "9", uid: "SEA-445109", name: "Kanya Siriwat", avatar: "👩", lastMessage: "ส่งรูปมาหน่อย~", lastTime: "12h", unread: 0, online: false, connectionType: "hotspot", country: "Thailand 🇹🇭" },
  { id: "10", uid: "SEA-998134", name: "Arief Pratama", avatar: "👨", lastMessage: "GG bro! 🎮", lastTime: "1d", unread: 0, online: false, connectionType: "uid", country: "Indonesia 🇮🇩" },
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
  "7": [
    { id: "m13", senderId: "7", text: "Bro! Kau kat mana sekarang? 😄", timestamp: "2:00 PM", isMe: false },
    { id: "m14", senderId: "me", text: "Kat rumah je, kenapa?", timestamp: "2:05 PM", isMe: true },
    { id: "m15", senderId: "7", text: "Apa khabar bro!", timestamp: "2:10 PM", isMe: false },
  ],
  "8": [
    { id: "m16", senderId: "8", text: "Hey! Long time no chat 🌸", timestamp: "11:00 AM", isMe: false },
    { id: "m17", senderId: "me", text: "Mei Lin! How's Singapore?", timestamp: "11:15 AM", isMe: true },
    { id: "m18", senderId: "8", text: "Dinner later? 🍜", timestamp: "11:20 AM", isMe: false },
  ],
  "10": [
    { id: "m19", senderId: "10", text: "Main game yuk! 🎮", timestamp: "8:00 PM", isMe: false },
    { id: "m20", senderId: "me", text: "Boleh! Ranked?", timestamp: "8:05 PM", isMe: true },
    { id: "m21", senderId: "10", text: "GG bro! 🎮", timestamp: "9:30 PM", isMe: false },
  ],
};
