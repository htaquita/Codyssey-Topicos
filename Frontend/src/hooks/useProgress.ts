import { useState, useCallback, useEffect } from "react";
import { modules } from "@/data/challenges";
import { supabase } from "@/integrations/supabase/client";

export type ChallengeStatus = "completed" | "current" | "locked";

interface ProgressState {
  completedChallenges: number[];
  totalXp: number;
}

const defaultState: ProgressState = { completedChallenges: [], totalXp: 0 };

export const useProgress = () => {
  const [state, setState] = useState<ProgressState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  const allChallengeIds = modules.flatMap((m) => m.challenges);

  // Load progress from Supabase on mount
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoaded(true); return; }

      const { data } = await supabase
        .from("user_progress")
        .select("completed_challenges, total_xp")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setState({
          completedChallenges: data.completed_challenges ?? [],
          totalXp: data.total_xp ?? 0,
        });
      }
      setLoaded(true);
    };
    load();
  }, []);

  const saveToSupabase = useCallback(async (next: ProgressState) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("user_progress")
      .upsert({
        user_id: user.id,
        completed_challenges: next.completedChallenges,
        total_xp: next.totalXp,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
  }, []);

  const getChallengeStatus = useCallback(
    (challengeId: number): ChallengeStatus => {
      if (state.completedChallenges.includes(challengeId)) return "completed";
      const globalIndex = allChallengeIds.indexOf(challengeId);
      if (globalIndex === 0 && state.completedChallenges.length === 0) return "current";
      if (globalIndex > 0) {
        const prevId = allChallengeIds[globalIndex - 1];
        if (state.completedChallenges.includes(prevId)) return "current";
      }
      return "locked";
    },
    [state.completedChallenges, allChallengeIds]
  );

  const completeChallenge = useCallback(
    (challengeId: number, xpReward: number) => {
      setState((prev) => {
        if (prev.completedChallenges.includes(challengeId)) return prev;
        const next = {
          completedChallenges: [...prev.completedChallenges, challengeId],
          totalXp: prev.totalXp + xpReward,
        };
        saveToSupabase(next);
        return next;
      });
    },
    [saveToSupabase]
  );

  const getCurrentChallengeId = useCallback((): number => {
    for (const id of allChallengeIds) {
      if (!state.completedChallenges.includes(id)) return id;
    }
    return allChallengeIds[allChallengeIds.length - 1];
  }, [state.completedChallenges, allChallengeIds]);

  const resetProgress = useCallback(async () => {
    setState(defaultState);
    await saveToSupabase(defaultState);
  }, [saveToSupabase]);

  return {
    completedChallenges: state.completedChallenges,
    totalXp: state.totalXp,
    completedCount: state.completedChallenges.length,
    totalCount: allChallengeIds.length,
    getChallengeStatus,
    completeChallenge,
    getCurrentChallengeId,
    resetProgress,
    loaded,
  };
};
