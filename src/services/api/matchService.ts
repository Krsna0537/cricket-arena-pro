import { supabase } from '../../lib/supabase';
import { Match } from '../../types';

export async function createMatch(match: Omit<Match, 'id'>): Promise<Match> {
  const { data, error } = await supabase
    .from('matches')
    .insert([{
      tournament_id: match.tournamentId,
      team1_id: match.team1Id,
      team2_id: match.team2Id,
      date: match.date,
      venue: match.venue,
      status: match.status,
      overs: match.overs,
      toss_winner_id: match.tossWinnerId,
      toss_decision: match.tossDecision
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Match;
}

export async function updateMatch(id: string, updates: Partial<Match>): Promise<Match> {
  const { data, error } = await supabase
    .from('matches')
    .update({
      date: updates.date,
      venue: updates.venue,
      status: updates.status,
      result: updates.result,
      overs: updates.overs,
      toss_winner_id: updates.tossWinnerId,
      toss_decision: updates.tossDecision,
      // NOTE: Removed any logic for scoreTeam1/scoreTeam2. Use innings_summary or match_scores for score updates instead.
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Match;
}
