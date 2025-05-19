export interface Tournament {
  id: string;
  name: string;
  description?: string;
  format: 'league' | 'knockout' | 'group_knockout';
  type?: string;
  start_date: string;
  startDate?: string;
  end_date: string;
  endDate?: string;
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  creatorId: string;
  access_code?: string;
  teams?: Team[];
  matches?: Match[];
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  short_name: string;
  logo_url?: string;
  tournament_id: string;
  captain_name?: string;
  contact_email?: string;
  contact_phone?: string;
  players?: Player[];
  created_at: string;
}

export interface Player {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  jersey_number?: number;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicketkeeper';
  batting_style?: string;
  bowling_style?: string;
  is_captain: boolean;
  is_wicketkeeper: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  team1_id: string;
  team2_id: string;
  venue?: string;
  match_date: string;
  status: 'upcoming' | 'live' | 'completed';
  match_type: 'league' | 'quarter_final' | 'semi_final' | 'final' | 'group';
  overs: number;
  team1_score?: number;
  team1_wickets?: number;
  team1_overs?: number;
  team2_score?: number;
  team2_wickets?: number;
  team2_overs?: number;
  winning_team_id?: string;
  created_at: string;
  team1?: Team;
  team2?: Team;
}

export interface TournamentFilters {
  search: string;
  status: string;
  format: string;
} 