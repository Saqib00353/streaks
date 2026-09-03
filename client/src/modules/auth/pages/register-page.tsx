import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useAuth } from '@/modules/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type FieldErrors = Partial<Record<'username' | 'email' | 'password', string>>

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)
    try {
      await register(data)
      navigate('/', { replace: true })
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        const body = err.response.data as Record<string, string[]>
        const fieldErrors: FieldErrors = {}
        for (const key of ['username', 'email', 'password'] as const) {
          if (body[key]?.[0]) fieldErrors[key] = body[key][0]
        }
        setErrors(fieldErrors)
      } else {
        setErrors({ username: 'Something went wrong, please try again.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                aria-invalid={!!errors.username}
                value={data.username}
                onChange={(e) => setData((p) => ({ ...p, username: e.target.value }))}
                required
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                aria-invalid={!!errors.email}
                value={data.email}
                onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
                required
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                aria-invalid={!!errors.password}
                value={data.password}
                onChange={(e) => setData((p) => ({ ...p, password: e.target.value }))}
                required
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
