
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Player, WicketType } from '@/types';

interface WicketModalProps {
  striker: Player | null;
  wicketType: WicketType | '';
  setWicketType: (type: WicketType | '') => void;
  fielder: Player | null;
  setFielder: (player: Player | null) => void;
  availableBowlers: Player[];
  handleWicketConfirm: () => void;
  setShowWicketModal: (show: boolean) => void;
  isLoading: boolean;
}

export const WicketModal: React.FC<WicketModalProps> = ({ 
  striker, 
  wicketType,
  setWicketType,
  fielder,
  setFielder,
  availableBowlers,
  handleWicketConfirm,
  setShowWicketModal,
  isLoading
}) => {
  const wicketTypes: WicketType[] = ['bowled', 'caught', 'lbw', 'run-out', 'stumped', 'hit-wicket'];
  
  return (
    <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded">
      <h4 className="font-bold mb-3 text-red-700">Wicket Details</h4>
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Out Batsman</label>
          <div className="px-3 py-2 bg-white border rounded">{striker?.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Wicket Type</label>
          <Select 
            value={wicketType} 
            onValueChange={(value) => setWicketType(value as WicketType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How out?" />
            </SelectTrigger>
            <SelectContent>
              {wicketTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(wicketType === 'caught' || wicketType === 'run-out' || wicketType === 'stumped') && (
          <div>
            <label className="block text-sm font-medium mb-1">Fielder</label>
            <Select 
              value={fielder?.id || ''} 
              onValueChange={(value) => setFielder(availableBowlers.find(p => p.id === value) || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fielder" />
              </SelectTrigger>
              <SelectContent>
                {availableBowlers.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <Button 
          variant="destructive"
          onClick={handleWicketConfirm}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Wicket
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setShowWicketModal(false);
            setWicketType('');
            setFielder(null);
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
