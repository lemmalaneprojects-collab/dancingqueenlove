import { MessageCircle, User, Settings, Wifi } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export default function BottomNav() {
  const navItems = [
    { to: "/", icon: MessageCircle, label: "Chats" },
    { to: "/nearby", icon: Wifi, label: "Nearby" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 text-muted-foreground"
            activeClassName="text-primary bg-primary/10"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-display font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
