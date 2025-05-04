
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const teamSchema = z.object({
  name: z.string().min(3, { message: 'Team name is required' }),
  logo: z.any().optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface TeamFormProps {
  onSubmit: (data: { name: string, logo?: string }) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processSubmit = (data: TeamFormData) => {
    onSubmit({
      name: data.name,
      logo: logoPreview || undefined,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Team</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              placeholder="Enter team name"
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Team Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              className="cursor-pointer"
              onChange={handleLogoChange}
            />
            {logoPreview && (
              <div className="mt-2 flex justify-center">
                <img src={logoPreview} alt="Logo Preview" className="w-20 h-20 object-contain" />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-cricket-navy hover:bg-cricket-navy-light">
            Add Team
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamForm;
