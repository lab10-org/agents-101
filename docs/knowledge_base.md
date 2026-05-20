# Knowledge Base

Este archivo lo lee la tool `research_docs` del agente. Edítalo libremente con la información de tu dominio: cuando el agente necesite responder algo que pueda estar aquí, va a llamarla.

## Sobre este proyecto

`agents-101` es un laboratorio para aprender a construir agentes de IA usando el AI SDK de Vercel sobre Next.js 15. La idea es ir agregando capacidades al agente paso a paso.

## Metodología ReAct

ReAct (Reasoning + Acting) combina razonamiento explícito del modelo con acciones a través de herramientas. El agente:

1. Razona sobre el problema.
2. Si necesita información o cálculo externo, llama una tool.
3. Observa el resultado.
4. Continúa razonando o llamando más tools hasta tener suficiente información.
5. Da una respuesta final.

## Tools disponibles

- **`research_docs`**: busca en este mismo archivo. Úsala para responder preguntas sobre el proyecto, su stack, o lo que esté documentado aquí.

## Stack

- **Frontend**: Next.js 15 (App Router, Turbopack), React 19, Tailwind v4.
- **IA**: AI SDK de Vercel (`ai`, `@ai-sdk/react`), provider Google con `@ai-sdk/google`.
- **Modelo por defecto**: `gemini-2.5-flash`.
- **Tipos**: TypeScript con `InferUITools` para type-safety end-to-end entre cliente y servidor.

## Estructura

- `app/api/chat/agent.ts`: definición del agente (modelo, tools, tipos).
- `app/api/chat/route.ts`: route handler con `streamText`.
- `app/page.tsx`: UI del chat con `useChat` y editor de system prompt.
- `docs/`: guía paso a paso y esta base de conocimiento.
