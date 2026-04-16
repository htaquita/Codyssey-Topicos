import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Rocket, BookOpen, Trophy, Zap, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import spaceBg from "@/assets/space-bg.jpg";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const [mode, setMode] = useState<"info" | "login" | "register">("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!loading && isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password);
      toast({ title: "Conta criada!", description: "Bem-vindo ao Codyssey." });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" ? "Email ou senha incorretos." : err.message || "Erro ao entrar.");
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Aprenda com histórias",
      desc: "Cada exercício é contextualizado em uma narrativa espacial envolvente no estilo RPG.",
    },
    {
      icon: <Zap className="w-8 h-8 text-accent" />,
      title: "Exercícios em Python",
      desc: "12 desafios progressivos cobrindo condicionais, laços de repetição e funções.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-secondary" />,
      title: "Ganhe XP e suba de nível",
      desc: "Complete desafios, acumule pontos de experiência e acompanhe sua evolução.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Rocket className="w-10 h-10 text-primary animate-float" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background relative flex flex-col"
      style={{
        backgroundImage: `url(${spaceBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/90" />

      {/* Header */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Rocket className="w-8 h-8 text-primary animate-float" />
          <span className="font-display text-xl tracking-[0.12em] text-foreground text-glow-cyan">CODYSSEY</span>
        </div>
        {mode === "info" && (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2 font-display tracking-wider" onClick={() => setMode("login")}>
              <LogIn className="w-4 h-4" /> Entrar
            </Button>
            <Button size="sm" className="gap-2 font-display tracking-wider" onClick={() => setMode("register")}>
              <UserPlus className="w-4 h-4" /> Criar Conta
            </Button>
          </div>
        )}
        {mode !== "info" && (
          <button className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMode("info")}>
            ← Voltar
          </button>
        )}
      </header>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        {mode === "info" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="font-display text-4xl md:text-5xl tracking-[0.12em] text-foreground text-glow-cyan mb-3">
                CODYSSEY
              </h1>
              <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
                Sua odisseia pela lógica de programação começa aqui.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div key={i} className="card-glass rounded-xl p-6 text-center space-y-3 hover:border-primary/40 transition-colors">
                  <div className="flex justify-center">{f.icon}</div>
                  <h3 className="font-display text-foreground text-lg">{f.title}</h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="card-glass rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl text-foreground text-center">Como funciona?</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { step: "1", text: "Crie sua conta gratuita e comece sua jornada espacial." },
                  { step: "2", text: "Resolva desafios de Python em ordem, desbloqueando novos a cada conquista." },
                  { step: "3", text: "Acumule XP, suba de nível e revise exercícios anteriores quando quiser." },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-display text-primary text-sm">
                      {s.step}
                    </span>
                    <p className="font-body text-foreground/80 text-sm leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="gap-2 font-display tracking-wider text-base px-8" onClick={() => setMode("register")}>
                <UserPlus className="w-5 h-5" /> Começar Agora
              </Button>
            </div>
          </div>
        )}

        {(mode === "login" || mode === "register") && (
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="card-glass rounded-xl p-8 space-y-6">
              <h2 className="font-display text-2xl text-foreground text-center">
                {mode === "register" ? "Criar Conta" : "Entrar"}
              </h2>

              <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-2">
                    <label className="font-body text-sm text-muted-foreground">Nome</label>
                    <Input placeholder="Seu nome de explorador" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} className="bg-muted/50 border-muted-foreground/20 text-foreground placeholder:text-muted-foreground/50" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="font-body text-sm text-muted-foreground">Email</label>
                  <Input type="email" placeholder="explorador@codyssey.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="bg-muted/50 border-muted-foreground/20 text-foreground placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <label className="font-body text-sm text-muted-foreground">Senha</label>
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="bg-muted/50 border-muted-foreground/20 text-foreground placeholder:text-muted-foreground/50" />
                </div>

                {error && <p className="text-destructive text-sm font-body">{error}</p>}

                <Button type="submit" className="w-full gap-2 font-display tracking-wider" size="lg" disabled={submitting}>
                  {submitting ? "Aguarde..." : mode === "register" ? "Começar Jornada" : "Entrar"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>

              <div className="text-center">
                <button className="font-body text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline" onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }}>
                  {mode === "register" ? "Já tenho uma conta" : "Criar uma conta"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
