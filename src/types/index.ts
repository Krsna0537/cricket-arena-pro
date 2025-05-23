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
  // Removed scoreTeam1 and scoreTeam2. Fetch scores from innings_summary or match_scores instead.
  overs: number;
  tossWinnerId?: string;
  tossDecision?: 'bat' | 'bowl';
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
  defaultOvers: number; // Added default overs field
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

// --- Ball-by-ball scoring types ---
export type BallEventType = 'run' | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';

export type WicketType = 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'hit-wicket';

export interface BallEvent {
  id: string;
  matchId: string;
  teamId: string;
  inning: number; // 1 or 2
  over: number;
  ball: number; // ball number in the over
  eventType: BallEventType;
  runs: number; // runs scored off the bat
  extras: number; // extras (wides, no-balls, byes, leg-byes)
  batsmanId: string;
  bowlerId: string;
  isStriker: boolean;
  nonStrikerId?: string; // Added non-striker ID
  wicketType?: WicketType;
  fielderId?: string;
  extrasType?: string;
  createdAt?: string;
}

export interface InningsSummary {
  matchId: string;
  inning: number;
  runs: number;
  wickets: number;
  overs: number;
  extras?: number;
  target?: number;
}

export interface BattingCard {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  wicketType?: WicketType;
  bowlerId?: string;
  fielderId?: string;
  isStriker?: boolean;
  isNonStriker?: boolean;
}

export interface BowlingCard {
  playerId: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface TargetScore {
  matchId: string;
  inningsNumber: number;
  targetRuns: number;
}

// Add a custom Match type from DB to fix the scoreTeam1/scoreTeam2 property issues
export interface MatchFromDB {
  created_at: string;
  date: string;
  id: string;
  result: string | null;
  status: string;
  team1_id: string;
  team2_id: string;
  tournament_id: string;
  updated_at: string;
  venue: string;
  overs: number;
  toss_winner_id: string | null;
  toss_decision: 'bat' | 'bowl' | null;
  // Removed scoreTeam1 and scoreTeam2. Fetch scores from innings_summary or match_scores instead.
}

export * from './tournament';

// User and authentication types
export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  phone?: string;
  created_at: string;
}

// Common application types
export interface AppConfig {
  app: {
    name: string;
    version: string;
  };
  api: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    timeout: number;
  };
  tournaments: {
    maxTeams: number;
    maxPlayersPerTeam: number;
    defaultOvers: number;
  };
  pagination: {
    defaultLimit: number;
  };
  features: {
    enableScoring: boolean;
    enableLiveUpdates: boolean;
    enableExport: boolean;
    enableTeamLogos: boolean;
  };
}

// Import/Export types
export interface ImportResult {
  success: boolean;
  message?: string;
  count?: number;
}
