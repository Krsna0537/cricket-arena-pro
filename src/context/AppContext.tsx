
import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fetchTournaments } from '@/services/tournamentService';
import { TournamentProvider, useTournament } from './TournamentContext';
import { TeamProvider, useTeam } from './TeamContext';
import { PlayerProvider, usePlayer } from './PlayerContext';
import { MatchProvider, useMatch } from './MatchContext';
import { ScoringProvider, useScoring, useLiveBallEvents } from './ScoringContext';

// Create a data initializer component
const DataFetcher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { tournaments, setCurrentTournament } = useTournament();

  // Fetch tournaments on mount
  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchTournaments();
        setCurrentTournament(data.length > 0 ? data[0] : null);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch tournaments: " + error.message,
          variant: "destructive",
        });
      }
    };
    
    loadTournaments();
  }, [toast, setCurrentTournament]);

  return <>{children}</>;
};

// The main App Provider that wraps all other providers
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TournamentProvider>
      <TeamProvider>
        <PlayerProvider>
          <MatchProvider>
            <ScoringProvider>
              <DataFetcher>
                {children}
              </DataFetcher>
            </ScoringProvider>
          </MatchProvider>
        </PlayerProvider>
      </TeamProvider>
    </TournamentProvider>
  );
};

// Export a unified hook that provides access to all contexts
export const useApp = () => {
  const tournament = useTournament();
  const team = useTeam();
  const player = usePlayer();
  const match = useMatch();
  const scoring = useScoring();

  return {
    ...tournament,
    ...team,
    ...player,
    ...match,
    ...scoring,
  };
};

// Re-export the useLiveBallEvents hook for convenience
export { useLiveBallEvents };
