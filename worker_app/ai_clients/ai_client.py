import json

from common.applicant import Applicant


class InvalidAIResponse(Exception):
    pass


class AIClient:
    def validate_response(self, response_text, applicant: Applicant):
        def str_only_list(items):
            return all(isinstance(item, str) for item in items)

        try:
            data = json.loads(response_text)
        except:
            print("Failed to load json")
            return False

        for position in applicant.positions:
            if len(data["positions"].get(position.company, [])) == 0:
                print(f"No points created for {position.company}")
                return False

            if not str_only_list(data["positions"].get(position.company)):
                print(f"Invalid points for {position.company}")
                return False

        if len(data.get("tools", [])) == 0:
            print("Did not get tools")
            return False

        if not str_only_list(data.get("tools")):
            print("Invalid response for tools")
            return False

        if len(data.get("languages", [])) == 0:
            print("Did not get languages")
            return False

        if not str_only_list(data.get("languages")):
            print("Invalid response for languages")
            return False

        return True

    def get_retry_prompt(self, applicant: Applicant):
        output_schema = ",".join(
            [
                f'"{position.company}": [bullet_point_items]'
                for position in applicant.positions
            ]
        )

        return f"""
You gave me incorrect output. I need the output to be JSON in the following schema:
{{"positions": {{{output_schema}}}, "languages": [languages], "tools": [tools] }}
"""
