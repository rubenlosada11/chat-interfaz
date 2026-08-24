// NOTA: el enunciado del ejercicio pide un modelo Llama de Meta, pero la cuenta de
// Groq usada para probar este proyecto no tiene ningún Llama de chat disponible
// (llama-3.1-8b-instant y llama-3.3-70b-versatile se retiraron del tier gratuito
// el 16/08/2026, y Llama 4 Scout/Maverick tampoco aparecen accesibles). Se usa el
// modelo recomendado por Groq como reemplazo; cambia esta constante si tu cuenta sí
// tiene acceso a un Llama.
export const GROQ_MODEL = 'openai/gpt-oss-20b'

export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export type GroqRole = 'system' | 'user' | 'assistant'

export type GroqMessage = {
  role: GroqRole
  content: string
}

export type GroqChatCompletionResponse = {
  choices?: {
    message?: {
      role: string
      content: string
    }
  }[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
  model?: string
  error?: {
    message?: string
    type?: string
  }
}
