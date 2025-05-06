import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useLiveBallEvents } from '@/hooks/useLiveBallEvents';
import { BallEventType, Match, Team, Player } from '@/types';
import { useApp } from '@/context/AppContext';

const inning = 1; // TODO: Support both innings

const LiveScoringDashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const { addBallEvent, tournaments } = useApp();
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [strikerId, setStrikerId] = useState<string>('');
  const [nonStrikerId, setNonStrikerId] = useState<string>('');
  const [bowlerId, setBowlerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Find selected match and team
  const allMatches = tournaments.flatMap(t => t.matches);
  const selectedMatch = allMatches.find(m => m.id === selectedMatchId);
  const allTeams = tournaments.flatMap(t => t.teams);
  const selectedTeam = allTeams.find(t => t.id === selectedTeamId);
  const players = selectedTeam?.players || [];

  // Get events for selected match
  const events = useLiveBallEvents(selectedMatchId, inning);

  // Calculate score summary from events
  const runs = events.reduce((sum, e) => sum + e.runs + e.extras, 0);
  const wickets = events.filter(e => e.eventType === 'wicket').length;
  const legalBalls = events.filter(e => !['wide', 'no-ball'].includes(e.eventType)).length;
  const overs = `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
  const runRate = legalBalls > 0 ? (runs / (legalBalls / 6)).toFixed(2) : '0.00';

  // Only allow scorers/admins (userRole 'creator')
  if (!user || userRole !== 'creator') {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to access the scoring dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  // Ball input handler (runs only for now)
  const handleRunInput = async (run: number) => {
    if (!selectedMatchId || !selectedTeamId || !strikerId || !nonStrikerId || !bowlerId) {
      alert('Please select match, team, striker, non-striker, and bowler.');
      return;
    }
    setIsLoading(true);
    try {
      // Debug: Log all IDs before making the request
      console.log('addBallEvent payload:', {
        matchId: selectedMatchId,
        teamId: selectedTeamId,
        strikerId,
        nonStrikerId,
        bowlerId,
        run
      });
      // Determine ball number: legal deliveries only for ball count
      const legalCount = events.filter(e => !['wide', 'no-ball'].includes(e.eventType)).length;
      const nextLegal = legalCount + 1;
      const overNum = Math.floor((nextLegal - 1) / 6) + 1;
      const ballNum = ((nextLegal - 1) % 6) + 1;
      await addBallEvent({
        matchId: selectedMatchId,
        teamId: selectedTeamId,
        inning,
        over: overNum,
        ball: ballNum,
        eventType: 'run',
        runs: run,
        extras: 0,
        batsmanId: strikerId,
        bowlerId,
        nonStrikerId,
        isStriker: true
      });
      // Only rotate strike after odd runs
      if (run % 2 === 1) {
        setStrikerId(prev => {
          const temp = strikerId;
          setStrikerId(nonStrikerId);
          setNonStrikerId(temp);
          return nonStrikerId;
        });
      }
      // Only reset bowler at end of over
      if (ballNum === 6) {
        setBowlerId(''); // Prompt for new bowler
      }
      // Do NOT reset striker/non-striker after every ball
    } catch (err) {
      // Improved error logging
      console.error('Failed to record run event:', err, JSON.stringify(err));
      alert('Failed to record run event: ' + (err?.message || JSON.stringify(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Live Scoring Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Match and Team Selectors */}
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Match</label>
            <select className="border rounded px-2 py-1" value={selectedMatchId} onChange={e => setSelectedMatchId(e.target.value)}>
              <option value="">Select Match</option>
              {allMatches.map(m => (
                <option key={m.id} value={m.id}>{m.team1Id} vs {m.team2Id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batting Team</label>
            <select className="border rounded px-2 py-1" value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)}>
              <option value="">Select Team</option>
              {allTeams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Striker</label>
            <select className="border rounded px-2 py-1" value={strikerId} onChange={e => setStrikerId(e.target.value)}>
              <option value="">Select Striker</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Non-Striker</label>
            <select className="border rounded px-2 py-1" value={nonStrikerId} onChange={e => setNonStrikerId(e.target.value)}>
              <option value="">Select Non-Striker</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bowler</label>
            <select className="border rounded px-2 py-1" value={bowlerId} onChange={e => setBowlerId(e.target.value)}>
              <option value="">Select Bowler</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scoreboard Section */}
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <div className="text-xl font-bold">{selectedTeam?.name || 'Team'}</div>
          <div className="text-2xl">{runs}/{wickets} ({overs} ov)</div>
          <div className="text-sm text-gray-600">Run Rate: {runRate}</div>
        </div>

        {/* Ball Input Panel */}
        <div className="mb-6 p-4 bg-white rounded shadow">
          <div className="font-semibold mb-2">Ball Input</div>
          <div className="flex gap-2 mb-2">
            {[0,1,2,3,4,5,6].map(run => (
              <button key={run} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" onClick={() => handleRunInput(run)} disabled={isLoading}>{run}</button>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            <button className="px-4 py-2 bg-yellow-500 text-white rounded" disabled>Wide</button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded" disabled>No Ball</button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded" disabled>Bye</button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded" disabled>Leg Bye</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded" disabled>Wicket</button>
          </div>
          <button className="mt-2 px-4 py-2 bg-gray-400 text-white rounded" disabled>Manual Override</button>
        </div>

        {/* Ball History */}
        <div className="p-4 bg-gray-50 rounded">
          <div className="font-semibold mb-2">Ball-by-Ball History</div>
          {events.length === 0 ? (
            <div className="text-gray-500">No balls recorded yet.</div>
          ) : (
            <ul className="text-sm">
              {events.map((e, idx) => (
                <li key={e.id || idx}>
                  Over {e.over}.{e.ball}: {e.eventType === 'run' ? `${e.runs} run(s)` : e.eventType}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveScoringDashboard; 