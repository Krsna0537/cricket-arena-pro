
import { supabase } from '@/integrations/supabase/client';
import { InningsSummary, TeamInningsSummary } from '../scoring/index';

/**
 * Interface for database row structure
 */
interface InningsSummaryRow {
  match_id: string;
  team1_id: string;
  team2_id: string;
  team1_score: number;
  team1_wickets: number;
  team1_overs: number;
  team2_score: number;
  team2_wickets: number;
  team2_overs: number;
  current_innings: number;
  status: string;
}

/**
 * Gets the latest innings summary for a match
 * @param matchId The match ID to retrieve innings summary for
 * @returns Promise with innings summary or undefined if not found
 */
export const getInningsSummary = async (matchId: string): Promise<InningsSummary | undefined> => {
  try {
    const { data, error } = await supabase
      .from('innings_summary')
      .select('*')
      .eq('match_id', matchId)
      .single();

    if (error || !data) {
      console.error('Error fetching innings summary:', error);
      return undefined;
    }

    // Convert from database model to domain model
    const row = data as InningsSummaryRow;

    return {
      matchId: row.match_id,
      team1: {
        teamId: row.team1_id,
        score: row.team1_score,
        wickets: row.team1_wickets,
        overs: row.team1_overs
      },
      team2: {
        teamId: row.team2_id,
        score: row.team2_score,
        wickets: row.team2_wickets,
        overs: row.team2_overs
      },
      currentInnings: row.current_innings,
      status: row.status
    };
  } catch (error) {
    console.error('Error in getInningsSummary:', error);
    return undefined;
  }
};

/**
 * Upserts (inserts or updates) innings summary data for a match
 */
export const upsertInningsSummary = async (summary: InningsSummary): Promise<void> => {
  try {
    const { error } = await supabase.from('innings_summary').upsert({
      match_id: summary.matchId,
      team1_id: summary.team1.teamId,
      team2_id: summary.team2.teamId,
      team1_score: summary.team1.score,
      team1_wickets: summary.team1.wickets,
      team1_overs: summary.team1.overs,
      team2_score: summary.team2.score,
      team2_wickets: summary.team2.wickets,
      team2_overs: summary.team2.overs,
      current_innings: summary.currentInnings,
      status: summary.status
    });

    if (error) {
      console.error('Error upserting innings summary:', error);
    }
  } catch (error) {
    console.error('Error in upsertInningsSummary:', error);
  }
};

// Function to fetch innings summary by match ID and inning number
export const fetchInningsSummary = async (matchId: string, inning: number): Promise<InningsSummary | null> => {
  try {
    const summary = await getInningsSummary(matchId);
    if (!summary) return null;
    return summary;
  } catch (error) {
    console.error('Error fetching innings summary:', error);
    return null;
  }
};

// Additional functions related to innings summary...
