import { useNavigate } from "react-router-dom";
import spaceBg from "@/assets/space-bg.jpg";
import PlayerHeader from "@/components/PlayerHeader";
import JourneyMap from "@/components/JourneyMap";
import { useAuth } from "@/hooks/useAuth";
import { Rocket, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="w-8 h-8 text-primary animate-float" />
            <h1 className="font-display text-2xl tracking-[0.15em] text-foreground text-glow-cyan">
              CODYSSEY
            </h1>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        <PlayerHeader />

        <div className="card-glass rounded-xl p-5">
          <p className="font-body text-foreground/80 text-sm leading-relaxed">
            Bem-vindo à sua odisseia, <span className="text-primary font-semibold">{profile?.display_name || "Explorador"}</span>! Cada desafio é um passo na sua jornada pelo cosmos da lógica de programação.
            Complete missões, ganhe XP e desbloqueie novos capítulos da história.
          </p>
        </div>

        <JourneyMap />
      </div>
    </div>
  );
};

export default Dashboard;
