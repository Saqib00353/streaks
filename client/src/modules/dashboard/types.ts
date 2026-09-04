export type Frequency = 'daily' | 'weekly' | 'custom'

export type Category =
  | 'health'
  | 'mindfulness'
  | 'learning'
  | 'productivity'
  | 'finance'
  | 'social'
  | 'creativity'
  | 'other'

export type Streak = {
  current_streak: number
  longest_streak: number
  last_completed_date: string | null
}

export type Habit = {
  id: number
  name: string
  description: string | null
  frequency: Frequency
  days_interval: number | null
  category: Category
  archived: boolean
  owner: number
  created_at: string
  updated_at: string
  streak: Streak
}

export type HabitLog = {
  id: number
  date: string
  completed: boolean
  note: string | null
  created_at: string
  updated_at: string
}

export type HabitPayload = {
  name: string
  description?: string | null
  frequency: Frequency
  days_interval?: number | null
  category: Category
  archived?: boolean
}

export type CheckInPayload = {
  date?: string
  completed?: boolean
  note?: string
}

export const CATEGORIES: Category[] = [
  'health',
  'mindfulness',
  'learning',
  'productivity',
  'finance',
  'social',
  'creativity',
  'other',
]

export const CATEGORY_LABEL: Record<Category, string> = {
  health: 'Health & Fitness',
  mindfulness: 'Mindfulness',
  learning: 'Learning',
  productivity: 'Productivity',
  finance: 'Finance',
  social: 'Social',
  creativity: 'Creativity',
  other: 'Other',
}

export const FREQUENCIES: Frequency[] = ['daily', 'weekly', 'custom']

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  custom: 'Custom',
}

export function frequencyDescription(habit: Pick<Habit, 'frequency' | 'days_interval'>) {
  if (habit.frequency === 'custom') {
    const n = habit.days_interval ?? 1
    return `Every ${n} day${n === 1 ? '' : 's'}`
  }
  return FREQUENCY_LABEL[habit.frequency]
}

export function streakUnitLabel(frequency: Frequency) {
  return frequency === 'weekly' ? 'week streak' : 'day streak'
}

export function todayISO() {
  return new Date().toLocaleDateString('en-CA')
}

export function isCompletedToday(habit: Habit) {
  if (!habit.streak.last_completed_date) return false
  return habit.streak.last_completed_date === todayISO()
}

export function daysSince(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((today.getTime() - date.getTime()) / 86_400_000)
}

export function lastNDates(n: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dates: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d.toLocaleDateString('en-CA'))
  }
  return dates
}

const WEEKDAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function weekdayLetter(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return WEEKDAY_SHORT[new Date(y, m - 1, d).getDay()]
}
