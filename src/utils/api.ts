import { AuthApi } from "./services/auth-api";
import { PollApi } from "./services/poll-api";
import { VoteApi } from "./services/vote-api";

export const authApi = new AuthApi();
export const pollApi = new PollApi();
export const voteApi = new VoteApi();

export const api = {
  auth: authApi,
  polls: pollApi,
  votes: voteApi,
};
