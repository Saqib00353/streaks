import { useEffect, useRef, useState } from 'react'
import { ArchiveIcon, MoreIcon, PencilIcon } from '@/modules/dashboard/components/icons'

type HabitMenuProps = {
  onEdit: () => void
  onArchive: () => void
}

export function HabitMenu({ onEdit, onArchive }: HabitMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Habit actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <MoreIcon width={16} height={16} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-[var(--radius)] border border-border bg-card py-1 shadow-md"
        >
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false)
              onEdit()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <PencilIcon width={14} height={14} />
            Edit
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false)
              onArchive()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <ArchiveIcon width={14} height={14} />
            Archive
          </button>
        </div>
      )}
    </div>
  )
}
