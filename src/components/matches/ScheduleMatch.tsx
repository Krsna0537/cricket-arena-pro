
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Team, Tournament } from '@/types';

const matchSchema = z.object({
  team1Id: z.string().min(1, { message: 'Team 1 is required' }),
  team2Id: z.string().min(1, { message: 'Team 2 is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  venue: z.string().min(1, { message: 'Venue is required' }),
  overs: z.number().min(1).max(50).optional(),
}).refine(data => data.team1Id !== data.team2Id, {
  message: "Teams must be different",
  path: ["team2Id"],
});

type ScheduleMatchFormData = z.infer<typeof matchSchema>;

interface ScheduleMatchProps {
  teams: Team[];
  tournament?: Tournament;
  onSubmit: (data: ScheduleMatchFormData) => void;
}

const ScheduleMatch: React.FC<ScheduleMatchProps> = ({ teams, tournament, onSubmit }) => {
  const defaultOvers = tournament?.defaultOvers || 20;
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<ScheduleMatchFormData>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      overs: defaultOvers,
    }
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Schedule Match</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team1Id">Team 1</Label>
            <Controller
              name="team1Id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.team1Id && <p className="text-red-500 text-sm">{errors.team1Id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="team2Id">Team 2</Label>
            <Controller
              name="team2Id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.team2Id && <p className="text-red-500 text-sm">{errors.team2Id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="overs">Overs</Label>
            <Input
              id="overs"
              type="number"
              min="1"
              max="50"
              placeholder={defaultOvers.toString()}
              {...register('overs', { valueAsNumber: true })}
            />
            {errors.overs && <p className="text-red-500 text-sm">{errors.overs.message}</p>}
            <p className="text-xs text-gray-500">Default: {defaultOvers} overs (tournament setting)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Match Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              placeholder="Enter venue"
              {...register('venue')}
            />
            {errors.venue && <p className="text-red-500 text-sm">{errors.venue.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-cricket-navy hover:bg-cricket-navy-light">
            Schedule Match
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleMatch;
