import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogBody, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { CategoryIcon } from '@/modules/dashboard/components/category-icon'
import {
  ArchiveIcon,
  CheckCircleIcon,
  CircleIcon,
  CloseIcon,
  FlameIcon,
  PencilIcon,
  StarIcon,
} from '@/modules/dashboard/components/icons'
import { listHabitLogs } from '@/modules/dashboard/service'
import {
  CATEGORY_LABEL,
  frequencyDescription,
  isCompletedToday,
  lastNDates,
  streakUnitLabel,
  todayISO,
  weekdayLetter,
  type Habit,
  type HabitLog,
} from '@/modules/dashboard/types'
import { cn } from '@/lib/cn'

const WINDOW_DAYS = 21

type HabitDetailDialogProps = {
  habit: Habit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  pending: boolean
  onCheckIn: (habit: Habit) => void
  onEdit: (habit: Habit) => void
  onArchive: (habit: Habit) => void
}

export function HabitDetailDialog({
  habit,
  open,
  onOpenChange,
  pending,
  onCheckIn,
  onEdit,
  onArchive,
}: HabitDetailDialogProps) {
  const [logs, setLogs] = useState<HabitLog[] | null>(null)

  useEffect(() => {
    if (!open || !habit) {
      setLogs(null)
      return
    }
    let cancelled = false
    listHabitLogs(habit.id, WINDOW_DAYS).then((data) => {
      if (!cancelled) setLogs(data)
    })
    return () => {
      cancelled = true
    }
  }, [open, habit])

  if (!habit) return null

  const done = isCompletedToday(habit)
  const today = todayISO()
  const dates = lastNDates(WINDOW_DAYS)
  const completedDates = new Set((logs ?? []).filter((l) => l.completed).map((l) => l.date))
  const weekdayHeader = dates.slice(0, 7).map(weekdayLetter)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-muted text-foreground">
              <CategoryIcon category={habit.category} width={20} height={20} />
            </div>
            <div>
              <div className="text-[17px] font-semibold leading-tight">{habit.name}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge>{CATEGORY_LABEL[habit.category]}</Badge>
                <span className="text-xs text-muted-foreground">{frequencyDescription(habit)}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </DialogHeader>

        <DialogBody>
          {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--radius)] border border-border bg-muted p-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FlameIcon width={16} height={16} style={{ color: 'var(--color-flame)' }} />
                Current streak
              </div>
              <div className="mt-1.5 text-[26px] font-bold leading-none">
                {habit.streak.current_streak}{' '}
                <span className="text-sm font-medium text-muted-foreground">
                  {streakUnitLabel(habit.frequency).replace(' streak', '')}
                  {habit.streak.current_streak === 1 ? '' : 's'}
                </span>
              </div>
            </div>
            <div className="rounded-[var(--radius)] border border-border bg-muted p-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <StarIcon width={16} height={16} />
                Longest streak
              </div>
              <div className="mt-1.5 text-[26px] font-bold leading-none">
                {habit.streak.longest_streak}{' '}
                <span className="text-sm font-medium text-muted-foreground">
                  {streakUnitLabel(habit.frequency).replace(' streak', '')}
                  {habit.streak.longest_streak === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={pending}
            onClick={() => onCheckIn(habit)}
            className={cn(
              'flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius)] text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
              done
                ? 'border border-primary/25 bg-accent text-primary'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            )}
          >
            {done ? <CheckCircleIcon width={17} height={17} /> : <CircleIcon width={17} height={17} />}
            {done
              ? 'Completed today'
              : habit.frequency === 'weekly'
                ? 'Mark this week done'
                : 'Mark today done'}
          </button>

          <div>
            <div className="mb-3 text-[13px] font-semibold">Last {WINDOW_DAYS} days</div>

            <div className="mb-1.5 grid grid-cols-7 gap-1.5">
              {weekdayHeader.map((letter, i) => (
                <div key={i} className="text-center text-[11px] text-muted-foreground">
                  {letter}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[28px] gap-1.5">
              {dates.map((date) => {
                const isToday = date === today
                const completed = completedDates.has(date)
                return (
                  <div
                    key={date}
                    title={date}
                    className={cn(
                      'rounded-md',
                      completed ? 'bg-primary' : 'border border-border bg-muted',
                      isToday && 'shadow-[0_0_0_2px_var(--color-card),0_0_0_4px_var(--color-primary)]'
                    )}
                  />
                )
              })}
            </div>

            <div className="mt-3.5 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-[4px] bg-primary" />
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-[4px] border border-border bg-muted" />
                <span className="text-xs text-muted-foreground">Missed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-[4px] bg-primary shadow-[0_0_0_2px_var(--color-card),0_0_0_3.5px_var(--color-primary)]" />
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
            </div>
          </div>
        </DialogBody>

        <div className="flex items-center justify-between gap-2.5 border-t border-border px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive"
            onClick={() => onArchive(habit)}
          >
            <ArchiveIcon width={14} height={14} />
            Archive habit
          </Button>
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => onEdit(habit)}>
            <PencilIcon width={14} height={14} />
            Edit habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
