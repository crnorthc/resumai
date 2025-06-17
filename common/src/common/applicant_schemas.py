from enum import Enum
from typing import Dict, List, Literal

from pydantic import BaseModel, Field, RootModel, conlist


class AIModel(Enum):
    OPENAI = "openAI"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"


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


class PositionsSchema(RootModel[Dict[str, conlist(str, min_length=1)]]):
    pass


class ModelSchema(BaseModel):
    provider: AIModel
    model: str
    api_key: str


class GeneratedData(BaseModel):
    positions: PositionsSchema
    languages: List[str] = Field(..., min_items=1)
    tools: List[str] = Field(..., min_items=1)


DocumentType = Literal["pdf", "docx"]
