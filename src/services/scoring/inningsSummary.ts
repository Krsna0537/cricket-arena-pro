
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

// Define a simple interface that matches the exact database structure
interface InningsSummaryRow {
  id?: string;
  match_id: string;
  inning: number;
  total_runs: number;
  wickets: number;
  overs: number;
  extras?: number;
  target?: number;
  batting_team_id?: string;
  created_at?: string;
  updated_at?: string;
}

export async function fetchInningsSummary(matchId: string, inning: number): Promise<InningsSummary | null> {
  try {
    // Use a simple string-based query to avoid TypeScript recursion issues
    const { data, error } = await supabase
      .from('innings_summary')
      .select('*')
      .eq('match_id', matchId)
      .eq('inning', inning)
      .single();
    
    if (error) {
      // Check if it's just a "not found" error which isn't a true error
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    // Check if we have data
    if (!data) {
      return null;
    }
    
    // Cast the data to our known row structure
    const row = data as unknown as InningsSummaryRow;
    
    // Map database row to domain type with explicit field mapping
    return {
      matchId: row.match_id,
      inning: row.inning,
      runs: row.total_runs,
      wickets: row.wickets,
      overs: row.overs,
      extras: row.extras || 0,
      target: row.target
    };
  } catch (error) {
    console.error("Error fetching innings summary:", error);
    throw error;
  }
}
