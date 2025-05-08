
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
