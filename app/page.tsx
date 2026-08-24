'use client'

import { BarChart3, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ChatThread } from '@/components/chat-thread'
import { TokenSidebar } from '@/components/token-sidebar'
import { GROQ_MODEL } from '@/lib/groq'
import type { ChatApiError, ChatApiSuccess, Message, UsageStats } from '@/lib/types'
import { formatTokens } from '@/lib/utils'

const MESSAGES_STORAGE_KEY = 'chat-messages'

const EMPTY_USAGE: UsageStats = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
}

function usageFromMessages(messages: Message[]): UsageStats {
  return messages.reduce<UsageStats>((acc, m) => {
    if (!m.requestUsage) return acc
    return {
      ...acc,
      promptTokens: acc.promptTokens + m.requestUsage.promptTokens,
      completionTokens: acc.completionTokens + m.requestUsage.completionTokens,
      totalTokens: acc.totalTokens + m.requestUsage.totalTokens,
    }
  }, EMPTY_USAGE)
}

function nowTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usage, setUsage] = useState<UsageStats>(EMPTY_USAGE)
  const [hydrated, setHydrated] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  // Restore the conversation from localStorage on mount. This must run in an
  // effect (not a lazy initializer) so the server-rendered and first client
  // render both start empty, avoiding a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MESSAGES_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Message[]
        if (Array.isArray(parsed)) {
          setMessages(parsed)
          setUsage(usageFromMessages(parsed))
        }
      }
    } catch {
      // Ignore malformed/unavailable storage and start with an empty chat.
    }
    setHydrated(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist the conversation after every change, once hydration has run.
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages))
  }, [messages, hydrated])

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: text,
      time: nowTime(),
    }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = (await response.json()) as ChatApiSuccess | ChatApiError

      if (!response.ok || 'error' in data) {
        const message = 'error' in data ? data.error : 'Ha ocurrido un error inesperado.'
        setError(message)
        return
      }

      if (!data.message?.content || !data.usage) {
        setError('La respuesta del servidor no tiene el formato esperado.')
        return
      }

      const assistantMessage: Message = {
        id: `m-${Date.now()}-a`,
        role: 'assistant',
        content: data.message.content,
        time: nowTime(),
        requestUsage: data.usage,
      }

      setMessages([...updatedMessages, assistantMessage])
      setUsage((prev) => ({
        promptTokens: prev.promptTokens + data.usage.promptTokens,
        completionTokens: prev.completionTokens + data.usage.completionTokens,
        totalTokens: prev.totalTokens + data.usage.totalTokens,
        lastResponseTime: data.responseTime,
        lastCompletionTokens: data.usage.completionTokens,
        model: data.model,
      }))
    } catch {
      setError('No se ha podido conectar con el servidor. Comprueba tu conexión a internet.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleClear() {
    setMessages([])
    setUsage(EMPTY_USAGE)
    setError(null)
    setInput('')
    localStorage.removeItem(MESSAGES_STORAGE_KEY)
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-sidebar px-4 py-2.5">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <span className="label-mono shrink-0 text-foreground">Habla con la Máquina</span>
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
            chat con Groq
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:inline">
            sesión {formatTokens(usage.totalTokens)} tok
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-card px-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:bg-secondary"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Borrar conversación
          </button>
          <button
            type="button"
            onClick={() => setStatsOpen(true)}
            className="flex size-8 items-center justify-center rounded-sm border border-border bg-card text-foreground xl:hidden"
          >
            <BarChart3 className="size-4" aria-hidden="true" />
            <span className="sr-only">Abrir estadísticas de tokens</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="chat-surface flex min-w-0 flex-1 flex-col">
          <ChatThread
            messages={messages}
            isLoading={isLoading}
            error={error}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
          />
        </main>

        <div className="hidden w-80 shrink-0 border-l border-border xl:block">
          <TokenSidebar usage={{ model: GROQ_MODEL, ...usage }} />
        </div>
      </div>

      {statsOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Cerrar estadísticas"
            onClick={() => setStatsOpen(false)}
            className="absolute inset-0 bg-foreground/40"
          />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm border-l border-border shadow-xl">
            <TokenSidebar usage={{ model: GROQ_MODEL, ...usage }} onClose={() => setStatsOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
