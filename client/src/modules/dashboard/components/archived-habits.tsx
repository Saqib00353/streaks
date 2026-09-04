import { Button } from '@/components/ui/button'
import { CategoryIcon } from '@/modules/dashboard/components/category-icon'
import { RestoreIcon } from '@/modules/dashboard/components/icons'
import { CATEGORY_LABEL, frequencyDescription, type Habit } from '@/modules/dashboard/types'

type ArchivedHabitsProps = {
  habits: Habit[]
  pendingIds: Set<number>
  onRestore: (habit: Habit) => void
}

export function ArchivedHabits({ habits, pendingIds, onRestore }: ArchivedHabitsProps) {
  if (habits.length === 0) return null

  return (
    <div className="mt-8 flex flex-col gap-2">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-muted px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] border border-border bg-card text-muted-foreground">
              <CategoryIcon category={habit.category} width={18} height={18} />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-foreground">{habit.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {CATEGORY_LABEL[habit.category]} &middot; {frequencyDescription(habit)} &middot; Longest
                streak: {habit.streak.longest_streak} days
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            disabled={pendingIds.has(habit.id)}
            onClick={() => onRestore(habit)}
            className="gap-1.5"
          >
            <RestoreIcon width={14} height={14} />
            Restore
          </Button>
        </div>
      ))}
    </div>
  )
}
