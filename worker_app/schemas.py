from typing import List, Dict
from pydantic import BaseModel


class GeneratedData(BaseModel):
    __root__: Dict[str, List[str]]
    tools: List[str]
    languages: List[str]
