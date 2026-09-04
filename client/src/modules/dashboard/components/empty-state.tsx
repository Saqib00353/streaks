import { Button } from '@/components/ui/button'
import { FlameIcon, PlusIcon } from '@/modules/dashboard/components/icons'

type EmptyStateProps = {
  onCreate: () => void
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-accent">
        <FlameIcon width={34} height={34} style={{ color: 'var(--color-primary)' }} strokeWidth={1.6} />
      </div>
      <h2 className="mt-6 text-xl font-semibold">Start your first streak</h2>
      <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Track a daily, weekly, or custom habit and watch your streak grow. Setting one up takes less
        than a minute.
      </p>
      <Button size="lg" className="mt-6 gap-2" onClick={onCreate}>
        <PlusIcon width={16} height={16} />
        Create your first habit
      </Button>
    </div>
  )
}
