import { useState } from "react";
import { Play, CheckCircle2, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChallengeData } from "@/data/challenges";
import { checkExercise } from "@/lib/api";

interface CodeEditorProps {
  challenge: ChallengeData;
  onSuccess: () => void;
}

const CodeEditor = ({ challenge, onSuccess }: CodeEditorProps) => {
  const [code, setCode] = useState(challenge.initialCode);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setResult("idle");

    try {
      const response = await checkExercise(code, challenge.expectedOutput);

      setOutput(response.actual_output || "");
      setFeedback(response.feedback || "");

      if (response.passed) {
        setResult("success");
        onSuccess();
      } else {
        setResult("error");
      }
    } catch (e) {
      setResult("error");
      setFeedback("Erro ao conectar com o servidor. O backend está rodando?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode(challenge.initialCode);
    setResult("idle");
    setFeedback("");
    setOutput("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-xs tracking-[0.15em] text-muted-foreground">TERMINAL PYTHON</h4>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-xp/60" />
          <div className="w-3 h-3 rounded-full bg-success/60" />
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setResult("idle");
        }}
        className="w-full h-52 bg-background/80 border border-border rounded-lg p-4 font-mono text-sm text-foreground/90 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
        spellCheck={false}
      />

      <div className="flex items-center gap-3">
        <Button
          onClick={handleRun}
          disabled={loading}
          className="bg-primary text-primary-foreground font-display text-xs tracking-wider hover:bg-primary/90 glow-cyan"
        >
          {loading
            ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            : <Play className="w-4 h-4 mr-2" />
          }
          {loading ? "EXECUTANDO..." : "EXECUTAR"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-border text-muted-foreground font-display text-xs tracking-wider hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          RESETAR
        </Button>
      </div>

      {output && (
        <div className="bg-background/80 border border-border rounded-lg p-3 font-mono text-xs text-foreground/80">
          <p className="text-muted-foreground mb-1">OUTPUT:</p>
          <pre>{output}</pre>
        </div>
      )}

      {result === "success" && (
        <div className="rpg-box rounded-xl p-4 border-success/40 flex items-center gap-3 glow-green">
          <CheckCircle2 className="w-8 h-8 text-success" />
          <div>
            <p className="font-display text-sm text-success tracking-wide">DESAFIO SUPERADO!</p>
            <p className="text-xs text-muted-foreground font-body mt-1">
              +{challenge.xpReward} XP • {challenge.successMessage}
            </p>
          </div>
        </div>
      )}

      {result === "error" && (
        <div className="rpg-box rounded-xl p-4 border-destructive/40 flex items-center gap-3">
          <XCircle className="w-8 h-8 text-destructive" />
          <div>
            <p className="font-display text-sm text-destructive tracking-wide">FALHA NA EXECUÇÃO</p>
            <p className="text-xs text-muted-foreground font-body mt-1">
              {feedback || challenge.errorHint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;