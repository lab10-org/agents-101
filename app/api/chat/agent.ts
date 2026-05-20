import { google } from "@ai-sdk/google";
import {
  type InferUITools,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
} from "ai";

export const DEFAULT_SYSTEM_PROMPT = `Eres un agente de IA que sigue la metodología ReAct (Reasoning + Acting).

En cada turno:
1. Razona explícitamente sobre lo que te piden y qué información necesitas.
2. Si tienes herramientas disponibles y necesitas datos externos o cálculos, llama a la herramienta que aplique.
3. Observa el resultado de la herramienta.
4. Sigue razonando o llama otra herramienta si hace falta.
5. Cuando tengas suficiente información, da una respuesta final clara al usuario.

Responde siempre en el idioma del usuario.`;

export const agentModel = google("gemini-2.5-flash");

export const agentTools = {} satisfies ToolSet;

export type ChatUITools = InferUITools<typeof agentTools>;
export type ChatUIMessage = UIMessage<never, UIDataTypes, ChatUITools>;
