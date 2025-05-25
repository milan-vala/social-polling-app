import { NextRequest } from "next/server";
import { PollController } from "@/controllers/poll-controller";

export async function POST(request: NextRequest) {
  return PollController.createPoll(request);
}

export async function GET(request: NextRequest) {
  return PollController.getAllPolls(request);
}
