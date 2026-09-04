import type { ReactNode, SVGProps } from 'react'
import type { Category } from '@/modules/dashboard/types'

type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps): IconProps {
  return {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...props,
  }
}

const paths: Record<Category, ReactNode> = {
  health: (
    <>
      <rect x="2" y="9" width="3" height="6" rx="1" />
      <rect x="19" y="9" width="3" height="6" rx="1" />
      <line x1="6.5" y1="12" x2="17.5" y2="12" />
      <rect x="6" y="7" width="2.5" height="10" rx="1" />
      <rect x="15.5" y="7" width="2.5" height="10" rx="1" />
    </>
  ),
  mindfulness: (
    <>
      <path d="M12 3c-4 3-7 7-7 11a7 7 0 0 0 14 0c0-4-3-8-7-11Z" />
      <path d="M12 8v10" />
    </>
  ),
  learning: (
    <>
      <path d="M4 5c3-1.5 6-1.5 8 0v13c-2-1.5-5-1.5-8 0Z" />
      <path d="M20 5c-3-1.5-6-1.5-8 0v13c2-1.5 5-1.5 8 0Z" />
    </>
  ),
  productivity: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  finance: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  social: (
    <>
      <path d="M17 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
      <circle cx="10" cy="7" r="3.3" />
      <path d="M21 19v-1a4 4 0 0 0-2.8-3.8" />
      <path d="M15.3 3.4a3.3 3.3 0 0 1 0 6.4" />
    </>
  ),
  creativity: (
    <>
      <path d="M14 4l6 6-8.5 8.5a3 3 0 0 1-2 1l-3.5.5.5-3.5a3 3 0 0 1 1-2Z" />
      <path d="M13 6l5 5" />
    </>
  ),
  other: (
    <>
      <path d="M12.5 3H5a2 2 0 0 0-2 2v7.5a1 1 0 0 0 .3.7l9.5 9.5a1 1 0 0 0 1.4 0l7.5-7.5a1 1 0 0 0 0-1.4l-9.5-9.5a1 1 0 0 0-.7-.3Z" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
}

export function CategoryIcon({
  category,
  ...props
}: { category: Category } & IconProps) {
  return <svg {...base(props)}>{paths[category]}</svg>
}
