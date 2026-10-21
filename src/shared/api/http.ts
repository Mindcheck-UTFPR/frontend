const apiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
if (import.meta.env.PROD && apiUrl !== '/api' && !apiUrl.startsWith('https://')) {
  throw new Error('A API de produção deve usar HTTPS.')
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message)
  }
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...init,
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
      headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    })
    if (response.status === 204) return undefined as T
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      const fields: Record<string, string> = {}
      for (const detail of data?.erro?.detalhes ?? []) {
        if (typeof detail?.campo === 'string' && typeof detail?.mensagem === 'string')
          fields[detail.campo] = detail.mensagem
      }
      const message =
        response.status >= 500
          ? 'O serviço está indisponível. Tente novamente.'
          : response.status === 429
            ? 'Muitas tentativas. Aguarde um pouco antes de tentar novamente.'
            : data?.erro?.mensagem || 'Não foi possível concluir a operação.'
      throw new ApiError(
        response.status,
        data?.erro?.codigo || 'REQUISICAO_FALHOU',
        message,
        fields,
      )
    }
    if (data === null)
      throw new ApiError(502, 'RESPOSTA_INVALIDA', 'O serviço retornou uma resposta inválida.')
    return data as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      0,
      'SEM_CONEXAO',
      'Não foi possível conectar. Confira sua conexão e tente novamente.',
    )
  } finally {
    clearTimeout(timeout)
  }
}

export function jsonBody(data: unknown): RequestInit {
  return { method: 'POST', body: JSON.stringify(data) }
}
