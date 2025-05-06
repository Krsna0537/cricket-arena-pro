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
      innings_summary: {
        Row: {
          match_id: string;
          inning: number;
          runs: number;
          wickets: number;
          overs: number;
          updated_at: string;
        }
        Insert: {
          match_id: string;
          inning: number;
          runs: number;
          wickets: number;
          overs: number;
          updated_at?: string;
        }
        Update: {
          match_id?: string;
          inning?: number;
          runs?: number;
          wickets?: number;
          overs?: number;
          updated_at?: string;
        }
        Relationships: [
          {
            foreignKeyName: "innings_summary_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
        ]
      }
      ball_by_ball: {
        Row: {
          id: string;
          match_id: string;
          team_id: string;
          inning: number;
          over: number;
          ball: number;
          event_type: string;
          runs: number;
          extras: number;
          batsman_id: string;
          bowler_id: string;
          is_striker: boolean;
          created_at: string;
          updated_at: string;
        }
        Insert: {
          id?: string;
          match_id: string;
          team_id: string;
          inning: number;
          over: number;
          ball: number;
          event_type: string;
          runs: number;
          extras: number;
          batsman_id: string;
          bowler_id: string;
          is_striker: boolean;
          created_at?: string;
          updated_at?: string;
        }
        Update: {
          id?: string;
          match_id?: string;
          team_id?: string;
          inning?: number;
          over?: number;
          ball?: number;
          event_type?: string;
          runs?: number;
          extras?: number;
          batsman_id?: string;
          bowler_id?: string;
          is_striker?: boolean;
          created_at?: string;
          updated_at?: string;
        }
        Relationships: [
          {
            foreignKeyName: "ball_by_ball_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ball_by_ball_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
