export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      battle_history: {
        Row: {
          accuracy_percentage: number
          battle_duration_seconds: number | null
          completed_at: string
          era_name: string
          id: string
          money_earned: number
          questions_correct: number
          questions_total: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          accuracy_percentage: number
          battle_duration_seconds?: number | null
          completed_at?: string
          era_name: string
          id?: string
          money_earned?: number
          questions_correct: number
          questions_total: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          accuracy_percentage?: number
          battle_duration_seconds?: number | null
          completed_at?: string
          era_name?: string
          id?: string
          money_earned?: number
          questions_correct?: number
          questions_total?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      eras: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_items: {
        Row: {
          category: Database["public"]["Enums"]["knowledge_category"]
          content: string | null
          correct_answer: string | null
          created_at: string
          era_id: string
          id: string
          is_verified: boolean
          item_type: Database["public"]["Enums"]["knowledge_item_type"]
          question: string | null
          source: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
          wrong_options: Json
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["knowledge_category"]
          content?: string | null
          correct_answer?: string | null
          created_at?: string
          era_id: string
          id?: string
          is_verified?: boolean
          item_type?: Database["public"]["Enums"]["knowledge_item_type"]
          question?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          wrong_options?: Json
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["knowledge_category"]
          content?: string | null
          correct_answer?: string | null
          created_at?: string
          era_id?: string
          id?: string
          is_verified?: boolean
          item_type?: Database["public"]["Enums"]["knowledge_item_type"]
          question?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          wrong_options?: Json
          year_end?: number | null
          year_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_items_era_id_fkey"
            columns: ["era_id"]
            isOneToOne: false
            referencedRelation: "eras"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          battles_won: number
          created_at: string
          display_name: string | null
          favorite_era: string | null
          id: string
          total_battles: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          battles_won?: number
          created_at?: string
          display_name?: string | null
          favorite_era?: string | null
          id?: string
          total_battles?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          battles_won?: number
          created_at?: string
          display_name?: string | null
          favorite_era?: string | null
          id?: string
          total_battles?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wallet: {
        Row: {
          balance: number
          created_at: string
          id: string
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          battle_id: string | null
          created_at: string
          description: string
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          battle_id?: string | null
          created_at?: string
          description: string
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          battle_id?: string | null
          created_at?: string
          description?: string
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "battle_history"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      knowledge_category: "history" | "finance" | "technology" | "future"
      knowledge_item_type: "fact" | "qa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      knowledge_category: ["history", "finance", "technology", "future"],
      knowledge_item_type: ["fact", "qa"],
    },
  },
} as const
