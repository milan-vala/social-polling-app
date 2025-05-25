"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GetPollsResponse } from "@/types/poll";

export function useRealtimePolls(initialPolls: GetPollsResponse[]) {
  const [polls, setPolls] = useState<GetPollsResponse[]>(initialPolls);

  useEffect(() => {
    const subscription = supabase
      .channel("poll_options_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "poll_options",
        },
        (payload) => {
          console.log("Poll option updated -", payload);
          setPolls((currentPolls) =>
            currentPolls.map((poll) => ({
              ...poll,
              poll_options: poll.poll_options.map((option) =>
                option.id === payload.new.id
                  ? { ...option, vote_count: payload.new.vote_count }
                  : option
              ),
            }))
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return polls;
}
