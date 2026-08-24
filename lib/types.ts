export type Role = 'user' | 'assistant'

export type Message = {
  id: string
  role: Role
  content: string
  time: string
  /** Only present on assistant messages: usage figures for this single request. */
  requestUsage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export type UsageStats = {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  lastResponseTime?: number
  lastCompletionTokens?: number
  model?: string
}

export type ChatApiSuccess = {
  message: {
    role: 'assistant'
    content: string
  }
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  responseTime: number
}

export type ChatApiError = {
  error: string
}
