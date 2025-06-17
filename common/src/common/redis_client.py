import os
import json

import redis
from dotenv import load_dotenv
from pydantic import validate_call

from common.job_updates import JobUpdateMessage

load_dotenv()

SECOND_IN_TEN_MINS = 10 * 60


class RedisClient:
    def __init__(self):
        self.redis = redis.Redis(
            host=os.environ.get("REDIS_HOST"), port=os.environ.get("REDIS_PORT"), db=0
        )

    @validate_call
    def publish(self, channel: str, message: JobUpdateMessage):
        return self.redis.publish(channel, message.model_dump_json())

    def get_pubsub(self):
        return self.redis.pubsub()

    def get(self, key):
        data = self.redis.get(key)

        if not data:
            return None

        return json.loads(data)

    def set(self, key, data, expiration=SECOND_IN_TEN_MINS):
        self.redis.set(key, json.dumps(data), ex=expiration)
