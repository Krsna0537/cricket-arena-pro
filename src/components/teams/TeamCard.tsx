
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Team } from '@/types';
import { Users } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  return (
    <Card className="cricket-card cursor-pointer hover:scale-[1.02] transition-transform" onClick={onClick}>
      <CardHeader className="pb-2 pt-4 flex justify-center">
        {team.logo ? (
          <img src={team.logo} alt={team.name} className="w-16 h-16 object-contain" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-cricket-navy/10 flex items-center justify-center">
            <span className="text-cricket-navy text-xl font-bold">
              {team.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="text-center pb-2">
        <h3 className="font-bold text-lg">{team.name}</h3>
        <div className="flex items-center gap-1 justify-center mt-1 text-gray-600 text-sm">
          <Users className="h-4 w-4" />
          <span>{team.players.length} Players</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <button className="w-full py-1.5 text-sm bg-cricket-navy/10 text-cricket-navy rounded-md hover:bg-cricket-navy/20 transition-colors">
          View Details
        </button>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;
