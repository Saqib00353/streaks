import { useCallback, useEffect, useState } from 'react'
import { checkIn, createHabit, listHabits, updateHabit } from '@/modules/dashboard/service'
import { isCompletedToday, type Habit, type HabitPayload } from '@/modules/dashboard/types'

type Status = 'loading' | 'ready' | 'error'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())

  const refetch = useCallback(async () => {
    setStatus((prev) => (prev === 'ready' ? prev : 'loading'))
    try {
      const data = await listHabits(true)
      setHabits(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  async function withPending(id: number, task: () => Promise<void>) {
    setPendingIds((prev) => new Set(prev).add(id))
    try {
      await task()
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  async function create(payload: HabitPayload) {
    await createHabit(payload)
    await refetch()
  }

  async function update(id: number, payload: Partial<HabitPayload>) {
    await updateHabit(id, payload)
    await refetch()
  }

  function archive(id: number) {
    return withPending(id, async () => {
      await updateHabit(id, { archived: true })
      await refetch()
    })
  }

  function restore(id: number) {
    return withPending(id, async () => {
      await updateHabit(id, { archived: false })
      await refetch()
    })
  }

  function toggleCheckIn(habit: Habit) {
    return withPending(habit.id, async () => {
      await checkIn(habit.id, { completed: !isCompletedToday(habit) })
      await refetch()
    })
  }

  return {
    habits,
    status,
    pendingIds,
    create,
    update,
    archive,
    restore,
    toggleCheckIn,
    refetch,
  }
}
