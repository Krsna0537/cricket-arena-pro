import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider, ProtectedRoute } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import NotAuthorizedPage from "@/pages/NotAuthorizedPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import TournamentDetailPage from "@/pages/admin/TournamentDetailPage";
import JoinTournamentPage from "@/pages/JoinTournamentPage";
import PublicTournamentView from "@/pages/public/PublicTournamentView";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>

              {/* Auth Routes */}
              <Route path="/auth">
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>

              {/* Protected Routes */}
              <Route path="/" element={<Layout />}>
                <Route path="profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="join" element={
                  <ProtectedRoute>
                    <JoinTournamentPage />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Creator Routes */}
              <Route path="/dashboard" element={<Layout isAdmin={true} />}>
                <Route index element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="tournament/:tournamentId" element={
                  <ProtectedRoute allowedRoles={['creator']}>
                    <TournamentDetailPage />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Public Tournament View */}
              <Route path="/tournament/:tournamentId" element={<Layout />}>
                <Route index element={
                  <ProtectedRoute>
                    <PublicTournamentView />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Error Routes */}
              <Route path="/not-authorized" element={<Layout />}>
                <Route index element={<NotAuthorizedPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
