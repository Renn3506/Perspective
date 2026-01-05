import os

NEWSAPI = {
    "api_key": os.getenv("NEWS_API_KEY"),
    "endpoint": os.getenv("NEWSAPI_ENDPOINT", "https://newsapi.org/v2/everything"),
    "query": os.getenv("NEWSAPI_QUERY", "technology OR politics OR economy"),
    "page_size": int(os.getenv("NEWSAPI_PAGE_SIZE", "20")),
    "max_pages": int(os.getenv("NEWSAPI_MAX_PAGES", "2")),
}
