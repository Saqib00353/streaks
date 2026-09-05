import { useMemo, useState } from 'react'
import { useAuth } from '@/modules/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { AppTopbar } from '@/modules/dashboard/components/app-topbar'
import { HabitFilters } from '@/modules/dashboard/components/habit-filters'
import { HabitGrid } from '@/modules/dashboard/components/habit-grid'
import { ArchivedHabits } from '@/modules/dashboard/components/archived-habits'
import { EmptyState } from '@/modules/dashboard/components/empty-state'
import { HabitFormDialog } from '@/modules/dashboard/components/habit-form-dialog'
import { HabitDetailDialog } from '@/modules/dashboard/components/habit-detail-dialog'
import { PlusIcon } from '@/modules/dashboard/components/icons'
import { useHabits } from '@/modules/dashboard/hooks/use-habits'
import {
  CATEGORIES,
  isCompletedToday,
  type Category,
  type Habit,
  type HabitPayload,
} from '@/modules/dashboard/types'

const FREE_TIER_ACTIVE_HABIT_LIMIT = 3

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { habits, status, pendingIds, create, update, archive, restore, toggleCheckIn } = useHabits()

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [viewingHabitId, setViewingHabitId] = useState<number | null>(null)

  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits])
  const archivedHabits = useMemo(() => habits.filter((h) => h.archived), [habits])

  const categoriesPresent = useMemo(
    () => CATEGORIES.filter((category) => activeHabits.some((h) => h.category === category)),
    [activeHabits]
  )

  const filteredHabits = useMemo(
    () =>
      selectedCategory === 'all'
        ? activeHabits
        : activeHabits.filter((h) => h.category === selectedCategory),
    [activeHabits, selectedCategory]
  )

  const completedToday = useMemo(() => activeHabits.filter(isCompletedToday).length, [activeHabits])

  const atFreeTierLimit = !user?.is_premium && activeHabits.length >= FREE_TIER_ACTIVE_HABIT_LIMIT

  const viewingHabit = useMemo(
    () => habits.find((h) => h.id === viewingHabitId) ?? null,
    [habits, viewingHabitId]
  )

  function openCreate() {
    setEditingHabit(null)
    setDialogOpen(true)
  }

  function openEdit(habit: Habit) {
    setViewingHabitId(null)
    setEditingHabit(habit)
    setDialogOpen(true)
  }

  function handleArchiveFromDetail(habit: Habit) {
    setViewingHabitId(null)
    archive(habit.id)
  }

  async function handleSubmit(payload: HabitPayload) {
    if (editingHabit) {
      await update(editingHabit.id, payload)
    } else {
      await create(payload)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppTopbar />

      <div className="px-6 py-7 sm:px-8">
        {status === 'loading' && habits.length === 0 && (
          <div className="flex justify-center py-20 text-sm text-muted-foreground">Loading habits…</div>
        )}

        {status === 'error' && (
          <div className="flex justify-center py-20 text-sm text-destructive">
            Something went wrong loading your habits.
          </div>
        )}

        {status !== 'error' && (status === 'ready' || habits.length > 0) && (
          <>
            {habits.length === 0 ? (
              <EmptyState onCreate={openCreate} />
            ) : (
              <>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
                      {greeting()}
                      {user ? `, ${user.username}` : ''}
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {activeHabits.length} active habit{activeHabits.length === 1 ? '' : 's'} &middot;{' '}
                      {completedToday} completed today
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Button className="gap-2" onClick={openCreate} disabled={atFreeTierLimit}>
                      <PlusIcon width={16} height={16} />
                      New habit
                    </Button>
                    {atFreeTierLimit && (
                      <p className="text-xs text-muted-foreground">
                        Free plan limit reached ({FREE_TIER_ACTIVE_HABIT_LIMIT} active habits).{' '}
                        Upgrade to add more.
                      </p>
                    )}
                  </div>
                </div>

                <HabitFilters
                  categories={categoriesPresent}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                  archivedCount={archivedHabits.length}
                  showArchived={showArchived}
                  onToggleArchived={() => setShowArchived((v) => !v)}
                />

                <div className="mt-6">
                  {filteredHabits.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      No habits in this category yet.
                    </p>
                  ) : (
                    <HabitGrid
                      habits={filteredHabits}
                      pendingIds={pendingIds}
                      onCheckIn={toggleCheckIn}
                      onEdit={openEdit}
                      onArchive={(habit) => archive(habit.id)}
                      onView={(habit) => setViewingHabitId(habit.id)}
                    />
                  )}
                </div>

                {showArchived && (
                  <ArchivedHabits
                    habits={archivedHabits}
                    pendingIds={pendingIds}
                    onRestore={(habit) => restore(habit.id)}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      <HabitFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        habit={editingHabit}
        onSubmit={handleSubmit}
      />

      <HabitDetailDialog
        habit={viewingHabit}
        open={viewingHabit !== null}
        onOpenChange={(open) => !open && setViewingHabitId(null)}
        pending={viewingHabit !== null && pendingIds.has(viewingHabit.id)}
        onCheckIn={toggleCheckIn}
        onEdit={openEdit}
        onArchive={handleArchiveFromDetail}
      />
    </div>
  )
}
