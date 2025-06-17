from typing import List, Any, Optional

from pydantic import BaseModel, Field
from common.applicant_schemas import GeneratedData

from server_app.message_enums import (
    OutboundWebsocketMessage,
    InboundWebsocketMessage,
)


class EncryptApiKeySchema(BaseModel):
    key: str


class WebsocketRequestMessageSchema(BaseModel):
    type: InboundWebsocketMessage
    data: Optional[Any] = Field(None)


class WebsocketResponseMessageSchema(BaseModel):
    type: OutboundWebsocketMessage
    data: Optional[str | List[str] | GeneratedData | None] = Field(None)
