import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import TeamCard from '@/components/teams/TeamCard';
import PlayerCard from '@/components/players/PlayerCard';
import MatchCard from '@/components/matches/MatchCard';
import LeaderboardTable from '@/components/stats/LeaderboardTable';
import StatsCard from '@/components/stats/StatsCard';
import { useApp } from '@/context/AppContext';
import { Tournament, Team, Player, Match, Leaderboard } from '@/types';
import { AlertCircle, Calendar, MapPin, Trophy, User, Users } from 'lucide-react';

const PublicTournamentView = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { findTournament, findTeam, tournaments } = useApp();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

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

  // Generate leaderboard data
  const generateLeaderboard = (): Leaderboard[] => {
    const leaderboard: Record<string, Leaderboard> = {};
    
    // Initialize teams
    tournament.teams.forEach(team => {
      leaderboard[team.id] = {
        teamId: team.id,
        teamName: team.name,
        matchesPlayed: 0,
        won: 0,
        lost: 0,
        points: 0,
        netRunRate: 0
      };
    });
    
    // Process completed matches
    tournament.matches
      .filter(match => match.status === 'completed')
      .forEach(match => {
        // TODO: Replace match.scoreTeam1 and match.scoreTeam2 usages below with data fetched from innings_summary or match_scores
        // if (!match.scoreTeam1 || !match.scoreTeam2) return;
        // if (match.scoreTeam1.runs > match.scoreTeam2.runs) { ... }
        // ...
        // Example: Use a function like getTeamScore(match.id, match.team1Id) to fetch scores
        // ... existing code ...
      });
    
    return Object.values(leaderboard);
  };

  // Get player stats
  const getTopPlayers = () => {
    const players: Player[] = [];
    tournament.teams.forEach(team => {
      players.push(...team.players);
    });
    
    return {
      topRunScorer: [...players].sort((a, b) => (b.stats?.runs || 0) - (a.stats?.runs || 0))[0],
      topWicketTaker: [...players].sort((a, b) => (b.stats?.wickets || 0) - (a.stats?.wickets || 0))[0],
      topSixer: [...players].sort((a, b) => (b.stats?.sixes || 0) - (a.stats?.sixes || 0))[0]
    };
  };

  // Get upcoming, live and completed matches
  const getUpcomingMatches = (): Match[] => tournament.matches.filter(m => m.status === 'upcoming');
  const getLiveMatches = (): Match[] => tournament.matches.filter(m => m.status === 'live');
  const getCompletedMatches = (): Match[] => tournament.matches.filter(m => m.status === 'completed');

  const leaderboard = generateLeaderboard();
  const { topRunScorer, topWicketTaker, topSixer } = getTopPlayers();
  const upcomingMatches = getUpcomingMatches();
  const liveMatches = getLiveMatches();
  const completedMatches = getCompletedMatches();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`${tournament.status === 'ongoing' ? 'bg-amber-500' : tournament.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}>
            {tournament.status}
          </Badge>
          <span className="text-muted-foreground">
            {tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)} Tournament
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tournament Period</p>
              <p className="font-semibold">
                {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Venue</p>
              <p className="font-semibold">{tournament.venueCity}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <Trophy className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Teams</p>
              <p className="font-semibold">{tournament.teams.length} teams participating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="statistics">Player Stats</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Live Matches</h2>
              {liveMatches.length > 0 ? (
                <div className="space-y-4">
                  {liveMatches.map(match => {
                    const team1 = tournament.teams.find(t => t.id === match.team1Id);
                    const team2 = tournament.teams.find(t => t.id === match.team2Id);
                    return (
                      <MatchCard 
                        key={match.id}
                        match={match}
                        team1={team1}
                        team2={team2}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No matches are currently live.
                  </CardContent>
                </Card>
              )}

              <h2 className="text-xl font-semibold">Upcoming Matches</h2>
              {upcomingMatches.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMatches.slice(0, 3).map(match => {
                    const team1 = tournament.teams.find(t => t.id === match.team1Id);
                    const team2 = tournament.teams.find(t => t.id === match.team2Id);
                    return (
                      <MatchCard 
                        key={match.id}
                        match={match}
                        team1={team1}
                        team2={team2}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No upcoming matches scheduled.
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Top Performers</h2>
              <div className="grid gap-4">
                {topRunScorer && (
                  <StatsCard
                    title="Top Run Scorer"
                    value={topRunScorer.name}
                    subtitle={`${topRunScorer.stats?.runs || 0} runs`}
                    icon={<User className="h-5 w-5 text-blue-600" />}
                    colorClass="bg-blue-500"
                  />
                )}
                
                {topWicketTaker && (
                  <StatsCard
                    title="Top Wicket Taker"
                    value={topWicketTaker.name}
                    subtitle={`${topWicketTaker.stats?.wickets || 0} wickets`}
                    icon={<User className="h-5 w-5 text-green-600" />}
                    colorClass="bg-cricket-pitch"
                  />
                )}
                
                {topSixer && (
                  <StatsCard
                    title="Most Sixes"
                    value={topSixer.name}
                    subtitle={`${topSixer.stats?.sixes || 0} sixes`}
                    icon={<User className="h-5 w-5 text-purple-600" />}
                    colorClass="bg-purple-500"
                  />
                )}
              </div>

              <h2 className="text-xl font-semibold">Recent Results</h2>
              {completedMatches.length > 0 ? (
                <div className="space-y-4">
                  {completedMatches.slice(0, 3).map(match => {
                    const team1 = tournament.teams.find(t => t.id === match.team1Id);
                    const team2 = tournament.teams.find(t => t.id === match.team2Id);
                    return (
                      <MatchCard 
                        key={match.id}
                        match={match}
                        team1={team1}
                        team2={team2}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No completed matches yet.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tournament.teams.map((team) => (
              <TeamCard 
                key={team.id} 
                team={team} 
                onClick={() => setSelectedTeam(team)}
              />
            ))}
          </div>

          {selectedTeam && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {selectedTeam.logo ? (
                    <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-8 h-8 object-contain" />
                  ) : null}
                  <span>{selectedTeam.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" /> Players
                </h3>
                {selectedTeam.players.length > 0 ? (
                  <div className="grid gap-3">
                    {selectedTeam.players.map((player) => (
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
        <TabsContent value="matches" className="space-y-6">
          {liveMatches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Badge className="status-live">LIVE</Badge> Live Matches
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveMatches.map(match => {
                  const team1 = tournament.teams.find(t => t.id === match.team1Id);
                  const team2 = tournament.teams.find(t => t.id === match.team2Id);
                  return (
                    <MatchCard 
                      key={match.id}
                      match={match}
                      team1={team1}
                      team2={team2}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {upcomingMatches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Badge className="status-upcoming">Upcoming</Badge> Upcoming Matches
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMatches.map(match => {
                  const team1 = tournament.teams.find(t => t.id === match.team1Id);
                  const team2 = tournament.teams.find(t => t.id === match.team2Id);
                  return (
                    <MatchCard 
                      key={match.id}
                      match={match}
                      team1={team1}
                      team2={team2}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {completedMatches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Badge className="status-completed">Completed</Badge> Completed Matches
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedMatches.map(match => {
                  const team1 = tournament.teams.find(t => t.id === match.team1Id);
                  const team2 = tournament.teams.find(t => t.id === match.team2Id);
                  return (
                    <MatchCard 
                      key={match.id}
                      match={match}
                      team1={team1}
                      team2={team2}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {tournament.matches.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No matches scheduled yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Standings</CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.length > 0 ? (
                <LeaderboardTable data={leaderboard} />
              ) : (
                <p className="text-center text-gray-500 py-6">
                  Leaderboard will be available after matches are played.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Player Stats Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Batting Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <StatsCard
                    title="Most Runs"
                    value={topRunScorer?.name || "N/A"}
                    subtitle={`${topRunScorer?.stats?.runs || 0} runs`}
                    colorClass="bg-blue-500"
                  />
                  <StatsCard
                    title="Most Sixes"
                    value={topSixer?.name || "N/A"}
                    subtitle={`${topSixer?.stats?.sixes || 0} sixes`}
                    colorClass="bg-purple-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bowling Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <StatsCard
                    title="Most Wickets"
                    value={topWicketTaker?.name || "N/A"}
                    subtitle={`${topWicketTaker?.stats?.wickets || 0} wickets`}
                    colorClass="bg-cricket-pitch"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fielding Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tournament.teams.flatMap(t => t.players)
                    .sort((a, b) => (b.stats?.catches || 0) - (a.stats?.catches || 0))
                    .slice(0, 1)
                    .map(player => (
                      <StatsCard
                        key={player.id}
                        title="Most Catches"
                        value={player.name}
                        subtitle={`${player.stats?.catches || 0} catches`}
                        colorClass="bg-amber-500"
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicTournamentView;
