
// Re-export all scoring service functionality from one central file
export * from './ballEvents';
export * from './inningsSummary';
export * from './targetScore';
export * from './utils';

// Define interfaces needed for database representation
export interface TeamInningsSummary {
  teamId: string;
  score: number;
  wickets: number;
  overs: number;
}

// This is the DB representation of innings summary
export interface DbInningsSummary {
  matchId: string;
  team1: TeamInningsSummary;
  team2: TeamInningsSummary;
  currentInnings: number;
  status: string;
}

// Export type alias for backward compatibility
export type BallEventResponse = any;
