
// Re-export all scoring service functionality from one central file
export * from './ballEvents';
export * from './inningsSummary';
export * from './targetScore';
export * from './utils';

// Define interfaces needed by multiple modules
export interface TeamInningsSummary {
  teamId: string;
  score: number;
  wickets: number;
  overs: number;
}

export interface InningsSummary {
  matchId: string;
  team1: TeamInningsSummary;
  team2: TeamInningsSummary;
  currentInnings: number;
  status: string;
}

// Alias for backward compatibility
export type BallEventResponse = any;
