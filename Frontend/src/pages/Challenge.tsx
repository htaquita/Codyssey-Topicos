import { useParams, useNavigate } from "react-router-dom";
import spaceBg from "@/assets/space-bg.jpg";
import NarrativeBox from "@/components/NarrativeBox";
import CodeEditor from "@/components/CodeEditor";
import { ArrowLeft, ArrowRight, Rocket, BookOpen, Lightbulb } from "lucide-react";
import { getChallengeById, getModuleForChallenge, getChallengeIndex, modules } from "@/data/challenges";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";

const Challenge = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const challengeId = Number(id) || 1;
  const challenge = getChallengeById(challengeId);
  const mod = getModuleForChallenge(challengeId);
  const indices = getChallengeIndex(challengeId);
  const { completeChallenge, getChallengeStatus } = useProgress();

  if (!challenge || !mod || !indices) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Desafio não encontrado.</p>
      </div>
    );
  }

  const allChallengeIds = modules.flatMap((m) => m.challenges);
  const globalIdx = allChallengeIds.indexOf(challengeId);
  const nextId = globalIdx < allChallengeIds.length - 1 ? allChallengeIds[globalIdx + 1] : null;
  const status = getChallengeStatus(challengeId);

  const handleSuccess = () => {
    completeChallenge(challengeId, challenge.xpReward);
  };

  return (
    <div
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${spaceBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Mapa
          </button>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="font-display text-sm tracking-wider text-foreground">CodeSideral</span>
          </div>
        </div>

        <div className="card-glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-neon-cyan" />
            <span className="font-display text-[10px] tracking-[0.2em] text-primary">
              {mod.name.toUpperCase()} • DESAFIO {indices.challengeIndex + 1} DE {mod.challenges.length}
            </span>
          </div>
          <h1 className="font-display text-xl tracking-wide text-foreground text-glow-cyan">
            {challenge.title}
          </h1>
          <p className="text-muted-foreground text-xs font-body mt-1">+{challenge.xpReward} XP</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <NarrativeBox paragraphs={challenge.storyParagraphs} />

            <div className="card-glass rounded-xl p-4 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-xp shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-xs text-xp tracking-wider">DICA</p>
                <p className="text-xs text-muted-foreground font-body mt-1">{challenge.hint}</p>
              </div>
            </div>

            {status === "completed" && nextId && (
              <Button
                onClick={() => navigate(`/challenge/${nextId}`)}
                className="w-full bg-primary text-primary-foreground font-display text-xs tracking-wider"
              >
                PRÓXIMO DESAFIO <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <div className="card-glass rounded-xl p-5">
            <CodeEditor key={challenge.id} challenge={challenge} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;
