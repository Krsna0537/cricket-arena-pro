
export type TournamentType = 'league' | 'knockout';

export type PlayerRole = 'batsman' | 'bowler' | 'all-rounder' | 'keeper';

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  teamId: string;
  avatar?: string;
  stats?: PlayerStats;
}

export interface PlayerStats {
  matches: number;
  runs: number;
  wickets: number;
  catches: number;
  sixes: number;
  fours: number;
  highestScore?: number;
  bestBowling?: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  tournamentId: string;
  players: Player[];
}

export interface Match {
  id: string;
  tournamentId: string;
  team1Id: string;
  team2Id: string;
  date: string;
  venue: string;
  status: MatchStatus;
  result?: string;
  scoreTeam1?: Score;
  scoreTeam2?: Score;
}

export interface Score {
  runs: number;
  wickets: number;
  overs: number;
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  startDate: string;
  endDate: string;
  creatorId: string;
  teams: Team[];
  matches: Match[];
  venueCity?: string;
  accessCode?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Leaderboard {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  won: number;
  lost: number;
  points: number;
  netRunRate?: number;
}
