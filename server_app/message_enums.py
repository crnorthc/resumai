from enum import Enum

WEBSOCKET_CHANNEL = "ws"


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
    JOB_COMPLETED = "job_completed"

    # An applicant's data expired in the redis key/value store
    APPLICANT_DATA_EXPIRED = "applicant_data_expired"
