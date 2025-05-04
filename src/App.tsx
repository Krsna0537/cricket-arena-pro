
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/admin/DashboardPage";
import TournamentDetailPage from "@/pages/admin/TournamentDetailPage";
import JoinTournamentPage from "@/pages/JoinTournamentPage";
import PublicTournamentView from "@/pages/public/PublicTournamentView";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="join" element={<JoinTournamentPage />} />
            </Route>
            
            <Route path="/dashboard" element={<Layout isAdmin={true} />}>
              <Route index element={<DashboardPage />} />
              <Route path="tournament/:tournamentId" element={<TournamentDetailPage />} />
            </Route>
            
            <Route path="/tournament/:tournamentId" element={<Layout />}>
              <Route index element={<PublicTournamentView />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
