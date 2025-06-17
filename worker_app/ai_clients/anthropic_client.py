import json

from anthropic import Anthropic
from common.applicant import Applicant
from common.api_key_service import decrypt_api_key

from worker_app.ai_clients.ai_client import AIClient, InvalidAIResponse


class AnthropicClient(AIClient):
    def __init__(self, api_key, model):
        self.client = Anthropic(api_key=decrypt_api_key(api_key))
        self.model = model

    def generate_resume_info(self, applicant: Applicant, prompt: str):
        response = self.client.messages.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2048,
        )

        response_text = response.content[0]["text"]

        if not self.validate_response(response_text, applicant):
            response = self.client.messages.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": prompt},
                    {"role": "assistant", "content": response_text},
                    {"role": "user", "content": self.get_retry_prompt(applicant)},
                ],
                max_tokens=2048,
            )

            response_text = response.content[0]["text"]

            if not self.validate_response(response_text, applicant):
                raise InvalidAIResponse("Could not get valid response from AI")

        return json.loads(response_text)
