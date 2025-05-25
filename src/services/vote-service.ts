import { supabase } from "@/lib/supabase";
import { Vote, VoteInsert } from "@/types/database";
import {
  CastVoteRequest,
  CastVoteResponse,
  PollVotesResponse,
  DeleteVoteRequest,
} from "@/types/vote";

export class VoteService {
  static async castVote(data: CastVoteRequest): Promise<CastVoteResponse> {
    const { poll_id, option_id, user_id } = data;

    const { data: existingVote, error: voteCheckError } = await supabase
      .from("votes")
      .select("id")
      .eq("poll_id", poll_id)
      .eq("user_id", user_id)
      .single();

    if (voteCheckError && voteCheckError.code !== "PGRST116") {
      throw new Error("Error checking existing vote");
    }

    if (existingVote) {
      throw new Error("User has already voted on this poll");
    }

    const { data: option, error: optionError } = await supabase
      .from("poll_options")
      .select("poll_id")
      .eq("id", option_id)
      .single();

    if (optionError || !option) {
      throw new Error("Invalid option ID");
    }

    if (option.poll_id !== poll_id) {
      throw new Error("Option does not belong to the specified poll");
    }

    const voteData: VoteInsert = {
      poll_id,
      option_id,
      user_id,
    };

    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert(voteData)
      .select()
      .single();

    if (voteError) {
      throw new Error(voteError.message);
    }

    const { data: currentOption, error: fetchError } = await supabase
      .from("poll_options")
      .select("vote_count")
      .eq("id", option_id)
      .single();

    if (fetchError) {
      await supabase.from("votes").delete().eq("id", vote.id);
      throw new Error("Failed to fetch current vote count");
    }

    const { error: updateError } = await supabase
      .from("poll_options")
      .update({ vote_count: (currentOption.vote_count || 0) + 1 })
      .eq("id", option_id);

    if (updateError) {
      await supabase.from("votes").delete().eq("id", vote.id);
      throw new Error("Failed to update vote count");
    }

    return vote;
  }

  static async getPollVotes(pollId: number): Promise<PollVotesResponse> {
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select(
        `
        id,
        option_id,
        user_id,
        created_at,
        poll_options!inner(option_text)
      `
      )
      .eq("poll_id", pollId)
      .order("created_at", { ascending: false });

    if (votesError) {
      throw new Error(votesError.message);
    }

    const totalVotes = votes?.length || 0;

    const formattedVotes =
      votes?.map((vote) => ({
        id: vote.id,
        option_id: vote.option_id,
        user_id: vote.user_id,
        created_at: vote.created_at,
        option_text: (vote.poll_options as any).option_text,
      })) || [];

    return {
      poll_id: pollId,
      total_votes: totalVotes,
      votes: formattedVotes,
    };
  }

  static async getVoteById(voteId: number): Promise<Vote | null> {
    const { data: vote, error } = await supabase
      .from("votes")
      .select("*")
      .eq("id", voteId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }

    return vote;
  }

  static async deleteVote(
    voteId: number,
    data: DeleteVoteRequest
  ): Promise<{ id: number }> {
    const { user_id } = data;

    const existingVote = await this.getVoteById(voteId);
    if (!existingVote) {
      throw new Error("Vote not found");
    }

    if (existingVote.user_id !== user_id) {
      throw new Error("Unauthorized: You can only delete your own votes");
    }

    const { data: currentOption, error: fetchError } = await supabase
      .from("poll_options")
      .select("vote_count")
      .eq("id", existingVote.option_id)
      .single();

    if (fetchError) {
      throw new Error("Failed to fetch current vote count");
    }

    const { error: updateError } = await supabase
      .from("poll_options")
      .update({ vote_count: Math.max(0, (currentOption.vote_count || 0) - 1) })
      .eq("id", existingVote.option_id);

    if (updateError) {
      throw new Error("Failed to update vote count");
    }

    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("id", voteId);

    if (deleteError) {
      await supabase
        .from("poll_options")
        .update({ vote_count: currentOption.vote_count || 0 })
        .eq("id", existingVote.option_id);

      throw new Error("Failed to delete vote");
    }

    return { id: voteId };
  }
}
