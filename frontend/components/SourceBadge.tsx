import { Badge } from './ui/badge'
import { Source } from '@/lib/types'

interface SourceBadgeProps {
  source: Source
  showCount?: boolean
}

export function SourceBadge({ source, showCount = false }: SourceBadgeProps) {
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <span>{source.name}</span>
      {showCount && source.article_count !== undefined && (
        <span className="text-xs opacity-70">({source.article_count})</span>
      )}
    </Badge>
  )
}
