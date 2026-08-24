'use client'

import { ArrowUp } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled: boolean
}

export function ChatInput({ value, onChange, onSubmit, disabled }: Props) {
  return (
    <div className="pb-5 pt-2">
      <div className="rounded-xl border border-border bg-card shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring/40">
        <label htmlFor="prompt" className="sr-only">
          Escribe tu mensaje
        </label>
        <textarea
          id="prompt"
          rows={3}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              onSubmit()
            }
          }}
          placeholder="Escribe un mensaje…"
          className="w-full resize-none bg-transparent px-4 py-3.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
        />
        <div className="flex items-center justify-end gap-3 border-t border-border/70 px-3 py-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            className="flex h-7 items-center gap-1.5 rounded-lg bg-primary px-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Enviar
            <ArrowUp className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Enter envía · Shift + Enter salto de línea
      </p>
    </div>
  )
}
