import { session } from './session'

export const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | undefined>
}

export async function api<T>(
  path: string,
  { method = 'GET', body, query }: RequestOptions = {},
): Promise<T> {
  const url = new URL(`${API_URL}${path}`)
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {}
  const token = session.getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json'

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0)
  }

  if (response.status === 401 && token) {
    session.clear()
    window.location.assign(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string | Array<string>
    } | null
    const message = Array.isArray(data?.message)
      ? data.message.join('. ')
      : (data?.message ?? 'Ocurrio un error inesperado')
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export function documentFileUrl(documentId: string) {
  return `${API_URL}/documents/${documentId}/file?token=${session.getToken() ?? ''}`
}
