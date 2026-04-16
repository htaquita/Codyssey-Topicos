import { Lock, CheckCircle2, Play, GitBranch, Repeat, Code2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { modules, getChallengeById } from "@/data/challenges";
import { useProgress, ChallengeStatus } from "@/hooks/useProgress";

const iconMap: Record<string, React.ReactNode> = {
  GitBranch: <GitBranch className="w-6 h-6" />,
  Repeat: <Repeat className="w-6 h-6" />,
  Code2: <Code2 className="w-6 h-6" />,
};

const moduleStyles = [
  { color: "text-neon-cyan", glowClass: "glow-cyan" },
  { color: "text-neon-purple", glowClass: "glow-purple" },
  { color: "text-neon-green", glowClass: "glow-green" },
];

const JourneyMap = () => {
  const navigate = useNavigate();
  const { completedCount, totalCount, getChallengeStatus } = useProgress();
  const overallPercent = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-8">
      <div className="card-glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm tracking-wider text-foreground">PROGRESSO DA JORNADA</h3>
          <span className="text-primary font-display text-sm">{completedCount}/{totalCount}</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full progress-bar-glow rounded-full transition-all duration-700"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {modules.map((mod, modIdx) => {
        const style = moduleStyles[modIdx];
        return (
          <div key={mod.id} className="space-y-3">
            <div className={`flex items-center gap-3 ${style.color}`}>
              {iconMap[mod.icon]}
              <h3 className="font-display text-lg tracking-wide">{mod.name}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mod.challenges.map((challengeId) => {
                const challenge = getChallengeById(challengeId);
                if (!challenge) return null;
                const status: ChallengeStatus = getChallengeStatus(challengeId);
                const isCompleted = status === "completed";
                const isCurrent = status === "current";
                const isLocked = status === "locked";

                return (
                  <button
                    key={challengeId}
                    onClick={() => (isCurrent || isCompleted) && navigate(`/challenge/${challengeId}`)}
                    disabled={isLocked}
                    className={`
                      relative p-4 rounded-xl text-left transition-all duration-300 group
                      ${isCompleted ? "card-glass border border-success/30 cursor-pointer hover:scale-[1.02]" : ""}
                      ${isCurrent ? `rpg-box ${style.glowClass} cursor-pointer hover:scale-[1.03]` : ""}
                      ${isLocked ? "card-glass opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-body text-sm font-medium ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                        {challenge.title}
                      </span>
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                      {isCurrent && <Play className="w-5 h-5 text-primary animate-pulse-glow" />}
                      {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {isCurrent && (
                        <span className="inline-block text-[10px] font-display tracking-widest text-primary uppercase">
                          Desafio Ativo
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-display tracking-widest text-success uppercase">
                          <RotateCcw className="w-3 h-3" /> Refazer
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JourneyMap;
