import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Trophy, Users, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tournament } from '@/types';

interface TournamentCardProps {
  tournament: Tournament;
  isAdmin?: boolean;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, isAdmin = false }) => {
  const getStatusBadge = () => {
    switch (tournament.status) {
      case 'ongoing':
        return (
          <Badge variant="outline" className="bg-red-500 dark:bg-red-600 text-white">
            Live
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500 dark:bg-green-600 text-white">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-500 dark:bg-blue-600 text-white">
            Upcoming
          </Badge>
        );
    }
  };

  const getFormatBadge = () => {
    switch (tournament.format) {
      case 'knockout':
        return <Badge variant="secondary">Knockout</Badge>;
      case 'group_knockout':
        return <Badge variant="secondary">Group + Knockout</Badge>;
      default:
        return <Badge variant="secondary">League</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg dark:border-gray-700">
      <CardHeader className="relative p-0">
        <div 
          className={cn(
            "relative h-32 w-full bg-gradient-to-r from-cricket-navy to-cricket-navy-light flex items-center justify-center",
            tournament.status === 'ongoing' && "from-red-600 to-red-800",
            tournament.status === 'completed' && "from-green-600 to-green-800"
          )}
        >
          <Trophy className="w-16 h-16 text-cricket-accent opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-lg truncate pr-2">
                {tournament.name}
              </h3>
              <div className="flex gap-1">
                {getStatusBadge()}
                {getFormatBadge()}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-5 space-y-3">
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>
              {format(new Date(tournament.start_date), 'dd MMM yyyy')} - {format(new Date(tournament.end_date), 'dd MMM yyyy')}
            </span>
          </div>

          {tournament.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>{tournament.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>{tournament.teams?.length || 0} teams</span>
          </div>
        </div>

        {tournament.description && (
          <p className="text-sm line-clamp-2">{tournament.description}</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        {isAdmin ? (
          <Link to={`/dashboard/tournament/${tournament.id}`} className="w-full">
            <Button variant="default" className="w-full dark:bg-cricket-accent dark:text-black">
              Manage
            </Button>
          </Link>
        ) : (
          <Link to={`/tournament/${tournament.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              <Eye className="mr-2 w-4 h-4" />
              View
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
