import json

import redis
from redis.asyncio import Redis
from dotenv import load_dotenv
from pydantic import validate_call

from common.job_updates import JobUpdateMessage

load_dotenv()

SECOND_IN_TEN_MINS = 10 * 60


class RedisClient:
    def __init__(self, host, port):
        self.redis = redis.Redis(
            host=host,
            port=port,
        )
        self.async_redis = Redis(host=host, port=port, decode_responses=True)
        try:
            if self.redis.ping():
                print("✅ Connected to Redis!")
        except redis.exceptions.ConnectionError as e:
            print("❌ Redis connection failed:", e)

    @validate_call
    def publish(self, channel: str, message: JobUpdateMessage):
        response = self.redis.publish(channel, message.model_dump_json())
        print("✅ Published to Redis!", response)

    def get_pubsub(self):
        return self.async_redis.pubsub()

    def get(self, key):
        data = self.redis.get(key)

        if not data:
            return None

        return json.loads(data)

    def set(self, key, data, expiration=SECOND_IN_TEN_MINS):
        self.redis.set(key, json.dumps(data), ex=expiration)
