
import React, { createContext, useContext } from 'react';
import { Match } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { 
  createMatch,
  updateMatch
} from '@/services/tournamentService';
import { useTournament } from './TournamentContext';

interface MatchContextType {
  addMatch: (tournamentId: string, match: Omit<Match, 'id'>) => Promise<void>;
  updateMatch: (match: Match) => Promise<void>;
  findMatch: (matchId: string) => Match | undefined;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { tournaments, updateTournament, findTournament } = useTournament();

  const addMatch = async (tournamentId: string, match: Omit<Match, 'id'>) => {
    try {
      const newMatch = await createMatch(match);

      const tournament = findTournament(tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          matches: [...tournament.matches, newMatch]
        };
        await updateTournament(updatedTournament);
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
      await updateMatch(match.id, match);

      const tournament = findTournament(match.tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          matches: tournament.matches.map(m => m.id === match.id ? match : m)
        };
        await updateTournament(updatedTournament);
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

  const findMatch = (matchId: string) => {
    for (const tournament of tournaments) {
      const match = tournament.matches.find(m => m.id === matchId);
      if (match) return match;
    }
    return undefined;
  };

  return (
    <MatchContext.Provider
      value={{
        addMatch,
        updateMatch: handleUpdateMatch,
        findMatch
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
