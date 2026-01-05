import logging
import os

from .newsapi import NewsAPIIngestionSource
from common.queue import ARTICLE_QUEUE

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)


def get_enabled_sources():
    source_map = {
        "newsapi": NewsAPIIngestionSource,
    }
    enabled_sources_str = os.getenv("ENABLED_SOURCES", "newsapi")
    enabled_sources_names = [s.strip() for s in enabled_sources_str.split(",")]

    sources = []
    for source_name in enabled_sources_names:
        if source_name in source_map:
            sources.append(source_map[source_name]())
        else:
            logger.warning("Unknown source: %s", source_name)
    return sources


def main():
    logger.info("Starting ingestion pipeline")

    total_articles_fetched = 0

    try:
        for source in get_enabled_sources():
            logger.info("Running source: %s", source.source_name)
            try:
                articles = source.fetch_articles()
                for article in articles:
                    ARTICLE_QUEUE.put(article)
                total_articles_fetched += len(articles)
                logger.info(
                    "%s: fetched %d articles and pushed to queue",
                    source.source_name,
                    len(articles),
                )
            except Exception as e:
                logger.error(
                    "Error processing source: %s. Skipping.",
                    source.source_name,
                    exc_info=e,
                )

    finally:
        pass # No database connection to close here

    logger.info("Ingestion complete: %d articles fetched and queued", total_articles_fetched)


if __name__ == "__main__":
    main()