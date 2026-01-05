import logging
import requests
from typing import List, Dict
from datetime import datetime
import time

from .base import BaseIngestionSource
from .sources import NEWSAPI

logger = logging.getLogger(__name__)


class NewsAPIIngestionSource(BaseIngestionSource):
    """
    Ingestion source for NewsAPI.
    """

    def __init__(self):
        super().__init__(source_name="newsapi")

    def fetch_articles(self) -> List[Dict]:
        articles: List[Dict] = []
        page = 1

        while page <= NEWSAPI["max_pages"]:
            logger.info("newsapi: fetching page %d", page)
            page_articles = self._fetch_page(page)
            articles.extend(page_articles)
            page += 1

        logger.info("newsapi: fetched %d articles total", len(articles))
        return articles

    def _fetch_page(self, page: int) -> List[Dict]:
        params = {
            "q": NEWSAPI["query"],
            "pageSize": NEWSAPI["page_size"],
            "page": page,
            "apiKey": NEWSAPI["api_key"],
            "language": "en",
        }

        try:
            response = requests.get(
                NEWSAPI["endpoint"],
                params=params,
                timeout=10,
            )
            response.raise_for_status()

        except requests.exceptions.HTTPError as exc:
            resp = exc.response

            if resp is not None and resp.status_code == 429:
                logger.warning("newsapi: rate limit hit, sleeping 60s")
                time.sleep(60)
                return self._fetch_page(page)

            raise

        except requests.exceptions.RequestException:
            raise

        data = response.json()
        return [self._normalize(a) for a in data.get("articles", [])]

    def _normalize(self, article: Dict) -> Dict:
        """
        Normalize NewsAPI article into internal schema.
        """
        published = article.get("publishedAt")

        return {
            "title": article.get("title"),
            "body": article.get("content") or article.get("description"),
            "url": article.get("url"),
            "published_at": (
                datetime.fromisoformat(published.replace("Z", ""))
                if published
                else None
            ),
            "source_name": article.get("source", {}).get("name"),
        }
