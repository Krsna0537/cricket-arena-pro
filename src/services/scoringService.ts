
import { BallEvent, InningsSummary, BallEventType, WicketType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Define a separate interface for ball event database rows to avoid recursive typing
interface BallEventRow {
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
function mapRowToBallEvent(row: BallEventRow): BallEvent {
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

export async function addBallEvent(event: Omit<BallEvent, 'id' | 'createdAt'>): Promise<BallEvent> {
  try {
    // Calculate the sequential ball number
    const ballNumber = (event.over - 1) * 6 + event.ball;
    
    // Format the data for the database
    const ballEventData = {
      match_id: event.matchId,
      team_id: event.teamId,
      inning: event.inning,
      over: event.over,
      ball: event.ball,
      event_type: event.eventType,
      runs: event.runs,
      extras: event.extras,
      batsman_id: event.batsmanId,
      bowler_id: event.bowlerId,
      non_striker_id: event.nonStrikerId,
      is_striker: event.isStriker,
      wicket_type: event.wicketType,
      fielder_id: event.fielderId,
      extras_type: event.extrasType,
      ball_number: ballNumber // Add calculated sequential ball number
    };

    const { data, error } = await supabase
      .from('ball_by_ball')
      .insert(ballEventData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map DB row to BallEvent using our mapping function
    return mapRowToBallEvent(data as BallEventRow);
  } catch (error) {
    throw error;
  }
}

export async function fetchBallEvents(matchId: string, inning: number): Promise<BallEvent[]> {
  try {
    const { data, error } = await supabase
      .from('ball_by_ball')
      .select('*')
      .eq('match_id', matchId)
      .eq('inning', inning)
      .order('over', { ascending: true })
      .order('ball', { ascending: true });
      
    if (error) throw error;
    
    // Type the data array explicitly before mapping
    const ballEventRows = data as BallEventRow[];
    // Use our mapping function to convert rows to BallEvents
    return ballEventRows.map(mapRowToBallEvent);
  } catch (error) {
    throw error;
  }
}

export async function upsertInningsSummary(summary: InningsSummary): Promise<void> {
  try {
    const { error } = await supabase
      .from('innings_summary')
      .upsert([
        {
          match_id: summary.matchId,
          inning: summary.inning,
          total_runs: summary.runs,
          wickets: summary.wickets,
          overs: summary.overs,
          extras: summary.extras,
          target: summary.target
        }
      ], { onConflict: 'match_id,inning' });
      
    if (error) throw error;
  } catch (error) {
    throw error;
  }
}

export async function fetchInningsSummary(matchId: string, inning: number): Promise<InningsSummary | null> {
  try {
    const { data, error } = await supabase
      .from('innings_summary')
      .select('*')
      .eq('match_id', matchId)
      .eq('inning', inning)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    // Define a concrete type for the database row to avoid infinite type instantiation
    interface InningsSummaryRow {
      match_id: string;
      inning: number;
      total_runs: number;
      wickets: number;
      overs: number;
      extras?: number;
      target?: number;
    }
    
    // Explicitly cast the data to our row type
    const row = data as InningsSummaryRow;
    
    // Map the database row to our domain type
    return {
      matchId: row.match_id,
      inning: row.inning,
      runs: row.total_runs,
      wickets: row.wickets,
      overs: row.overs,
      extras: row.extras,
      target: row.target
    };
  } catch (error) {
    throw error;
  }
}

export async function fetchTargetScore(matchId: string): Promise<number | null> {
  try {
    // Define a type for the target score row
    interface TargetScoreRow {
      target_runs: number;
    }
    
    const { data, error } = await supabase
      .from('target_scores')
      .select('target_runs')
      .eq('match_id', matchId)
      .eq('innings_number', 1)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    // Explicitly cast to our row type
    const row = data as TargetScoreRow;
    return row.target_runs;
  } catch (error) {
    throw error;
  }
}
