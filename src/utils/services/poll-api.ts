import { ApiClient } from "../api-client";
import {
  CreatePollRequest,
  CreatePollResponse,
  GetPollsResponse,
  UpdatePollRequest,
  DeletePollRequest,
} from "@/types/poll";

export class PollApi extends ApiClient {
  async createPoll(data: CreatePollRequest) {
    return this.request<CreatePollResponse, CreatePollRequest>("/api/polls", {
      method: "POST",
      body: data,
    });
  }

  async getPolls() {
    return this.request<GetPollsResponse[]>("/api/polls");
  }

  async getPoll(id: number) {
    return this.request<GetPollsResponse>(`/api/polls/${id}`);
  }

  async updatePoll(id: number, data: UpdatePollRequest) {
    return this.request<GetPollsResponse, UpdatePollRequest>(
      `/api/polls/${id}`,
      {
        method: "PATCH",
        body: data,
      }
    );
  }

  async deletePoll(id: number, data: DeletePollRequest) {
    return this.request<{ id: number; title: string }, DeletePollRequest>(
      `/api/polls/${id}`,
      {
        method: "DELETE",
        body: data,
      }
    );
  }
}
