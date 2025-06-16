from typing import List, Literal, Optional

from pydantic import BaseModel, Field

from common.resume_templates import ResumeTemplate


class PositionSchema(BaseModel):
    position: str = Field(..., min_length=1)
    company: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    start: str = Field(..., min_length=1)
    end: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


class OpenPositionSchema(BaseModel):
    job_description: str = Field(..., min_length=1)
    company: str = Field(..., min_length=1)
    position: str = Field(..., min_length=1)


class GeneratedData(BaseModel):
    positions: dict[str, List[str]]
    languages: List[str]
    tools: List[str]


DocumentType = Literal["pdf", "docx"]


class GeneratePayloadSchema(BaseModel):
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


class ApplicantData(GeneratePayloadSchema):
    generated_prompt: Optional[str]
    confirmed_prompt: Optional[str]

    generated_info: Optional[GeneratedData]
    confirmed_info: Optional[GeneratedData]

    resume_path: Optional[str]
