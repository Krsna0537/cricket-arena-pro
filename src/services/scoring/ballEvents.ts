import { BallEvent } from '@/types';
import { supabase } from '@/lib/supabase';
import { BallEventRow, mapRowToBallEvent } from './utils';

export async function addBallEvent(event: Omit<BallEvent, 'id' | 'createdAt'>): Promise<BallEvent> {
  try {
    // Calculate the sequential ball number
    const ballNumber = (event.over - 1) * 6 + event.ball;
    
    // Format the data for the database
    const ballEventData = {
      match_id: event.matchId,
      team_id: event.teamId,
      batting_team_id: event.teamId, // Add the batting team ID explicitly
      bowling_team_id: event.inning === 1 ? undefined : event.teamId, // Set appropriate bowling team
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
      ball_number: ballNumber
    };

    // Remove undefined fields from the payload
    const cleanData = Object.fromEntries(
      Object.entries(ballEventData).filter(([_, v]) => v !== undefined)
    );

    console.log('Sending ball event data to Supabase:', cleanData);

    const { data, error } = await supabase
      .from('ball_by_ball')
      .insert([cleanData])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error.message, error.details, error.hint);
      throw error;
    }
    
    // Map DB row to BallEvent using our mapping function
    return mapRowToBallEvent(data as BallEventRow);
  } catch (error) {
    console.error('Error in addBallEvent:', error);
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
    console.error('Error in fetchBallEvents:', error);
    throw error;
  }
}
