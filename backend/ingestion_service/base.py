from abc import ABC, abstractmethod
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


class BaseIngestionSource(ABC):
    """
    Abstract base class for all ingestion sources.

    Responsibilities:
    - Fetch raw articles from an external source
    - Normalize them into a common schema
    """

    def __init__(self, source_name: str):
        self.source_name = source_name

    @abstractmethod
    def fetch_articles(self) -> List[Dict]:
        """
        Fetch raw articles from the external source.

        Returns:
            List of article dicts with keys:
            - title
            - body
            - published_at
            - url
        """
        raise NotImplementedError