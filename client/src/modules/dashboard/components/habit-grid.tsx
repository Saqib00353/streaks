import { HabitCard } from '@/modules/dashboard/components/habit-card'
import type { Habit } from '@/modules/dashboard/types'

type HabitGridProps = {
  habits: Habit[]
  pendingIds: Set<number>
  onCheckIn: (habit: Habit) => void
  onEdit: (habit: Habit) => void
  onArchive: (habit: Habit) => void
  onView: (habit: Habit) => void
}

export function HabitGrid({ habits, pendingIds, onCheckIn, onEdit, onArchive, onView }: HabitGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          pending={pendingIds.has(habit.id)}
          onCheckIn={() => onCheckIn(habit)}
          onEdit={() => onEdit(habit)}
          onArchive={() => onArchive(habit)}
          onView={() => onView(habit)}
        />
      ))}
    </div>
  )
}
