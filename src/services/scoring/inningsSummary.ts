
import { supabase } from '@/integrations/supabase/client';
import { DbInningsSummary, TeamInningsSummary } from '../scoring/index';
import { InningsSummary } from '@/types';

/**
 * Interface for database row structure that matches what's actually in Supabase
 */
interface InningsSummaryRow {
  match_id: string;
  batting_team_id: string;
  total_runs: number;
  wickets: number;
  overs: number;
  extras?: number;
  target?: number;
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Gets the latest innings summary for a match in the DB format
 * @param matchId The match ID to retrieve innings summary for
 * @returns Promise with innings summary or undefined if not found
 */
export const getInningsSummary = async (matchId: string): Promise<DbInningsSummary | undefined> => {
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

    // If we have data but it doesn't match our expected row format, handle it
    const row = data as unknown as InningsSummaryRow;

    // Convert from database model to domain model
    // This is a placeholder implementation since the actual DB schema seems different
    // from what's expected - we need to adapt based on what's actually in the DB
    return {
      matchId: row.match_id,
      team1: {
        teamId: row.batting_team_id,
        score: row.total_runs,
        wickets: row.wickets,
        overs: row.overs
      },
      team2: {
        teamId: '', // This would need to be derived from match data
        score: 0,   // These defaults would need to be updated
        wickets: 0,
        overs: 0
      },
      currentInnings: 1, // Default to first innings
      status: 'in-progress' // Default status
    };
  } catch (error) {
    console.error('Error in getInningsSummary:', error);
    return undefined;
  }
};

/**
 * Upserts (inserts or updates) innings summary data for a match
 */
export const upsertInningsSummary = async (summary: DbInningsSummary): Promise<void> => {
  try {
    // Transform from our app model to the database model
    const dbRecord = {
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
    };

    const { error } = await supabase.from('innings_summary').upsert(dbRecord);

    if (error) {
      console.error('Error upserting innings summary:', error);
    }
  } catch (error) {
    console.error('Error in upsertInningsSummary:', error);
  }
};

/**
 * Function to fetch innings summary by match ID and inning number
 * Converts from DB format to app format
 */
export const fetchInningsSummary = async (matchId: string, inning: number): Promise<InningsSummary | null> => {
  try {
    const dbSummary = await getInningsSummary(matchId);
    if (!dbSummary) return null;
    
    // Convert from DB model to app model defined in types/index.ts
    const appSummary: InningsSummary = {
      matchId: dbSummary.matchId,
      inning: inning,
      runs: inning === 1 ? dbSummary.team1.score : dbSummary.team2.score,
      wickets: inning === 1 ? dbSummary.team1.wickets : dbSummary.team2.wickets,
      overs: inning === 1 ? dbSummary.team1.overs : dbSummary.team2.overs,
      extras: 0, // Would need to be updated with actual data
      target: inning === 2 ? dbSummary.team1.score + 1 : undefined
    };
    
    return appSummary;
  } catch (error) {
    console.error('Error fetching innings summary:', error);
    return null;
  }
};

// Additional functions related to innings summary...
