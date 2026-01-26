from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Fact(BaseModel):
    id: int
    text: str
    source_text: Optional[str]
    is_quantitative: bool
    confidence: Optional[float]

    class Config:
        orm_mode = True


class Article(BaseModel):
    id: int
    title: str
    url: str
    source_id: int
    published_at: datetime
    flesch_kincaid_grade: Optional[float]
    summary: Optional[str]
    tone: Optional[str]
    tone_confidence: Optional[float]
    facts: List[Fact] = []
    body: Optional[str] = None # Added body field
    source: Optional[Source] = None # Added source field

    class Config:
        orm_mode = True


class ArticleSummary(BaseModel):
    id: int
    title: str
    url: str
    source_id: int
    published_at: datetime
    summary: Optional[str]

    class Config:
        orm_mode = True

class PaginatedArticles(BaseModel):
    items: List[ArticleSummary]
    total: int
    skip: int
    limit: int

class Source(BaseModel):
    id: int
    name: str
    url: str
    article_count: int

    class Config:
        orm_mode = True


class Cluster(BaseModel):
    id: int
    representative_fact: str
    fact_count: int
    article_count: int

    class Config:
        orm_mode = True


class ClusterDetail(Cluster):
    aligned_facts: List[Fact]


class Stats(BaseModel):
    total_articles: int
    total_sources: int
    total_clusters: int
    recent_activity: List[ArticleSummary]