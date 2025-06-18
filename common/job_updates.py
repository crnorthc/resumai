from enum import Enum

from pydantic import BaseModel


UPDATES_CHANNEL = "updates_channel"


class JobUpdate(Enum):
    JOB_STARTED = "job_started"
    EDIT_PROMPT = "edit_prompt"
    EDIT_INFO = "edit_info"
    DATA_GENERATED = "data_generated"
    JOB_COMPLETED = "job_completed"


class JobUpdateMessage(BaseModel):
    type: JobUpdate
    applicant_id: str
