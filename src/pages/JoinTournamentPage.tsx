
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/use-toast';

const joinSchema = z.object({
  accessCode: z.string().min(3, { message: 'Tournament code is required' }),
});

type JoinFormData = z.infer<typeof joinSchema>;

const JoinTournamentPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
  });
  
  const { tournaments } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recentTournaments] = useState(tournaments.slice(0, 3));

  const handleJoin = (data: JoinFormData) => {
    const tournament = tournaments.find(t => t.accessCode === data.accessCode);
    
    if (tournament) {
      navigate(`/tournament/${tournament.id}`);
    } else {
      toast({
        title: "Invalid tournament code",
        description: "Please check the code and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 relative">
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <img 
          src="/images/cricket-scoreboard.jpg" 
          alt="Cricket Scoreboard" 
          className="h-64 w-64 object-cover rounded-bl-3xl"
        />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Join a Tournament</h1>
      
      <Card className="mb-8 relative overflow-hidden">
        <div className="absolute -right-20 bottom-0 opacity-5">
          <img 
            src="/images/cricket-ticket.png" 
            alt="Tournament Ticket" 
            className="h-64"
          />
        </div>
        <CardHeader>
          <CardTitle>Enter Tournament Code</CardTitle>
          <CardDescription>
            Enter the code provided by the tournament administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleJoin)}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="accessCode">Tournament Code</Label>
                <Input
                  id="accessCode"
                  placeholder="Enter code (e.g. CPL2025)"
                  {...register('accessCode')}
                />
                {errors.accessCode && (
                  <p className="text-sm text-red-500">{errors.accessCode.message}</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit(handleJoin)} 
            className="w-full bg-cricket-navy hover:bg-cricket-navy-light"
          >
            Join Tournament
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Tournaments</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {recentTournaments.map(tournament => (
            <Card key={tournament.id} className="cricket-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{tournament.name}</CardTitle>
                <CardDescription>
                  {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500">
                  {tournament.teams.length} Teams • {tournament.matches.length} Matches
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate(`/tournament/${tournament.id}`)}
                  variant="outline" 
                  className="w-full"
                >
                  View Tournament
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinTournamentPage;
