'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Navigation } from '../../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FactCard } from '@/components/FactCard'
import { SourceBadge } from '@/components/SourceBadge'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ArticleDetailPage() {
  const params = useParams()
  const articleId = Number(params.id)

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => api.getArticle(articleId),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div>Loading article...</div>
        </main>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-destructive">Article not found</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{article.title}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {article.source && <SourceBadge source={article.source} />}
                  <span>{formatDate(article.published_at)}</span>
                  {article.facts && article.facts.length > 0 && (
                    <Badge variant="secondary">
                      {article.facts.length} facts
                    </Badge>
                  )}
                </div>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Original <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </CardHeader>
          {article.body && (
            <CardContent>
              <div className="prose max-w-none whitespace-pre-wrap">
                {article.body}
              </div>
            </CardContent>
          )}
        </Card>

        {article.facts && article.facts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Extracted Facts</h2>
            <div className="space-y-4">
              {article.facts.map((fact) => (
                <FactCard key={fact.id} fact={fact} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
