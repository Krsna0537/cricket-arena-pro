import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, ArrowRight, Users, TrendingUp, Calendar, BarChart2, Share } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AnimatedImage } from '@/components/ui/animated-image';

const HomePage = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-cricket-navy text-white py-16 md:py-24">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Cricket Tournament Management
                </h1>
                <p className="max-w-[600px] text-gray-200 md:text-xl">
                  Create and manage cricket tournaments with ease. Track teams, players, and live scores all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                {user ? (
                  <>
                    {userRole === 'creator' ? (
                      <Link to="/dashboard">
                        <Button className="bg-cricket-accent text-black hover:bg-cricket-accent/90">
                          Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/join">
                        <Button className="bg-cricket-accent text-black hover:bg-cricket-accent/90">
                          Join Tournament
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile">
                      <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white/20">
                        Your Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth/register">
                      <Button className="bg-cricket-accent text-black hover:bg-cricket-accent/90">
                        Sign Up
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/auth/login">
                      <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white/20">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Image Container with improved styling */}
            <div className="flex items-center justify-center">
              <div className="w-full h-[550px] max-w-[450px] relative rounded-3xl overflow-hidden shadow-2xl shadow-cricket-accent/20 border-2 border-white/10">
                <AnimatedImage
                  src="/vk1.jpg"
                  alt="Cricket Player"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 md:py-16 lg:py-24">
        <div className="mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
            Features
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
            Everything you need to run a successful cricket tournament
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="cricket-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cricket-navy/10">
              <Trophy className="h-6 w-6 text-cricket-navy dark:text-cricket-accent" />
            </div>
            <h3 className="text-xl font-bold">Tournament Management</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Create and manage tournaments with flexible formats - league or knockout.
            </p>
          </div>
          <div className="cricket-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cricket-navy/10">
              <Users className="h-6 w-6 text-cricket-navy dark:text-cricket-accent" />
            </div>
            <h3 className="text-xl font-bold">Team & Player Management</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Add teams, upload logos, and manage player information with specific roles.
            </p>
          </div>
          <div className="cricket-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cricket-navy/10">
              <TrendingUp className="h-6 w-6 text-cricket-navy dark:text-cricket-accent" />
            </div>
            <h3 className="text-xl font-bold">Live Scoring</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Real-time score updates, wickets, overs tracking, and match statistics.
            </p>
          </div>
          <div className="cricket-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cricket-navy/10">
              <Calendar className="h-6 w-6 text-cricket-navy dark:text-cricket-accent" />
            </div>
            <h3 className="text-xl font-bold">Match Scheduling</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Schedule matches with venues and timings for leagues, knockouts, and finals.
            </p>
          </div>
          <div className="cricket-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cricket-navy/10">
              <BarChart2 className="h-6 w-6 text-cricket-navy dark:text-cricket-accent" />
            </div>
            <h3 className="text-xl font-bold">Statistics & Leaderboards</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Track tournament statistics with dynamic leaderboards and player stats.
            </p>
          </div>
          <div className="cricket-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cricket-navy/10">
              <Share className="h-6 w-6 text-cricket-navy dark:text-cricket-accent" />
            </div>
            <h3 className="text-xl font-bold">Public Tournament View</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Share tournaments with viewers through access codes or direct links.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 dark:bg-gray-900">
        <div className="container px-4">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-2xl font-bold">Join a Tournament</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Enter a tournament code to view match details, scores, and stats.
            </p>
            <div className="mt-4 flex">
              <Input placeholder="Enter tournament code" className="rounded-r-none" />
              <Button className="rounded-l-none bg-cricket-navy hover:bg-cricket-navy-light dark:bg-cricket-accent dark:text-black">
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
