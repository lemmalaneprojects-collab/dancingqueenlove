import { Wifi, Bluetooth, Search, RefreshCw } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

const NEARBY_DEVICES = [
  { id: "d1", name: "Aira's Phone", type: "hotspot" as const, signal: "Strong", avatar: "🧑‍🦱" },
  { id: "d2", name: "Minh's Galaxy", type: "bluetooth" as const, signal: "Medium", avatar: "👩" },
  { id: "d3", name: "Putri's iPhone", type: "hotspot" as const, signal: "Strong", avatar: "👧" },
];

export default function NearbyPage() {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 pt-6 pb-4">
        <h1 className="font-display font-extrabold text-xl text-foreground mb-1">Nearby</h1>
        <p className="text-xs text-muted-foreground font-body">Find people around you to chat offline</p>
      </header>

      {/* Connection options */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <button className="bg-card border border-border rounded-3xl p-4 flex flex-col items-center gap-2 cute-shadow hover:scale-105 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-mint/30 flex items-center justify-center">
            <Wifi className="w-6 h-6 text-secondary-foreground" />
          </div>
          <span className="font-display font-bold text-xs text-foreground">Hotspot</span>
          <span className="text-[10px] text-muted-foreground">WiFi Direct</span>
        </button>
        <button className="bg-card border border-border rounded-3xl p-4 flex flex-col items-center gap-2 cute-shadow hover:scale-105 active:scale-95 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-baby-blue/30 flex items-center justify-center">
            <Bluetooth className="w-6 h-6 text-foreground" />
          </div>
          <span className="font-display font-bold text-xs text-foreground">Bluetooth</span>
          <span className="text-[10px] text-muted-foreground">Short range</span>
        </button>
      </div>

      {/* Scan button */}
      <div className="px-4 mb-4">
        <button
          onClick={handleScan}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning..." : "Scan for Devices"}
        </button>
      </div>

      {/* Devices list */}
      <div className="px-4">
        <h2 className="font-display font-bold text-sm text-foreground mb-3">Devices Found</h2>
        <div className="space-y-2">
          {NEARBY_DEVICES.map((device, i) => (
            <div
              key={device.id}
              className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3 cute-shadow"
              style={{ animation: `pop-in 0.3s ease-out ${i * 0.1}s both` }}
            >
              <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-xl">
                {device.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-sm text-foreground">{device.name}</h3>
                <div className="flex items-center gap-1">
                  {device.type === "bluetooth" ? (
                    <Bluetooth className="w-3 h-3 text-baby-blue" />
                  ) : (
                    <Wifi className="w-3 h-3 text-mint" />
                  )}
                  <span className="text-[10px] text-muted-foreground">{device.signal} signal</span>
                </div>
              </div>
              <button className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary font-display font-bold text-xs hover:bg-primary/20 transition-colors">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
