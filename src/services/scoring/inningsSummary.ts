
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
    // Avoid complex typing by using a simpler approach
    const { data, error } = await supabase
      .from('innings_summary')
      .select('*')
      .eq('match_id', matchId)
      .eq('inning', inning);
    
    // Handle errors
    if (error) {
      if (error.code !== 'PGRST116') { // Ignore "no rows returned" error
        throw error;
      }
      return null;
    }
    
    // Check if we have data
    if (!data || data.length === 0) {
      return null;
    }
    
    // Explicitly cast to known type and map the first row to our domain type
    const row = data[0] as InningsSummaryRow;
    
    return {
      matchId: row.match_id,
      inning: row.inning,
      runs: row.total_runs,
      wickets: row.wickets,
      overs: row.overs,
      extras: row.extras,
      target: row.target
    };
  } catch (error) {
    throw error;
  }
}
