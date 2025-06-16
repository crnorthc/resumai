from enum import Enum
from typing import List

from pydantic import ValidationError

from common.redis_client import redis_client
from common.redis_types import GeneratedData
from common.applicant_data import (
    DocumentType,
    OpenPositionSchema,
    PositionSchema,
    ApplicantData,
)
from common.resume_templates import ResumeTemplate


class Status(Enum):
    IDLE = "idle"
    GENERATING = "generating"
    AWAITING_PROMPT_CONFIRMATION = "awaiting_prompt_conformation"
    PROMPT_CONFIRMED = "prompt_confirmed"
    AWAITING_INFO_CONFIRMATION = "awaiting_info_confirmation"
    INFO_CONFIRMED = "info_confirmed"
    JOB_COMPLETED = "job_completed"


def get_status(applicant_status):
    for status in Status:
        if applicant_status == status.value:
            return status


class Applicant:
    def __init__(self, applicant_id: str, **kwargs):
        self.applicant_id: str = applicant_id
        self.status: Status = kwargs.get("status", Status.IDLE)

        self.name: str = kwargs.get("name")
        self.email: str = kwargs.get("email")
        self.phone: str = kwargs.get("phone")
        self.location: str = kwargs.get("location")
        self.college: str = kwargs.get("college")
        self.degree: str = kwargs.get("degree")
        self.graduation_year: str = kwargs.get("graduation_year")
        self.tools: List[str] = kwargs.get("tools")
        self.languages: List[str] = kwargs.get("languages")
        self.positions: List[PositionSchema] = kwargs.get("positions")
        self.open_position: OpenPositionSchema = kwargs.get("open_position")
        self.edit_generated_info: bool = kwargs.get("edit_generated_info")
        self.edit_prompt: bool = kwargs.get("edit_prompt")
        self.document_type: DocumentType = kwargs.get("document_type")
        self.resume_template: ResumeTemplate = kwargs.get("resume_template")
        self.dark_mode: bool = kwargs.get("dark_mode")

        self.generated_prompt: str = kwargs.get("generated_prompt")
        self.confirmed_prompt: str = kwargs.get("confirmed_prompt")

        self.generated_info: GeneratedData | None = kwargs.get("generated_info")
        self.confirmed_info = kwargs.get("confirmed_info")

        self.resume_path = kwargs.get("resume_path")

    @classmethod
    def get_or_create_applicant(cls, applicant_id: str):
        existing_applicant = redis_client.get(applicant_id)

        if existing_applicant:
            applicant_data = ApplicantData.model_validate(existing_applicant)
            return cls(applicant_id, **applicant_data.model_dump())

        new_applicant = cls(applicant_id)

        redis_client.set(applicant_id, new_applicant.to_json())

        return new_applicant

    def refresh(self):
        latest_applicant_data = redis_client.get(self.applicant_id)
        for key, value in latest_applicant_data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    @classmethod
    def get_applicant(cls, applicant_id: str):
        existing_applicant = redis_client.get(applicant_id)

        if existing_applicant:
            try:
                applicant_data = ApplicantData.model_validate(existing_applicant)
            except ValidationError as e:
                print(e.json())
            return cls(applicant_id, **applicant_data.model_dump())

        return None

    def update_status(self, new_status: Status):
        self.status = new_status
        self.save()

    def save(self):
        redis_client.set(self.applicant_id, self.to_json())

    def to_response(self):
        return {
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "location": self.location,
            "college": self.college,
            "degree": self.degree,
            "graduation_year": self.graduation_year,
            "tools": self.tools,
            "languages": self.languages,
            "positions": self.positions,
        }

    def to_json(self):
        return {
            **self.to_response(),
            "applicant_id": self.applicant_id,
            "status": self.status.value,
            "document_type": self.document_type,
            "edit_generated_info": self.edit_generated_info,
            "edit_prompt": self.edit_prompt,
            "resume_template": self.resume_template.value,
            "dark_mode": self.dark_mode,
            "generated_prompt": self.generated_prompt,
            "confirmed_prompt": self.confirmed_prompt,
            "generated_info": self.generated_info,
            "confirmed_info": self.confirmed_info,
            "open_position": self.open_position,
            "resume_path": self.resume_path,
        }
