import React, { useState } from 'react';
import { Tournament, Team, Match } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MatchCard from '@/components/matches/MatchCard';
import ScheduleMatch from '@/components/matches/ScheduleMatch';
import { useApp } from '@/context/AppContext';
import { Plus } from 'lucide-react';

interface MatchesTabProps {
  tournament: Tournament;
  onMatchClick: (matchId: string) => void;
}

const MatchesTab = ({ tournament, onMatchClick }: MatchesTabProps) => {
  const { addMatch } = useApp();
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const handleScheduleMatch = async (data: any) => {
    try {
      await addMatch(tournament.id, {
        team1Id: data.team1Id,
        team2Id: data.team2Id,
        date: data.date || tournament.startDate,
        venue: data.venue || tournament.venueCity,
        status: 'upcoming' as const,
        tournamentId: tournament.id,
        overs: data.overs || tournament.defaultOvers,
        tossWinnerId: data.tossWinnerId,
        tossDecision: data.tossDecision
      });
      setShowScheduleForm(false);
    } catch (error) {
      console.error('Failed to schedule match:', error);
    }
  };

  return (
    <div className="space-y-4">
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
            tournament={tournament}
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
                onClick={() => onMatchClick(match.id)} 
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
    </div>
  );
};

export default MatchesTab;
