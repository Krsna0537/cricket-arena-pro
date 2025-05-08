
import React from 'react';
import { Link } from 'react-router-dom';
import { Tournament } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TournamentHeaderProps {
  tournament: Tournament;
}

const TournamentHeader = ({ tournament }: TournamentHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
        <p className="text-muted-foreground">
          {tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1)} Tournament • 
          {' '}{new Date(tournament.startDate).toLocaleDateString()} to {new Date(tournament.endDate).toLocaleDateString()}
        </p>
        <Badge className={`mt-2 ${
          tournament.status === 'upcoming' ? 'bg-blue-500' : 
          tournament.status === 'ongoing' ? 'bg-amber-500' : 'bg-green-500'
        }`}>
          {tournament.status.toUpperCase()}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to={`/tournament/${tournament.id}`}>
          <Button variant="outline">Public View</Button>
        </Link>
      </div>
    </div>
  );
};

export default TournamentHeader;
