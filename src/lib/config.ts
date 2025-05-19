// Application configuration
export const config = {
  app: {
    name: "Cricket Arena Pro",
    version: "1.0.0",
  },
  api: {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    timeout: 30000, // API timeout in milliseconds
  },
  tournaments: {
    maxTeams: 16, // Maximum teams allowed per tournament
    maxPlayersPerTeam: 15, // Maximum players allowed per team
    defaultOvers: 20, // Default overs per match
  },
  pagination: {
    defaultLimit: 10, // Default number of items per page
  },
  features: {
    enableScoring: true,
    enableLiveUpdates: true,
    enableExport: true,
    enableTeamLogos: true,
  },
};

// Validate essential config is present
if (!config.api.supabaseUrl || !config.api.supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export default config; 