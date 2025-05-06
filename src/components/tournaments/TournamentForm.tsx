import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TournamentType } from '@/types';

const tournamentSchema = z.object({
  name: z.string().min(3, { message: 'Tournament name is required' }),
  type: z.enum(['league', 'knockout']),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().min(1, { message: 'End date is required' }),
  venueCity: z.string().min(1, { message: 'Venue city is required' }),
});

type TournamentFormData = z.infer<typeof tournamentSchema>;

interface TournamentFormProps {
  onSubmit: (data: TournamentFormData) => Promise<void>;
}

const TournamentForm: React.FC<TournamentFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      type: 'league',
    },
  });

  const onFormSubmit = async (data: TournamentFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Tournament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              id="name"
              placeholder="Enter tournament name"
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tournament Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="league" id="league" />
                    <Label htmlFor="league">League</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="knockout" id="knockout" />
                    <Label htmlFor="knockout">Knockout</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate')}
              disabled={isSubmitting}
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
              disabled={isSubmitting}
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueCity">Venue City</Label>
            <Input
              id="venueCity"
              placeholder="Enter venue city"
              {...register('venueCity')}
              disabled={isSubmitting}
            />
            {errors.venueCity && <p className="text-red-500 text-sm">{errors.venueCity.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-cricket-navy hover:bg-cricket-navy-light"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Tournament'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TournamentForm;
