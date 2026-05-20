# Guía paso a paso: agents-101

Esta guía te lleva desde cero hasta tener el proyecto corriendo en tu máquina con Claude Code como copiloto.

---

## Paso 1 — Instalar Claude Code

Claude Code es el CLI oficial de Anthropic que vas a usar como copiloto durante todo el laboratorio.

1. Abre la guía oficial de instalación: [Claude Code Quickstart](https://code.claude.com/docs/en/quickstart).
2. Sigue las instrucciones para tu sistema operativo (macOS, Linux o Windows).
3. Inicia sesión cuando el CLI te lo pida.

**Verifica que quedó instalado** ejecutando en tu terminal:

```bash
claude --version
```

Si ves un número de versión, ya estás listo para el siguiente paso.

---

## Paso 2 — Clonar el repo e instalar dependencias

Vas a clonar el repositorio directamente desde Claude Code (sin tocar `git` en la terminal) y luego instalar las dependencias con `npm`.

### 2.1 Clonar desde la UI

1. Abre Claude Code (desde la app de escritorio, la extensión del IDE o el CLI).
2. Cuando te pida un directorio de trabajo, elige la opción de **clonar un repositorio desde GitHub**.
3. Pega la URL del repo:

   ```
   https://github.com/lab10-org/agents-101
   ```

4. Selecciona la carpeta local donde quieres que se guarde el proyecto.
5. Espera a que termine la descarga. Claude Code abrirá automáticamente el proyecto en esa carpeta.

Cuando termine, deberías ver los archivos del proyecto (`app/`, `package.json`, `CLAUDE.md`, etc.) en tu editor.

### 2.2 Instalar dependencias con npm

Necesitas tener **Node.js 18 o superior** instalado. Verifícalo con:

```bash
node --version
```

Si no lo tienes, descárgalo desde [nodejs.org](https://nodejs.org/).

Luego, dentro de la carpeta del proyecto, instala las dependencias:

```bash
npm install
```

Esto descarga todo lo que el proyecto necesita (Next.js, AI SDK, Tailwind, etc.) en la carpeta `node_modules/`. Puede tardar un par de minutos la primera vez.

Cuando termine sin errores, ya estás listo para el siguiente paso.

---

## Paso 3 — Crear el agente con metodología ReAct

En este paso le vas a pedir a Claude Code que construya el agente. Vas a usar la **metodología ReAct** (*Reasoning + Acting*): el modelo razona en voz alta, llama herramientas (*tools*), observa los resultados, y decide el siguiente paso hasta resolver la tarea.

Además, vas a poder **configurar el *system prompt* del agente desde la UI**, para experimentar con distintas personalidades y comportamientos sin tocar el código.

### 3.1 Abrir Claude Code en el proyecto

Asegúrate de estar en la carpeta del proyecto y abre Claude Code (por terminal: `claude`, o desde la extensión del IDE).

### 3.2 Pegar este prompt en Claude Code

Copia el siguiente bloque tal cual y pégalo en Claude Code:

````markdown
Quiero construir un agente de IA en este proyecto siguiendo la **metodología ReAct** (Reasoning + Acting), usando el **AI SDK de Vercel** con el provider de Google (Gemini) que ya está instalado.

## Requisitos funcionales

1. **Agente ReAct**: el modelo debe poder razonar, llamar herramientas (tools), observar el resultado y continuar el ciclo hasta dar una respuesta final.
   - Usa `streamText` del AI SDK con `tools` y `stopWhen: stepCountIs(N)` para habilitar el loop multi-paso.
   - **No agregues tools todavía**: deja la estructura preparada (un `agentTools` vacío y los tipos derivados con `InferUITools`) para que pueda añadir mis propias tools después sin reescribir el plomería.
   - El modelo por defecto debe ser `gemini-2.5-flash`.

2. **System prompt configurable desde la UI**:
   - En el chat, el usuario debe poder editar el system prompt antes o durante la conversación (ej: un campo de texto colapsable arriba del chat, o un panel lateral).
   - El system prompt se envía desde el cliente al route handler en cada request.
   - Debe haber un **valor por defecto** razonable que explique al modelo que es un agente ReAct (sin listar tools específicas, porque todavía no hay).
   - Cuando el usuario cambia el system prompt, debe poder **reiniciar la conversación** con un botón claro.

3. **UI del chat**:
   - Usa el hook `useChat` de `@ai-sdk/react` para conectar la UI.
   - Muestra los mensajes del usuario y del asistente con streaming.
   - **Deja preparada la visualización de los pasos del agente**: un renderer genérico para los `dynamic-tool` parts que muestre nombre de la tool, argumentos y resultado en un bloque expandible/colapsable. Cuando agregue tools, ya debe verse en la UI sin tocar nada.
   - Estilo limpio con Tailwind, accesible (labels, focus states, contraste razonable).

## Restricciones

- Sigue las reglas del archivo `CLAUDE.md` del proyecto.
- Usa la skill `ai-sdk` para confirmar la API actual del SDK (especialmente `streamText`, `tools`, `stopWhen`, y `useChat`).
- Usa la skill `web-design-guidelines` para la UI del chat.
- **No sobre-diseñes**: nada de abstracciones especulativas. Edita archivos existentes antes que crear nuevos.
- Comentarios solo cuando el *por qué* no sea obvio.
- Asume que `GOOGLE_GENERATIVE_AI_API_KEY` ya está en `.env.local`. Si no existe, recuérdame configurarla antes de correr el proyecto.

## Entregables

- Un route handler en `app/api/chat/route.ts` con el agente ReAct (sin tools por ahora) y `stopWhen` configurado.
- Un archivo compartido (ej. `app/api/chat/agent.ts`) con el modelo, el system prompt por defecto, el objeto `agentTools` vacío y los tipos `ChatUITools` / `ChatUIMessage` derivados con `InferUITools`.
- La UI del chat actualizada en `app/page.tsx` (o componente equivalente) con el campo para editar el system prompt y el renderer genérico de tool calls listo para cuando agregue tools.
- Instrucciones cortas al final sobre cómo correr el proyecto (`npm run dev`) y probarlo.

Antes de empezar a codificar, dame un plan corto (3-5 puntos) de los archivos que vas a tocar y por qué. Si tienes dudas sobre algún requisito, pregúntame primero.
````

### 3.3 Revisar el plan y aprobar

Claude Code te va a responder con un plan corto antes de codificar. Léelo, haz preguntas si algo no te cuadra, y luego dile que proceda.

### 3.4 Probar el agente

Cuando Claude termine, configura tu API key (si aún no lo has hecho) en el archivo `.env.local`:

`GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui`

Puedes obtener una API key gratis en [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## Paso 4 — Agregar la tool `research_docs`

Ahora le vas a dar al agente una **herramienta real**: `research_docs`. Esta tool lee un archivo `docs/knowledge_base.md` y le permite al agente responder preguntas basadas en esa base de conocimiento — el patrón mínimo de un agente con acceso a datos del proyecto.

### 4.1 Crear el archivo de conocimiento

Crea (o edita) `docs/knowledge_base.md` con la información que quieras que el agente conozca. Algunos ejemplos de contenido útil:

- Descripción del proyecto y su stack.
- Convenciones del equipo (estilo de código, naming, branching).
- FAQ del producto.
- Glosario de términos del dominio.

El agente va a recibir todo el archivo cuando llame la tool, así que mantenlo enfocado (un par de páginas a lo sumo).

### 4.2 Pegar este prompt en Claude Code

````markdown
Quiero agregar una nueva tool al agente que ya construimos, llamada **`research_docs`**.

## Comportamiento de la tool

- **Nombre**: `research_docs`.
- **Input**: un objeto con un campo `query` (string) — una descripción corta de qué está buscando el agente.
- **Comportamiento**: lee el archivo `docs/knowledge_base.md` desde el filesystem y devuelve su contenido completo junto con el `query` original.
- **Errores**: si el archivo no existe o no se puede leer, devuelve un objeto `{ query, error }` en vez de tirar excepción.

## Dónde hacer los cambios

- Agrega la tool en `app/api/chat/agent.ts` dentro del objeto `agentTools`, manteniendo el `satisfies ToolSet` y los tipos `ChatUITools` / `ChatUIMessage` ya existentes.
- Actualiza el `DEFAULT_SYSTEM_PROMPT` para mencionar que el agente tiene acceso a `research_docs` y cuándo usarla.
- En `app/page.tsx`, agrega un `case "tool-research_docs"` al switch del renderer de partes, reusando el componente que ya muestra los tool calls (input + output + estado). No dupliques la UI.
- Resuelve la ruta del archivo con `path.join(process.cwd(), "docs", "knowledge_base.md")` y lee con `node:fs/promises`.

## Restricciones

- Sigue las reglas del archivo `CLAUDE.md`.
- Usa la skill `ai-sdk` si tienes dudas sobre `tool()`, `inputSchema`, o el rendering de `tool-*` parts en el cliente.
- No agregues caching ni búsqueda fuzzy todavía — devolver el archivo completo es suficiente para esta iteración.
- Comentarios solo si el *por qué* no es obvio.

## Entregables

- `app/api/chat/agent.ts` actualizado con la tool `research_docs`.
- `app/page.tsx` actualizado para renderizar el tool call tipado.
- Sin cambios en `route.ts` (las tools se inyectan desde `agentTools`).

Antes de codificar, dame un plan corto. Si tienes dudas sobre la forma del output o cómo resolver la ruta, pregúntame.
````

---
