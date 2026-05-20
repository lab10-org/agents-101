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
