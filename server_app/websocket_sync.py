import json

from fastapi import WebSocket
from redis.asyncio import Redis
from common.redis_client import RedisClient
from common.job_updates import UPDATES_CHANNEL, JobUpdateMessage

from server_app.message_enums import OutboundWebsocketMessage
from server_app.schemas import WebsocketResponseMessageSchema
from server_app.pubsub_message_service import (
    handle_pubsub_message,
)

redis_client = RedisClient()


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    def get_active_websocket(self, applicant_id: str) -> WebSocket:
        return self.active_connections.get(applicant_id, None)

    async def connect(self, websocket: WebSocket, applicant_id: str):
        await websocket.accept()
        self.active_connections[applicant_id] = websocket

    async def send_message(
        self, websocket: WebSocket, message: WebsocketResponseMessageSchema
    ):
        await websocket.send_json(message.model_dump(mode="json"))

    def disconnect(self, applicant_id: str):
        del self.active_connections[applicant_id]


class InstanceSync:
    def __init__(self, local_manager: ConnectionManager):
        self.local_manager = local_manager
        redis = Redis(decode_responses=True)
        self.pubsub = redis.pubsub()

    async def handle_messages(self):
        await self.pubsub.subscribe(UPDATES_CHANNEL)
        await self.pubsub.subscribe(
            "__keyevent@0__:expired"  # listens for expired keys
        )
        async for redis_message in self.pubsub.listen():
            if redis_message["type"] == "message":
                data = json.loads(redis_message["data"])
                message = JobUpdateMessage.model_validate(data)

                websocket = self.local_manager.get_active_websocket(
                    message.applicant_id
                )

                if websocket:
                    response = handle_pubsub_message(message)
                    await self.local_manager.send_message(websocket, response)
            # Applicant's data expired from redis key/value store
            elif redis_message["type"] == "pmessage":
                expired_applicant_id = redis_message["data"].decode()
                websocket = self.local_manager.get_active_websocket(
                    expired_applicant_id
                )
                if websocket:
                    await self.local_manager.send_message(
                        websocket,
                        {"type": OutboundWebsocketMessage.APPLICANT_DATA_EXPIRED},
                    )


manager = ConnectionManager()
connection_manager = InstanceSync(manager)
