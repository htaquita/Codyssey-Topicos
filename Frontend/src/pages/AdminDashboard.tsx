import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/adminEmails";
import { getChallengeById, modules } from "@/data/challenges";
import spaceBg from "@/assets/space-bg.jpg";
import { Rocket, LogOut, Users, Target, Clock, TrendingUp, X, CheckCircle2, XCircle, Lock } from "lucide-react";
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

interface StudentAttempt {
  challenge_id: number;
  passed: boolean;
  time_spent: number | null;
  attempted_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [attemptStats, setAttemptStats] = useState<AttemptStats[]>([]);
  const [activeTab, setActiveTab] = useState<"students" | "challenges">("students");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [studentAttempts, setStudentAttempts] = useState<StudentAttempt[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const allChallengeIds = modules.flatMap((m) => m.challenges);

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
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name");
    const { data: progress } = await supabase.from("user_progress").select("user_id, total_xp, completed_challenges");

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

    const { data: attempts } = await supabase.from("challenge_attempts").select("challenge_id, passed, time_spent");
    if (attempts) {
      const stats = allChallengeIds.map((id) => {
        const forChallenge = attempts.filter((a) => a.challenge_id === id);
        const passed = forChallenge.filter((a) => a.passed).length;
        const times = forChallenge.map((a) => a.time_spent ?? 0).filter((t) => t > 0);
        const avg_time = times.length > 0 ? Math.floor(times.reduce((a, b) => a + b, 0) / times.length) : 0;
        return { challenge_id: id, total: forChallenge.length, passed, avg_time };
      });
      setAttemptStats(stats);
    }
  };

  const openStudentModal = async (student: StudentData) => {
    setSelectedStudent(student);
    setLoadingModal(true);
    const { data } = await supabase
      .from("challenge_attempts")
      .select("challenge_id, passed, time_spent, attempted_at")
      .eq("user_id", student.user_id)
      .order("attempted_at", { ascending: true });
    setStudentAttempts(data ?? []);
    setLoadingModal(false);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds === 0) return "—";
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const totalStudents = students.length;
  const totalAttempts = attemptStats.reduce((a, b) => a + b.total, 0);
  const avgXp = students.length > 0 ? Math.floor(students.reduce((a, b) => a + b.total_xp, 0) / students.length) : 0;

  // Dados por questão para o modal
  const getStudentChallengeStats = (challengeId: number) => {
    const attempts = studentAttempts.filter(a => a.challenge_id === challengeId);
    const completed = selectedStudent?.completed_challenges.includes(challengeId) ?? false;
    const totalTries = attempts.length;
    const times = attempts.map(a => a.time_spent ?? 0).filter(t => t > 0);
    const avgTime = times.length > 0 ? Math.floor(times.reduce((a, b) => a + b, 0) / times.length) : 0;
    const firstSuccess = attempts.find(a => a.passed);
    return { completed, totalTries, avgTime, firstSuccess };
  };

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
            { icon: Clock, label: "Questões Ativas", value: attemptStats.filter(a => a.total > 0).length },
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
          <button onClick={() => setActiveTab("students")}
            className={`font-display text-xs tracking-wider px-4 py-2 rounded-lg transition-colors ${activeTab === "students" ? "bg-primary text-primary-foreground" : "card-glass text-muted-foreground hover:text-foreground"}`}>
            ALUNOS
          </button>
          <button onClick={() => setActiveTab("challenges")}
            className={`font-display text-xs tracking-wider px-4 py-2 rounded-lg transition-colors ${activeTab === "challenges" ? "bg-primary text-primary-foreground" : "card-glass text-muted-foreground hover:text-foreground"}`}>
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
                  <th className="text-left p-4 font-display text-xs tracking-wider text-muted-foreground">DETALHES</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr><td colSpan={6} className="p-4 text-center text-muted-foreground text-sm">Nenhum aluno cadastrado ainda.</td></tr>
                )}
                {students.map((s, i) => {
                  const total = allChallengeIds.length;
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
                      <td className="p-4">
                        <button onClick={() => openStudentModal(s)}
                          className="font-display text-xs text-primary hover:text-primary/80 border border-primary/30 px-3 py-1 rounded-lg transition-colors hover:bg-primary/10">
                          VER
                        </button>
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

      {/* Modal do aluno */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-y-auto card-glass rounded-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}>

            {/* Header do modal */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-foreground">{selectedStudent.display_name}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedStudent.total_xp} XP • {selectedStudent.completed_challenges.length}/{allChallengeIds.length} questões completas
                </p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de progresso geral */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progresso geral</span>
                <span>{Math.floor((selectedStudent.completed_challenges.length / allChallengeIds.length) * 100)}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.floor((selectedStudent.completed_challenges.length / allChallengeIds.length) * 100)}%` }} />
              </div>
            </div>

            {loadingModal ? (
              <div className="flex justify-center py-8">
                <Rocket className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {modules.map((mod) => (
                  <div key={mod.id}>
                    <p className="font-display text-xs tracking-wider text-primary mb-2">{mod.name.toUpperCase()}</p>
                    <div className="space-y-2">
                      {mod.challenges.map((challengeId) => {
                        const challenge = getChallengeById(challengeId);
                        const stats = getStudentChallengeStats(challengeId);
                        return (
                          <div key={challengeId} className="flex items-center justify-between bg-background/40 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              {stats.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                              ) : stats.totalTries > 0 ? (
                                <XCircle className="w-4 h-4 text-destructive shrink-0" />
                              ) : (
                                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                              )}
                              <span className="text-sm text-foreground">{challenge?.title ?? `Desafio ${challengeId}`}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {stats.totalTries > 0 && (
                                <>
                                  <span>{stats.totalTries} tentativa{stats.totalTries > 1 ? "s" : ""}</span>
                                  <span>{formatTime(stats.avgTime)}</span>
                                </>
                              )}
                              {stats.completed && (
                                <span className="text-success font-display">+{challenge?.xpReward} XP</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;