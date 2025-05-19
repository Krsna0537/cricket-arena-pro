import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TournamentCard from '@/components/tournaments/TournamentCard';
import TournamentForm from '@/components/tournaments/TournamentForm';
import TournamentFilter from '@/components/tournaments/TournamentFilter';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Plus, Trophy, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import config from '@/lib/config';
import { Tournament, TournamentFilters } from '@/types';

const DashboardPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TournamentFilters>({
    search: '',
    status: '',
    format: '',
  });
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

  const statusOptions = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
  ];

  const formatOptions = [
    { label: 'League', value: 'league' },
    { label: 'Knockout', value: 'knockout' },
    { label: 'Group + Knockout', value: 'group_knockout' },
  ];

  const filteredTournaments = useMemo(() => {
    if (!tournaments) return [];

    return tournaments.filter((tournament: Tournament) => {
      const matchesSearch = !filters.search || 
        tournament.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (tournament.description && tournament.description.toLowerCase().includes(filters.search.toLowerCase())) ||
        (tournament.location && tournament.location.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesStatus = !filters.status || tournament.status === filters.status;
      const matchesFormat = !filters.format || tournament.format === filters.format;

      return matchesSearch && matchesStatus && matchesFormat;
    });
  }, [tournaments, filters]);
  
  // Calculate aggregate stats safely with null checks
  const totalTeams = tournaments ? tournaments.reduce((acc, t) => acc + (t.teams?.length || 0), 0) : 0;
  const totalMatches = tournaments ? tournaments.reduce((acc, t) => acc + (t.matches?.length || 0), 0) : 0;
  const liveMatches = tournaments ? tournaments.reduce(
    (acc, t) => acc + (t.matches?.filter(m => m.status === 'live')?.length || 0), 
    0
  ) : 0;
  const completedMatches = tournaments ? tournaments.reduce(
    (acc, t) => acc + (t.matches?.filter(m => m.status === 'completed')?.length || 0), 
    0
  ) : 0;
  const upcomingMatches = tournaments ? tournaments.reduce(
    (acc, t) => acc + (t.matches?.filter(m => m.status === 'upcoming')?.length || 0), 
    0
  ) : 0;
  const liveTournaments = tournaments ? tournaments.filter(t => t.status === 'ongoing').length : 0;

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground">
            Create and manage your cricket tournaments
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="bg-cricket-navy hover:bg-cricket-navy-light dark:bg-cricket-accent dark:text-black dark:hover:bg-cricket-accent-dark"
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

      <TournamentFilter
        onFilter={setFilters}
        statusOptions={statusOptions}
        formatOptions={formatOptions}
      />

      {filteredTournaments.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
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
            <CardTitle>No tournaments found</CardTitle>
          </CardHeader>
          <CardContent>
            {tournaments && tournaments.length > 0 ? (
              <p>No tournaments match your current filters. Try changing or resetting the filters.</p>
            ) : (
              <p>You haven't created any tournaments yet. Click the button above to get started.</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-cricket-navy/5 border-cricket-navy/20 dark:bg-cricket-navy/20">
        <CardHeader>
          <CardTitle className="text-cricket-navy dark:text-cricket-accent">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-cricket-dark-card rounded-lg shadow-sm">
              <p className="text-3xl font-bold">{tournaments ? tournaments.length : 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tournaments</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-cricket-dark-card rounded-lg shadow-sm">
              <p className="text-3xl font-bold">{totalTeams}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Teams</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-cricket-dark-card rounded-lg shadow-sm">
              <p className="text-3xl font-bold">{totalMatches}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Matches</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-cricket-dark-card rounded-lg shadow-sm">
              <p className="text-3xl font-bold">{liveTournaments}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Live Tournaments</p>
            </div>
          </div>
          
          {totalMatches > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{upcomingMatches}</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">Upcoming</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                <p className="text-xl font-bold text-red-700 dark:text-red-400">{liveMatches}</p>
                <p className="text-sm text-red-600 dark:text-red-300">Live</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <p className="text-xl font-bold text-green-700 dark:text-green-400">{completedMatches}</p>
                <p className="text-sm text-green-600 dark:text-green-300">Completed</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
