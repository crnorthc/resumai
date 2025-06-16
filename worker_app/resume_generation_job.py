from common.applicant import Applicant, Status
from common.redis_client import redis_client
from common.redis_types import UPDATES_CHANNEL, JobUpdate
from worker_app.document_builder.template_map import TEMPLATES
from worker_app.ai_clients.openai_client import openai_client
from worker_app.instructions import instructions_template


class ResumeGenerationJob:
    def __init__(self, applicant_id: str):
        self.applicant_id = applicant_id
        self.applicant = Applicant.get_or_create_applicant(applicant_id)

    def handle(self):
        redis_client.publish(
            UPDATES_CHANNEL,
            {
                "type": JobUpdate.JOB_STARTED.value,
                "applicant_id": self.applicant_id,
            },
        )

        prompt = self.get_prompt()
        if self.applicant.edit_prompt and not self.applicant.confirmed_prompt:
            self.applicant.update_status(Status.AWAITING_PROMPT_CONFIRMATION)
            redis_client.publish(
                UPDATES_CHANNEL,
                {
                    "type": JobUpdate.EDIT_PROMPT.value,
                    "applicant_id": self.applicant_id,
                },
            )
            return

        self.generate_info(prompt)
        if self.applicant.edit_generated_info and not self.applicant.confirmed_info:
            self.applicant.update_status(Status.AWAITING_INFO_CONFIRMATION)
            redis_client.publish(
                UPDATES_CHANNEL,
                {
                    "type": JobUpdate.EDIT_INFO.value,
                    "applicant_id": self.applicant_id,
                },
            )
            return

        file_path = self.generate_resume()

        self.applicant.status = Status.JOB_COMPLETED
        self.applicant.resume_path = file_path
        self.applicant.save()

        redis_client.publish(
            UPDATES_CHANNEL,
            {
                "type": JobUpdate.JOB_COMPLETED.value,
                "applicant_id": self.applicant_id,
                "data": {"file_path": file_path},
            },
        )

        print("\n\nDONE")

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
        generated_info = openai_client.generate_resume_info(self.applicant, prompt)
        self.applicant.generated_info = generated_info
        self.applicant.save()

        return generated_info

    def generate_prompt(self):
        prompt = instructions_template.render(
            all_positions=",".join(
                [position["company"] for position in self.applicant.positions]
            ),
            positions_schema=",".join(
                [
                    f'"{position["company"]}": [bullet_point_items]'
                    for position in self.applicant.positions
                ]
            ),
            positions=self.applicant.positions,
            languages=",".join(self.applicant.languages),
            tools=",".join(self.applicant.tools),
            job_description=self.applicant.open_position["job_description"],
        )
        self.applicant.generated_prompt = prompt
        self.applicant.save()

        return prompt

    def generate_resume(self):
        redis_client.publish(
            UPDATES_CHANNEL,
            {
                "type": JobUpdate.GENERATING_DOCUMENT.value,
                "applicant_id": self.applicant_id,
            },
        )

        Template = TEMPLATES[self.applicant.resume_template]

        template = Template(self.applicant)

        return template.run()
