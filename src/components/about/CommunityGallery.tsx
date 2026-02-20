import { useState } from "react";
import { Heart, MessageCircle, Camera, Star } from "lucide-react";

const COMMUNITY_MEMBERS = [
  { id: 1, name: "Maria S.", country: "🇵🇭", avatar: "👩‍🦰", photo: null, testimonial: "SEA-U changed how I stay connected with my family in the province — even without WiFi!", rating: 5, likes: 42 },
  { id: 2, name: "Budi K.", country: "🇮🇩", avatar: "👨", photo: null, testimonial: "Finally an app that works offline. I use it every day on my commute through Jakarta.", rating: 5, likes: 38 },
  { id: 3, name: "Thanh N.", country: "🇻🇳", avatar: "👩", photo: null, testimonial: "The sticker system is so cute! My friends and I love the SEA-themed packs 🌺", rating: 5, likes: 55 },
  { id: 4, name: "Somchai P.", country: "🇹🇭", avatar: "👨‍🦱", photo: null, testimonial: "I was skeptical about P2P chat, but SEA-U is fast, private, and beautiful.", rating: 4, likes: 29 },
  { id: 5, name: "Aisha R.", country: "🇲🇾", avatar: "🧕", photo: null, testimonial: "Love that it's free forever with no ads. Lemma Lane really cares about users!", rating: 5, likes: 61 },
  { id: 6, name: "Dara C.", country: "🇰🇭", avatar: "👩‍🎤", photo: null, testimonial: "Being able to chat with nearby people via Bluetooth is magical ✨", rating: 5, likes: 47 },
];

export default function CommunityGallery() {
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleLike = (id: number) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider">
          <Camera className="w-3 h-3 inline mr-1" />Community Wall
        </p>
        <span className="text-[9px] text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full font-display">
          {COMMUNITY_MEMBERS.length} stories
        </span>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-3">
        {COMMUNITY_MEMBERS.map((member, i) => {
          const isExpanded = expandedId === member.id;
          const isLiked = likedIds.has(member.id);

          return (
            <button
              key={member.id}
              onClick={() => setExpandedId(isExpanded ? null : member.id)}
              className={`bg-card border border-border rounded-2xl p-3 cute-shadow text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                isExpanded ? "col-span-2" : ""
              }`}
              style={{ animation: `pop-in 0.3s ease-out ${i * 0.08}s both` }}
            >
              {/* Avatar placeholder */}
              <div className="w-full aspect-square rounded-xl bg-muted/60 border border-border/40 flex flex-col items-center justify-center gap-1 mb-3 relative overflow-hidden">
                <span className="text-4xl">{member.avatar}</span>
                <span className="text-lg">{member.country}</span>
                <div className="absolute bottom-1 right-1 bg-card/80 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                  <Camera className="w-2.5 h-2.5 text-muted-foreground" />
                  <span className="text-[8px] text-muted-foreground font-display">Soon</span>
                </div>
              </div>

              {/* Info */}
              <p className="font-display font-bold text-xs text-foreground">{member.name}</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: member.rating }).map((_, j) => (
                  <Star key={j} className="w-2.5 h-2.5 fill-butter text-butter" />
                ))}
              </div>

              {/* Testimonial */}
              <p className={`text-[10px] text-muted-foreground font-body mt-2 leading-relaxed ${
                isExpanded ? "" : "line-clamp-2"
              }`}>
                "{member.testimonial}"
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/40">
                <div
                  onClick={(e) => { e.stopPropagation(); toggleLike(member.id); }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-display font-bold transition-all ${
                    isLiked ? "bg-coral/20 text-coral" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Heart className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`} />
                  {member.likes + (isLiked ? 1 : 0)}
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-[9px] font-display">
                  <MessageCircle className="w-3 h-3" />
                  Reply
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center space-y-2">
        <p className="font-display font-bold text-xs text-foreground">📸 Share Your Story!</p>
        <p className="text-[10px] text-muted-foreground font-body">
          Want to be featured? Send us your photo and testimonial — with your consent, we'll add you to the community wall!
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-[10px] font-display font-bold">
          <Camera className="w-3 h-3" /> Coming Soon
        </div>
      </div>
    </div>
  );
}
