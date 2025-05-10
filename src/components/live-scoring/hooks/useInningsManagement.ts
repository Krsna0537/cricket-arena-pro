import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Match } from '@/types';

export function useInningsManagement(
  match: Match,
  summary: { 
    runs: number;
    wickets: number;
    overs: number;
    extras: number;
  }
) {
  const { toast } = useToast();
  const { fetchInningsSummary, upsertInningsSummary } = useApp();
  
  const [inning, setInning] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [inning1Complete, setInning1Complete] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Check if first innings is complete and set target
  useEffect(() => {
    async function checkInnings() {
      setLoadingSummary(true);
      try {
        if (inning === 2) {
          const firstInningSummary = await fetchInningsSummary(match.id, 1);
          if (firstInningSummary) {
            setInning1Complete(true);
            setTargetScore(firstInningSummary.runs + 1); // Target is always 1 more than first innings score
          }
        }
      } catch (error) {
        console.error("Error checking innings:", error);
      } finally {
        setLoadingSummary(false);
      }
    }
    
    checkInnings();
  }, [inning, match.id, fetchInningsSummary]);

  // Handle completion of first innings
  const handleCompleteInnings = async () => {
    try {
      setIsLoading(true);
      // Save the summary
      await upsertInningsSummary({
        matchId: match.id,
        inning: inning,
        runs: summary.runs,
        wickets: summary.wickets,
        overs: summary.overs,
        extras: summary.extras
      });
      
      // Fetch the saved summary to get the correct runs
      const firstInningSummary = await fetchInningsSummary(match.id, 1);
      if (firstInningSummary) {
        setTargetScore(firstInningSummary.runs + 1);
      }
      
      // Update target score in database
      await supabase
        .from('target_scores')
        .upsert({
          match_id: match.id,
          innings_number: 1,
          target_runs: summary.runs + 1
        });
      
      // Switch to second innings
      setInning(2);
      setInning1Complete(true);
      
      toast({
        title: "Innings Complete",
        description: `First innings completed with ${summary.runs}/${summary.wickets} in ${summary.overs} overs. Target: ${summary.runs + 1}`,
      });
    } catch (error) {
      console.error("Error completing innings:", error);
      toast({
        title: "Error",
        description: "Failed to complete innings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inning,
    setInning,
    isLoading,
    targetScore,
    inning1Complete,
    loadingSummary,
    setLoadingSummary,
    handleCompleteInnings
  };
}
