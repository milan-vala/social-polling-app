export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      poll_options: {
        Row: {
          id: number;
          poll_id: number;
          option_text: string;
          vote_count: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          poll_id: number;
          option_text: string;
          vote_count?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          poll_id?: number;
          option_text?: string;
          vote_count?: number;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: number;
          poll_id: number;
          option_id: number;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          poll_id: number;
          option_id: number;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          poll_id?: number;
          option_id?: number;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
