import { MessageCircle, User, Settings, Wifi, BookOpen } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useUnreadCount } from "@/hooks/useUnreadCount";

export default function BottomNav() {
  const totalUnread = useUnreadCount();

  const navItems = [
    { to: "/", icon: MessageCircle, label: "Chats", badge: totalUnread },
    { to: "/nearby", icon: Wifi, label: "Nearby", badge: 0 },
    { to: "/study", icon: BookOpen, label: "Study", badge: 0 },
    { to: "/profile", icon: User, label: "Profile", badge: 0 },
    { to: "/settings", icon: Settings, label: "Settings", badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 text-muted-foreground"
            activeClassName="text-primary bg-primary/10"
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-display font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
