'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Navigation } from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function ClustersPage() {
  const { data: clusters, isLoading, error } = useQuery({
    queryKey: ['clusters'],
    queryFn: () => api.getClusters(100),
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fact Clusters</h1>
          <p className="text-muted-foreground">
            Groups of aligned facts across different sources
          </p>
        </div>

        {isLoading ? (
          <div>Loading clusters...</div>
        ) : error ? (
          <div className="text-destructive">Error loading clusters</div>
        ) : clusters?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((cluster) => (
              <Link key={cluster.cluster_id} href={`/clusters/${cluster.cluster_id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Cluster {cluster.cluster_id.slice(0, 8)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Facts:</span>
                        <span className="font-medium">{cluster.fact_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Articles:</span>
                        <span className="font-medium">{cluster.article_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sources:</span>
                        <span className="font-medium">{cluster.sources.length}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground truncate">
                          {cluster.sources.join(', ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No clusters found
          </div>
        )}
      </main>
    </div>
  )
}
