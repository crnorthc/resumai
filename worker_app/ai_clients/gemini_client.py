import json

from google import genai
from common.applicant import Applicant
from common.api_key_service import decrypt_api_key

from worker_app.ai_clients.ai_client import AIClient, InvalidAIResponse


class GeminiClient(AIClient):
    def __init__(self, api_key, model):
        self.client = genai.Client(api_key=decrypt_api_key(api_key))
        self.model = model

    def generate_resume_info(self, applicant: Applicant, prompt: str):
        chat = self.client.chats.create(model=self.model)

        response = chat.send_message(prompt)

        response_text = response.text

        if not self.validate_response(response_text, applicant):
            response = chat.send_message(self.get_retry_prompt(applicant))
            response_text = response.text
            if not self.validate_response(response_text, applicant):
                raise InvalidAIResponse("Could not get valid response from AI")

        return json.loads(response_text)
