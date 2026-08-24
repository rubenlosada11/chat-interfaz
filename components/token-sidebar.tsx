'use client'

import { X } from 'lucide-react'
import { formatTokens } from '@/lib/utils'
import type { UsageStats } from '@/lib/types'

type Props = {
  usage: UsageStats
  onClose?: () => void
}

export function TokenSidebar({ usage, onClose }: Props) {
  const tokensPerSecond =
    usage.lastResponseTime && usage.lastCompletionTokens
      ? usage.lastCompletionTokens / (usage.lastResponseTime / 1000)
      : undefined

  return (
    <aside
      aria-label="Estadísticas de consumo de tokens"
      className="flex h-full flex-col bg-sidebar"
    >
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <span className="label-mono text-muted-foreground">Estadísticas</span>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg border border-border bg-card text-foreground xl:hidden"
          >
            <X className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Cerrar panel de estadísticas</span>
          </button>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="label-mono text-muted-foreground">Tokens de la sesión</p>
          <p className="mt-2 font-mono text-4xl leading-none tracking-tight text-foreground">
            {formatTokens(usage.totalTokens)}
          </p>

          <dl className="mt-5 grid grid-cols-2 border-t border-border/70">
            <div className="border-r border-border/70 py-3 pr-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Prompt
              </dt>
              <dd className="mt-1 font-mono text-lg text-foreground">
                {formatTokens(usage.promptTokens)}
              </dd>
            </div>
            <div className="py-3 pl-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Respuesta
              </dt>
              <dd className="mt-1 font-mono text-lg text-foreground">
                {formatTokens(usage.completionTokens)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="label-mono text-muted-foreground">Modelo</p>
          <p className="mt-2 truncate font-mono text-sm text-foreground">
            {usage.model ?? '—'}
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="label-mono text-muted-foreground">Última respuesta</p>
          <p className="mt-2 font-mono text-2xl leading-none tracking-tight text-foreground">
            {usage.lastResponseTime ? `${(usage.lastResponseTime / 1000).toFixed(2)} s` : '—'}
          </p>
          {tokensPerSecond ? (
            <p className="mt-3 border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
              ~{tokensPerSecond.toFixed(1)} tokens/s
            </p>
          ) : null}
        </section>
      </div>
    </aside>
  )
}
