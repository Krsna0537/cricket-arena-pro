import { useState, useEffect, useRef } from 'react';
import { BallEvent } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { BallEventRow, mapRowToBallEvent } from '@/services/scoring/utils';

// Real-time ball event subscription hook
export function useLiveBallEvents(matchId: string, inning: number): BallEvent[] {
  const [events, setEvents] = useState<BallEvent[]>([]);
  const { toast } = useToast();
  const supabaseClient = useRef(supabase);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    
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
        if (mounted.current && data) {
          const mappedEvents: BallEvent[] = (data as BallEventRow[]).map(mapRowToBallEvent);
          setEvents(mappedEvents);
        }
      } catch (error: any) {
        console.error('[LiveScoring] Error fetching ball events:', error);
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
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'ball_by_ball', 
          filter: `match_id=eq.${matchId}` 
        },
        (payload: PayloadType) => {
          if (payload.new && payload.new.inning === inning && mounted.current) {
            const newEvent = mapRowToBallEvent(payload.new);
            setEvents(prev => {
              // Check if event already exists to prevent duplicates
              const exists = prev.some(e => 
                e.over === newEvent.over && 
                e.ball === newEvent.ball && 
                e.inning === newEvent.inning
              );
              if (exists) return prev;
              return [...prev, newEvent];
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[LiveScoring] Successfully subscribed to ball events');
        } else {
          console.error('[LiveScoring] Failed to subscribe to ball events:', status);
          toast({
            title: 'Connection Error',
            description: 'Failed to establish real-time connection. Please refresh the page.',
            variant: 'destructive'
          });
        }
      });
    
    return () => {
      mounted.current = false;
      supabaseClient.current.removeChannel(channel);
    };
  }, [matchId, inning, toast]);
  
  return events;
}
