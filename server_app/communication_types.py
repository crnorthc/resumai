from enum import Enum

from server_app.exceptions import InvalidWebsocketMessage

WEBSOCKET_CHANNEL = "ws"


class InstanceSyncMessages(Enum):
    CONNECTION_ESTABLISHED = "connection_established"


class InboundWebsocketMessage(Enum):
    GENERATE_RESUME = "generate_resume"
    CONFIRMED_PROMPT = "confirmed_prompt"
    CONFIRMED_INFO = "confirmed_info"


class OutboundWebsocketMessage(Enum):
    MISSING_FIELDS = "missing_fields"
    GENERATION_QUEUED = "generation_queued"
    JOB_STARTED = "job_started"
    CONFIRM_PROMPT = "confirm_prompt"
    CONFIRM_INFO = "confirm_info"
    DOCUMENT_GENERATING = "document_generating"
    JOB_COMPLETED = "job_completed"

    # An applicant's data expired in the redis key/value store
    APPLICANT_DATA_EXPIRED = "applicant_data_expired"


def get_websocket_message_type(message_type: str) -> OutboundWebsocketMessage:
    for websocket_message in [*OutboundWebsocketMessage, *InboundWebsocketMessage]:
        if websocket_message.value == message_type:
            return websocket_message

    raise InvalidWebsocketMessage("Invalid message type")
