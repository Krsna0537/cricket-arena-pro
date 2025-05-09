
import React, { createContext, useState, useContext } from 'react';
import { Tournament, Team, Match } from '../types';
import { useToast } from '../components/ui/use-toast';
import { 
  fetchTournaments,
  createTournament, 
  updateTournament,
  generateShareableLink
} from '../services/tournamentService';

interface TournamentContextType {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  setCurrentTournament: (tournament: Tournament | null) => void;
  addTournament: (tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>) => Promise<void>;
  updateTournament: (tournament: Tournament) => Promise<void>;
  findTournament: (tournamentId: string) => Tournament | undefined;
  generateShareableLink: (tournamentId: string) => Promise<string>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ 
  children: React.ReactNode;
  initialTournaments?: Tournament[];
}> = ({ children, initialTournaments = [] }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const { toast } = useToast();

  const addTournament = async (tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>) => {
    try {
      // Create tournament without specifying teams/matches as they are added separately
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
      const updatedTournament = await updateTournament(tournament.id, tournament);
      setTournaments(prev => prev.map(t => t.id === tournament.id ? updatedTournament : t));
      
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

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        currentTournament,
        setCurrentTournament,
        addTournament,
        updateTournament: handleUpdateTournament,
        findTournament,
        generateShareableLink,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
