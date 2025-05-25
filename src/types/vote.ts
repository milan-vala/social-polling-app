export interface CastVoteRequest {
  poll_id: number;
  option_id: number;
  user_id: string;
}

export interface DeleteVoteRequest {
  user_id: string;
}

export interface CastVoteResponse {
  id: number;
  poll_id: number;
  option_id: number;
  user_id: string;
  created_at: string;
}

export interface PollVotesResponse {
  poll_id: number;
  total_votes: number;
  votes: {
    id: number;
    option_id: number;
    user_id: string;
    created_at: string;
    option_text: string;
  }[];
}
