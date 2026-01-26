import Link from 'next/link'
import { ArticleSummary } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { formatRelativeTime } from '@/lib/utils'

interface ArticleCardProps {
  article: ArticleSummary
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatRelativeTime(article.published_at)}</span>
          </div>
        </CardHeader>
        {article.summary && (
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {article.summary}
            </p>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
