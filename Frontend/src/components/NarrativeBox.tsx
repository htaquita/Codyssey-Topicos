import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface NarrativeBoxProps {
  paragraphs: string[];
  speaker?: string;
}

const NarrativeBox = ({ paragraphs, speaker = "COMANDANTE LYRA" }: NarrativeBoxProps) => {
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const isLast = currentParagraph >= paragraphs.length - 1;

  return (
    <div className="rpg-box rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <span className="font-display text-xs tracking-[0.2em] text-primary">{speaker}</span>
      </div>

      <p className="font-body text-foreground/90 leading-relaxed text-sm min-h-[60px]">
        {paragraphs[currentParagraph]}
      </p>

      <div className="flex justify-end">
        {!isLast ? (
          <button
            onClick={() => setCurrentParagraph((p) => p + 1)}
            className="flex items-center gap-1 text-xs font-display text-primary hover:text-primary/80 transition-colors"
          >
            CONTINUAR <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs font-display text-muted-foreground tracking-wider">FIM DA TRANSMISSÃO</span>
        )}
      </div>
    </div>
  );
};

export default NarrativeBox;
