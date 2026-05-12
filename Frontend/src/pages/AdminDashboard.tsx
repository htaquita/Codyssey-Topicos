import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/adminEmails";
import { getChallengeById, modules } from "@/data/challenges";
import spaceBg from "@/assets/space-bg.jpg";
import { Rocket, LogOut, Users, Target, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentData {
  user_id: string;
  display_name: string;
  total_xp: number;
  completed_challenges: number[];
}

interface AttemptStats {
  challenge_id: number;
  total: number;
  passed: number;
  avg_time: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [attemptStats, setAttemptStats] = useState<AttemptStats[]>([]);
  const [activeTab, setActiveTab] = useState<"students" | "challenges">("students");

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isAdmin(user.email)) {
        navigate("/dashboard");
        return;
      }
      await loadData();
      setLoading(false);
    };
    checkAccess();
  }, []);

  const loadData = async () => {
    // Carregar alunos
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name");

    const { data: progress } = await supabase
      .from("user_progress")
      .select("user_id, total_xp, completed_challenges");

    if (profiles && progress) {
      const merged = profiles.map((p) => {
        const prog = progress.find((pr) => pr.user_id === p.user_id);
        return {
          user_id: p.user_id,
          display_name: p.display_name,
          total_xp: prog?.total_xp ?? 0,
          completed_challenges: prog?.completed_challenges ?? [],
        };
      });
      setStudents(merged.sort((a, b) => b.total_xp - a.total_xp));
    }

    // Carregar tentativas
    const { data: attempts } = await supabase
      .from("challenge_attempts")
      .select("challenge_id, passed, time_spent");

    if (attempts) {
      const allIds = modules.flatMap((m) => m.challenges);
      const stats = allIds.map((id) => {
        const forChallenge = attempts.filter((a) => a.challenge_id === id);
        const passed = forChallenge.filter((a) => a.passed).length;
        const times = forChallenge.map((a) => a.time_spent ?? 0).filter((t) => t > 0);
        const avg_time = times.length > 0 ? Math.floor(times.reduce((a, b) => a + b, 0) / times.length) : 0;
        return { challenge_id: id, total: forChallenge.length, passed, avg_time };
      });
      setAttemptStats(stats);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const totalStudents = students.length;
  const totalAttempts = attemptStats.reduce((a, b) => a + b.total, 0);
  const avgXp = students.length > 0 ? Math.floor(students.reduce((a, b) => a + b.total_xp, 0) / students.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Rocket className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-display text-2xl tracking-[0.15em] text-foreground text-glow-cyan">CODYSSEY</h1>
              <p className="text-xs text-muted-foreground font-display tracking-wider">PAINEL DO PROFESSOR</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Alunos", value: totalStudents },
            { icon: Target, label: "Tentativas", value: totalAttempts },
            { icon: TrendingUp, label: "XP Médio", value: avgXp },
            { icon: Clock, label: "Questões", value: attemptStats.filter(a => a.total > 0).length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card-glass rounded-xl p-4 flex items-center gap-3">
              <Icon className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-display text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("students")}
            className={`font-display text-xs tracking-wider px-4 py-2 rounded-lg transition-colors ${activeTab === "students" ? "bg-primary text-primary-foreground" : "card-glass text-muted-foreground hover:text-foreground"}`}
          >
            ALUNOS
          </button>
          <button
            onClick={() => setActiveTab("challenges")}
            className={`font-display text-xs tracking-wider px-4 py-2 rounded-lg transition-colors ${activeTab === "challenges" ? "bg-primary text-primary-foreground" : "card-glass text-muted-foreground hover:text-foreground"}`}
          >
            QUESTÕES
          </button>
        </div>

        {/* Tab: Alunos */}
        {activeTab === "students" && (
          <div className="card-glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">#</th>
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">ALUNO</th>
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">XP</th>
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">COMPLETOS</th>
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">PROGRESSO</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground text-sm">Nenhum aluno cadastrado ainda.</td></tr>
                )}
                {students.map((s, i) => {
                  const total = modules.flatMap(m => m.challenges).length;
                  const pct = Math.floor((s.completed_challenges.length / total) * 100);
                  return (
                    <tr key={s.user_id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-muted-foreground text-sm">{i + 1}</td>
                      <td className="p-4 text-foreground text-sm font-medium">{s.display_name}</td>
                      <td className="p-4 text-primary font-display text-sm">{s.total_xp} XP</td>
                      <td className="p-4 text-foreground text-sm">{s.completed_challenges.length}/{total}</td>
                      <td className="p-4 w-40">
                        <div className="w-full bg-border rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{pct}%</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Questões */}
        {activeTab === "challenges" && (
          <div className="card-glass rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">QUESTÃO</th>
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">TENTATIVAS</th>
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">ACERTOS</th>
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">TAXA</th>
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">TEMPO MÉDIO</th>
                </tr>
              </thead>
              <tbody>
                {attemptStats.filter(a => a.total > 0).length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground text-sm">Nenhuma tentativa registrada ainda.</td></tr>
                )}
                {attemptStats.filter(a => a.total > 0).map((s) => {
                  const challenge = getChallengeById(s.challenge_id);
                  const taxa = Math.floor((s.passed / s.total) * 100);
                  return (
                    <tr key={s.challenge_id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-foreground text-sm font-medium">{challenge?.title ?? `Desafio ${s.challenge_id}`}</td>
                      <td className="p-4 text-foreground text-sm">{s.total}</td>
                      <td className="p-4 text-success text-sm">{s.passed}</td>
                      <td className="p-4">
                        <span className={`text-xs font-display px-2 py-1 rounded-full ${taxa >= 70 ? "bg-success/20 text-success" : taxa >= 40 ? "bg-xp/20 text-xp" : "bg-destructive/20 text-destructive"}`}>
                          {taxa}%
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{formatTime(s.avg_time)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;