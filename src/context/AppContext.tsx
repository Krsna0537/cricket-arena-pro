import React, { createContext, useState, useContext, useEffect } from 'react';
import { Tournament, Team, Player, Match, TournamentType, MatchStatus, BallEvent, InningsSummary } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { 
  fetchTournaments,
  generateAccessCode,
  createTournament, 
  updateTournament,
  createTeam,
  updateTeam,
  createPlayer,
  updatePlayer,
  createMatch,
  updateMatch,
  generateShareableLink
} from '@/services/tournamentService';
import {
  addBallEvent,
  fetchBallEvents,
  upsertInningsSummary,
  fetchInningsSummary,
  fetchTargetScore,
  convertToDbInningsSummary
} from '@/services/scoringService';
import { useLiveBallEvents } from '@/hooks/useLiveBallEvents';

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

  // Fetch tournaments on mount
  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchTournaments();
        setTournaments(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch tournaments: " + error.message,
          variant: "destructive",
        });
      }
    };
    
    loadTournaments();
  }, [toast]);

  const addTournament = async (tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>) => {
    try {
      const newTournament = await createTournament(tournament);
      setTournaments(prev => [...prev, newTournament]);
      
      toast({
        title: "Success",
        description: "Tournament created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create tournament: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateTournament = async (tournament: Tournament) => {
    try {
      await updateTournament(tournament);
      
      setTournaments(prev => prev.map(t => t.id === tournament.id ? tournament : t));
      
      toast({
        title: "Success",
        description: "Tournament updated successfully",
      });
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
      const newTeam = await createTeam(tournamentId, team);
      
      const tournament = findTournament(tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          teams: [...tournament.teams, newTeam]
        };
        handleUpdateTournament(updatedTournament);
      }

      toast({
        title: "Success",
        description: "Team added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add team: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateTeam = async (team: Team) => {
    try {
      await updateTeam(team);

      const tournament = findTournament(team.tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          teams: tournament.teams.map(t => t.id === team.id ? team : t)
        };
        handleUpdateTournament(updatedTournament);
      }

      toast({
        title: "Success",
        description: "Team updated successfully",
      });
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
      const newPlayer = await createPlayer(teamId, player);

      // Update the team's players list
      const team = findTeam(teamId);
      if (team) {
        const updatedTeam = {
          ...team,
          players: [...team.players, newPlayer]
        };
        handleUpdateTeam(updatedTeam);
      }

      toast({
        title: "Success",
        description: "Player added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add player: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdatePlayer = async (player: Player) => {
    try {
      await updatePlayer(player);

      const team = findTeam(player.teamId);
      if (team) {
        const updatedTeam = {
          ...team,
          players: team.players.map(p => p.id === player.id ? player : p)
        };
        handleUpdateTeam(updatedTeam);
      }

      toast({
        title: "Success",
        description: "Player updated successfully",
      });
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
      const newMatch = await createMatch(tournamentId, match);

      const tournament = findTournament(tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          matches: [...tournament.matches, newMatch]
        };
        handleUpdateTournament(updatedTournament);
      }

      toast({
        title: "Success",
        description: "Match added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add match: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateMatch = async (match: Match) => {
    try {
      await updateMatch(match);

      const tournament = findTournament(match.tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          matches: tournament.matches.map(m => m.id === match.id ? match : m)
        };
        handleUpdateTournament(updatedTournament);
      }

      toast({
        title: "Success",
        description: "Match updated successfully",
      });
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

  const handleAddBallEvent = async (event: Omit<BallEvent, 'id' | 'createdAt'>) => {
    try {
      return await addBallEvent(event);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to add ball event: ' + error.message, 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const handleFetchBallEvents = async (matchId: string, inning: number) => {
    try {
      return await fetchBallEvents(matchId, inning);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch ball events: ' + error.message, 
        variant: 'destructive' 
      });
      return [];
    }
  };

  const handleUpsertInningsSummary = async (summary: InningsSummary) => {
    try {
      // Convert app model to DB model before sending to the service function
      const dbSummary = convertToDbInningsSummary(summary, summary.matchId);
      await upsertInningsSummary(dbSummary);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update innings summary: ' + error.message, 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const handleFetchInningsSummary = async (matchId: string, inning: number) => {
    try {
      return await fetchInningsSummary(matchId, inning);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch innings summary: ' + error.message, 
        variant: 'destructive' 
      });
      return null;
    }
  };

  const handleFetchTargetScore = async (matchId: string) => {
    try {
      return await fetchTargetScore(matchId);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch target score: ' + error.message, 
        variant: 'destructive' 
      });
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        tournaments,
        addTournament,
        updateTournament: handleUpdateTournament,
        addTeam,
        updateTeam: handleUpdateTeam,
        addPlayer,
        updatePlayer: handleUpdatePlayer,
        addMatch,
        updateMatch: handleUpdateMatch,
        findTeam,
        findTournament,
        findMatch,
        currentTournament,
        setCurrentTournament,
        addBallEvent: handleAddBallEvent,
        fetchBallEvents: handleFetchBallEvents,
        upsertInningsSummary: handleUpsertInningsSummary,
        fetchInningsSummary: handleFetchInningsSummary,
        fetchTargetScore: handleFetchTargetScore,
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

// Re-export the useLiveBallEvents hook for convenience
export { useLiveBallEvents };
