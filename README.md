# Habla con la Máquina

Interfaz de chat construida con Next.js (App Router) y React, conectada a la API de Groq mediante `fetch` puro (sin SDKs). Proyecto educativo centrado en el flujo `fetch` + `async/await`, gestión de estado con hooks, persistencia en `localStorage` y métricas de uso de tokens.

## Instalación

```bash
pnpm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```env
GROQ_API_KEY=tu_api_key
```

La clave se usa exclusivamente en el servidor (ruta `/api/chat`) y nunca se expone al navegador. Consulta `.env.example` como referencia.

## Ejecución

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Otros scripts

```bash
pnpm build   # build de producción
pnpm start   # arranca el build de producción
pnpm lint    # ESLint (flat config, next lint fue eliminado en Next.js 16)
```

## Arquitectura

```text
Navegador (componentes cliente)
        ↓ fetch("/api/chat")
Next.js API Route (app/api/chat/route.ts) — usa GROQ_API_KEY
        ↓ fetch a la API de Groq
https://api.groq.com/openai/v1/chat/completions
```

El frontend nunca llama directamente a Groq ni accede a `process.env.GROQ_API_KEY`. La ruta de API valida el cuerpo de la petición, llama a Groq con `Authorization: Bearer`, mide el tiempo de respuesta y devuelve al cliente únicamente el mensaje del asistente, el `usage` y el modelo usado.

El modelo se centraliza en `GROQ_MODEL` (`lib/groq.ts`), actualmente `meta-llama/llama-4-scout-17b-16e-instruct`.

## Funcionalidades

- **Chat**: envío de mensajes con Enter (Shift+Enter para salto de línea), estado de carga ("Pensando…"), autoscroll y bloqueo de envíos simultáneos.
- **Historial stateless**: cada petición a `/api/chat` envía el array completo de mensajes de la conversación (Groq no mantiene estado).
- **Persistencia**: la conversación se guarda en `localStorage` (`chat-messages`) y sobrevive a recargas. El botón "Borrar conversación" limpia mensajes, estadísticas y `localStorage`.
- **Tokens**: los valores de `prompt`, `completion` y `total` provienen directamente del campo `usage` que devuelve Groq (nunca se estiman a partir de `texto.length`). Se muestran tanto por mensaje (última petición) como acumulados de toda la sesión.
- **Métricas adicionales**: modelo usado, tiempo de la última respuesta y tokens/s estimados, visibles en el panel lateral de estadísticas.
- **Errores**: mensajes legibles para clave ausente, errores HTTP (401, 429, etc.), respuestas con formato inesperado y fallos de red, sin filtrar información sensible. Si una petición falla, el mensaje del usuario se conserva en el historial para poder reintentar.

## Estructura relevante

```text
app/
  api/chat/route.ts    # única ruta con acceso a GROQ_API_KEY
  page.tsx             # estado de la conversación (mensajes, input, loading, error, usage)
components/
  chat-thread.tsx       # lista de mensajes + input + error
  chat-message.tsx       # una burbuja de mensaje
  chat-input.tsx         # textarea + botón enviar
  loading-indicator.tsx  # "Pensando…"
  token-sidebar.tsx      # panel de estadísticas de tokens
lib/
  groq.ts   # GROQ_MODEL, tipos de la API de Groq
  types.ts  # Message, UsageStats, tipos de /api/chat
```
