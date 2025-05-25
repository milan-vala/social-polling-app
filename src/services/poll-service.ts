import { supabase } from "@/lib/supabase";
import { Poll, PollInsert, PollUpdate } from "@/types/database";
import {
  CreatePollRequest,
  CreatePollResponse,
  GetPollsResponse,
  UpdatePollRequest,
  DeletePollRequest,
} from "@/types/poll";

export class PollService {
  static async createPoll(
    data: CreatePollRequest
  ): Promise<CreatePollResponse> {
    const { title, options, user_id, description } = data;

    const pollData: PollInsert = {
      title,
      description: description || null,
      created_by: user_id,
    };

    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert(pollData)
      .select()
      .single();

    if (pollError || !poll) {
      throw new Error(pollError?.message || "Poll creation failed");
    }

    const optionsData = options.map((option: string) => ({
      poll_id: poll.id,
      option_text: option,
      vote_count: 0,
    }));

    const { data: createdOptions, error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsData)
      .select();

    if (optionsError) {
      await supabase.from("polls").delete().eq("id", poll.id);
      throw new Error(optionsError.message);
    }

    return {
      poll,
      options: createdOptions,
    };
  }

  static async getAllPolls(): Promise<GetPollsResponse[]> {
    const { data: polls, error } = await supabase
      .from("polls")
      .select(`*, poll_options (id, option_text, vote_count)`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return polls || [];
  }

  static async getPollById(pollId: number): Promise<Poll | null> {
    const { data: poll, error } = await supabase
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }

    return poll;
  }

  static async updatePoll(
    pollId: number,
    data: UpdatePollRequest
  ): Promise<Poll> {
    const { title, description, user_id } = data;

    const existingPoll = await this.getPollById(pollId);
    if (!existingPoll) {
      throw new Error("Poll not found");
    }

    if (existingPoll.created_by !== user_id) {
      throw new Error("Unauthorized: You can only update polls you created");
    }

    const updateData: PollUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const { data: updatedPoll, error } = await supabase
      .from("polls")
      .update(updateData)
      .eq("id", pollId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updatedPoll;
  }

  static async deletePoll(
    pollId: number,
    data: DeletePollRequest
  ): Promise<{ id: number; title: string }> {
    const { user_id } = data;

    const existingPoll = await this.getPollById(pollId);
    if (!existingPoll) {
      throw new Error("Poll not found");
    }

    if (existingPoll.created_by !== user_id) {
      throw new Error("Unauthorized: You can only delete polls you created");
    }

    const { error: votesError } = await supabase
      .from("votes")
      .delete()
      .eq("poll_id", pollId);

    if (votesError) {
      throw new Error("Failed to delete poll votes");
    }

    const { error: optionsError } = await supabase
      .from("poll_options")
      .delete()
      .eq("poll_id", pollId);

    if (optionsError) {
      throw new Error("Failed to delete poll options");
    }

    const { error: pollError } = await supabase
      .from("polls")
      .delete()
      .eq("id", pollId);

    if (pollError) {
      throw new Error("Failed to delete poll");
    }

    return {
      id: pollId,
      title: existingPoll.title,
    };
  }
}
