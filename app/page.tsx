"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState } from "react";
import type { ChatUIMessage } from "./api/chat/agent";
import { DEFAULT_SYSTEM_PROMPT } from "./api/chat/system-prompt";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const systemPromptRef = useRef(systemPrompt);
  systemPromptRef.current = systemPrompt;

  const [input, setInput] = useState("");
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const { messages, sendMessage, status, stop, setMessages, error } =
    useChat<ChatUIMessage>({
      transport: new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ systemPrompt: systemPromptRef.current }),
      }),
    });

  const isBusy = status === "submitted" || status === "streaming";

  const handleReset = () => {
    if (isBusy) stop();
    setMessages([]);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 py-6 sm:py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Agente ReAct
        </h1>
        <p className="text-sm text-foreground/60">
          Razonamiento + herramientas con AI SDK + Gemini 2.5 Flash.
        </p>
      </header>

      <SystemPromptPanel
        open={showSystemPrompt}
        onToggle={() => setShowSystemPrompt((v) => !v)}
        value={systemPrompt}
        onChange={setSystemPrompt}
        onReset={handleReset}
        onRestoreDefault={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
      />

      <section
        aria-label="Conversación"
        className="flex flex-1 flex-col gap-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {isBusy && (
          <div className="flex items-center gap-2 text-xs text-foreground/60">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-foreground/40" />
            {status === "submitted" ? "Pensando…" : "Respondiendo…"}
            <button
              type="button"
              onClick={() => stop()}
              className="ml-2 rounded border border-foreground/20 px-2 py-0.5 text-xs hover:bg-foreground/5"
            >
              Detener
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300"
          >
            Ocurrió un error al contactar el modelo. Revisa la consola.
          </div>
        )}
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = input.trim();
          if (!text || isBusy) return;
          sendMessage({ text });
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          aria-label="Mensaje al agente"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregúntale algo al agente…"
          disabled={isBusy}
          className="flex-1 rounded-md border border-foreground/15 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isBusy}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}

function SystemPromptPanel({
  open,
  onToggle,
  value,
  onChange,
  onReset,
  onRestoreDefault,
}: {
  open: boolean;
  onToggle: () => void;
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;
  onRestoreDefault: () => void;
}) {
  return (
    <div className="rounded-lg border border-foreground/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium hover:bg-foreground/5"
      >
        <span>System prompt</span>
        <span
          aria-hidden
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        >
          ▶
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-2 border-t border-foreground/10 p-4">
          <label htmlFor="system-prompt" className="text-xs text-foreground/60">
            Se envía al modelo en cada request. Cámbialo en vivo, pero reinicia
            la conversación para verlo aplicado desde cero.
          </label>
          <textarea
            id="system-prompt"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={8}
            className="w-full resize-y rounded-md border border-foreground/15 bg-background p-3 font-mono text-xs leading-relaxed outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onReset}
              className="rounded-md border border-foreground/20 px-3 py-1.5 text-xs hover:bg-foreground/5"
            >
              Reiniciar conversación
            </button>
            <button
              type="button"
              onClick={onRestoreDefault}
              className="rounded-md border border-foreground/20 px-3 py-1.5 text-xs hover:bg-foreground/5"
            >
              Restaurar prompt por defecto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-foreground/50">
      <p>Empieza la conversación con el agente. Algunos ejemplos:</p>
      <ul className="text-xs">
        <li>&quot;¿De qué trata este proyecto?&quot;</li>
        <li>&quot;¿Qué stack usa agents-101?&quot;</li>
        <li>&quot;Explícame la metodología ReAct.&quot;</li>
      </ul>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatUIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-foreground text-background"
            : "bg-background border border-foreground/10"
        }`}
      >
        <div className="mb-1 text-[10px] uppercase tracking-wider opacity-60">
          {isUser ? "Tú" : "Agente"}
        </div>
        <div className="flex flex-col gap-2">
          {message.parts.map((part, index) => (
            <MessagePart
              key={`${message.id}-${index}`}
              part={part}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type Part = ChatUIMessage["parts"][number];

function MessagePart({ part, index }: { part: Part; index: number }) {
  switch (part.type) {
    case "text":
      return <p className="whitespace-pre-wrap">{part.text}</p>;

    case "reasoning":
      return (
        <pre className="whitespace-pre-wrap rounded bg-foreground/5 p-2 text-xs italic opacity-80">
          {part.text}
        </pre>
      );

    case "step-start":
      return index > 0 ? (
        <hr className="my-1 border-foreground/10" />
      ) : null;

    case "tool-research_docs":
      return <ToolCallBox name="research_docs" part={part} />;

    case "dynamic-tool":
      return <ToolCallBox name={part.toolName} part={part} />;

    default:
      return null;
  }
}

type ToolPartShape = {
  state: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function ToolCallBox({ name, part }: { name: string; part: ToolPartShape }) {
  return (
    <details className="rounded border border-foreground/15 bg-foreground/5 text-xs">
      <summary className="flex cursor-pointer items-center justify-between gap-2 px-2 py-1.5">
        <span className="font-mono">
          <span className="opacity-60">tool</span> · {name}
        </span>
        <span className="rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
          {labelForState(part.state)}
        </span>
      </summary>
      <div className="flex flex-col gap-2 border-t border-foreground/10 px-2 py-2">
        {part.input !== undefined && (
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wider opacity-60">
              Input
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-background/60 p-2 font-mono text-[11px]">
              {JSON.stringify(part.input, null, 2)}
            </pre>
          </div>
        )}
        {part.state === "output-available" && (
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wider opacity-60">
              Output
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-background/60 p-2 font-mono text-[11px]">
              {JSON.stringify(part.output, null, 2)}
            </pre>
          </div>
        )}
        {part.state === "output-error" && (
          <div className="text-red-600 dark:text-red-300">
            Error: {part.errorText}
          </div>
        )}
      </div>
    </details>
  );
}

function labelForState(state: string): string {
  switch (state) {
    case "input-streaming":
      return "preparando";
    case "input-available":
      return "ejecutando";
    case "output-available":
      return "listo";
    case "output-error":
      return "error";
    default:
      return state;
  }
}
