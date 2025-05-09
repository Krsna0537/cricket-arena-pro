
import { supabase } from '../lib/supabase';
import { Tournament, TournamentType, MatchStatus, Match, Team, Player } from '../types';

export async function fetchTournaments(): Promise<Tournament[]> {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      teams:teams(*, players:players(*)),
      matches:matches(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const formattedTournaments = (data ?? []).map(row => ({
    id: row.id,
    name: row.name,
    type: row.type as TournamentType, // Explicitly cast to TournamentType
    startDate: row.start_date,
    endDate: row.end_date,
    creatorId: row.creator_id,
    venueCity: row.venue_city ?? undefined,
    accessCode: row.access_code ?? undefined,
    status: row.status,
    defaultOvers: row.default_overs || 20, // Add default overs
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
      status: match.status as MatchStatus, // Explicitly cast to MatchStatus
      result: match.result ?? undefined,
      overs: match.overs, // Add match overs
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
      overs: match.overs
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
      scoreTeam1: updates.scoreTeam1,
      scoreTeam2: updates.scoreTeam2
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Match;
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

