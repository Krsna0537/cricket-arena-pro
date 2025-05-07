
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TournamentCard from '@/components/tournaments/TournamentCard';
import TournamentForm from '@/components/tournaments/TournamentForm';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Plus, Trophy, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DashboardPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { tournaments, addTournament } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
  }, [tournaments]);

  const handleCreateTournament = async (data: any) => {
    try {
      await addTournament({
        ...data,
        creatorId: user?.id || 'unknown',
        status: 'upcoming'
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create tournament:', error);
    }
  };
  
  // Calculate aggregate stats
  const totalTeams = tournaments.reduce((acc, t) => acc + t.teams.length, 0);
  const totalMatches = tournaments.reduce((acc, t) => acc + t.matches.length, 0);
  const liveMatches = tournaments.reduce(
    (acc, t) => acc + t.matches.filter(m => m.status === 'live').length, 
    0
  );
  const completedMatches = tournaments.reduce(
    (acc, t) => acc + t.matches.filter(m => m.status === 'completed').length, 
    0
  );
  const upcomingMatches = tournaments.reduce(
    (acc, t) => acc + t.matches.filter(m => m.status === 'upcoming').length, 
    0
  );
  const liveTournaments = tournaments.filter(t => t.status === 'ongoing').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tournaments</h1>
            <p className="text-muted-foreground">Loading your tournaments...</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0 -z-10 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80"
          alt="Cricket Ground" 
          className="h-64 w-64 object-cover rounded-bl-3xl"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground">
            Create and manage your cricket tournaments
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="bg-cricket-navy hover:bg-cricket-navy-light"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Tournament
        </Button>
      </div>

      {showCreateForm && (
        <div className="mt-6">
          <TournamentForm onSubmit={handleCreateTournament} />
        </div>
      )}

      {tournaments.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              isAdmin={true}
            />
          ))}
        </div>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Welcome to Cricket Arena Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You haven't created any tournaments yet. Click the button above to get started.</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-cricket-navy/5 border-cricket-navy/20 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1613099051607-9f28253d42af?auto=format&fit=crop&q=80"
            alt="Cricket Equipment" 
            className="h-64 object-contain"
            loading="lazy"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-cricket-navy">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-3xl font-bold">{tournaments.length}</p>
              <p className="text-sm text-gray-500">Tournaments</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-3xl font-bold">{totalTeams}</p>
              <p className="text-sm text-gray-500">Teams</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-3xl font-bold">{totalMatches}</p>
              <p className="text-sm text-gray-500">Matches</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-3xl font-bold">{liveTournaments}</p>
              <p className="text-sm text-gray-500">Live Tournaments</p>
            </div>
          </div>
          
          {totalMatches > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xl font-bold text-blue-700">{upcomingMatches}</p>
                <p className="text-sm text-blue-600">Upcoming</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xl font-bold text-red-700">{liveMatches}</p>
                <p className="text-sm text-red-600">Live</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xl font-bold text-green-700">{completedMatches}</p>
                <p className="text-sm text-green-600">Completed</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
