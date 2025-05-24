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

type Tables = Database["public"]["Tables"];

export type Poll = Tables["polls"]["Row"];
export type PollInsert = Tables["polls"]["Insert"];
export type PollUpdate = Tables["polls"]["Update"];

export type Option = Tables["poll_options"]["Row"];
export type OptionInsert = Tables["poll_options"]["Insert"];
export type OptionUpdate = Tables["poll_options"]["Update"];

export type Vote = Tables["votes"]["Row"];
export type VoteInsert = Tables["votes"]["Insert"];
export type VoteUpdate = Tables["votes"]["Update"];

export interface User {
  id: string;
  email: string;
  created_at: string;
}
