
import { BallEvent, InningsSummary, BallEventType, WicketType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Map DB row to BallEvent
    return {
      id: data.id,
      matchId: data.match_id,
      teamId: data.team_id,
      inning: data.inning,
      over: data.over,
      ball: data.ball,
      eventType: data.event_type as BallEventType,
      runs: data.runs,
      extras: data.extras,
      batsmanId: data.batsman_id,
      bowlerId: data.bowler_id,
      isStriker: data.is_striker,
      nonStrikerId: data.non_striker_id,
      wicketType: data.wicket_type as WicketType | undefined,
      fielderId: data.fielder_id,
      extrasType: data.extras_type,
      createdAt: data.created_at
    };
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
    
    // Map DB rows to BallEvent[]
    return (data as any[]).map(row => ({
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
    })) as BallEvent[];
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
    
    return {
      matchId: data.match_id,
      inning: inning,
      runs: data.total_runs,
      wickets: data.wickets,
      overs: data.overs,
      extras: data.extras,
      target: data.target
    } as InningsSummary;
  } catch (error) {
    throw error;
  }
}

export async function fetchTargetScore(matchId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('target_scores')
      .select('target_runs')
      .eq('match_id', matchId)
      .eq('innings_number', 1)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return data.target_runs;
  } catch (error) {
    throw error;
  }
}
