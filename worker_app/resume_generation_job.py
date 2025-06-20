import os

from common.applicant import Applicant, Status
from common.applicant_schemas import GeneratedData, AIModel
from common.redis_client import RedisClient
from common.job_updates import UPDATES_CHANNEL, JobUpdate
from worker_app.document_builder.template_map import TEMPLATES
from worker_app.ai_clients.openai_client import OpenAIClient
from worker_app.ai_clients.anthropic_client import AnthropicClient
from worker_app.ai_clients.gemini_client import GeminiClient

# from worker_app.instructions import instructions_template
from worker_app.instructions_v2 import instructions_v2_template

redis_client = RedisClient(
    os.environ.get("REDIS_HOST", "redis"), os.environ.get("REDIS_PORT", "6379")
)


class ResumeGenerationJob:
    def __init__(self, applicant_id: str):
        self.applicant_id = applicant_id
        self.applicant = Applicant.get_applicant(applicant_id)
        self.ai_client = self.get_ai_client()

    def get_ai_client(self):
        if self.applicant.model.provider == AIModel.OPENAI:
            return OpenAIClient(
                self.applicant.model.api_key, self.applicant.model.model
            )
        if self.applicant.model.provider == AIModel.ANTHROPIC:
            return AnthropicClient(
                self.applicant.model.api_key, self.applicant.model.model
            )
        if self.applicant.model.provider == AIModel.GEMINI:
            return GeminiClient(
                self.applicant.model.api_key, self.applicant.model.model
            )

    def handle(self):
        self.send_update(JobUpdate.JOB_STARTED)

        prompt = self.get_prompt()
        if self.applicant.edit_prompt and not self.applicant.confirmed_prompt:
            self.applicant.update_status(Status.AWAITING_PROMPT_CONFIRMATION)
            self.send_update(JobUpdate.EDIT_PROMPT)
            return

        self.generate_info(prompt)
        if self.applicant.edit_generated_info and not self.applicant.confirmed_info:
            self.applicant.update_status(Status.AWAITING_INFO_CONFIRMATION)
            self.send_update(JobUpdate.EDIT_INFO)
            return

        file_path = self.generate_resume()

        self.applicant.status = Status.JOB_COMPLETED
        self.applicant.resume_path = file_path
        self.applicant.save()

        self.send_update(JobUpdate.JOB_COMPLETED)

        print("\n\nDONE")

    def send_update(self, update_type: JobUpdate):
        redis_client.publish(
            UPDATES_CHANNEL,
            {
                "type": update_type,
                "applicant_id": self.applicant_id,
            },
        )

    def get_prompt(self):
        if self.applicant.confirmed_prompt:
            return self.applicant.confirmed_prompt
        else:
            return self.generate_prompt()

    def get_generated_info(self, prompt: str):
        if self.applicant.confirmed_info:
            return self.applicant.confirmed_info
        else:
            self.generate_info(prompt)

    def generate_info(self, prompt: str):
        generated_info = self.ai_client.generate_resume_info(self.applicant, prompt)
        self.applicant.generated_info = GeneratedData.model_validate(generated_info)
        self.applicant.save()

        return generated_info

    def generate_prompt(self):
        prompt = instructions_v2_template.render(
            all_positions=",".join(
                [position.company for position in self.applicant.positions]
            ),
            positions_schema=",".join(
                [
                    f'"{position.company}": [bullet_point_items]'
                    for position in self.applicant.positions
                ]
            ),
            positions=self.applicant.positions,
            languages=",".join(self.applicant.languages),
            tools=",".join(self.applicant.tools),
            job_description=self.applicant.open_position.job_description,
        )
        self.applicant.generated_prompt = prompt
        self.applicant.save()

        return prompt

    def generate_resume(self):
        Template = TEMPLATES[self.applicant.resume_template]

        template = Template(self.applicant)

        return template.run()
