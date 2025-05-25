export interface CreatePollRequest {
  title: string;
  description?: string;
  options: string[];
  user_id: string;
}

export interface CreatePollResponse {
  poll: {
    id: number;
    title: string;
    description: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
  };
  options: {
    id: number;
    poll_id: number;
    option_text: string;
    vote_count: number;
    created_at: string;
  }[];
}

export interface GetPollsResponse {
  id: number;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  poll_options: {
    id: number;
    option_text: string;
    vote_count: number;
  }[];
}

export interface UpdatePollRequest {
  title?: string;
  description?: string;
  user_id: string;
}

export interface DeletePollRequest {
  user_id: string;
}
