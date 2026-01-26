'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Navigation } from '../../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FactCard } from '@/components/FactCard'
import { SourceBadge } from '@/components/SourceBadge'
import { Badge } from '@/components/ui/badge'

export default function ClusterDetailPage() {
  const params = useParams()
  const clusterId = String(params.id)

  const { data: cluster, isLoading, error } = useQuery({
    queryKey: ['cluster', clusterId],
    queryFn: () => api.getCluster(clusterId),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div>Loading cluster...</div>
        </main>
      </div>
    )
  }

  if (error || !cluster) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-destructive">Cluster not found</div>
        </main>
      </div>
    )
  }

  // Group facts by source
  const factsBySource = new Map<string, typeof cluster.facts>()
  if (cluster.facts) {
    cluster.facts.forEach((cf) => {
      const sourceName = cf.source.name
      if (!factsBySource.has(sourceName)) {
        factsBySource.set(sourceName, [])
      }
      factsBySource.get(sourceName)!.push(cf)
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">
              Cluster {cluster.cluster_id.slice(0, 8)}
            </CardTitle>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">{cluster.fact_count} facts</Badge>
              <Badge variant="secondary">{cluster.article_count} articles</Badge>
              <Badge variant="secondary">{cluster.sources.length} sources</Badge>
            </div>
          </CardHeader>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Aligned Facts by Source</h2>
          <div className="space-y-6">
            {Array.from(factsBySource.entries()).map(([sourceName, facts]) => (
              <Card key={sourceName}>
                <CardHeader>
                  <CardTitle className="text-lg">{sourceName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {facts.length} fact{facts.length !== 1 ? 's' : ''} from this source
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {facts.map((cf) => (
                      <div key={cf.fact.id} className="border-l-4 border-primary pl-4">
                        <FactCard fact={cf.fact} showClusters={false} />
                        <div className="mt-2 text-xs text-muted-foreground">
                          From: <a
                            href={`/articles/${cf.article.id}`}
                            className="text-primary hover:underline"
                          >
                            {cf.article.title}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
