import json

from openai import OpenAI
from common.applicant import Applicant
from common.api_key_service import decrypt_api_key

from worker_app.ai_clients.ai_client import AIClient, InvalidAIResponse


class OpenAIClient(AIClient):
    def __init__(self, api_key, model):
        self.client = OpenAI(api_key=decrypt_api_key(api_key))
        self.model = model

    def generate_resume_info(self, applicant: Applicant, prompt: str):
        response = self.client.responses.create(model=self.model, input=prompt)

        response_text = response.output_text

        if not self.validate_response(response_text, applicant):
            response = self.client.responses.create(
                model=self.model,
                input=self.get_retry_prompt(applicant),
                previous_response_id=response.id,
            )

            response_text = response.output_text
            if not self.validate_response(response_text, applicant):
                raise InvalidAIResponse("Could not get valid response from AI")

        return json.loads(response_text)
