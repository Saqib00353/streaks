import { useAuth } from '@/modules/auth/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import { Button } from '@/components/ui/button'
import { FlameIcon, LogoutIcon, MoonIcon, SunIcon } from '@/modules/dashboard/components/icons'

function initials(username: string) {
  return username.slice(0, 2).toUpperCase()
}

export function AppTopbar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6 sm:px-8">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary">
          <FlameIcon width={17} height={17} stroke="none" fill="var(--color-primary-foreground)" />
        </div>
        <span className="text-base font-bold tracking-tight">Streaks</span>
      </div>
      <div className="flex items-center gap-3.5">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {isDark ? <SunIcon width={18} height={18} /> : <MoonIcon width={18} height={18} />}
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-[13px] font-semibold text-secondary-foreground">
          {user ? initials(user.username) : '?'}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={() => logout()}
          aria-label="Log out"
        >
          <LogoutIcon width={18} height={18} />
        </Button>
      </div>
    </header>
  )
}
