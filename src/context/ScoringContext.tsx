
import React, { createContext, useContext } from 'react';
import { BallEvent, InningsSummary } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import {
  addBallEvent as addBallEventService,
  fetchBallEvents as fetchBallEventsService,
  upsertInningsSummary as upsertInningsSummaryService,
  fetchInningsSummary as fetchInningsSummaryService,
  fetchTargetScore as fetchTargetScoreService,
  convertToDbInningsSummary
} from '@/services/scoringService';
import { useLiveBallEvents } from '@/hooks/useLiveBallEvents';

interface ScoringContextType {
  addBallEvent: (event: Omit<BallEvent, 'id' | 'createdAt'>) => Promise<BallEvent>;
  fetchBallEvents: (matchId: string, inning: number) => Promise<BallEvent[]>;
  upsertInningsSummary: (summary: InningsSummary) => Promise<void>;
  fetchInningsSummary: (matchId: string, inning: number) => Promise<InningsSummary | null>;
  fetchTargetScore: (matchId: string) => Promise<number | null>;
}

const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

export const ScoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const handleAddBallEvent = async (event: Omit<BallEvent, 'id' | 'createdAt'>) => {
    try {
      return await addBallEventService(event);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to add ball event: ' + error.message, 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const handleFetchBallEvents = async (matchId: string, inning: number) => {
    try {
      return await fetchBallEventsService(matchId, inning);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch ball events: ' + error.message, 
        variant: 'destructive' 
      });
      return [];
    }
  };

  const handleUpsertInningsSummary = async (summary: InningsSummary) => {
    try {
      // Convert app model to DB model before sending to the service function
      const dbSummary = convertToDbInningsSummary(summary, summary.matchId);
      await upsertInningsSummaryService(dbSummary);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update innings summary: ' + error.message, 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const handleFetchInningsSummary = async (matchId: string, inning: number) => {
    try {
      return await fetchInningsSummaryService(matchId, inning);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch innings summary: ' + error.message, 
        variant: 'destructive' 
      });
      return null;
    }
  };

  const handleFetchTargetScore = async (matchId: string) => {
    try {
      return await fetchTargetScoreService(matchId);
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch target score: ' + error.message, 
        variant: 'destructive' 
      });
      return null;
    }
  };

  return (
    <ScoringContext.Provider
      value={{
        addBallEvent: handleAddBallEvent,
        fetchBallEvents: handleFetchBallEvents,
        upsertInningsSummary: handleUpsertInningsSummary,
        fetchInningsSummary: handleFetchInningsSummary,
        fetchTargetScore: handleFetchTargetScore
      }}
    >
      {children}
    </ScoringContext.Provider>
  );
};

export const useScoring = () => {
  const context = useContext(ScoringContext);
  if (context === undefined) {
    throw new Error('useScoring must be used within a ScoringProvider');
  }
  return context;
};

// Re-export the useLiveBallEvents hook for convenience
export { useLiveBallEvents };
