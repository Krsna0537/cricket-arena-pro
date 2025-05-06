
import { supabase } from '@/integrations/supabase/client';

// Define a type for the target score row
interface TargetScoreRow {
  target_runs: number;
}

export async function fetchTargetScore(matchId: string): Promise<number | null> {
  try {
    // Explicitly type the query result to avoid deep type instantiation
    type QueryResultType = { data: TargetScoreRow | null, error: any };
    
    // Use explicit type casting to break potential type inference loops
    const result = await supabase
      .from('target_scores')
      .select('target_runs')
      .eq('match_id', matchId)
      .eq('innings_number', 1)
      .maybeSingle() as QueryResultType;
    
    const { data, error } = result;
      
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return data.target_runs;
  } catch (error) {
    throw error;
  }
}
