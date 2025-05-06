import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Team, Match, BallEventType, BallEvent, Player } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useApp, useLiveBallEvents } from '@/context/AppContext';

interface LiveScoringProps {
  match: Match;
  team1?: Team;
  team2?: Team;
  onUpdateScore: (match: Match) => void;
}

const LiveScoring: React.FC<LiveScoringProps> = ({ match, team1, team2, onUpdateScore }) => {
  const { toast } = useToast();
  const isLive = match.status === 'live';
  const { addBallEvent } = useApp();

  // Inning state (1 or 2)
  const [inning, setInning] = useState<number>(1);
  // Batting and bowling state
  const [striker, setStriker] = useState<Player | null>(null);
  const [nonStriker, setNonStriker] = useState<Player | null>(null);
  const [bowler, setBowler] = useState<Player | null>(null);
  const [showPlayerSelect, setShowPlayerSelect] = useState(true);
  const [availableBatsmen, setAvailableBatsmen] = useState<Player[]>([]);
  const [availableBowlers, setAvailableBowlers] = useState<Player[]>([]);

  // Real-time ball events
  const events = useLiveBallEvents(match.id, inning);

  // Score summary
  const summary = React.useMemo(() => {
    const legalCount = events.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
    const overs = Math.floor(legalCount / 6) + (legalCount % 6) / 10;
    const runs = events.reduce((acc, e) => acc + e.runs + e.extras, 0);
    const wickets = events.filter(e => e.eventType === 'wicket').length;
    return { runs, wickets, overs };
  }, [events]);

  // Set available batsmen and bowlers at the start of the innings
  useEffect(() => {
    if (inning === 1 && team1) {
      setAvailableBatsmen(team1.players);
      setAvailableBowlers(team2?.players || []);
    } else if (inning === 2 && team2) {
      setAvailableBatsmen(team2.players);
      setAvailableBowlers(team1?.players || []);
    }
    setStriker(null);
    setNonStriker(null);
    setBowler(null);
    setShowPlayerSelect(true);
  }, [inning, team1, team2]);

  // Debug logging for state
  useEffect(() => {
    console.log('[LiveScoring] isLive:', isLive);
    console.log('[LiveScoring] showPlayerSelect:', showPlayerSelect);
    console.log('[LiveScoring] striker:', striker);
    console.log('[LiveScoring] nonStriker:', nonStriker);
    console.log('[LiveScoring] bowler:', bowler);
  }, [isLive, showPlayerSelect, striker, nonStriker, bowler]);

  // Handle a new ball event
  async function handleBall(eventType: BallEventType, runs = 0, extras = 0) {
    console.log('[LiveScoring] handleBall called', { eventType, runs, extras, striker, nonStriker, bowler });
    if (!striker || !nonStriker || !bowler) {
      toast({ title: 'Select players', description: 'Please select batsmen and bowler first', variant: 'destructive' });
      setShowPlayerSelect(true);
      return;
    }
    try {
      // Determine ball number: legal deliveries only for ball count
      const legalCount = events.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
      const nextLegal = eventType === 'wide' || eventType === 'no-ball' ? legalCount : legalCount + 1;
      const overNum = Math.floor((nextLegal - 1) / 6) + 1;
      const ballNum = eventType === 'wide' || eventType === 'no-ball' ? (legalCount % 6) + 1 : ((nextLegal - 1) % 6) + 1;
      // Record the ball event
      console.log('[LiveScoring] addBallEvent payload', {
        matchId: match.id,
        teamId: inning === 1 ? team1!.id : team2!.id,
        inning,
        over: overNum,
        ball: ballNum,
        eventType,
        runs,
        extras,
        batsmanId: striker.id,
        bowlerId: bowler.id,
        isStriker: true
      });
      await addBallEvent({
        matchId: match.id,
        teamId: inning === 1 ? team1!.id : team2!.id,
        inning,
        over: overNum,
        ball: ballNum,
        eventType,
        runs,
        extras,
        batsmanId: striker.id,
        bowlerId: bowler.id,
        isStriker: true
      });
      console.log('[LiveScoring] addBallEvent success');
      // Strike rotation logic
      let swap = false;
      if (eventType === 'run' && runs % 2 === 1) swap = true;
      if (eventType === 'wicket') {
        // Prompt for new batsman
        setShowPlayerSelect(true);
        setAvailableBatsmen(availableBatsmen.filter(p => p.id !== striker.id));
      }
      // End of over: swap strike and prompt for new bowler
      if (ballNum === 6 && (eventType !== 'wide' && eventType !== 'no-ball')) {
        swap = !swap;
        setShowPlayerSelect(true);
      }
      if (swap) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
    } catch (e) {
      console.error('[LiveScoring] addBallEvent error', String(e));
    }
  }

  // Player selection UI
  function PlayerSelect() {
    return (
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h4 className="font-bold mb-2">Select Players</h4>
        <div className="flex gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium">Striker</label>
            <select value={striker?.id || ''} onChange={e => setStriker(availableBatsmen.find(p => p.id === e.target.value) || null)}>
              <option value="">Select</option>
              {availableBatsmen.filter(p => !nonStriker || p.id !== nonStriker.id).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Non-Striker</label>
            <select value={nonStriker?.id || ''} onChange={e => setNonStriker(availableBatsmen.find(p => p.id === e.target.value) || null)}>
              <option value="">Select</option>
              {availableBatsmen.filter(p => !striker || p.id !== striker.id).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Bowler</label>
            <select value={bowler?.id || ''} onChange={e => setBowler(availableBowlers.find(p => p.id === e.target.value) || null)}>
              <option value="">Select</option>
              {availableBowlers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <Button onClick={() => {
          if (striker && nonStriker && bowler) setShowPlayerSelect(false);
        }} disabled={!(striker && nonStriker && bowler)}>
          Confirm
        </Button>
      </div>
    );
  }

  // Professional Batting Card
  function BattingCard() {
    // Get all batsmen who have batted (from events)
    const batsmanIds = Array.from(new Set(events.map(e => e.batsmanId)));
    const batsmen = batsmanIds.map(id => {
      const player = availableBatsmen.find(p => p.id === id) || striker || nonStriker;
      const balls = events.filter(e => e.batsmanId === id && e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
      const runs = events.filter(e => e.batsmanId === id).reduce((acc, e) => acc + e.runs, 0);
      const fours = events.filter(e => e.batsmanId === id && e.runs === 4).length;
      const sixes = events.filter(e => e.batsmanId === id && e.runs === 6).length;
      const out = events.some(e => e.batsmanId === id && e.eventType === 'wicket');
      const sr = balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0';
      return { name: player?.name || id, runs, balls, fours, sixes, sr, out, isStriker: striker?.id === id };
    });
    return (
      <div className="mb-2">
        <div className="font-semibold">Batting</div>
        <table className="text-sm w-full">
          <thead><tr><th>Name</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th><th>Status</th></tr></thead>
          <tbody>
            {batsmen.map((b, i) => (
              <tr key={i} className={b.isStriker ? 'font-bold text-green-700' : ''}>
                <td>{b.name}{b.isStriker ? '*' : ''}</td>
                <td>{b.runs}</td>
                <td>{b.balls}</td>
                <td>{b.fours}</td>
                <td>{b.sixes}</td>
                <td>{b.sr}</td>
                <td>{b.out ? 'Out' : 'Not out'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Professional Bowling Card
  function BowlingCard() {
    // Get all bowlers who have bowled (from events)
    const bowlerIds = Array.from(new Set(events.map(e => e.bowlerId)));
    const bowlers = bowlerIds.map(id => {
      const player = availableBowlers.find(p => p.id === id) || bowler;
      const balls = events.filter(e => e.bowlerId === id && e.eventType !== 'wide' && e.eventType !== 'no-ball').length;
      const overs = Math.floor(balls / 6) + (balls % 6) / 10;
      const runs = events.filter(e => e.bowlerId === id).reduce((acc, e) => acc + e.runs + e.extras, 0);
      const wickets = events.filter(e => e.bowlerId === id && e.eventType === 'wicket').length;
      const eco = balls > 0 ? (runs / (balls / 6)).toFixed(2) : '0.00';
      return { name: player?.name || id, overs, runs, wickets, eco };
    });
    return (
      <div className="mb-2">
        <div className="font-semibold">Bowling</div>
        <table className="text-sm w-full">
          <thead><tr><th>Name</th><th>O</th><th>R</th><th>W</th><th>Eco</th></tr></thead>
          <tbody>
            {bowlers.map((b, i) => (
              <tr key={i}>
                <td>{b.name}</td>
                <td>{b.overs}</td>
                <td>{b.runs}</td>
                <td>{b.wickets}</td>
                <td>{b.eco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Current Over Display
  function CurrentOver() {
    // Get last 6 legal balls
    const legalBalls = events.filter(e => e.eventType !== 'wide' && e.eventType !== 'no-ball');
    const last6 = legalBalls.slice(-6);
    return (
      <div className="mb-2">
        <div className="font-semibold">Current Over</div>
        <div className="flex gap-2">
          {last6.map((e, i) => (
            <span key={i} className="px-2 py-1 rounded bg-gray-200 font-mono">
              {e.eventType === 'wicket' ? 'W' : e.runs > 0 ? e.runs : '.'}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Ball-by-ball log
  function BallLog() {
    return (
      <div className="mb-2">
        <div className="font-semibold">Ball-by-Ball Log</div>
        <div className="flex flex-wrap gap-1">
          {events.map((e, i) => (
            <span key={i} className="px-2 py-1 rounded bg-gray-100 font-mono text-xs">
              {e.over}.{e.ball}: {e.eventType === 'wicket' ? 'W' : e.runs > 0 ? e.runs : e.eventType === 'wide' ? 'Wd' : e.eventType === 'no-ball' ? 'Nb' : '.'}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Target/Chase context (for 2nd innings)
  function TargetChase() {
    if (inning === 2) {
      // TODO: fetch 1st innings summary for target
      // For now, just show placeholder
      return (
        <div className="mb-2 font-semibold text-blue-700">Target: [TBD]</div>
      );
    }
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Live Scoring</CardTitle>
      </CardHeader>
      <CardContent>
        {showPlayerSelect && <PlayerSelect />}
        <div className="sticky top-0 z-10 bg-white pb-2">
          <div className="text-xl font-bold mb-1">{summary.runs}/{summary.wickets} ({summary.overs} ov)</div>
          <TargetChase />
          <CurrentOver />
        </div>
        <BattingCard />
        <BowlingCard />
        <BallLog />
        {isLive && !showPlayerSelect && (
          <>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[0,1,2,3,4,5,6].map(r => (
                <Button key={r} onClick={() => handleBall('run', r, 0)} disabled={!isLive}>{r}</Button>
              ))}
              <Button onClick={() => handleBall('wicket')} disabled={!isLive}>Wkt</Button>
              <Button onClick={() => handleBall('wide', 0, 1)} disabled={!isLive}>Wd</Button>
              <Button onClick={() => handleBall('no-ball', 0, 1)} disabled={!isLive}>Nb</Button>
              <Button onClick={() => handleBall('bye', 0, 1)} disabled={!isLive}>Bye</Button>
              <Button onClick={() => handleBall('leg-bye', 0, 1)} disabled={!isLive}>Lb</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveScoring;
