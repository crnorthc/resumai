import os
import json

import redis
from dotenv import load_dotenv

load_dotenv()

SECOND_IN_TEN_MINS = 10 * 60


class RedisClient:
    def __init__(self):
        self.redis = redis.Redis(
            host=os.environ.get("REDIS_HOST"), port=os.environ.get("REDIS_PORT"), db=0
        )

    def publish(self, channel, message):
        return self.redis.publish(channel, json.dumps(message))

    def get_pubsub(self):
        return self.redis.pubsub()

    def get(self, key):
        data = self.redis.get(key)

        if not data:
            return None

        return json.loads(data)

    def set(self, key, data, expiration=SECOND_IN_TEN_MINS):
        self.redis.set(key, json.dumps(data), ex=expiration)


redis_client = RedisClient()
