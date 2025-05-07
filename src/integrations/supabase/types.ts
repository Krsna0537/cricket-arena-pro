export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ball_by_ball: {
        Row: {
          ball: number
          ball_number: number
          batsman_id: string
          batting_team_id: string | null
          bowler_id: string
          bowling_team_id: string | null
          created_at: string | null
          event_type: string
          extras: number
          extras_type: string | null
          fielder_id: string | null
          id: string
          inning: number | null
          is_striker: boolean
          match_id: string | null
          non_striker_id: string | null
          over: number
          runs: number
          team_id: string | null
          updated_at: string | null
          wicket_type: string | null
        }
        Insert: {
          ball?: number
          ball_number: number
          batsman_id: string
          batting_team_id?: string | null
          bowler_id: string
          bowling_team_id?: string | null
          created_at?: string | null
          event_type?: string
          extras?: number
          extras_type?: string | null
          fielder_id?: string | null
          id?: string
          inning?: number | null
          is_striker?: boolean
          match_id?: string | null
          non_striker_id?: string | null
          over?: number
          runs?: number
          team_id?: string | null
          updated_at?: string | null
          wicket_type?: string | null
        }
        Update: {
          ball?: number
          ball_number?: number
          batsman_id?: string
          batting_team_id?: string | null
          bowler_id?: string
          bowling_team_id?: string | null
          created_at?: string | null
          event_type?: string
          extras?: number
          extras_type?: string | null
          fielder_id?: string | null
          id?: string
          inning?: number | null
          is_striker?: boolean
          match_id?: string | null
          non_striker_id?: string | null
          over?: number
          runs?: number
          team_id?: string | null
          updated_at?: string | null
          wicket_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ball_by_ball_batsman_id_fkey"
            columns: ["batsman_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_by_ball_batting_team_id_fkey"
            columns: ["batting_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_by_ball_bowler_id_fkey"
            columns: ["bowler_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_by_ball_bowling_team_id_fkey"
            columns: ["bowling_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_by_ball_fielder_id_fkey"
            columns: ["fielder_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_by_ball_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ball_by_ball_non_striker_id_fkey"
            columns: ["non_striker_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      innings_summary: {
        Row: {
          batting_team_id: string | null
          created_at: string | null
          extras: number | null
          id: string
          match_id: string | null
          overs: number | null
          target: number | null
          total_runs: number | null
          updated_at: string | null
          wickets: number | null
        }
        Insert: {
          batting_team_id?: string | null
          created_at?: string | null
          extras?: number | null
          id?: string
          match_id?: string | null
          overs?: number | null
          target?: number | null
          total_runs?: number | null
          updated_at?: string | null
          wickets?: number | null
        }
        Update: {
          batting_team_id?: string | null
          created_at?: string | null
          extras?: number | null
          id?: string
          match_id?: string | null
          overs?: number | null
          target?: number | null
          total_runs?: number | null
          updated_at?: string | null
          wickets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "innings_summary_batting_team_id_fkey"
            columns: ["batting_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "innings_summary_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_scores: {
        Row: {
          created_at: string
          id: string
          match_id: string
          overs: number | null
          runs: number | null
          team_id: string
          updated_at: string
          wickets: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          overs?: number | null
          runs?: number | null
          team_id: string
          updated_at?: string
          wickets?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          overs?: number | null
          runs?: number | null
          team_id?: string
          updated_at?: string
          wickets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_scores_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scores_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          date: string
          id: string
          result: string | null
          status: string
          team1_id: string
          team2_id: string
          tournament_id: string
          updated_at: string
          venue: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          result?: string | null
          status?: string
          team1_id: string
          team2_id: string
          tournament_id: string
          updated_at?: string
          venue: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          result?: string | null
          status?: string
          team1_id?: string
          team2_id?: string
          tournament_id?: string
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_team1_id_fkey"
            columns: ["team1_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team2_id_fkey"
            columns: ["team2_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      player_match_performance: {
        Row: {
          balls_faced: number | null
          catches: number | null
          created_at: string | null
          fours: number | null
          id: string
          match_id: string | null
          overs_bowled: number | null
          player_id: string | null
          run_outs: number | null
          runs_conceded: number | null
          runs_scored: number | null
          sixes: number | null
          updated_at: string | null
          wickets: number | null
        }
        Insert: {
          balls_faced?: number | null
          catches?: number | null
          created_at?: string | null
          fours?: number | null
          id?: string
          match_id?: string | null
          overs_bowled?: number | null
          player_id?: string | null
          run_outs?: number | null
          runs_conceded?: number | null
          runs_scored?: number | null
          sixes?: number | null
          updated_at?: string | null
          wickets?: number | null
        }
        Update: {
          balls_faced?: number | null
          catches?: number | null
          created_at?: string | null
          fours?: number | null
          id?: string
          match_id?: string | null
          overs_bowled?: number | null
          player_id?: string | null
          run_outs?: number | null
          runs_conceded?: number | null
          runs_scored?: number | null
          sixes?: number | null
          updated_at?: string | null
          wickets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_match_performance_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_performance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          best_bowling: string | null
          catches: number | null
          created_at: string
          fours: number | null
          highest_score: number | null
          id: string
          matches: number | null
          player_id: string
          runs: number | null
          sixes: number | null
          updated_at: string
          wickets: number | null
        }
        Insert: {
          best_bowling?: string | null
          catches?: number | null
          created_at?: string
          fours?: number | null
          highest_score?: number | null
          id?: string
          matches?: number | null
          player_id: string
          runs?: number | null
          sixes?: number | null
          updated_at?: string
          wickets?: number | null
        }
        Update: {
          best_bowling?: string | null
          catches?: number | null
          created_at?: string
          fours?: number | null
          highest_score?: number | null
          id?: string
          matches?: number | null
          player_id?: string
          runs?: number | null
          sixes?: number | null
          updated_at?: string
          wickets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          name: string
          role: string
          team_id: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id?: string
          name: string
          role: string
          team_id: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          profile_picture: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          profile_picture?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_picture?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      target_scores: {
        Row: {
          created_at: string | null
          id: string
          innings_number: number
          match_id: string
          target_runs: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          innings_number?: number
          match_id: string
          target_runs?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          innings_number?: number
          match_id?: string
          target_runs?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "target_scores_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      team_performances: {
        Row: {
          created_at: string
          id: string
          lost: number | null
          matches_played: number | null
          net_run_rate: number | null
          points: number | null
          team_id: string
          tournament_id: string
          updated_at: string
          won: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          lost?: number | null
          matches_played?: number | null
          net_run_rate?: number | null
          points?: number | null
          team_id: string
          tournament_id: string
          updated_at?: string
          won?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          lost?: number | null
          matches_played?: number | null
          net_run_rate?: number | null
          points?: number | null
          team_id?: string
          tournament_id?: string
          updated_at?: string
          won?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_performances_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_performances_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          logo: string | null
          name: string
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo?: string | null
          name: string
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_participants: {
        Row: {
          id: string
          joined_at: string
          tournament_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          tournament_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          access_code: string | null
          created_at: string
          creator_id: string
          end_date: string
          id: string
          name: string
          start_date: string
          status: string
          type: string
          updated_at: string
          venue_city: string
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          creator_id: string
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: string
          type: string
          updated_at?: string
          venue_city: string
        }
        Update: {
          access_code?: string | null
          created_at?: string
          creator_id?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          venue_city?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_innings_summary: {
        Args: { match_id_param: string; inning_param: number }
        Returns: {
          total_runs: number
          total_wickets: number
          total_overs: number
          extras: number
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      user_has_tournament_access: {
        Args: { tournament_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "creator" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["creator", "viewer"],
    },
  },
} as const
