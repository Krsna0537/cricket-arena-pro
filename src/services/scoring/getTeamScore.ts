import { supabase } from '@/lib/supabase';

export async function getTeamScore(matchId: string, teamId: string, inning: number) {
  const { data, error } = await supabase
    .from('innings_summary')
    .select('runs, wickets, overs')
    .eq('match_id', matchId)
    .eq('batting_team_id', teamId)
    .eq('inning', inning)
    .single();

  if (error) {
    console.error('Error fetching team score:', error);
    return null;
  }
  return data;
} 