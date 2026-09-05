import { useAuth } from '@/modules/auth/auth-provider'
import { useTheme, type Theme } from '@/providers/theme-provider'
import { Button } from '@/components/ui/button'
import { FlameIcon, LogoutIcon, MonitorIcon, MoonIcon, SunIcon } from '@/modules/dashboard/components/icons'

function initials(username: string) {
  return username.slice(0, 2).toUpperCase()
}

const THEME_CYCLE: Record<Theme, Theme> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const THEME_LABEL: Record<Theme, string> = {
  system: 'Matching system',
  light: 'Light',
  dark: 'Dark',
}

export function AppTopbar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

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
          onClick={() => setTheme(THEME_CYCLE[theme])}
          aria-label={`Theme: ${THEME_LABEL[theme]}. Click to change.`}
          title={THEME_LABEL[theme]}
        >
          {theme === 'system' ? (
            <MonitorIcon width={18} height={18} />
          ) : theme === 'light' ? (
            <SunIcon width={18} height={18} />
          ) : (
            <MoonIcon width={18} height={18} />
          )}
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
