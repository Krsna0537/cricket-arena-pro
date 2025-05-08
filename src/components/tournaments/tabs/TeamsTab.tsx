
import React, { useState } from 'react';
import { Tournament, Team } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamCard from '@/components/teams/TeamCard';
import TeamForm from '@/components/teams/TeamForm';
import PlayerForm from '@/components/players/PlayerForm';
import PlayerCard from '@/components/players/PlayerCard';
import { useApp } from '@/context/AppContext';
import { Plus } from 'lucide-react';

interface TeamsTabProps {
  tournament: Tournament;
}

const TeamsTab = ({ tournament }: TeamsTabProps) => {
  const { findTournament, addTeam, addPlayer } = useApp();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showPlayerForm, setShowPlayerForm] = useState(false);

  const handleAddTeam = async (data: { name: string, logo?: string }) => {
    try {
      await addTeam(tournament.id, {
        name: data.name,
        logo: data.logo,
        tournamentId: tournament.id
      });
      setShowTeamForm(false);
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  const handleAddPlayer = async (data: { name: string, role: any }) => {
    if (selectedTeam) {
      try {
        await addPlayer(selectedTeam.id, {
          name: data.name,
          role: data.role,
          teamId: selectedTeam.id
        });
        setShowPlayerForm(false);
      } catch (error) {
        console.error("Error adding player:", error);
      }
    }
  };

  const teamPlayers = selectedTeam?.players || [];

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default TeamsTab;
