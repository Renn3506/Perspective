// frontend/lib/api.ts
import { Article, ArticleSummary, Fact, Source, Cluster, Stats, PaginatedArticles, ClusterDetail } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  getArticles: async (
    skip: number = 0,
    limit: number = 20,
    source_id?: number,
    start_date?: string,
    end_date?: string,
    q?: string
  ): Promise<PaginatedArticles> => {
    const params = new URLSearchParams();
    params.append("skip", String(skip));
    params.append("limit", String(limit));
    if (source_id) params.append("source_id", String(source_id));
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);
    if (q) params.append("q", q);
    const items = await fetcher<ArticleSummary[]>(`/api/articles?${params.toString()}`);
    return { items, total: 0, skip, limit }; // Hardcode total for now
  },

  getArticle: (id: number): Promise<Article> => {
    return fetcher<Article>(`/api/articles/${id}`);
  },

  getArticleFacts: (id: number): Promise<Fact[]> => {
    return fetcher<Fact[]>(`/api/articles/${id}/facts`);
  },

  getSources: (): Promise<Source[]> => {
    return fetcher<Source[]>("/api/sources");
  },

  getSource: (id: number): Promise<Source> => {
    return fetcher<Source>(`/api/sources/${id}`);
  },

  getClusters: (
    skip: number = 0,
    limit: number = 20
  ): Promise<Cluster[]> => {
    // Placeholder data for now, as backend is not fully implemented
    return Promise.resolve([
      {
        cluster_id: "cluster123",
        representative_fact: "This is a representative fact from cluster 1",
        fact_count: 5,
        article_count: 3,
        sources: ["Source A", "Source B"],
      },
      {
        cluster_id: "cluster456",
        representative_fact: "This is a representative fact from cluster 2",
        fact_count: 8,
        article_count: 5,
        sources: ["Source C"],
      },
    ]);
    // const params = new URLSearchParams();
    // params.append("skip", String(skip));
    // params.append("limit", String(limit));
    // return fetcher<Cluster[]>(`/api/clusters?${params.toString()}`);
  },

  getCluster: (id: string): Promise<ClusterDetail> => {
    // Placeholder data for now
    return Promise.resolve({
      cluster_id: id,
      representative_fact: `Representative fact for cluster ${id}`,
      fact_count: 10,
      article_count: 5,
      sources: ["Source A", "Source D"],
      facts: [
        {
          fact: {
            id: 1,
            text: `Fact 1 for cluster ${id} from Source A`,
            is_quantitative: false,
          },
          source: { id: 1, name: "Source A", url: "http://sourcea.com", article_count: 100 },
          article: { id: 101, title: "Article 1 Title", url: "http://sourcea.com/article1" },
        },
        {
          fact: {
            id: 2,
            text: `Fact 2 for cluster ${id} from Source B`,
            is_quantitative: false,
          },
          source: { id: 2, name: "Source B", url: "http://sourceb.com", article_count: 50 },
          article: { id: 102, title: "Article 2 Title", url: "http://sourceb.com/article2" },
        },
      ],
    });
  },

  getClusterArticles: (id: number): Promise<ArticleSummary[]> => {
    return fetcher<ArticleSummary[]>(`/api/clusters/${id}/articles`);
  },

  getStats: (): Promise<Stats> => {
    return fetcher<Stats>("/api/stats");
  },

  search: (query: string): Promise<any> => {
    const params = new URLSearchParams();
    params.append("q", query);
    return fetcher<any>(`/api/search?${params.toString()}`);
  },
};
