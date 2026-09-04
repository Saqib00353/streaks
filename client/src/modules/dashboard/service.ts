import { makeRequest } from '@/lib/http'
import type { CheckInPayload, Habit, HabitLog, HabitPayload, Streak } from '@/modules/dashboard/types'

export function listHabits(includeArchived = false) {
  return makeRequest<Habit[]>('/habits/', {
    params: { include_archived: includeArchived },
  })
}

export function createHabit(payload: HabitPayload) {
  return makeRequest<Habit>('/habits/', { method: 'POST', data: payload })
}

export function updateHabit(id: number, payload: Partial<HabitPayload>) {
  return makeRequest<Habit>(`/habits/${id}/`, { method: 'PATCH', data: payload })
}

export function checkIn(id: number, payload: CheckInPayload = {}) {
  return makeRequest<{ log: HabitLog; streak: Streak }>(`/habits/${id}/check-in/`, {
    method: 'POST',
    data: payload,
  })
}

export function listHabitLogs(id: number, days = 21) {
  return makeRequest<HabitLog[]>(`/habits/${id}/logs/`, { params: { days } })
}
