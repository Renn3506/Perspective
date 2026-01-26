import { Fact } from '@/lib/types'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import Link from 'next/link'

interface FactCardProps {
  fact: Fact
  showClusters?: boolean
}

export function FactCard({ fact, showClusters = true }: FactCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm mb-3">{fact.text}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {fact.confidence && fact.confidence > 0 && (
            <Badge variant="secondary">
              Confidence: {fact.confidence}%
            </Badge>
          )}
          {showClusters && fact.cluster_ids && fact.cluster_ids.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {fact.cluster_ids.map((clusterId) => (
                <Link
                  key={clusterId}
                  href={`/clusters/${clusterId}`}
                  className="text-xs"
                >
                  <Badge variant="outline" className="hover:bg-accent">
                    Cluster {clusterId.slice(0, 8)}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
