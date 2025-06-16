import os
import json

from anthropic import Anthropic

from common.applicant import Applicant


class AnthropicClient:
    def __init__(self):
        self.client = Anthropic(api_key=os.environ.get("OPEN_AI_API_KEY"))

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
        response = self.client.messages.create(
            model="claude-2.0",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2048,
        )

        data = self.validate_response(response, applicant)

        return data


openai_client = AnthropicClient()
