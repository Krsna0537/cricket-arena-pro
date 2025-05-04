
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayerRole } from '@/types';

const playerSchema = z.object({
  name: z.string().min(3, { message: 'Player name is required' }),
  role: z.enum(['batsman', 'bowler', 'all-rounder', 'keeper']),
});

type PlayerFormData = z.infer<typeof playerSchema>;

interface PlayerFormProps {
  onSubmit: (data: PlayerFormData) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      role: 'batsman',
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Player</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Player Name</Label>
            <Input
              id="name"
              placeholder="Enter player name"
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Player Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batsman">Batsman</SelectItem>
                    <SelectItem value="bowler">Bowler</SelectItem>
                    <SelectItem value="all-rounder">All-Rounder</SelectItem>
                    <SelectItem value="keeper">Wicket Keeper</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-cricket-navy hover:bg-cricket-navy-light">
            Add Player
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
