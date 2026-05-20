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
