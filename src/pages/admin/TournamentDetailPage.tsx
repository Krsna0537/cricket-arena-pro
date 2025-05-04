
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import TeamCard from '@/components/teams/TeamCard';
import TeamForm from '@/components/teams/TeamForm';
import PlayerForm from '@/components/players/PlayerForm';
import PlayerCard from '@/components/players/PlayerCard';
import MatchCard from '@/components/matches/MatchCard';
import ScheduleMatch from '@/components/matches/ScheduleMatch';
import LiveScoring from '@/components/live-scoring/LiveScoring';
import { useApp } from '@/context/AppContext';
import { Tournament, Team } from '@/types';
import { AlertCircle, Plus } from 'lucide-react';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { findTournament, updateTournament, addTeam, addPlayer } = useApp();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      const found = findTournament(tournamentId);
      if (found) {
        setTournament(found);
      }
    }
  }, [tournamentId, findTournament]);

  if (!tournament) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Tournament not found.</AlertDescription>
      </Alert>
    );
  }

  const handleAddTeam = (data: { name: string, logo?: string }) => {
    addTeam(tournament.id, {
      name: data.name,
      logo: data.logo,
      tournamentId: tournament.id
    });
    setShowTeamForm(false);
    
    // Refresh tournament data
    const updated = findTournament(tournament.id);
    if (updated) {
      setTournament(updated);
    }
  };

  const handleAddPlayer = (data: { name: string, role: any }) => {
    if (selectedTeam) {
      addPlayer(selectedTeam.id, {
        name: data.name,
        role: data.role,
        teamId: selectedTeam.id
      });
      setShowPlayerForm(false);
      
      // Refresh tournament data
      const updated = findTournament(tournament.id);
      if (updated) {
        setTournament(updated);
        
        // Update selected team
        const updatedTeam = updated.teams.find(t => t.id === selectedTeam.id);
        if (updatedTeam) {
          setSelectedTeam(updatedTeam);
        }
      }
    }
  };

  const handleScheduleMatch = (data: any) => {
    const newMatch = {
      team1Id: data.team1Id,
      team2Id: data.team2Id,
      date: data.date,
      venue: data.venue,
      status: 'upcoming' as const,
      tournamentId: tournament.id
    };
    
    const updatedTournament = {
      ...tournament,
      matches: [...tournament.matches, { ...newMatch, id: Math.random().toString(36).substring(2, 10) }]
    };
    
    updateTournament(updatedTournament);
    setShowScheduleForm(false);
    setTournament(updatedTournament);
  };

  const handleUpdateMatch = (updatedMatch: any) => {
    const updatedMatches = tournament.matches.map(m => 
      m.id === updatedMatch.id ? updatedMatch : m
    );
    
    const updatedTournament = {
      ...tournament,
      matches: updatedMatches
    };
    
    updateTournament(updatedTournament);
    setTournament(updatedTournament);
  };

  const selectedMatch = selectedMatchId 
    ? tournament.matches.find(m => m.id === selectedMatchId) 
    : null;

  const team1 = selectedMatch 
    ? tournament.teams.find(t => t.id === selectedMatch.team1Id) 
    : null;
  
  const team2 = selectedMatch 
    ? tournament.teams.find(t => t.id === selectedMatch.team2Id) 
    : null;

  const teamPlayers = selectedTeam?.players || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
          <p className="text-muted-foreground">
            {tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)} Tournament • 
            {' '}{new Date(tournament.startDate).toLocaleDateString()} to {new Date(tournament.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/tournament/${tournament.id}`}>
            <Button variant="outline">Public View</Button>
          </Link>
          <Button variant="outline">Share Link</Button>
          <div className="bg-gray-100 px-3 py-1 rounded flex items-center border">
            <span className="text-sm">Code: </span>
            <span className="font-mono ml-1 font-bold">{tournament.accessCode}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="live">Live Scoring</TabsTrigger>
        </TabsList>
        
        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Teams</h2>
            <Button 
              onClick={() => {
                setShowTeamForm(true);
                setSelectedTeam(null);
              }}
              className="bg-cricket-navy hover:bg-cricket-navy-light"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </div>

          {showTeamForm && (
            <div className="mb-6">
              <TeamForm onSubmit={handleAddTeam} />
            </div>
          )}

          {tournament.teams.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tournament.teams.map((team) => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  onClick={() => setSelectedTeam(team)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No teams added yet. Add your first team to get started.</p>
              </CardContent>
            </Card>
          )}

          {selectedTeam && (
            <Card className="mt-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedTeam.name}</CardTitle>
                  <p className="text-sm text-gray-500">{selectedTeam.players.length} Players</p>
                </div>
                <Button 
                  onClick={() => setShowPlayerForm(true)}
                  className="bg-cricket-navy hover:bg-cricket-navy-light"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Player
                </Button>
              </CardHeader>
              <CardContent>
                {showPlayerForm && (
                  <div className="mb-6">
                    <PlayerForm onSubmit={handleAddPlayer} />
                  </div>
                )}

                {teamPlayers.length > 0 ? (
                  <div className="grid gap-3">
                    {teamPlayers.map((player) => (
                      <PlayerCard key={player.id} player={player} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6">No players added yet.</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Matches</h2>
            <Button 
              onClick={() => setShowScheduleForm(true)}
              className="bg-cricket-navy hover:bg-cricket-navy-light"
              disabled={tournament.teams.length < 2}
            >
              <Plus className="mr-2 h-4 w-4" />
              Schedule Match
            </Button>
          </div>

          {showScheduleForm && (
            <div className="mb-6">
              <ScheduleMatch 
                teams={tournament.teams} 
                onSubmit={handleScheduleMatch} 
              />
            </div>
          )}

          {tournament.matches.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournament.matches.map((match) => {
                const team1 = tournament.teams.find(t => t.id === match.team1Id);
                const team2 = tournament.teams.find(t => t.id === match.team2Id);
                return (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    team1={team1} 
                    team2={team2}
                    onClick={() => setSelectedMatchId(match.id)} 
                  />
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  {tournament.teams.length < 2 
                    ? "Add at least two teams to schedule matches." 
                    : "No matches scheduled yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Live Scoring Tab */}
        <TabsContent value="live">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Live Scoring</h2>
            
            {tournament.matches.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Schedule matches first to enable live scoring.</p>
                </CardContent>
              </Card>
            ) : selectedMatchId && selectedMatch ? (
              <LiveScoring 
                match={selectedMatch} 
                team1={team1!} 
                team2={team2!}
                onUpdateScore={handleUpdateMatch}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500">Select a match to start live scoring:</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.matches.map((match) => {
                    const team1 = tournament.teams.find(t => t.id === match.team1Id);
                    const team2 = tournament.teams.find(t => t.id === match.team2Id);
                    return (
                      <MatchCard 
                        key={match.id} 
                        match={match} 
                        team1={team1} 
                        team2={team2}
                        onClick={() => setSelectedMatchId(match.id)} 
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TournamentDetailPage;
