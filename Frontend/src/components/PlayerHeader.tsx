import astronautAvatar from "@/assets/astronaut-avatar.png";
import { Star, Zap, Trophy } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

const PlayerHeader = () => {
  const { totalXp, completedCount } = useProgress();
  const level = Math.floor(totalXp / 500) + 1;
  const xpInLevel = totalXp % 500;
  const xpToNext = 500;
  const xpPercent = (xpInLevel / xpToNext) * 100;

  return (
    <header className="w-full px-6 py-4 card-glass rounded-xl flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full border-2 border-primary glow-cyan overflow-hidden">
          <img src={astronautAvatar} alt="Avatar do jogador" className="w-full h-full object-cover" />
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-display font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {level}
          </span>
        </div>
        <div>
          <h2 className="font-display text-sm tracking-wider text-foreground">EXPLORADOR CÓSMICO</h2>
          <p className="text-muted-foreground text-xs font-body">Nível {level} • {totalXp} XP total</p>
          <div className="mt-1 w-40 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full progress-bar-glow rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xp">
          <Star className="w-5 h-5" />
          <span className="font-display text-sm">{totalXp}</span>
        </div>
        <div className="flex items-center gap-2 text-neon-orange">
          <Zap className="w-5 h-5" />
          <span className="font-display text-sm">{completedCount}</span>
        </div>
        <div className="flex items-center gap-2 text-neon-purple">
          <Trophy className="w-5 h-5" />
          <span className="font-display text-sm">{Math.floor(completedCount / 4)}</span>
        </div>
      </div>
    </header>
  );
};

export default PlayerHeader;
