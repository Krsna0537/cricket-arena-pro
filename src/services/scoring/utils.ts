
import { BallEvent, BallEventType, WicketType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Define a separate interface for ball event database rows to avoid recursive typing
export interface BallEventRow {
  id: string;
  match_id: string;
  team_id: string;
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
