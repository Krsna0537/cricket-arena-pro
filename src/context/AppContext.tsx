import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Tournament, Team, Player, Match, TournamentType, MatchStatus, BallEvent, BallEventType, InningsSummary, TargetScore, WicketType, MatchFromDB } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface AppContextType {
  tournaments: Tournament[];
  addTournament: (tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>) => Promise<void>;
  updateTournament: (tournament: Tournament) => Promise<void>;
  addTeam: (tournamentId: string, team: Omit<Team, 'id' | 'players'>) => Promise<void>;
  updateTeam: (team: Team) => Promise<void>;
  addPlayer: (teamId: string, player: Omit<Player, 'id'>) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
  addMatch: (tournamentId: string, match: Omit<Match, 'id'>) => Promise<void>;
  updateMatch: (match: Match) => Promise<void>;
  findTeam: (teamId: string) => Team | undefined;
  findTournament: (tournamentId: string) => Tournament | undefined;
  findMatch: (matchId: string) => Match | undefined;
  currentTournament: Tournament | null;
  setCurrentTournament: (tournament: Tournament | null) => void;
  addBallEvent: (event: Omit<BallEvent, 'id' | 'createdAt'>) => Promise<BallEvent>;
  fetchBallEvents: (matchId: string, inning: number) => Promise<BallEvent[]>;
  upsertInningsSummary: (summary: InningsSummary) => Promise<void>;
  fetchInningsSummary: (matchId: string, inning: number) => Promise<InningsSummary | null>;
  fetchTargetScore: (matchId: string) => Promise<number | null>;
  generateShareableLink: (tournament: Tournament) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch tournaments on mount
  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          teams:teams(*, players:players(*)),
          matches:matches(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTournaments: Tournament[] = (data ?? []).map(row => ({
        id: row.id,
        name: row.name,
        type: row.type as TournamentType,
        startDate: row.start_date,
        endDate: row.end_date,
        creatorId: row.creator_id,
        venueCity: row.venue_city ?? undefined,
        accessCode: row.access_code ?? undefined,
        status: row.status as 'upcoming' | 'ongoing' | 'completed',
        teams: (row.teams ?? []).map(team => ({
          id: team.id,
          name: team.name,
          logo: team.logo ?? undefined,
          tournamentId: team.tournament_id,
          players: (team.players ?? []).map((player: any) => ({
            id: player.id,
            name: player.name,
            role: player.role,
            teamId: player.team_id,
            avatar: player.avatar,
            stats: player.stats ?? undefined
          }))
        })),
        matches: (row.matches ?? []).map((match: MatchFromDB) => ({
          id: match.id,
          tournamentId: match.tournament_id,
          team1Id: match.team1_id,
          team2Id: match.team2_id,
          date: match.date,
          venue: match.venue,
          status: match.status as MatchStatus,
          result: match.result ?? undefined,
          // Parse score from JSON format if available
          scoreTeam1: match.scoreTeam1 ? {
            runs: match.scoreTeam1.runs || 0,
            wickets: match.scoreTeam1.wickets || 0,
            overs: match.scoreTeam1.overs || 0
          } : undefined,
          scoreTeam2: match.scoreTeam2 ? {
            runs: match.scoreTeam2.runs || 0,
            wickets: match.scoreTeam2.wickets || 0,
            overs: match.scoreTeam2.overs || 0
          } : undefined
        })),
      }));

      setTournaments(formattedTournaments);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tournaments: " + error.message,
        variant: "destructive",
      });
    }
  };

  function generateAccessCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  const addTournament = async (tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>) => {
    try {
      const accessCode = tournament.accessCode || generateAccessCode();
      const { data, error } = await supabase
        .from('tournaments')
        .insert([{
          name: tournament.name,
          type: tournament.type,
          start_date: tournament.startDate,
          end_date: tournament.endDate,
          creator_id: tournament.creatorId,
          status: tournament.status,
          venue_city: tournament.venueCity,
          access_code: accessCode
        }])
        .select()
        .single();

      if (error) throw error;

      const newTournament: Tournament = {
        ...tournament,
        id: data.id,
        teams: [],
        matches: [],
        accessCode: accessCode
      };

      setTournaments(prev => [...prev, newTournament]);
      toast({
        title: "Success",
        description: "Tournament created successfully",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create tournament: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTournament = async (tournament: Tournament) => {
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({
          name: tournament.name,
          type: tournament.type,
          start_date: tournament.startDate,
          end_date: tournament.endDate,
          status: tournament.status,
          venue_city: tournament.venueCity,
          access_code: tournament.accessCode
        })
        .eq('id', tournament.id);

      if (error) throw error;

      setTournaments(prev => prev.map(t => t.id === tournament.id ? tournament : t));
      toast({
        title: "Success",
        description: "Tournament updated successfully",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update tournament: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const findTournament = (tournamentId: string) => {
    return tournaments.find(tournament => tournament.id === tournamentId);
  };

  const addTeam = async (tournamentId: string, team: Omit<Team, 'id' | 'players'>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          name: team.name,
          logo: team.logo,
          tournament_id: tournamentId
        }])
        .select()
        .single();

      if (error) throw error;

      const newTeam: Team = {
        ...team,
        id: data.id,
        tournamentId,
        players: []
      };

      const tournament = findTournament(tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          teams: [...tournament.teams, newTeam]
        };
        updateTournament(updatedTournament);
      }

      toast({
        title: "Success",
        description: "Team added successfully",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add team: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTeam = async (team: Team) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: team.name,
          logo: team.logo
        })
        .eq('id', team.id);

      if (error) throw error;

      const tournament = findTournament(team.tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          teams: tournament.teams.map(t => t.id === team.id ? team : t)
        };
        updateTournament(updatedTournament);
      }

      toast({
        title: "Success",
        description: "Team updated successfully",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update team: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const addPlayer = async (teamId: string, player: Omit<Player, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: player.name,
          role: player.role,
          team_id: teamId,
          avatar: player.avatar
        }])
        .select()
        .single();

      if (error) throw error;

      const newPlayer: Player = {
        ...player,
        id: data.id,
        teamId
      };

      // Update the team's players list
      const team = findTeam(teamId);
      if (team) {
        const updatedTeam = {
          ...team,
          players: [...team.players, newPlayer]
        };
        updateTeam(updatedTeam);
      }

      toast({
        title: "Success",
        description: "Player added successfully",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add player: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePlayer = async (player: Player) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({
          name: player.name,
          role: player.role,
          avatar: player.avatar
        })
        .eq('id', player.id);

      if (error) throw error;

      const team = findTeam(player.teamId);
      if (team) {
        const updatedTeam = {
          ...team,
          players: team.players.map(p => p.id === player.id ? player : p)
        };
        updateTeam(updatedTeam);
      }

      toast({
        title: "Success",
        description: "Player updated successfully",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update player: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const addMatch = async (tournamentId: string, match: Omit<Match, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([{
          team1_id: match.team1Id,
          team2_id: match.team2Id,
          date: match.date,
          venue: match.venue,
          status: match.status || 'upcoming',
          tournament_id: tournamentId
        }])
        .select()
        .single();

      if (error) throw error;

      const newMatch: Match = {
        ...match,
        id: data.id,
        tournamentId,
        status: data.status as MatchStatus
      };

      const tournament = findTournament(tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          matches: [...tournament.matches, newMatch]
        };
        updateTournament(updatedTournament);
      }

      toast({
        title: "Success",
        description: "Match added successfully",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add match: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMatch = async (match: Match) => {
    try {
      const updateData: any = {
        team1_id: match.team1Id,
        team2_id: match.team2Id,
        date: match.date,
        venue: match.venue,
        status: match.status,
        result: match.result
      };

      // Add score data if available
      if (match.scoreTeam1) {
        updateData.scoreTeam1 = match.scoreTeam1;
      }
      
      if (match.scoreTeam2) {
        updateData.scoreTeam2 = match.scoreTeam2;
      }

      const { error } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', match.id);

      if (error) throw error;

      const tournament = findTournament(match.tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          matches: tournament.matches.map(m => m.id === match.id ? match : m)
        };
        updateTournament(updatedTournament);
      }

      toast({
        title: "Success",
        description: "Match updated successfully",
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update match: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const findTeam = (teamId: string) => {
    for (const tournament of tournaments) {
      const team = tournament.teams.find(t => t.id === teamId);
      if (team) return team;
    }
    return undefined;
  };

  const findMatch = (matchId: string) => {
    for (const tournament of tournaments) {
      const match = tournament.matches.find(m => m.id === matchId);
      if (match) return match;
    }
    return undefined;
  };

  const addBallEvent = async (event: Omit<BallEvent, 'id' | 'createdAt'>) => {
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
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to add ball event: ' + error.message, variant: 'destructive' });
      throw error;
    }
  };

  const fetchBallEvents = async (matchId: string, inning: number) => {
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
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to fetch ball events: ' + error.message, variant: 'destructive' });
      return [];
    }
  };

  const upsertInningsSummary = async (summary: InningsSummary) => {
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
      
      return;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update innings summary: ' + error.message, variant: 'destructive' });
      throw error;
    }
  };

  const fetchInningsSummary = async (matchId: string, inning: number) => {
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
        inning: inning, // Use the passed inning parameter instead of data.inning
        runs: data.total_runs,
        wickets: data.wickets,
        overs: data.overs,
        extras: data.extras,
        target: data.target
      } as InningsSummary;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to fetch innings summary: ' + error.message, variant: 'destructive' });
      return null;
    }
  };

  const fetchTargetScore = async (matchId: string) => {
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
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to fetch target score: ' + error.message, variant: 'destructive' });
      return null;
    }
  };

  const generateShareableLink = (tournament: Tournament) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/tournament/${tournament.accessCode || tournament.id}`;
  };

  return (
    <AppContext.Provider
      value={{
        tournaments,
        addTournament,
        updateTournament,
        addTeam,
        updateTeam,
        addPlayer,
        updatePlayer,
        addMatch,
        updateMatch,
        findTeam,
        findTournament,
        findMatch,
        currentTournament,
        setCurrentTournament,
        addBallEvent,
        fetchBallEvents,
        upsertInningsSummary,
        fetchInningsSummary,
        fetchTargetScore,
        generateShareableLink
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Real-time ball event subscription hook
export function useLiveBallEvents(matchId: string, inning: number) {
  const [events, setEvents] = useState<BallEvent[]>([]);
  const { fetchBallEvents } = useApp();
  const { toast } = useToast();
  const supabaseClient = useRef(supabase);

  useEffect(() => {
    let subscription: any;
    let mounted = true;
    
    // Initial fetch
    fetchBallEvents(matchId, inning).then(fetchedEvents => {
      if (mounted) setEvents(fetchedEvents);
    });
    
    // Subscribe to new events
    subscription = supabaseClient.current
      .channel('ball-by-ball-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ball_by_ball', filter: `match_id=eq.${matchId}` },
        (payload) => {
          if (payload.new && payload.new.inning === inning && mounted) {
            setEvents((prev) => [...prev, {
              id: payload.new.id,
              matchId: payload.new.match_id,
              teamId: payload.new.team_id,
              inning: payload.new.inning,
              over: payload.new.over,
              ball: payload.new.ball,
              eventType: payload.new.event_type as BallEventType,
              runs: payload.new.runs,
              extras: payload.new.extras,
              batsmanId: payload.new.batsman_id,
              bowlerId: payload.new.bowler_id,
              isStriker: payload.new.is_striker,
              nonStrikerId: payload.new.non_striker_id,
              wicketType: payload.new.wicket_type,
              fielderId: payload.new.fielder_id,
              extrasType: payload.new.extras_type,
              createdAt: payload.new.created_at
            }]);
          }
        }
      )
      .subscribe();
    
    return () => {
      mounted = false;
      if (subscription) supabaseClient.current.removeChannel(subscription);
    };
  }, [matchId, inning, fetchBallEvents]);
  
  return events;
}
