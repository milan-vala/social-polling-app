import { NextRequest } from "next/server";
import { PollController } from "@/controllers/poll-controller";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return PollController.updatePoll(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return PollController.deletePoll(request, id);
}
