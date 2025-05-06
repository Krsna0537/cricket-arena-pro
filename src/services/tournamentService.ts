import { Tournament, Team, Player, Match, MatchStatus, TournamentType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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

export function generateAccessCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createTournament(tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>): Promise<Tournament> {
  const accessCode = tournament.accessCode || generateAccessCode();
  const { data, error } = await supabase
    .from('tournaments')
    .insert([{
      name: tournament.name,
      type: tournament.type,
      start_date: tournament.startDate,
      end_date: tournament.endDate,
      creator_id: tournament.creatorId,
      status: tournament.status,
      venue_city: tournament.venueCity,
      access_code: accessCode
    }])
    .select()
    .single();

  if (error) throw error;

  const newTournament: Tournament = {
    ...tournament,
    id: data.id,
    teams: [],
    matches: [],
    accessCode: accessCode
  };

  return newTournament;
}

export async function updateTournament(tournament: Tournament): Promise<void> {
  const { error } = await supabase
    .from('tournaments')
    .update({
      name: tournament.name,
      type: tournament.type,
      start_date: tournament.startDate,
      end_date: tournament.endDate,
      status: tournament.status,
      venue_city: tournament.venueCity,
      access_code: tournament.accessCode
    })
    .eq('id', tournament.id);

  if (error) throw error;
}

export async function createTeam(tournamentId: string, team: Omit<Team, 'id' | 'players'>): Promise<Team> {
  const { data, error } = await supabase
    .from('teams')
    .insert([{
      name: team.name,
      logo: team.logo,
      tournament_id: tournamentId
    }])
    .select()
    .single();

  if (error) throw error;

  const newTeam: Team = {
    ...team,
    id: data.id,
    tournamentId,
    players: []
  };

  return newTeam;
}

export async function updateTeam(team: Team): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .update({
      name: team.name,
      logo: team.logo
    })
    .eq('id', team.id);

  if (error) throw error;
}

export async function createPlayer(teamId: string, player: Omit<Player, 'id'>): Promise<Player> {
  const { data, error } = await supabase
    .from('players')
    .insert([{
      name: player.name,
      role: player.role,
      team_id: teamId,
      avatar: player.avatar
    }])
    .select()
    .single();

  if (error) throw error;

  const newPlayer: Player = {
    ...player,
    id: data.id,
    teamId
  };

  return newPlayer;
}

export async function updatePlayer(player: Player): Promise<void> {
  const { error } = await supabase
    .from('players')
    .update({
      name: player.name,
      role: player.role,
      avatar: player.avatar
    })
    .eq('id', player.id);

  if (error) throw error;
}

export async function createMatch(tournamentId: string, match: Omit<Match, 'id'>): Promise<Match> {
  const { data, error } = await supabase
    .from('matches')
    .insert([{
      team1_id: match.team1Id,
      team2_id: match.team2Id,
      date: match.date,
      venue: match.venue,
      status: match.status || 'upcoming',
      tournament_id: tournamentId
    }])
    .select()
    .single();

  if (error) throw error;

  const newMatch: Match = {
    ...match,
    id: data.id,
    tournamentId,
    status: data.status as MatchStatus
  };

  return newMatch;
}

export async function updateMatch(match: Match): Promise<void> {
  const updateData: any = {
    team1_id: match.team1Id,
    team2_id: match.team2Id,
    date: match.date,
    venue: match.venue,
    status: match.status,
    result: match.result
  };

  // Add score data if available
  if (match.scoreTeam1) {
    updateData.scoreTeam1 = match.scoreTeam1;
  }
  
  if (match.scoreTeam2) {
    updateData.scoreTeam2 = match.scoreTeam2;
  }

  const { error } = await supabase
    .from('matches')
    .update(updateData)
    .eq('id', match.id);

  if (error) throw error;
}

export function generateShareableLink(tournament: Tournament): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/tournament/${tournament.accessCode || tournament.id}`;
}
