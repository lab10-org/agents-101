import { google } from "@ai-sdk/google";
import {
  tool,
  type InferUITools,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const agentModel = google("gemini-2.5-flash");

const KNOWLEDGE_BASE_PATH = path.join(
  process.cwd(),
  "docs",
  "knowledge_base.md",
);

export const agentTools = {
  research_docs: tool({
    description:
      "Search the project knowledge base (docs/knowledge_base.md) for information relevant to a query. Returns the full document so you can extract what's relevant.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("What you're looking for in the docs (1-2 line summary)."),
    }),
    execute: async ({ query }) => {
      try {
        const content = await readFile(KNOWLEDGE_BASE_PATH, "utf-8");
        return { query, content };
      } catch (error) {
        return {
          query,
          error:
            error instanceof Error
              ? error.message
              : "Failed to read knowledge base",
        };
      }
    },
  }),
} satisfies ToolSet;

export type ChatUITools = InferUITools<typeof agentTools>;
export type ChatUIMessage = UIMessage<never, UIDataTypes, ChatUITools>;
