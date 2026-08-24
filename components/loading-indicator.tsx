export function LoadingIndicator() {
  return (
    <div
      role="status"
      className="animate-message-in flex items-center gap-4 rounded-xl border border-border/70 bg-card/50 p-4 shadow-sm"
    >
      <div
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-accent bg-accent/25 font-mono text-[10px] font-medium text-foreground"
      >
        AI
      </div>
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        Pensando
        <span className="flex items-center gap-0.5" aria-hidden="true">
          <span className="animate-typing-dot size-1.5 rounded-full bg-accent [animation-delay:0ms]" />
          <span className="animate-typing-dot size-1.5 rounded-full bg-accent [animation-delay:150ms]" />
          <span className="animate-typing-dot size-1.5 rounded-full bg-accent [animation-delay:300ms]" />
        </span>
      </span>
    </div>
  )
}
