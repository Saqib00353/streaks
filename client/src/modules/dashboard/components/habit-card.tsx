import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CategoryIcon } from '@/modules/dashboard/components/category-icon'
import { HabitMenu } from '@/modules/dashboard/components/habit-menu'
import { CheckCircleIcon, CircleIcon, FlameIcon } from '@/modules/dashboard/components/icons'
import {
  CATEGORY_LABEL,
  daysSince,
  frequencyDescription,
  isCompletedToday,
  streakUnitLabel,
  type Habit,
} from '@/modules/dashboard/types'
import { cn } from '@/lib/cn'

type HabitCardProps = {
  habit: Habit
  pending: boolean
  onCheckIn: () => void
  onEdit: () => void
  onArchive: () => void
  onView: () => void
}

export function HabitCard({ habit, pending, onCheckIn, onEdit, onArchive, onView }: HabitCardProps) {
  const done = isCompletedToday(habit)
  const hasStreak = habit.streak.current_streak > 0

  return (
    <Card
      className="cursor-pointer p-5 transition-shadow hover:shadow-md"
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onView()
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-muted text-foreground">
            <CategoryIcon category={habit.category} width={18} height={18} />
          </div>
          <div>
            <div className="text-[15px] font-semibold leading-tight">{habit.name}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge>{CATEGORY_LABEL[habit.category]}</Badge>
              <span className="text-xs text-muted-foreground">{frequencyDescription(habit)}</span>
            </div>
          </div>
        </div>
        <HabitMenu onEdit={onEdit} onArchive={onArchive} />
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <FlameIcon
            width={22}
            height={22}
            style={{ color: hasStreak ? 'var(--color-flame)' : 'var(--color-muted-foreground)' }}
            className={cn(!hasStreak && 'opacity-50')}
          />
          <span className={cn('text-[28px] font-bold leading-none', !hasStreak && 'text-muted-foreground')}>
            {habit.streak.current_streak}
          </span>
          <span className="mt-1 text-[13px] text-muted-foreground">
            {streakUnitLabel(habit.frequency)}
          </span>
        </div>
        {!hasStreak && habit.streak.last_completed_date && (
          <div className="ml-[30px] mt-1 text-xs text-muted-foreground">
            Last done {daysSince(habit.streak.last_completed_date)} day
            {daysSince(habit.streak.last_completed_date) === 1 ? '' : 's'} ago
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={(e) => {
          e.stopPropagation()
          onCheckIn()
        }}
        className={cn(
          'mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius)] text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          done
            ? 'border border-primary/25 bg-accent text-primary'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        )}
      >
        {done ? <CheckCircleIcon width={16} height={16} /> : <CircleIcon width={16} height={16} />}
        {done
          ? 'Completed today'
          : habit.frequency === 'weekly'
            ? 'Mark this week done'
            : 'Mark today done'}
      </button>
    </Card>
  )
}
