
import { BallEvent, BallEventType, WicketType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Define a separate interface for ball event database rows to avoid recursive typing
export interface BallEventRow {
  id: string;
  match_id: string;
  team_id: string;
  batting_team_id?: string;
  bowling_team_id?: string;
  inning: number;
  over: number;
  ball: number;
  event_type: string;
  runs: number;
  extras: number;
  batsman_id: string;
  bowler_id: string;
  is_striker: boolean;
  non_striker_id?: string;
  wicket_type?: string;
  fielder_id?: string;
  extras_type?: string;
  created_at: string;
  ball_number: number;
}

// Explicitly map from row type to BallEvent to break the recursive type chain
export function mapRowToBallEvent(row: BallEventRow): BallEvent {
  return {
    id: row.id,
    matchId: row.match_id,
    teamId: row.team_id,
    inning: row.inning,
    over: row.over,
    ball: row.ball,
    eventType: row.event_type as BallEventType,
    runs: row.runs,
    extras: row.extras,
    batsmanId: row.batsman_id,
    bowlerId: row.bowler_id,
    isStriker: row.is_striker,
    nonStrikerId: row.non_striker_id,
    wicketType: row.wicket_type as WicketType | undefined,
    fielderId: row.fielder_id,
    extrasType: row.extras_type,
    createdAt: row.created_at
  };
}

/**
 * Calculate strike rate (runs scored per 100 balls)
 * @param runs Total runs scored
 * @param balls Total balls faced
 * @returns Strike rate or 0 if balls is 0
 */
export function getStrikeRate(runs: number, balls: number): number {
  if (balls === 0) return 0;
  return parseFloat(((runs / balls) * 100).toFixed(2));
}

/**
 * Calculate economy rate (runs conceded per over)
 * @param runs Runs conceded
 * @param overs Overs bowled
 * @returns Economy rate or 0 if overs is 0
 */
export function getEconomy(runs: number, overs: number): number {
  if (overs === 0) return 0;
  return parseFloat((runs / overs).toFixed(2));
}
