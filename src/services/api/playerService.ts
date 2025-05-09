
import { supabase } from '../../lib/supabase';
import { Player } from '../../types';

export async function createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
  const { data, error } = await supabase
    .from('players')
    .insert([{
      name: player.name,
      role: player.role,
      team_id: player.teamId,
      avatar: player.avatar,
      stats: player.stats
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Player;
}

export async function updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
  const { data, error } = await supabase
    .from('players')
    .update({
      name: updates.name,
      role: updates.role,
      avatar: updates.avatar,
      stats: updates.stats
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Player;
}
