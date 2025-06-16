import os
import json

from google import genai

from common.applicant import Applicant


class GeminiClient:
    def __init__(self):
        self.client = genai.Client(api_key=os.environ.get("OPEN_AI_API_KEY"))

    def validate_response(self, response, applicant: Applicant):
        try:
            data = json.loads(response.output_text)
        except:
            pass
            # TODO reprompt

        for position in applicant.positions:
            if not position["company"] in data:
                pass
                # handle

        if len(data["tools"]) == 0:
            pass
            # handle

        if len(data["languages"]) == 0:
            pass
            # handle

        return data

    def generate_resume_info(self, applicant: Applicant, prompt: str):
        response = self.client.models.generate_content(
            model="gpt-4.1-mini", input=prompt
        )

        return response


openai_client = GeminiClient()
