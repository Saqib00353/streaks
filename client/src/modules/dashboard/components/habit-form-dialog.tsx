import { type FormEvent, useEffect, useState } from 'react'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CategoryIcon } from '@/modules/dashboard/components/category-icon'
import { CloseIcon } from '@/modules/dashboard/components/icons'
import {
  CATEGORIES,
  CATEGORY_LABEL,
  FREQUENCIES,
  FREQUENCY_LABEL,
  type Category,
  type Frequency,
  type Habit,
  type HabitPayload,
} from '@/modules/dashboard/types'
import { cn } from '@/lib/cn'

type HabitFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  habit: Habit | null
  onSubmit: (payload: HabitPayload) => Promise<void>
}

const EMPTY_FORM = {
  name: '',
  description: '',
  frequency: 'daily' as Frequency,
  daysInterval: '3',
  category: 'health' as Category,
}

export function HabitFormDialog({ open, onOpenChange, habit, onSubmit }: HabitFormDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    if (habit) {
      setForm({
        name: habit.name,
        description: habit.description ?? '',
        frequency: habit.frequency,
        daysInterval: String(habit.days_interval ?? 3),
        category: habit.category,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, habit])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Give your habit a name.')
      return
    }
    if (form.frequency === 'custom' && (!form.daysInterval || Number(form.daysInterval) < 1)) {
      setError('Enter how many days this habit repeats every.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim() || null,
        frequency: form.frequency,
        days_interval: form.frequency === 'custom' ? Number(form.daysInterval) : null,
        category: form.category,
      })
      onOpenChange(false)
    } catch {
      setError('Could not save this habit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{habit ? 'Edit habit' : 'New habit'}</DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <CloseIcon width={16} height={16} />
            </button>
          </DialogHeader>

          <DialogBody>
            <div className="grid gap-1.5">
              <Label htmlFor="habit-name">Name</Label>
              <Input
                id="habit-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="habit-description">
                Description <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="habit-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Frequency</Label>
              <div className="flex gap-1 rounded-[var(--radius)] border border-border p-1">
                {FREQUENCIES.map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, frequency: freq }))}
                    className={cn(
                      'h-8 flex-1 rounded-md text-[13px] font-medium transition-colors',
                      form.frequency === freq
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {FREQUENCY_LABEL[freq]}
                  </button>
                ))}
              </div>
              {form.frequency === 'custom' && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[13px] text-muted-foreground">Repeat every</span>
                  <input
                    type="number"
                    min={1}
                    value={form.daysInterval}
                    onChange={(e) => setForm((f) => ({ ...f, daysInterval: e.target.value }))}
                    className="h-8 w-16 rounded-[var(--radius)] border border-input bg-background text-center text-[13px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="text-[13px] text-muted-foreground">days</span>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category }))}
                    className={cn(
                      'flex h-11 items-center gap-2 rounded-[var(--radius)] border px-3 text-[13px] font-medium transition-colors',
                      form.category === category
                        ? 'border-primary bg-accent text-primary'
                        : 'border-border text-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <CategoryIcon category={category} width={16} height={16} />
                    {CATEGORY_LABEL[category]}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : habit ? 'Save changes' : 'Save habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
