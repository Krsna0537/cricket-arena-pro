
import { InningsSummary } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export async function upsertInningsSummary(summary: InningsSummary): Promise<void> {
  try {
    const { error } = await supabase
      .from('innings_summary')
      .upsert([
        {
          match_id: summary.matchId,
          inning: summary.inning,
          total_runs: summary.runs,
          wickets: summary.wickets,
          overs: summary.overs,
          extras: summary.extras,
          target: summary.target
        }
      ], { onConflict: 'match_id,inning' });
      
    if (error) throw error;
  } catch (error) {
    throw error;
  }
}

// Define the interface for innings summary database rows
interface InningsSummaryRow {
  match_id: string;
  inning: number;
  total_runs: number;
  wickets: number;
  overs: number;
  extras?: number;
  target?: number;
  batting_team_id?: string;
  created_at?: string;
  id?: string;
  updated_at?: string;
}

export async function fetchInningsSummary(matchId: string, inning: number): Promise<InningsSummary | null> {
  try {
    // Explicitly type the query result to avoid deep type instantiation
    interface QueryResult {
      data: InningsSummaryRow | null;
      error: any;
    }
    
    // Use explicit type casting to break potential type inference loops
    const { data, error } = await supabase
      .from('innings_summary')
      .select('*')
      .eq('match_id', matchId)
      .eq('inning', inning)
      .maybeSingle() as QueryResult;
      
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    // Map the database row to our domain type
    return {
      matchId: data.match_id,
      inning: data.inning,
      runs: data.total_runs,
      wickets: data.wickets,
      overs: data.overs,
      extras: data.extras,
      target: data.target
    };
  } catch (error) {
    throw error;
  }
}
