import { NextRequest } from "next/server";
import { VoteController } from "@/controllers/vote-controller";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return VoteController.getPollVotes(request, id);
}
