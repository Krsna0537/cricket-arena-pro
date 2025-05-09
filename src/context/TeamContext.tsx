
import React, { createContext, useContext } from 'react';
import { Team, Player } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { 
  createTeam,
  updateTeam
} from '@/services/api/teamService';
import { useTournament } from './TournamentContext';

interface TeamContextType {
  addTeam: (tournamentId: string, team: Omit<Team, 'id' | 'players'>) => Promise<void>;
  updateTeam: (team: Team) => Promise<void>;
  findTeam: (teamId: string) => Team | undefined;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { tournaments, updateTournament: handleUpdateTournament, findTournament } = useTournament();

  const addTeam = async (tournamentId: string, team: Omit<Team, 'id' | 'players'>) => {
    try {
      const newTeam = await createTeam(team);
      
      const tournament = findTournament(tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          teams: [...tournament.teams, newTeam]
        };
        await handleUpdateTournament(updatedTournament);
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
      await updateTeam(team.id, team);

      const tournament = findTournament(team.tournamentId);
      if (tournament) {
        const updatedTournament = {
          ...tournament,
          teams: tournament.teams.map(t => t.id === team.id ? team : t)
        };
        await handleUpdateTournament(updatedTournament);
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

  const findTeam = (teamId: string) => {
    for (const tournament of tournaments) {
      const team = tournament.teams.find(t => t.id === teamId);
      if (team) return team;
    }
    return undefined;
  };

  return (
    <TeamContext.Provider
      value={{
        addTeam,
        updateTeam: handleUpdateTeam,
        findTeam
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
