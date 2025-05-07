
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
    // Break the chain and use explicit typing to avoid deep type inference
    const { data, error } = await supabase
      .from('innings_summary')
      .select('*')
      .eq('match_id', matchId)
      .eq('inning', inning);
    
    if (error) throw error;
    
    // Check if we have data
    if (!data || data.length === 0) {
      return null;
    }
    
    // First cast to any to break the type inference chain
    const row = data[0] as any as InningsSummaryRow;
    
    // Map database row to domain type
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
