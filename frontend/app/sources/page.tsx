'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Navigation } from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function SourcesPage() {
  const { data: sources, isLoading, error } = useQuery({
    queryKey: ['sources'],
    queryFn: () => api.getSources(),
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">News Sources</h1>
          <p className="text-muted-foreground">
            All news sources tracked by Perspective
          </p>
        </div>

        {isLoading ? (
          <div>Loading sources...</div>
        ) : error ? (
          <div className="text-destructive">Error loading sources</div>
        ) : sources?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((source) => (
              <Card key={source.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {source.url} <ExternalLink className="w-4 h-4" />
                    </a>
                    {source.article_count !== undefined && (
                      <div className="pt-2">
                        <Badge variant="secondary">
                          {source.article_count} article{source.article_count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No sources found
          </div>
        )}
      </main>
    </div>
  )
}
