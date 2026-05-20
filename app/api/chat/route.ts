import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { agentModel, agentTools, type ChatUIMessage } from "./agent";
import { DEFAULT_SYSTEM_PROMPT } from "./system-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    systemPrompt,
  }: { messages: ChatUIMessage[]; systemPrompt?: string } = await req.json();

  const result = streamText({
    model: agentModel,
    system: systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    tools: agentTools,
  });

  return result.toUIMessageStreamResponse();
}
