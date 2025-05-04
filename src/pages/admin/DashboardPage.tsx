
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TournamentCard from '@/components/tournaments/TournamentCard';
import TournamentForm from '@/components/tournaments/TournamentForm';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DashboardPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { tournaments, addTournament } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Future integration with Supabase for fetching tournaments
    setIsLoading(false);
  }, []);

  const handleCreateTournament = (data: any) => {
    addTournament({
      ...data,
      creatorId: user?.id || 'unknown', // Using the logged-in user ID
      status: 'upcoming'
    });
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading tournaments...</p>
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

      <Card className="bg-cricket-navy/5 border-cricket-navy/20">
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
              <p className="text-3xl font-bold">
                {tournaments.reduce((acc, t) => acc + t.teams.length, 0)}
              </p>
              <p className="text-sm text-gray-500">Teams</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-3xl font-bold">
                {tournaments.reduce((acc, t) => acc + t.matches.length, 0)}
              </p>
              <p className="text-sm text-gray-500">Matches</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-3xl font-bold">
                {tournaments.filter(t => t.status === 'ongoing').length}
              </p>
              <p className="text-sm text-gray-500">Live Tournaments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
