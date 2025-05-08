
import React from 'react';
import { Tournament, Match } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MatchCard from '@/components/matches/MatchCard';
import LiveScoring from '@/components/live-scoring/LiveScoring';
import { useApp } from '@/context/AppContext';

interface LiveScoringTabProps {
  tournament: Tournament;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
}

const LiveScoringTab = ({ tournament, selectedMatchId, setSelectedMatchId }: LiveScoringTabProps) => {
  const { updateMatch } = useApp();

  const selectedMatch = selectedMatchId 
    ? tournament.matches.find(m => m.id === selectedMatchId) 
    : null;

  const team1 = selectedMatch 
    ? tournament.teams.find(t => t.id === selectedMatch.team1Id) 
    : null;
  
  const team2 = selectedMatch 
    ? tournament.teams.find(t => t.id === selectedMatch.team2Id) 
    : null;

  const handleUpdateMatch = async (updatedMatch: Match) => {
    try {
      await updateMatch(updatedMatch);
    } catch (error) {
      console.error('Failed to update match:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Live Scoring</h2>
      
      {tournament.matches.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Schedule matches first to enable live scoring.</p>
          </CardContent>
        </Card>
      ) : selectedMatchId && selectedMatch ? (
        <>
          {selectedMatch.status !== 'live' && (
            <Button
              className="mb-4 bg-green-600 hover:bg-green-700"
              onClick={async () => {
                await updateMatch({ ...selectedMatch, status: 'live' });
              }}
            >
              Start Match
            </Button>
          )}
          {team1 && team2 && (
            <LiveScoring 
              match={selectedMatch} 
              team1={team1} 
              team2={team2}
              onUpdateScore={handleUpdateMatch}
            />
          )}
        </>
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
  );
};

export default LiveScoringTab;
