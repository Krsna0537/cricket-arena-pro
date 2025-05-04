
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Team, Match, Score } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface LiveScoringProps {
  match: Match;
  team1?: Team;
  team2?: Team;
  onUpdateScore: (match: Match) => void;
}

const LiveScoring: React.FC<LiveScoringProps> = ({ match, team1, team2, onUpdateScore }) => {
  const { toast } = useToast();
  const isLive = match.status === 'live';

  const [team1Score, setTeam1Score] = useState<Score>(
    match.scoreTeam1 || { runs: 0, wickets: 0, overs: 0 }
  );
  
  const [team2Score, setTeam2Score] = useState<Score>(
    match.scoreTeam2 || { runs: 0, wickets: 0, overs: 0 }
  );

  const handleUpdateScore = () => {
    const updatedMatch = {
      ...match,
      scoreTeam1: team1Score,
      scoreTeam2: team2Score
    };
    onUpdateScore(updatedMatch);
    toast({
      title: "Success!",
      description: "Match score updated successfully",
    });
  };

  const handleStartMatch = () => {
    const updatedMatch = {
      ...match,
      status: 'live' as const,
      scoreTeam1: { runs: 0, wickets: 0, overs: 0 },
      scoreTeam2: { runs: 0, wickets: 0, overs: 0 }
    };
    onUpdateScore(updatedMatch);
    toast({
      title: "Match started!",
      description: "Live scoring is now available",
    });
  };

  const handleEndMatch = () => {
    const updatedMatch = {
      ...match,
      status: 'completed' as const,
      result: team1Score.runs > team2Score.runs
        ? `${team1?.name} won by ${team1Score.runs - team2Score.runs} runs`
        : team2Score.runs > team1Score.runs
        ? `${team2?.name} won by ${10 - team2Score.wickets} wickets`
        : "Match tied"
    };
    onUpdateScore(updatedMatch);
    toast({
      title: "Match completed!",
      description: "Final scores saved successfully",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Live Scoring</span>
          <div className="space-x-2">
            {match.status === 'upcoming' && (
              <Button onClick={handleStartMatch} className="bg-green-600 hover:bg-green-700">
                Start Match
              </Button>
            )}
            {isLive && (
              <Button onClick={handleEndMatch} variant="destructive">
                End Match
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{team1?.name || 'Team 1'}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team1Runs">Runs</Label>
                <Input
                  id="team1Runs"
                  type="number"
                  value={team1Score.runs}
                  onChange={(e) => setTeam1Score({ ...team1Score, runs: parseInt(e.target.value) || 0 })}
                  disabled={!isLive}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team1Wickets">Wickets</Label>
                <Input
                  id="team1Wickets"
                  type="number"
                  min="0"
                  max="10"
                  value={team1Score.wickets}
                  onChange={(e) => setTeam1Score({ ...team1Score, wickets: parseInt(e.target.value) || 0 })}
                  disabled={!isLive}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team1Overs">Overs</Label>
                <Input
                  id="team1Overs"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={team1Score.overs}
                  onChange={(e) => setTeam1Score({ ...team1Score, overs: parseFloat(e.target.value) || 0 })}
                  disabled={!isLive}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">{team2?.name || 'Team 2'}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team2Runs">Runs</Label>
                <Input
                  id="team2Runs"
                  type="number"
                  value={team2Score.runs}
                  onChange={(e) => setTeam2Score({ ...team2Score, runs: parseInt(e.target.value) || 0 })}
                  disabled={!isLive}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team2Wickets">Wickets</Label>
                <Input
                  id="team2Wickets"
                  type="number"
                  min="0"
                  max="10"
                  value={team2Score.wickets}
                  onChange={(e) => setTeam2Score({ ...team2Score, wickets: parseInt(e.target.value) || 0 })}
                  disabled={!isLive}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team2Overs">Overs</Label>
                <Input
                  id="team2Overs"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={team2Score.overs}
                  onChange={(e) => setTeam2Score({ ...team2Score, overs: parseFloat(e.target.value) || 0 })}
                  disabled={!isLive}
                />
              </div>
            </div>
          </div>
        </div>

        {isLive && (
          <div className="mt-6">
            <Button 
              onClick={handleUpdateScore} 
              className="w-full bg-cricket-navy hover:bg-cricket-navy-light"
            >
              Update Score
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveScoring;
