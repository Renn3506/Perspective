from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from . import models
from .dependencies import get_db
from backend.common.db.models import Article as DBArticle, Fact as DBFact, Source as DBSource, Alignment as DBAlignment

app = FastAPI(title="Perspective API")

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Perspective API"}


@app.get("/api/articles", response_model=models.PaginatedArticles)
def list_articles(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
    source_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    q: Optional[str] = None, # Added query parameter
):
    query = db.query(DBArticle)
    if source_id:
        query = query.filter(DBArticle.source_id == source_id)
    if start_date:
        query = query.filter(DBArticle.published_at >= start_date)
    if end_date:
        query = query.filter(DBArticle.published_at <= end_date)
    if q:
        query = query.filter(DBArticle.title.ilike(f"%{q}%")) # Case-insensitive search
    
    total = query.count()
    articles = query.offset(skip).limit(limit).all()
    return {"items": articles, "total": total, "skip": skip, "limit": limit}


@app.get("/api/articles/{article_id}", response_model=models.Article)
def get_article(article_id: int, db: Session = Depends(get_db)):
    from sqlalchemy.orm import joinedload
    article = db.query(DBArticle).options(joinedload(DBArticle.source)).filter(DBArticle.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Manually construct the Article model to include the source
    return models.Article(
        id=article.id,
        title=article.title,
        url=article.url,
        published_at=article.published_at,
        source_id=article.source_id,
        summary=article.summary, # Assuming summary exists
        tone=article.tone, # Assuming tone exists
        tone_confidence=article.tone_confidence, # Assuming tone_confidence exists
        flesch_kincaid_grade=article.flesch_kincaid_grade, # Assuming flesch_kincaid_grade exists
        facts=article.facts,
        source=models.Source(
            id=article.source.id,
            name=article.source.name,
            url=article.source.url,
            article_count=db.query(DBArticle).filter(DBArticle.source_id == article.source.id).count()
        ),
        body=article.body, # Include body
    )


@app.get("/api/articles/{article_id}/facts", response_model=List[models.Fact])
def get_article_facts(article_id: int, db: Session = Depends(get_db)):
    article = db.query(DBArticle).filter(DBArticle.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article.facts


@app.get("/api/clusters", response_model=List[models.Cluster])
def list_clusters(db: Session = Depends(get_db), skip: int = 0, limit: int = 20):
    # This is a simplified implementation.
    # A real implementation would involve more complex aggregation.
    return []


@app.get("/api/clusters/{cluster_id}", response_model=models.ClusterDetail)
def get_cluster(cluster_id: int, db: Session = Depends(get_db)):
    # This is a simplified implementation.
    raise HTTPException(status_code=404, detail="Cluster not found")


@app.get("/api/clusters/{cluster_id}/articles", response_model=List[models.ArticleSummary])
def get_cluster_articles(cluster_id: int, db: Session = Depends(get_db)):
    # This is a simplified implementation.
    raise HTTPException(status_code=404, detail="Cluster not found")


@app.get("/api/sources", response_model=List[models.Source])
def list_sources(db: Session = Depends(get_db)):
    sources = db.query(DBSource).all()
    response_sources = []
    for source in sources:
        article_count = db.query(DBArticle).filter(DBArticle.source_id == source.id).count()
        response_sources.append(models.Source(
            id=source.id,
            name=source.name,
            url=source.url,
            article_count=article_count
        ))
    return response_sources


@app.get("/api/sources/{source_id}", response_model=models.Source)
def get_source(source_id: int, db: Session = Depends(get_db)):
    source = db.query(DBSource).filter(DBSource.id == source_id).first()
    if source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    article_count = db.query(DBArticle).filter(DBArticle.source_id == source.id).count()
    return models.Source(
        id=source.id,
        name=source.name,
        url=source.url,
        article_count=article_count
    )


@app.get("/api/stats", response_model=models.Stats)
def get_stats(db: Session = Depends(get_db)):
    total_articles = db.query(DBArticle).count()
    total_sources = db.query(DBSource).count()
    # Simplified cluster count.
    total_clusters = db.query(DBAlignment.cluster_id).distinct().count()
    recent_activity = db.query(DBArticle).order_by(DBArticle.published_at.desc()).limit(5).all()
    return models.Stats(
        total_articles=total_articles,
        total_sources=total_sources,
        total_clusters=total_clusters,
        recent_activity=recent_activity,
    )


@app.get("/api/search")
def search(q: str, db: Session = Depends(get_db)):
    # Placeholder for search functionality
    return {"results": []}