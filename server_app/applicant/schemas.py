from typing import Optional, List

from pydantic import BaseModel, Field


class JobSchema(BaseModel):
    job_description: Optional[str] = None
    job_company: Optional[str] = None
    job_position: Optional[str] = None


class ApplicantDataSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    email: Optional[str] = Field(None, min_length=1)
    phone: Optional[str] = Field(None, min_length=1)
    location: Optional[str] = Field(None, min_length=1)
    college: Optional[str] = Field(None, min_length=1)
    degree: Optional[str] = Field(None, min_length=1)
    graduation_year: Optional[str] = Field(None, min_length=1)
    tools: Optional[List[str]] = None
    languages: Optional[List[str]] = None
