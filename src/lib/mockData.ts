import { Tournament, Team, Player, Match, MatchStatus } from '@/types';

// Helper function to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Mock Players Data
export const generateMockPlayers = (teamId: string): Player[] => [
  {
    id: generateId(),
    name: "Virat Kohli",
    role: "batsman",
    teamId,
    stats: {
      matches: 15,
      runs: 720,
      wickets: 0,
      catches: 8,
      sixes: 18,
      fours: 60,
      highestScore: 105,
    },
  },
  {
    id: generateId(),
    name: "Jasprit Bumrah",
    role: "bowler",
    teamId,
    stats: {
      matches: 15,
      runs: 65,
      wickets: 22,
      catches: 4,
      sixes: 1,
      fours: 2,
      bestBowling: "4/16",
    },
  },
  {
    id: generateId(),
    name: "Ravindra Jadeja",
    role: "all-rounder",
    teamId,
    stats: {
      matches: 15,
      runs: 245,
      wickets: 12,
      catches: 7,
      sixes: 8,
      fours: 22,
    },
  },
  {
    id: generateId(),
    name: "MS Dhoni",
    role: "keeper",
    teamId,
    stats: {
      matches: 15,
      runs: 320,
      wickets: 0,
      catches: 16,
      sixes: 14,
      fours: 20,
    },
  },
];

// Mock Teams Data
export const generateMockTeams = (tournamentId: string): Team[] => {
  const teams: Team[] = [
    { id: generateId(), name: "Royal Strikers", tournamentId, players: [] },
    { id: generateId(), name: "Super Kings", tournamentId, players: [] },
    { id: generateId(), name: "Capital Warriors", tournamentId, players: [] },
    { id: generateId(), name: "Urban Riders", tournamentId, players: [] },
  ];
  
  // Add players to each team
  return teams.map(team => ({
    ...team,
    players: generateMockPlayers(team.id),
  }));
};

// Generate match dates
const generateMatchDates = (startDate: string, days: number) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Mock Matches Data
export const generateMockMatches = (tournamentId: string, teams: Team[]): Match[] => {
  const statuses: MatchStatus[] = ['upcoming', 'live', 'completed'];
  const venues = ['Eden Gardens', 'Wankhede Stadium', 'M. Chinnaswamy Stadium', 'Feroz Shah Kotla'];
  
  return [
    {
      id: generateId(),
      tournamentId,
      team1Id: teams[0].id,
      team2Id: teams[1].id,
      date: generateMatchDates('2025-05-15', 0),
      venue: venues[0],
      status: statuses[2],
      result: `${teams[0].name} won by 5 wickets`,
      scoreTeam1: { runs: 180, wickets: 4, overs: 20 },
      scoreTeam2: { runs: 176, wickets: 8, overs: 20 },
    },
    {
      id: generateId(),
      tournamentId,
      team1Id: teams[2].id,
      team2Id: teams[3].id,
      date: generateMatchDates('2025-05-15', 1),
      venue: venues[1],
      status: statuses[2],
      result: `${teams[3].name} won by 8 runs`,
      scoreTeam1: { runs: 165, wickets: 9, overs: 20 },
      scoreTeam2: { runs: 173, wickets: 6, overs: 20 },
    },
    {
      id: generateId(),
      tournamentId,
      team1Id: teams[0].id,
      team2Id: teams[2].id,
      date: generateMatchDates('2025-05-15', 2),
      venue: venues[2],
      status: statuses[1],
      scoreTeam1: { runs: 112, wickets: 3, overs: 14.2 },
      scoreTeam2: { runs: 0, wickets: 0, overs: 0 },
    },
    {
      id: generateId(),
      tournamentId,
      team1Id: teams[1].id,
      team2Id: teams[3].id,
      date: generateMatchDates('2025-05-15', 3),
      venue: venues[3],
      status: statuses[0],
    },
    {
      id: generateId(),
      tournamentId,
      team1Id: teams[0].id,
      team2Id: teams[3].id,
      date: generateMatchDates('2025-05-15', 4),
      venue: venues[0],
      status: statuses[0],
    },
    {
      id: generateId(),
      tournamentId,
      team1Id: teams[1].id,
      team2Id: teams[2].id,
      date: generateMatchDates('2025-05-15', 5),
      venue: venues[1],
      status: statuses[0],
    },
  ];
};

// Mock Tournaments Data
export const generateMockTournaments = (): Tournament[] => {
  const tournaments = [
    {
      id: generateId(),
      name: "Cricket Premier League 2025",
      type: "league" as const,
      startDate: "2025-05-15",
      endDate: "2025-06-30",
      creatorId: "user1",
      teams: [],
      matches: [],
      venueCity: "Mumbai",
      accessCode: "CPL2025",
      status: "ongoing" as const,
      defaultOvers: 20
    },
    {
      id: generateId(),
      name: "T20 Knockout Cup",
      type: "knockout" as const,
      startDate: "2025-07-10",
      endDate: "2025-07-25",
      creatorId: "user1",
      teams: [],
      matches: [],
      venueCity: "Delhi",
      accessCode: "T20KC",
      status: "upcoming" as const,
      defaultOvers: 20
    }
  ];
  
  // Add teams and matches to each tournament
  return tournaments.map(tournament => {
    const teams = generateMockTeams(tournament.id);
    const matches = generateMockMatches(tournament.id, teams);
    return {
      ...tournament,
      teams,
      matches
    };
  });
};

export const mockTournaments = generateMockTournaments();
