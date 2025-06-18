import os
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field
from dotenv import load_dotenv

from common.redis_client import RedisClient
from common.applicant_schemas import (
    ModelSchema,
    DocumentType,
    OpenPositionSchema,
    PositionSchema,
    GeneratedData,
)
from common.resume_templates import ResumeTemplate

load_dotenv()

redis_client = RedisClient(
    os.environ.get("REDIS_HOST", "redis"), os.environ.get("REDIS_PORT", "6379")
)


class Status(Enum):
    IDLE = "idle"
    JOB_INITIALIZED = "job_initialized"
    AWAITING_PROMPT_CONFIRMATION = "awaiting_prompt_conformation"
    PROMPT_CONFIRMED = "prompt_confirmed"
    AWAITING_INFO_CONFIRMATION = "awaiting_info_confirmation"
    INFO_CONFIRMED = "info_confirmed"
    JOB_COMPLETED = "job_completed"


class Applicant(BaseModel):
    status: Status = Status.IDLE
    applicant_id: str

    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    college: str = Field(..., min_length=1)
    degree: str = Field(..., min_length=1)
    graduation_year: str = Field(..., min_length=1)
    positions: List[PositionSchema] = Field(..., min_items=1)
    tools: List[str] = Field(..., min_items=1)
    languages: List[str] = Field(..., min_items=1)

    open_position: OpenPositionSchema
    edit_generated_info: bool
    edit_prompt: bool
    document_type: DocumentType
    resume_template: ResumeTemplate
    dark_mode: bool
    model: ModelSchema

    generated_prompt: Optional[str] = Field(None, min_length=1)
    confirmed_prompt: Optional[str] = Field(None, min_length=1)

    generated_info: Optional[GeneratedData] = Field(None)
    confirmed_info: Optional[GeneratedData] = Field(None)

    resume_path: Optional[str] = Field(None)

    def refresh(self):
        latest_applicant_data = redis_client.get(self.applicant_id)
        for key, value in latest_applicant_data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    @classmethod
    def get_applicant(cls, applicant_id: str):
        existing_applicant = redis_client.get(applicant_id)

        if existing_applicant:
            return cls.model_validate(existing_applicant)

        return None

    def update_status(self, new_status: Status):
        # Reset state
        if new_status == Status.JOB_INITIALIZED:
            self.generated_prompt = None
            self.confirmed_prompt = None
            self.generated_info = None
            self.confirmed_info = None
        if new_status == Status.PROMPT_CONFIRMED:
            self.confirmed_info = None
            self.generated_info = None
        if new_status == Status.INFO_CONFIRMED:
            self.resume_path = None

        self.status = new_status
        self.save()

    def save(self):
        redis_client.set(self.applicant_id, self.model_dump(mode="json"))
