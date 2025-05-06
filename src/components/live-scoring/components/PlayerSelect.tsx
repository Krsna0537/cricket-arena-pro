
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Player } from '@/types';

interface PlayerSelectProps {
  loadingSummary: boolean;
  striker: Player | null;
  nonStriker: Player | null;
  bowler: Player | null;
  availableBatsmen: Player[];
  availableBowlers: Player[];
  setStriker: (player: Player | null) => void;
  setNonStriker: (player: Player | null) => void;
  setBowler: (player: Player | null) => void;
  setShowPlayerSelect: (show: boolean) => void;
}

export const PlayerSelect: React.FC<PlayerSelectProps> = ({
  loadingSummary,
  striker,
  nonStriker,
  bowler,
  availableBatsmen,
  availableBowlers,
  setStriker,
  setNonStriker,
  setBowler,
  setShowPlayerSelect
}) => {
  if (loadingSummary) {
    return (
      <div className="mb-4 p-4 border rounded bg-gray-50 flex justify-center items-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading player data...</span>
      </div>
    );
  }
  
  return (
    <div className="mb-4 p-4 border rounded bg-gray-50">
      <h4 className="font-bold mb-3">Select Players</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Striker</label>
          <Select 
            value={striker?.id || ''} 
            onValueChange={(value) => setStriker(availableBatsmen.find(p => p.id === value) || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select batsman" />
            </SelectTrigger>
            <SelectContent>
              {availableBatsmen
                .filter(p => !nonStriker || p.id !== nonStriker.id)
                .map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Non-Striker</label>
          <Select 
            value={nonStriker?.id || ''} 
            onValueChange={(value) => setNonStriker(availableBatsmen.find(p => p.id === value) || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select batsman" />
            </SelectTrigger>
            <SelectContent>
              {availableBatsmen
                .filter(p => !striker || p.id !== striker.id)
                .map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bowler</label>
          <Select 
            value={bowler?.id || ''} 
            onValueChange={(value) => setBowler(availableBowlers.find(p => p.id === value) || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bowler" />
            </SelectTrigger>
            <SelectContent>
              {availableBowlers.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button 
        className="mt-4" 
        onClick={() => {
          if (striker && nonStriker && bowler) setShowPlayerSelect(false);
        }} 
        disabled={!(striker && nonStriker && bowler)}
      >
        Confirm
      </Button>
    </div>
  );
};
