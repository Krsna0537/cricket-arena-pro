
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'batsman': return 'bg-blue-500';
      case 'bowler': return 'bg-green-500';
      case 'all-rounder': return 'bg-purple-500';
      case 'keeper': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const roleLabel = player.role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  // Function to handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <Card 
      className="cricket-card cursor-pointer hover:shadow-md transition-all" 
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex-shrink-0">
          {player.avatar ? (
            <img 
              src={player.avatar} 
              alt={player.name} 
              className="w-12 h-12 rounded-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-cricket-navy/10 flex items-center justify-center">
              <span className="text-cricket-navy font-bold">
                {player.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold">{player.name}</h3>
          <Badge className={`${getRoleColor(player.role)} mt-1`}>
            {roleLabel}
          </Badge>
        </div>
        {player.stats && (
          <div className="text-sm text-right">
            {player.stats.runs > 0 && <div>{player.stats.runs} runs</div>}
            {player.stats.wickets > 0 && <div>{player.stats.wickets} wkts</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
