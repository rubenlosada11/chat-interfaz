'use client'

import { useEffect, useRef } from 'react'
import { ChatInput } from '@/components/chat-input'
import { ChatMessage } from '@/components/chat-message'
import { LoadingIndicator } from '@/components/loading-indicator'
import type { Message } from '@/lib/types'

type Props = {
  messages: Message[]
  isLoading: boolean
  error: string | null
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
}

export function ChatThread({ messages, isLoading, error, input, onInputChange, onSend }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, isLoading])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="chat-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 px-5 py-4 md:px-8">
          {messages.length === 0 ? (
            <p className="py-10 text-center font-mono text-xs text-muted-foreground">
              Escribe un mensaje para empezar la conversación.
            </p>
          ) : (
            messages.map((m) => <ChatMessage key={m.id} message={m} />)
          )}
          {isLoading ? <LoadingIndicator /> : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-5 md:px-8">
        {error ? (
          <div role="alert" className="pb-2">
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm">
              {error}
            </div>
          </div>
        ) : null}

        <ChatInput value={input} onChange={onInputChange} onSubmit={onSend} disabled={isLoading} />
      </div>
    </div>
  )
}
