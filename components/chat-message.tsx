import { Markdown } from '@/components/markdown'
import type { Message } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <article
      className={cn(
        'animate-message-in flex gap-4 rounded-xl border p-4 shadow-sm',
        isUser ? 'border-border bg-card' : 'border-border/70 bg-card/50',
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-medium',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border border-accent bg-accent/25 text-foreground',
        )}
      >
        {isUser ? 'TÚ' : 'AI'}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="label-mono text-muted-foreground">
            {isUser ? 'Tú' : 'Asistente'}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">{message.time}</span>
        </div>

        <div className="mt-2">
          <Markdown content={message.content} />
        </div>

        {!isUser && message.requestUsage ? (
          <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border/70 pt-3 font-mono text-[10px] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <dt className="text-muted-foreground">Prompt</dt>
              <dd className="text-foreground">
                {message.requestUsage.promptTokens.toLocaleString('es-ES')}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="text-muted-foreground">Respuesta</dt>
              <dd className="text-foreground">
                {message.requestUsage.completionTokens.toLocaleString('es-ES')}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="text-muted-foreground">Total</dt>
              <dd className="rounded-sm bg-accent px-1.5 text-accent-foreground">
                {message.requestUsage.totalTokens.toLocaleString('es-ES')}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>
    </article>
  )
}
