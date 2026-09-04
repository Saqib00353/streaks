import { ArchiveIcon } from '@/modules/dashboard/components/icons'
import { CATEGORY_LABEL, type Category } from '@/modules/dashboard/types'
import { cn } from '@/lib/cn'

type HabitFiltersProps = {
  categories: Category[]
  selected: Category | 'all'
  onSelect: (category: Category | 'all') => void
  archivedCount: number
  showArchived: boolean
  onToggleArchived: () => void
}

export function HabitFilters({
  categories,
  selected,
  onSelect,
  archivedCount,
  showArchived,
  onToggleArchived,
}: HabitFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect('all')}
          className={cn(
            'h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors',
            selected === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'border border-border text-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={cn(
              'h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors',
              selected === category
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {CATEGORY_LABEL[category]}
          </button>
        ))}
      </div>
      {archivedCount > 0 && (
        <button
          type="button"
          onClick={onToggleArchived}
          className={cn(
            'flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition-colors',
            showArchived
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          <ArchiveIcon width={14} height={14} />
          Archived ({archivedCount})
        </button>
      )}
    </div>
  )
}
