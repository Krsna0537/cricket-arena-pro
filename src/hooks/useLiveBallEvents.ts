
import { useState, useEffect, useRef } from 'react';
import { BallEvent, BallEventType, WicketType } from '@/types';
import { useToast } from '@/components/ui/use-toast';
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

// Real-time ball event subscription hook
export function useLiveBallEvents(matchId: string, inning: number): BallEvent[] {
  const [events, setEvents] = useState<BallEvent[]>([]);
  const { toast } = useToast();
  const supabaseClient = useRef(supabase);

  useEffect(() => {
    let mounted = true;
    
    // Initial fetch with strongly typed handler function
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabaseClient.current
          .from('ball_by_ball')
          .select('*')
          .eq('match_id', matchId)
          .eq('inning', inning)
          .order('over', { ascending: true })
          .order('ball', { ascending: true });
          
        if (error) throw error;
        
        // Use a strongly typed conversion
        if (mounted && data) {
          const mappedEvents: BallEvent[] = (data as BallEventRow[]).map(mapRowToBallEvent);
          setEvents(mappedEvents);
        }
      } catch (error: any) {
        toast({ 
          title: 'Error', 
          description: 'Failed to fetch ball events: ' + error.message, 
          variant: 'destructive' 
        });
      }
    };
    
    fetchEvents();
    
    // Subscribe to new events with strongly typed payload
    type PayloadType = { new: BallEventRow };
    
    const channel = supabaseClient.current
      .channel('ball-by-ball-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ball_by_ball', filter: `match_id=eq.${matchId}` },
        (payload: PayloadType) => {
          if (payload.new && payload.new.inning === inning && mounted) {
            const newEvent = mapRowToBallEvent(payload.new);
            setEvents(prev => [...prev, newEvent]);
          }
        }
      )
      .subscribe();
    
    return () => {
      mounted = false;
      supabaseClient.current.removeChannel(channel);
    };
  }, [matchId, inning, toast]);
  
  return events;
}
