import redis
import json
import os
from .json_encoder import CustomJSONEncoder

class RedisQueue:
    def __init__(self, name, **redis_kwargs):
        self.key = f"queue:{name}"
        self.redis = redis.Redis(**redis_kwargs)

    def put(self, item):
        self.redis.rpush(self.key, json.dumps(item, cls=CustomJSONEncoder))

    def get(self, block=True, timeout=None):
        if block:
            item = self.redis.blpop(self.key, timeout=timeout)
        else:
            item = self.redis.lpop(self.key)

        if item:
            return json.loads(item[1]) if block else json.loads(item)
        return None

# Global Redis queue instance for articles
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
ARTICLE_QUEUE = RedisQueue("articles", host=REDIS_HOST, port=REDIS_PORT)