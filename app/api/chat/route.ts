import { NextResponse } from 'next/server'
import { GROQ_API_URL, GROQ_MODEL, type GroqChatCompletionResponse, type GroqMessage } from '@/lib/groq'

function isValidMessage(value: unknown): value is GroqMessage {
  if (!value || typeof value !== 'object') return false
  const m = value as Record<string, unknown>
  return (
    (m.role === 'user' || m.role === 'assistant') &&
    typeof m.content === 'string' &&
    m.content.trim().length > 0
  )
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'El cuerpo de la petición no es un JSON válido.' }, { status: 400 })
  }

  const messages = (body as Record<string, unknown> | null)?.messages
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isValidMessage)) {
    return NextResponse.json(
      { error: 'Falta el historial de mensajes o tiene un formato inválido.' },
      { status: 400 },
    )
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY no configurada en el servidor.' },
      { status: 500 },
    )
  }

  const start = performance.now()
  let groqResponse: Response
  try {
    groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
      }),
    })
  } catch {
    return NextResponse.json(
      { error: 'No se ha podido conectar con el servicio de IA. Comprueba tu conexión de red.' },
      { status: 502 },
    )
  }
  const responseTime = Math.round(performance.now() - start)

  let data: GroqChatCompletionResponse
  try {
    data = await groqResponse.json()
  } catch {
    return NextResponse.json(
      { error: 'La respuesta del servicio de IA no es un JSON válido.' },
      { status: 502 },
    )
  }

  if (!groqResponse.ok) {
    if (groqResponse.status === 401) {
      return NextResponse.json(
        { error: 'No se ha podido conectar con el servicio de IA. Comprueba la configuración de la API.' },
        { status: 502 },
      )
    }
    if (groqResponse.status === 429) {
      return NextResponse.json(
        { error: 'Se ha alcanzado el límite de peticiones al servicio de IA. Inténtalo de nuevo en unos segundos.' },
        { status: 502 },
      )
    }
    return NextResponse.json(
      { error: 'El servicio de IA ha devuelto un error al procesar la petición.' },
      { status: 502 },
    )
  }

  const assistantContent = data.choices?.[0]?.message?.content
  const usage = data.usage
  if (typeof assistantContent !== 'string' || !usage) {
    return NextResponse.json(
      { error: 'La respuesta del servicio de IA no tiene el formato esperado.' },
      { status: 502 },
    )
  }

  return NextResponse.json({
    message: {
      role: 'assistant' as const,
      content: assistantContent,
    },
    usage: {
      promptTokens: usage.prompt_tokens ?? 0,
      completionTokens: usage.completion_tokens ?? 0,
      totalTokens: usage.total_tokens ?? 0,
    },
    model: data.model ?? GROQ_MODEL,
    responseTime,
  })
}
