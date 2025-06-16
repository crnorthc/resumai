from typing import List, TypedDict

from pydantic import BaseModel

from server_app.communication_types import OutboundWebsocketMessage
from common.applicant_data import GeneratePayloadSchema
from common.redis_types import GeneratedData


class EncryptApiKeySchema(BaseModel):
    key: str


class WebsocketRequestMessageSchema(TypedDict):
    type: OutboundWebsocketMessage
    data: GeneratedData | GeneratePayloadSchema


class GenericResponseSchema(TypedDict):
    message: str


class MissingFieldsSchema(TypedDict):
    missing_fields: List[str]


class WebsocketResponseMessageSchema(TypedDict):
    type: OutboundWebsocketMessage
    data: GenericResponseSchema | MissingFieldsSchema | None
