import { supabase } from '../../lib/supabase';
import { Tournament } from '../../types';

export async function fetchTournaments(userId: string): Promise<Tournament[]> {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      teams:teams(*, players:players(*)),
      matches:matches(*)
    `)
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const formattedTournaments = (data ?? []).map(row => ({
    id: row.id,
    name: row.name,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    creatorId: row.creator_id,
    venueCity: row.venue_city ?? undefined,
    accessCode: row.access_code ?? undefined,
    status: row.status,
    defaultOvers: row.default_overs || 20,
    teams: (row.teams ?? []).map(team => ({
      id: team.id,
      name: team.name,
      logo: team.logo ?? undefined,
      tournamentId: team.tournament_id,
      players: (team.players ?? []).map((player: any) => ({
        id: player.id,
        name: player.name,
        role: player.role,
        teamId: player.team_id,
        avatar: player.avatar,
        stats: player.stats ?? undefined
      }))
    })),
    matches: (row.matches ?? []).map((match: any) => ({
      id: match.id,
      tournamentId: match.tournament_id,
      team1Id: match.team1_id,
      team2Id: match.team2_id,
      date: match.date,
      venue: match.venue,
      status: match.status,
      result: match.result ?? undefined,
      overs: match.overs,
      scoreTeam1: match.scoreTeam1 ? {
        runs: match.scoreTeam1.runs || 0,
        wickets: match.scoreTeam1.wickets || 0,
        overs: match.scoreTeam1.overs || 0
      } : undefined,
      scoreTeam2: match.scoreTeam2 ? {
        runs: match.scoreTeam2.runs || 0,
        wickets: match.scoreTeam2.wickets || 0,
        overs: match.scoreTeam2.overs || 0
      } : undefined
    })),
  }));

  return formattedTournaments as Tournament[];
}

export async function createTournament(tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>): Promise<Tournament> {
  const { data, error } = await supabase
    .from('tournaments')
    .insert([{
      name: tournament.name,
      type: tournament.type,
      start_date: tournament.startDate,
      end_date: tournament.endDate,
      creator_id: tournament.creatorId,
      venue_city: tournament.venueCity,
      access_code: tournament.accessCode,
      status: tournament.status,
      default_overs: tournament.defaultOvers
    }])
    .select()
    .single();

  if (error) throw error;
  
  // Return with empty teams and matches arrays
  return {
    ...data,
    teams: [],
    matches: []
  } as Tournament;
}

export async function updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
  const { data, error } = await supabase
    .from('tournaments')
    .update({
      name: updates.name,
      type: updates.type,
      start_date: updates.startDate,
      end_date: updates.endDate,
      venue_city: updates.venueCity,
      access_code: updates.accessCode,
      status: updates.status,
      default_overs: updates.defaultOvers
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Preserve teams and matches data in the returned object
  return {
    ...data,
    teams: updates.teams || [],
    matches: updates.matches || []
  } as Tournament;
}

export async function generateShareableLink(tournamentId: string): Promise<string> {
  const { data, error } = await supabase
    .from('tournaments')
    .select('access_code')
    .eq('id', tournamentId)
    .single();

  if (error) throw error;
  return `${window.location.origin}/join/${data.access_code}`;
}
