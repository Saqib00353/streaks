import { useAuth } from '@/modules/auth/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome{user ? `, ${user.username}` : ''}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="secondary"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            Toggle theme ({theme})
          </Button>
          <Button variant="destructive" onClick={() => logout()}>
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
