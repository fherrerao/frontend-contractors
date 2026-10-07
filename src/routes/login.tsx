import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { LoginForm } from '#/components/organisms'
import type { LoginValues } from '#/components/organisms'
import { AuthTemplate } from '#/components/templates'
import { login } from '#/lib/auth'
import { session } from '#/lib/session'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: () => {
    if (session.getToken()) throw redirect({ to: '/' })
  },
  head: () => ({ meta: [{ title: 'Iniciar sesion · Gestion de Contratistas' }] }),
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { redirect: redirectTo } = Route.useSearch()

  const handleSubmit = async ({ email, password, remember }: LoginValues) => {
    await login(email, password, remember)
    const target = redirectTo?.startsWith('/') && !redirectTo.startsWith('/login') ? redirectTo : '/'
    router.history.push(target)
  }

  return (
    <AuthTemplate>
      <LoginForm onSubmit={handleSubmit} />
    </AuthTemplate>
  )
}
