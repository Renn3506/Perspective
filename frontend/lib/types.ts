// frontend/lib/types.ts
export interface Fact {
  id: number;
  text: string;
  source_text?: string;
  is_quantitative: boolean;
  confidence?: number;
  cluster_ids?: string[]; // Added cluster_ids
}

export interface Article {
  id: number;
  title: string;
  url: string;
  source_id: number;
  published_at: string; // datetime comes as string from FastAPI
  flesch_kincaid_grade?: number;
  summary?: string;
  tone?: string;
  tone_confidence?: number;
  facts: Fact[];
  source?: Source; // Added optional Source object
  body?: string; // Added optional article body
}

export interface ArticleSummary {
  id: number;
  title: string;
  url: string;
  source_id: number;
  published_at: string;
  summary?: string;
}

export interface PaginatedArticles {
  items: ArticleSummary[];
  total: number; // Assuming a total count is also returned for pagination
  skip: number;
  limit: number;
}

export interface Source {
  id: number;
  name: string;
  url: string;
  article_count: number;
}

export interface Cluster {
  cluster_id: string; // Changed from 'id' to 'cluster_id'
  representative_fact: string;
  fact_count: number;
  article_count: number;
  sources: string[]; // Added sources
}

export interface ClusterArticle {
  id: number;
  title: string;
  url: string;
}

export interface ClusterFact {
  fact: Fact;
  source: Source;
  article: ClusterArticle;
}

export interface ClusterDetail extends Cluster {
  facts: ClusterFact[]; // Changed from aligned_facts: Fact[]
}

export interface Stats {
  total_articles: number;
  total_sources: number;
  total_clusters: number;
  recent_activity: ArticleSummary[];
}