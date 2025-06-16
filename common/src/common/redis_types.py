from enum import Enum
from typing import List, Dict, TypedDict


class InvalidUpdateType(Exception):
    pass


UPDATES_CHANNEL = "updates_channel"


class JobUpdate(Enum):
    JOB_STARTED = "job_started"
    EDIT_PROMPT = "edit_prompt"
    EDIT_INFO = "edit_info"
    DATA_GENERATED = "data_generated"
    GENERATING_DOCUMENT = "generating_document"
    JOB_COMPLETED = "job_completed"


class GeneratedData(TypedDict):
    positions: Dict[str, List[str]]
    tools: List[str]
    languages: List[str]


class JobUpdateMessage(TypedDict):
    type: JobUpdate
    applicant_id: str
    data: GeneratedData | str | None


def get_job_update_type(job_update_type: str) -> JobUpdate:
    for job_update in JobUpdate:
        if job_update.value == job_update_type:
            return job_update

    raise InvalidUpdateType("Invalid job update type")
