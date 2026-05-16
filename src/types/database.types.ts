export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          experience_level: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          experience_level?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          experience_level?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          location: string | null;
          goal: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          location?: string | null;
          goal?: string | null;
          status?: string;
        };
        Update: {
          name?: string;
          location?: string | null;
          goal?: string | null;
          status?: string;
        };
      };
      project_land_details: {
        Row: {
          id: string;
          project_id: string;
          details: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          details: Json;
        };
        Update: {
          details?: Json;
        };
      };
      farming_plans: {
        Row: {
          id: string;
          project_id: string;
          plan: Json;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          plan: Json;
          status?: string;
        };
        Update: {
          plan?: Json;
          status?: string;
        };
      };
      farming_steps: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: string;
          due_label: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: string;
          due_label?: string | null;
        };
        Update: {
          status?: string;
          description?: string | null;
          due_label?: string | null;
        };
      };
      troubleshooting_chats: {
        Row: {
          id: string;
          project_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          role: "user" | "assistant";
          content: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
