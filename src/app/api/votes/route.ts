import { NextRequest } from "next/server";
import { VoteController } from "@/controllers/vote-controller";

export async function POST(request: NextRequest) {
  return VoteController.castVote(request);
}
