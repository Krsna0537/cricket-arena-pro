import { supabase } from '@/lib/supabase';
import config from '@/lib/config';

// Import team data from CSV
export const importTeams = async (
  tournamentId: string,
  teamsData: any[]
): Promise<{ success: boolean; message?: string; count?: number }> => {
  try {
    // Format the teams data correctly
    const formattedTeams = teamsData.map((team) => ({
      name: team.name,
      short_name: team.short_name || team.name?.substring(0, 3)?.toUpperCase() || '',
      logo_url: team.logo_url || null,
      tournament_id: tournamentId,
      captain_name: team.captain_name || null,
      contact_email: team.contact_email || null,
      contact_phone: team.contact_phone || null,
      created_at: new Date().toISOString(),
    }));

    // Insert teams into the database
    const { data, error } = await supabase
      .from('teams')
      .insert(formattedTeams)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      count: data?.length || 0,
      message: `Successfully imported ${data?.length} teams`,
    };
  } catch (error) {
    console.error('Error importing teams:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Import players data from CSV
export const importPlayers = async (
  teamId: string,
  playersData: any[]
): Promise<{ success: boolean; message?: string; count?: number }> => {
  try {
    // Format the players data correctly
    const formattedPlayers = playersData.map((player) => ({
      team_id: teamId,
      first_name: player.first_name,
      last_name: player.last_name || '',
      jersey_number: player.jersey_number || null,
      role: player.role || 'batsman',
      batting_style: player.batting_style || null,
      bowling_style: player.bowling_style || null,
      is_captain: player.is_captain === 'true' || player.is_captain === true,
      is_wicketkeeper: player.is_wicketkeeper === 'true' || player.is_wicketkeeper === true,
      created_at: new Date().toISOString(),
    }));

    // Insert players into the database
    const { data, error } = await supabase
      .from('players')
      .insert(formattedPlayers)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      count: data?.length || 0,
      message: `Successfully imported ${data?.length} players`,
    };
  } catch (error) {
    console.error('Error importing players:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Export teams data
export const exportTeams = async (
  tournamentId: string
): Promise<any[] | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('tournament_id', tournamentId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error exporting teams:', error);
    return null;
  }
};

// Export players data
export const exportPlayers = async (teamId: string): Promise<any[] | null> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error exporting players:', error);
    return null;
  }
};

// Get team template headers
export const getTeamTemplateHeaders = (): string[] => [
  'name',
  'short_name',
  'logo_url',
  'captain_name',
  'contact_email',
  'contact_phone',
];

// Get player template headers
export const getPlayerTemplateHeaders = (): string[] => [
  'first_name',
  'last_name',
  'jersey_number',
  'role',
  'batting_style',
  'bowling_style',
  'is_captain',
  'is_wicketkeeper',
]; 