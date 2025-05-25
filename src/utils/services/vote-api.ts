import { ApiClient } from "../api-client";
import {
  CastVoteRequest,
  CastVoteResponse,
  PollVotesResponse,
  DeleteVoteRequest,
} from "@/types/vote";

export class VoteApi extends ApiClient {
  async castVote(data: CastVoteRequest) {
    return this.request<CastVoteResponse, CastVoteRequest>("/api/votes", {
      method: "POST",
      body: data,
    });
  }

  async getPollVotes(pollId: number) {
    return this.request<PollVotesResponse>(`/api/polls/${pollId}/votes`);
  }

  async deleteVote(id: number, data: DeleteVoteRequest) {
    return this.request<{ id: number }, DeleteVoteRequest>(`/api/votes/${id}`, {
      method: "DELETE",
      body: data,
    });
  }
}
