'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ArticleCard } from '@/components/ArticleCard'
import { Navigation } from '../components/Navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ArticlesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sourceId, setSourceId] = useState<number | undefined>()
  const limit = 20; // Define limit for articles per page

  const { data, isLoading, error } = useQuery({
    queryKey: ['articles', page, search, sourceId],
    queryFn: () => api.getArticles((page - 1) * limit, limit, sourceId, undefined, undefined, search || undefined),
  })

  const { data: sources } = useQuery({
    queryKey: ['sources'],
    queryFn: () => api.getSources(),
  })

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Articles</h1>
          <p className="text-muted-foreground">
            Browse and search news articles from multiple sources
          </p>
        </div>

        <div className="mb-6 flex gap-4 flex-wrap">
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="max-w-sm"
          />
          <select
            value={sourceId || ''}
            onChange={(e) => {
              setSourceId(e.target.value ? Number(e.target.value) : undefined)
              setPage(1)
            }}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="">All Sources</option>
            {sources?.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div>Loading articles...</div>
        ) : error ? (
          <div className="text-destructive">Error loading articles</div>
        ) : data?.items.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.items.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No articles found
          </div>
        )}
      </main>
    </div>
  )
}
