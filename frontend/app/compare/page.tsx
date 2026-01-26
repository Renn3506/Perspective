'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Navigation } from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SourceBadge } from '@/components/SourceBadge'

export default function ComparePage() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)

  const { data: clusters } = useQuery({
    queryKey: ['clusters'],
    queryFn: () => api.getClusters(50),
  })

  const { data: cluster } = useQuery({
    queryKey: ['cluster', selectedCluster],
    queryFn: () => api.getCluster(selectedCluster!),
    enabled: !!selectedCluster,
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Source Comparison</h1>
          <p className="text-muted-foreground">
            Compare how different sources cover the same events
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Cluster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {clusters?.map((c) => (
                  <Button
                    key={c.cluster_id}
                    variant={selectedCluster === c.cluster_id ? 'default' : 'outline'}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedCluster(c.cluster_id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-mono">
                        {c.cluster_id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.fact_count} facts, {c.article_count} articles
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            {selectedCluster && cluster ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Cluster {cluster.cluster_id.slice(0, 8)} - Source Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cluster.sources.map((sourceName) => {
                        const sourceFacts = cluster.facts?.filter(
                          (cf) => cf.source.name === sourceName
                        ) || []
                        return (
                          <Card key={sourceName}>
                            <CardHeader>
                              <CardTitle className="text-lg">{sourceName}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {sourceFacts.length} fact{sourceFacts.length !== 1 ? 's' : ''}
                              </p>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {sourceFacts.map((cf) => (
                                  <div
                                    key={cf.fact.id}
                                    className="p-3 bg-muted rounded-md text-sm"
                                  >
                                    {cf.fact.text}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Select a cluster to compare sources
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
