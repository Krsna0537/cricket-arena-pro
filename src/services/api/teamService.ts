
import { supabase } from '../../lib/supabase';
import { Team } from '../../types';

export async function createTeam(team: Omit<Team, 'id' | 'players'>): Promise<Team> {
  const { data, error } = await supabase
    .from('teams')
    .insert([{
      name: team.name,
      logo: team.logo,
      tournament_id: team.tournamentId
    }])
    .select()
    .single();

  if (error) throw error;
  return { ...data, players: [] } as Team;
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
  const { data, error } = await supabase
    .from('teams')
    .update({
      name: updates.name,
      logo: updates.logo
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  // Preserve players data in the returned object
  return {
    ...data,
    players: updates.players || []
  } as Team;
}
