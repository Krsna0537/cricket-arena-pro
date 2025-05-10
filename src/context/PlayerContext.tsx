import React, { createContext, useContext } from 'react';
import { Player } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { 
  createPlayer,
  updatePlayer,
  getPlayerWithStats
} from '@/services/api/playerService';
import { useTeam } from './TeamContext';
import { fetchTournaments } from '@/services/api/tournamentService';
import { useAuth } from '@/context/AuthContext';
import { useTournament } from './TournamentContext';

interface PlayerContextType {
  addPlayer: (teamId: string, player: Omit<Player, 'id'>) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { findTeam, updateTeam } = useTeam();
  const { setTournaments } = useTournament();
  const { user } = useAuth();

  const addPlayer = async (teamId: string, player: Omit<Player, 'id'>) => {
    try {
      // Set default empty stats if not provided
      const playerWithDefaults = {
        ...player,
        stats: player.stats || {
          matches: 0,
          runs: 0,
          wickets: 0,
          catches: 0,
          sixes: 0,
          fours: 0
        }
      };

      const newPlayer = await createPlayer(playerWithDefaults);

      // Update the team's players list
      const team = findTeam(teamId);
      if (team) {
        const updatedTeam = {
          ...team,
          players: [...team.players, newPlayer]
        };
        await updateTeam(updatedTeam);
        // Re-fetch tournaments to update context with latest data
        if (user?.id) {
          const updatedTournaments = await fetchTournaments(user.id);
          setTournaments(updatedTournaments);
        }
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
      console.error("Error adding player:", error);
      throw error;
    }
  };

  const handleUpdatePlayer = async (player: Player) => {
    try {
      await updatePlayer(player.id, player);

      const team = findTeam(player.teamId);
      if (team) {
        const updatedTeam = {
          ...team,
          players: team.players.map(p => p.id === player.id ? player : p)
        };
        await updateTeam(updatedTeam);
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

  return (
    <PlayerContext.Provider
      value={{
        addPlayer,
        updatePlayer: handleUpdatePlayer
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
