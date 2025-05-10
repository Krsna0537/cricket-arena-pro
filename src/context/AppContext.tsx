import React, { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fetchTournaments } from '@/services/tournamentService';
import { TournamentProvider, useTournament } from './TournamentContext';
import { TeamProvider, useTeam } from './TeamContext';
import { PlayerProvider, usePlayer } from './PlayerContext';
import { MatchProvider, useMatch } from './MatchContext';
import { ScoringProvider, useScoring, useLiveBallEvents } from './ScoringContext';
import { useAuth } from '@/context/AuthContext';

// Create a data initializer component
const DataFetcher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { tournaments, setCurrentTournament, setTournaments } = useTournament();
  const { user } = useAuth();

  // Fetch tournaments on mount and when user changes
  useEffect(() => {
    const loadTournaments = async () => {
      try {
        if (user?.id) {
          const data = await fetchTournaments(user.id);
          if (data && data.length > 0) {
            setTournaments(data);
            setCurrentTournament(data[0]);
          } else {
            setTournaments([]);
            setCurrentTournament(null);
          }
        } else {
          setTournaments([]);
          setCurrentTournament(null);
        }
      } catch (error: any) {
        console.error("Error fetching tournaments:", error);
        toast({
          title: "Error",
          description: "Failed to fetch tournaments: " + (error?.message || "Unknown error"),
          variant: "destructive",
        });
      }
    };
    loadTournaments();
  }, [user, toast, setCurrentTournament, setTournaments]);

  return <>{children}</>;
};

// The main App Provider that wraps all other providers
// Important: Fix the nesting order to ensure each provider is available to the ones that depend on it
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TournamentProvider initialTournaments={[]}>
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
