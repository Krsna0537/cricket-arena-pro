
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Tournament } from '@/types';

// Import our new components
import TournamentHeader from '@/components/tournaments/TournamentHeader';
import SharingSection from '@/components/tournaments/SharingSection';
import TeamsTab from '@/components/tournaments/tabs/TeamsTab';
import MatchesTab from '@/components/tournaments/tabs/MatchesTab';
import LiveScoringTab from '@/components/tournaments/tabs/LiveScoringTab';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { findTournament, generateShareableLink } = useApp();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    if (tournamentId) {
      const found = findTournament(tournamentId);
      if (found) {
        setTournament(found);
        setShareLink(generateShareableLink(found));
      }
    }
  }, [tournamentId, findTournament, generateShareableLink]);

  // Re-fetch tournament data when location changes
  // (this helps refresh data after navigating back to this page)
  useEffect(() => {
    if (tournamentId) {
      const found = findTournament(tournamentId);
      if (found) {
        setTournament(found);
      }
    }
  }, [location, tournamentId, findTournament]);

  if (!tournament) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Tournament not found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <TournamentHeader tournament={tournament} />
      <SharingSection tournament={tournament} shareLink={shareLink} />

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="live">Live Scoring</TabsTrigger>
        </TabsList>
        
        {/* Teams Tab */}
        <TabsContent value="teams">
          <TeamsTab tournament={tournament} />
        </TabsContent>
        
        {/* Matches Tab */}
        <TabsContent value="matches">
          <MatchesTab 
            tournament={tournament}
            onMatchClick={setSelectedMatchId} 
          />
        </TabsContent>
        
        {/* Live Scoring Tab */}
        <TabsContent value="live">
          <LiveScoringTab 
            tournament={tournament}
            selectedMatchId={selectedMatchId}
            setSelectedMatchId={setSelectedMatchId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TournamentDetailPage;
