
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Match, Team } from '@/types';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  team1?: Team;
  team2?: Team;
  onClick?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, team1, team2, onClick }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 animate-pulse">LIVE</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge className="bg-blue-500">Upcoming</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      className={`cricket-card hover:shadow-md transition-all cursor-pointer ${
        match.status === 'live' ? 'border-red-500 border-2 shadow' : ''
      }`} 
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <h3 className="font-semibold truncate max-w-[70%]">
          {team1?.name || 'Team 1'} vs {team2?.name || 'Team 2'}
        </h3>
        {getStatusBadge(match.status)}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(match.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatTime(match.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{match.venue}</span>
          </div>
        </div>

        {(match.status === 'live' || match.status === 'completed') && match.scoreTeam1 && (
          <div className="mt-3 grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-md">
            <div className="text-sm">
              <p className="font-medium truncate">{team1?.name || 'Team 1'}</p>
              <p className="text-cricket-navy font-bold">
                {match.scoreTeam1.runs}/{match.scoreTeam1.wickets} ({match.scoreTeam1.overs.toFixed(1)} ov)
              </p>
            </div>
            {match.scoreTeam2 && match.scoreTeam2.runs > 0 && (
              <div className="text-sm">
                <p className="font-medium truncate">{team2?.name || 'Team 2'}</p>
                <p className="text-cricket-navy font-bold">
                  {match.scoreTeam2.runs}/{match.scoreTeam2.wickets} ({match.scoreTeam2.overs.toFixed(1)} ov)
                </p>
              </div>
            )}
          </div>
        )}

        {match.result && (
          <div className="mt-2 text-sm font-medium text-green-700 p-1.5 bg-green-50 rounded-md">
            {match.result}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <button className="w-full py-1.5 text-sm bg-cricket-navy/10 text-cricket-navy rounded-md hover:bg-cricket-navy/20 transition-colors">
          {match.status === 'live' ? 'View Live' : match.status === 'completed' ? 'Match Details' : 'Match Info'}
        </button>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
