import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, ArrowRight, Users, TrendingUp, Calendar, BarChart2, Share, Search, ChevronRight, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AnimatedImage } from '@/components/ui/animated-image';
import { motion } from 'framer-motion';

// Features data
const features = [
  {
    icon: <Trophy className="h-7 w-7 text-cricket-navy dark:text-cricket-accent" />,
    title: "Tournament Management",
    description: "Create and manage tournaments with flexible formats - league or knockout."
  },
  {
    icon: <Users className="h-7 w-7 text-cricket-navy dark:text-cricket-accent" />,
    title: "Team & Player Management",
    description: "Add teams, upload logos, and manage player information with specific roles."
  },
  {
    icon: <TrendingUp className="h-7 w-7 text-cricket-navy dark:text-cricket-accent" />,
    title: "Live Scoring",
    description: "Real-time score updates, wickets, overs tracking, and match statistics."
  },
  {
    icon: <Calendar className="h-7 w-7 text-cricket-navy dark:text-cricket-accent" />,
    title: "Match Scheduling",
    description: "Schedule matches with venues and timings for leagues, knockouts, and finals."
  },
  {
    icon: <BarChart2 className="h-7 w-7 text-cricket-navy dark:text-cricket-accent" />,
    title: "Statistics & Leaderboards",
    description: "Track tournament statistics with dynamic leaderboards and player stats."
  },
  {
    icon: <Share className="h-7 w-7 text-cricket-navy dark:text-cricket-accent" />,
    title: "Public Tournament View",
    description: "Share tournaments with viewers through access codes or direct links."
  }
];

const HomePage = () => {
  const { user, userRole } = useAuth();
  const [tournamentCode, setTournamentCode] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with better gradient and positioning */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cricket-navy via-cricket-navy-light to-cricket-navy text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-cricket-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-8">
              <motion.div 
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Cricket Tournament <span className="text-cricket-accent">Management</span>
                </h1>
                <p className="max-w-[600px] text-gray-200 md:text-xl">
                  Create and manage cricket tournaments with ease. Track teams, players, and live scores all in one place.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col gap-4 min-[400px]:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {user ? (
                  <>
                    {userRole === 'creator' ? (
                      <Link to="/dashboard">
                        <Button size="lg" className="bg-cricket-accent text-black hover:bg-cricket-accent/90 shadow-lg hover:shadow-xl transition-all">
                          Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/join">
                        <Button size="lg" className="bg-cricket-accent text-black hover:bg-cricket-accent/90 shadow-lg hover:shadow-xl transition-all">
                          Join Tournament
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile">
                      <Button size="lg" variant="outline" className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all">
                        Your Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth/register">
                      <Button size="lg" className="bg-cricket-accent text-black hover:bg-cricket-accent/90 shadow-lg hover:shadow-xl transition-all">
                        Sign Up
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/auth/login">
                      <Button size="lg" variant="outline" className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
              
              {/* Quick tournament code search bar - New Feature */}
              <motion.div 
                className="max-w-md mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full pl-4 pr-1 py-1 border border-white/20">
                  <Search className="h-4 w-4 text-white/70 mr-2" />
                  <Input 
                    type="text" 
                    placeholder="Enter tournament code" 
                    className="border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={tournamentCode}
                    onChange={(e) => setTournamentCode(e.target.value)}
                  />
                  <Button size="sm" className="rounded-full bg-cricket-accent text-black hover:bg-cricket-accent/90">
                    Go
                  </Button>
                </div>
              </motion.div>
            </div>
            
            {/* Image Container with improved styling */}
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full h-auto max-w-[450px] relative">
                <AnimatedImage
                  src="/vk1.jpg"
                  alt="Cricket Player"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-cricket-accent/10 blur-3xl"></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-cricket-accent/10 blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-6">
        {/* Features Section with Card Hover Effects */}
        <div className="py-16 md:py-24">
          <motion.div 
            className="mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              <span className="text-cricket-navy">Premium</span> Features
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
              Everything you need to run a successful cricket tournament
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="cricket-card p-8 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-cricket-accent/80"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cricket-navy/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="relative bg-gradient-to-br from-cricket-navy via-cricket-navy-light to-cricket-navy py-20">
        <div className="absolute inset-0 bg-cricket-pattern opacity-5"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">About Cricket Arena Pro</h2>
              <div className="space-y-4 text-gray-200">
                <p>
                  Cricket Arena Pro is a comprehensive tournament management platform designed specifically for cricket enthusiasts, 
                  teams, and organizers. Our platform combines powerful features with an intuitive interface to make cricket tournament 
                  management seamless and enjoyable.
                </p>
                <p>
                  Whether you're organizing a local community match, a corporate cricket league, or a professional tournament, 
                  our platform scales to meet your needs with features like real-time scoring, detailed statistics, and customizable 
                  tournament formats.
                </p>
                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-cricket-accent mb-3">Why Choose Cricket Arena Pro?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-cricket-accent mr-2 mt-1 flex-shrink-0" />
                      <span>Purpose-built for cricket with specialized scoring options</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-cricket-accent mr-2 mt-1 flex-shrink-0" />
                      <span>Flexible tournament formats - leagues, knockouts, or custom formats</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-cricket-accent mr-2 mt-1 flex-shrink-0" />
                      <span>Advanced player statistics and performance analysis</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-cricket-accent mr-2 mt-1 flex-shrink-0" />
                      <span>User-friendly interface with mobile-responsive design</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="w-full max-w-md relative">
                <div className="relative">
                  <AnimatedImage
                    src="/cric.jpg"
                    alt="Cricket match"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Section - Full Width */}
      <footer className="bg-cricket-navy dark:bg-gray-900 text-white w-screen mx-auto left-0 right-0 overflow-hidden">
        <div className="w-full px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* About Us */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Trophy className="h-5 w-5 text-cricket-accent mr-2" />
                Cricket Arena Pro
              </h3>
              <p className="text-gray-300 mb-4">
                Your complete cricket tournament management solution. Create, manage, and share tournaments with ease.
              </p>
              <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-cricket-accent transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-cricket-accent transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-cricket-accent transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" aria-label="Youtube" className="text-gray-300 hover:text-cricket-accent transition-colors">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-cricket-accent transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/auth/register" className="text-gray-300 hover:text-cricket-accent transition-colors">Register</Link>
                </li>
                <li>
                  <Link to="/auth/login" className="text-gray-300 hover:text-cricket-accent transition-colors">Login</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-cricket-accent transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h3 className="text-xl font-bold mb-4">Help & Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-cricket-accent transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cricket-accent transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cricket-accent transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-cricket-accent transition-colors">Support Center</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-cricket-accent mr-2 mt-0.5" />
                  <span className="text-gray-300">123 Cricket Lane<br />Sports District, IN 10001</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-cricket-accent mr-2" />
                  <span className="text-gray-300">+91 123-456-7890</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-cricket-accent mr-2" />
                  <span className="text-gray-300">pmesta246@gmail.com</span>
                </li>
                <li className="mt-4">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center bg-cricket-accent/20 hover:bg-cricket-accent/30 text-white py-2 px-4 rounded-full transition-colors"
                  >
                    Visit Contact Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 dark:border-gray-800 my-8 max-w-7xl mx-auto"></div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm max-w-7xl mx-auto">
            <p>© {new Date().getFullYear()} Cricket Arena Pro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-cricket-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-cricket-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-cricket-accent transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
