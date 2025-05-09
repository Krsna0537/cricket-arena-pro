
import { supabase } from '../../lib/supabase';
import { Player, PlayerStats } from '../../types';

export async function createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
  // Create the player record without the stats field
  const { data, error } = await supabase
    .from('players')
    .insert([{
      name: player.name,
      role: player.role,
      team_id: player.teamId,
      avatar: player.avatar
    }])
    .select()
    .single();

  if (error) throw error;
  
  // If player has stats, create a related stats record
  if (player.stats) {
    const { error: statsError } = await supabase
      .from('player_stats')
      .insert([{
        player_id: data.id,
        matches: player.stats.matches || 0,
        runs: player.stats.runs || 0,
        wickets: player.stats.wickets || 0,
        catches: player.stats.catches || 0,
        sixes: player.stats.sixes || 0,
        fours: player.stats.fours || 0,
        highest_score: player.stats.highestScore,
        best_bowling: player.stats.bestBowling
      }]);
    
    if (statsError) console.error("Error adding player stats:", statsError);
  }
  
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    teamId: data.team_id,
    avatar: data.avatar,
    stats: player.stats
  } as Player;
}

export async function updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
  // Update the player record
  const playerUpdates: any = {
    name: updates.name,
    role: updates.role,
    avatar: updates.avatar
  };
  
  const { data, error } = await supabase
    .from('players')
    .update(playerUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // If stats is included in updates, update the stats record separately
  if (updates.stats) {
    const statsUpdates = {
      matches: updates.stats.matches,
      runs: updates.stats.runs,
      wickets: updates.stats.wickets,
      catches: updates.stats.catches,
      sixes: updates.stats.sixes,
      fours: updates.stats.fours,
      highest_score: updates.stats.highestScore,
      best_bowling: updates.stats.bestBowling
    };
    
    const { error: statsError } = await supabase
      .from('player_stats')
      .update(statsUpdates)
      .eq('player_id', id);
    
    if (statsError) console.error("Error updating player stats:", statsError);
  }

  return {
    id: data.id,
    name: data.name,
    role: data.role,
    teamId: data.team_id,
    avatar: data.avatar,
    stats: updates.stats
  } as Player;
}

export async function getPlayerWithStats(id: string): Promise<Player | null> {
  // Get player data
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching player:", error);
    return null;
  }
  
  // Get player stats
  const { data: stats, error: statsError } = await supabase
    .from('player_stats')
    .select('*')
    .eq('player_id', id)
    .single();
  
  if (statsError && statsError.code !== 'PGRST116') {  // PGRST116 is not found error, which is fine
    console.error("Error fetching player stats:", statsError);
  }
  
  // Convert database format to our application format
  return {
    id: player.id,
    name: player.name,
    role: player.role,
    teamId: player.team_id,
    avatar: player.avatar,
    stats: stats ? {
      matches: stats.matches,
      runs: stats.runs,
      wickets: stats.wickets,
      catches: stats.catches,
      sixes: stats.sixes,
      fours: stats.fours,
      highestScore: stats.highest_score,
      bestBowling: stats.best_bowling
    } : undefined
  } as Player;
}
