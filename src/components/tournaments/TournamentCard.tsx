
import React from 'react';
import { Link } from 'react-router-dom';
import { Tournament } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Users } from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
  isAdmin?: boolean;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, isAdmin = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-amber-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card className="cricket-card overflow-hidden">
      <div className="h-2 cricket-gradient w-full" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{tournament.name}</h3>
          <Badge className={getStatusColor(tournament.status)}>
            {tournament.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Trophy className="h-4 w-4" />
          <span>{tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-4 w-4" />
          <span>{tournament.teams.length} Teams</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          {isAdmin ? (
            <Link to={`/dashboard/tournament/${tournament.id}`} className="w-full">
              <button className="w-full py-2 bg-cricket-navy text-white rounded-md hover:bg-cricket-navy-light transition-colors">
                Manage
              </button>
            </Link>
          ) : (
            <Link to={`/tournament/${tournament.id}`} className="w-full">
              <button className="w-full py-2 bg-cricket-navy text-white rounded-md hover:bg-cricket-navy-light transition-colors">
                View
              </button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
