'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { StatsCard } from '@/components/StatsCard'
import { ArticleCard } from '@/components/ArticleCard'
import { Navigation } from './components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats(),
  })

  const { data: recentArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles', 'recent'],
    queryFn: () => api.getArticles(0, 6),
  })

  const { data: clusters, isLoading: clustersLoading } = useQuery({
    queryKey: ['clusters', 'top'],
    queryFn: () => api.getClusters(0, 10),
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of news articles, sources, and fact clusters
          </p>
        </div>

        {statsLoading ? (
          <div className="mb-8">Loading statistics...</div>
        ) : stats ? (
          <StatsCard stats={stats} />
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
            </CardHeader>
            <CardContent>
              {articlesLoading ? (
                <div>Loading articles...</div>
              ) : recentArticles?.items.length ? (
                <div className="space-y-4">
                  {recentArticles.items.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No articles found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Clusters</CardTitle>
            </CardHeader>
            <CardContent>
              {clustersLoading ? (
                <div>Loading clusters...</div>
              ) : clusters?.length ? (
                <div className="space-y-2">
                  {clusters.map((cluster) => (
                    <div
                      key={cluster.cluster_id}
                      className="p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Cluster {cluster.cluster_id.slice(0, 8)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {cluster.fact_count} facts, {cluster.article_count}{' '}
                          articles
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Sources: {cluster.sources.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No clusters found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
