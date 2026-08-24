import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

const components: Components = {
  p: ({ node, ...props }) => (
    <p className="my-2 text-pretty text-[0.9375rem] leading-relaxed text-foreground first:mt-0 last:mb-0" {...props} />
  ),
  h1: ({ node, ...props }) => (
    <h1 className="mb-2 mt-4 text-base font-semibold text-foreground first:mt-0" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="mb-2 mt-4 text-[0.9375rem] font-semibold text-foreground first:mt-0" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mb-1.5 mt-3 text-sm font-semibold text-foreground first:mt-0" {...props} />
  ),
  strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  ul: ({ node, ...props }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 text-[0.9375rem] leading-relaxed text-foreground" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 text-[0.9375rem] leading-relaxed text-foreground" {...props} />
  ),
  li: ({ node, ...props }) => <li {...props} />,
  a: ({ node, ...props }) => (
    <a
      className="text-accent-foreground underline underline-offset-2 hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => <hr className="my-4 border-border" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="border-b border-border" {...props} />,
  th: ({ node, ...props }) => (
    <th
      className="border border-border bg-card px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td className="border border-border px-2 py-1.5 align-top text-foreground" {...props} />
  ),
  pre: ({ node, ...props }) => (
    <pre
      className="my-2 overflow-x-auto rounded-sm border border-border bg-card p-3 font-mono text-xs leading-relaxed text-foreground"
      {...props}
    />
  ),
  code: ({ node, className, children, ...props }) => {
    const text = String(children).replace(/\n$/, '')
    if (text.includes('\n')) {
      return (
        <code className={cn('whitespace-pre', className)} {...props}>
          {text}
        </code>
      )
    }
    return (
      <code
        className="rounded-sm border border-border bg-card px-1 py-0.5 font-mono text-[0.85em] text-foreground"
        {...props}
      >
        {text}
      </code>
    )
  },
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="flex flex-col">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
