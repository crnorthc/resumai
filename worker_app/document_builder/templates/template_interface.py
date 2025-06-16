from abc import ABC, abstractmethod

from common.applicant import Applicant
from worker_app.document_builder.writer_types import WriterOptions


class ResumeTemplate(ABC):
    def __init__(self, applicant: Applicant):
        pass

    @property
    @abstractmethod
    def options(self) -> WriterOptions:
        pass

    @abstractmethod
    def run(self):
        pass
