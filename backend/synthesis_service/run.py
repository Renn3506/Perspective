import logging
import time
import os
from datetime import datetime

from common.queue import ARTICLE_QUEUE # Reusing the queue definition
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Assuming models are defined in backend/db/models.py
from common.db.models import Article, Source, Base

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)

# Database setup
# This will be used by the synthesis service to store processed articles/facts
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def consume_articles():
    logger.info("Synthesis service started. Listening for articles...")
    while True:
        # Blocking pop with a timeout
        article_data = ARTICLE_QUEUE.get(block=True, timeout=5)
        if article_data:
            logger.info("Received article from queue: %s", article_data.get("title"))
            # Here you would add your synthesis logic:
            # - Extract facts
            # - Perform alignment and clustering
            # - Generate neutral article
            # - Analyze bias
            
            db = SessionLocal()
            try:
                source_name = article_data.get("source_name", "Unknown Source")
                source_url = "http://unknown.com" # NewsAPI does not provide source URL
                
                source_obj = db.query(Source).filter_by(name=source_name).first()
                if not source_obj:
                    source_obj = Source(name=source_name, url=source_url)
                    db.add(source_obj)
                    db.commit()
                    db.refresh(source_obj)

                # Check if article already exists by URL
                existing_article = db.query(Article).filter_by(url=article_data["url"]).first()
                if not existing_article:
                    published_at_str = article_data.get("published_at")
                    published_at = datetime.fromisoformat(published_at_str) if published_at_str else None
                    new_article = Article(
                        title=article_data["title"],
                        body=article_data.get("body"),
                        url=article_data["url"],
                        published_at=published_at,
                        source_id=source_obj.id
                    )
                    db.add(new_article)
                    db.commit()
                    db.refresh(new_article)
                    logger.info("Stored article in DB: %s", new_article.title)
                else:
                    logger.info("Article already exists in DB (URL: %s), skipping storage.", article_data["url"])
            except Exception as e:
                db.rollback()
                logger.error("Error storing article in DB: %s", e)
            finally:
                db.close()
            
        else:
            logger.debug("No articles in queue, waiting...")
        time.sleep(1) # Prevent busy-waiting too much


if __name__ == "__main__":
    consume_articles()
