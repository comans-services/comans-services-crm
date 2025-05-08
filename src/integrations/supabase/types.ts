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
      app_user: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_active: string | null
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_active?: string | null
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_active?: string | null
          last_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      deal_stage: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      engagement_stage: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      file_attachment: {
        Row: {
          file_name: string
          file_url: string
          id: string
          prospect_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_url: string
          id?: string
          prospect_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_url?: string
          id?: string
          prospect_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_attachment_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_attachment_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_source: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      persona: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      prospect_engagement: {
        Row: {
          created_at: string
          engagement_stage_id: string | null
          id: string
          last_contact_date: string | null
          prospect_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          engagement_stage_id?: string | null
          id?: string
          last_contact_date?: string | null
          prospect_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          engagement_stage_id?: string | null
          id?: string
          last_contact_date?: string | null
          prospect_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospect_engagement_engagement_stage_id_fkey"
            columns: ["engagement_stage_id"]
            isOneToOne: false
            referencedRelation: "engagement_stage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_engagement_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      prospect_profile: {
        Row: {
          address: string | null
          client_since: string | null
          company: string | null
          created_at: string
          deal_stage_id: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          lead_source_id: string | null
          persona_id: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          client_since?: string | null
          company?: string | null
          created_at?: string
          deal_stage_id?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          lead_source_id?: string | null
          persona_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          client_since?: string | null
          company?: string | null
          created_at?: string
          deal_stage_id?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          lead_source_id?: string | null
          persona_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospect_profile_deal_stage_id_fkey"
            columns: ["deal_stage_id"]
            isOneToOne: false
            referencedRelation: "deal_stage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_profile_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "lead_source"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_profile_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "persona"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_tracking: {
        Row: {
          body_text: string | null
          created_at: string
          date_of_communication: string
          id: string
          prospect_id: string
          salesperson_email: string
          subject_text: string
          updated_at: string
        }
        Insert: {
          body_text?: string | null
          created_at?: string
          date_of_communication?: string
          id?: string
          prospect_id: string
          salesperson_email: string
          subject_text: string
          updated_at?: string
        }
        Update: {
          body_text?: string | null
          created_at?: string
          date_of_communication?: string
          id?: string
          prospect_id?: string
          salesperson_email?: string
          subject_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_tracking_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      today_tasks: {
        Row: {
          completed: boolean
          created_at: string
          due_date: string
          id: string
          priority: string
          prospect_id: string
          task_description: string
          task_type: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          due_date?: string
          id?: string
          priority: string
          prospect_id: string
          task_description: string
          task_type: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          due_date?: string
          id?: string
          priority?: string
          prospect_id?: string
          task_description?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "today_tasks_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_detail: Json | null
          activity_type: string
          id: string
          occurred_at: string
          user_id: string
        }
        Insert: {
          activity_detail?: Json | null
          activity_type: string
          id?: string
          occurred_at?: string
          user_id: string
        }
        Update: {
          activity_detail?: Json | null
          activity_type?: string
          id?: string
          occurred_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_sales_tracking: {
        Row: {
          address: string | null
          body_text: string | null
          client_since: string | null
          company: string | null
          created_at: string | null
          date_of_communication: string | null
          days_since_contact: number | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          phone: string | null
          prospect_id: string | null
          salesperson_email: string | null
          status_colour: string | null
          subject_text: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_tracking_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospect_profile"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_contact_status_color: {
        Args: { days_since_last_contact: number }
        Returns: string
      }
      get_days_since_last_contact: {
        Args: { last_contact: string }
        Returns: number
      }
    }
    Enums: {
      user_role: "admin" | "salesperson"
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
      user_role: ["admin", "salesperson"],
    },
  },
} as const
