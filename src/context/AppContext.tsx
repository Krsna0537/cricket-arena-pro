
import React, { createContext, useState, useContext } from 'react';
import { Tournament, Team, Player, Match } from '@/types';
import { mockTournaments } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';

interface AppContextType {
  tournaments: Tournament[];
  addTournament: (tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>) => void;
  updateTournament: (tournament: Tournament) => void;
  addTeam: (tournamentId: string, team: Omit<Team, 'id' | 'players'>) => void;
  updateTeam: (team: Team) => void;
  addPlayer: (teamId: string, player: Omit<Player, 'id'>) => void;
  updatePlayer: (player: Player) => void;
  addMatch: (tournamentId: string, match: Omit<Match, 'id'>) => void;
  updateMatch: (match: Match) => void;
  findTeam: (teamId: string) => Team | undefined;
  findTournament: (tournamentId: string) => Tournament | undefined;
  findMatch: (matchId: string) => Match | undefined;
  currentTournament: Tournament | null;
  setCurrentTournament: (tournament: Tournament | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const { toast } = useToast();

  const generateId = () => Math.random().toString(36).substring(2, 10);

  const addTournament = (tournament: Omit<Tournament, 'id' | 'teams' | 'matches'>) => {
    const newTournament: Tournament = {
      ...tournament,
      id: generateId(),
      teams: [],
      matches: []
    };
    setTournaments([...tournaments, newTournament]);
    toast({
      title: "Success",
      description: "Tournament created successfully",
    });
  };

  const updateTournament = (tournament: Tournament) => {
    setTournaments(tournaments.map(t => (t.id === tournament.id ? tournament : t)));
    toast({
      title: "Success",
      description: "Tournament updated successfully",
    });
  };

  const findTournament = (tournamentId: string) => {
    return tournaments.find(tournament => tournament.id === tournamentId);
  };

  const addTeam = (tournamentId: string, team: Omit<Team, 'id' | 'players'>) => {
    const tournament = findTournament(tournamentId);
    if (!tournament) return;

    const newTeam: Team = {
      ...team,
      id: generateId(),
      tournamentId,
      players: []
    };

    const updatedTournament = {
      ...tournament,
      teams: [...tournament.teams, newTeam]
    };

    updateTournament(updatedTournament);
    toast({
      title: "Success",
      description: "Team added successfully",
    });
  };

  const updateTeam = (team: Team) => {
    const tournament = findTournament(team.tournamentId);
    if (!tournament) return;

    const updatedTournament = {
      ...tournament,
      teams: tournament.teams.map(t => (t.id === team.id ? team : t))
    };

    updateTournament(updatedTournament);
    toast({
      title: "Success",
      description: "Team updated successfully",
    });
  };

  const findTeam = (teamId: string) => {
    for (const tournament of tournaments) {
      const team = tournament.teams.find(team => team.id === teamId);
      if (team) return team;
    }
    return undefined;
  };

  const addPlayer = (teamId: string, player: Omit<Player, 'id'>) => {
    const team = findTeam(teamId);
    if (!team) return;

    const newPlayer: Player = {
      ...player,
      id: generateId(),
      teamId
    };

    const updatedTeam = {
      ...team,
      players: [...team.players, newPlayer]
    };

    updateTeam(updatedTeam);
    toast({
      title: "Success",
      description: "Player added successfully",
    });
  };

  const updatePlayer = (player: Player) => {
    const team = findTeam(player.teamId);
    if (!team) return;

    const updatedTeam = {
      ...team,
      players: team.players.map(p => (p.id === player.id ? player : p))
    };

    updateTeam(updatedTeam);
    toast({
      title: "Success",
      description: "Player updated successfully",
    });
  };

  const findMatch = (matchId: string) => {
    for (const tournament of tournaments) {
      const match = tournament.matches.find(match => match.id === matchId);
      if (match) return match;
    }
    return undefined;
  };

  const addMatch = (tournamentId: string, match: Omit<Match, 'id'>) => {
    const tournament = findTournament(tournamentId);
    if (!tournament) return;

    const newMatch: Match = {
      ...match,
      id: generateId(),
      tournamentId
    };

    const updatedTournament = {
      ...tournament,
      matches: [...tournament.matches, newMatch]
    };

    updateTournament(updatedTournament);
    toast({
      title: "Success",
      description: "Match added successfully",
    });
  };

  const updateMatch = (match: Match) => {
    const tournament = findTournament(match.tournamentId);
    if (!tournament) return;

    const updatedTournament = {
      ...tournament,
      matches: tournament.matches.map(m => (m.id === match.id ? match : m))
    };

    updateTournament(updatedTournament);
    toast({
      title: "Success",
      description: "Match updated successfully",
    });
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
        setCurrentTournament
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
