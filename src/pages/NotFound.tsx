import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BottomNav from "@/components/BottomNav";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pb-20">
      <div className="text-center px-4">
        <p className="text-6xl mb-4">🌊</p>
        <h1 className="mb-2 text-2xl font-display font-extrabold text-foreground">Oops!</h1>
        <p className="mb-6 text-sm text-muted-foreground font-body">This page drifted away~ 🐚</p>
        <a href="/" className="inline-block px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity">
          Back to Chats
        </a>
      </div>
      <BottomNav />
    </div>
  );
};

export default NotFound;
