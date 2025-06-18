import os

from pydantic import validate_call
from common.job_updates import JobUpdate, JobUpdateMessage
from common.applicant import Applicant

from server_app.message_enums import OutboundWebsocketMessage
from server_app.schemas import WebsocketResponseMessageSchema


@validate_call
def handle_pubsub_message(message: JobUpdateMessage):
    if message.type == JobUpdate.JOB_STARTED:
        response = {"type": OutboundWebsocketMessage.JOB_STARTED}
    elif message.type == JobUpdate.EDIT_PROMPT:
        applicant = Applicant.get_applicant(message.applicant_id)
        response = {
            "type": OutboundWebsocketMessage.CONFIRM_PROMPT,
            "data": applicant.generated_prompt,
        }
    elif message.type == JobUpdate.EDIT_INFO:
        applicant = Applicant.get_applicant(message.applicant_id)
        response = {
            "type": OutboundWebsocketMessage.CONFIRM_INFO,
            "data": applicant.generated_info.model_dump(),
        }
    else:
        response = {"type": OutboundWebsocketMessage.JOB_COMPLETED}

    return WebsocketResponseMessageSchema.model_validate(response)


def clean_expired_applicant(applicant: Applicant):
    base_path = f"{os.environ.get('COMPLETED_RESUMES_DIR', '/app/completed_resumes')}/{applicant.name.lower().replace(" ", "_")}"
    if os.path.exists(f"{base_path}.docx"):
        os.remove(f"{base_path}.docx")

    if os.path.exists(f"{base_path}.pdf"):
        os.remove(f"{base_path}.pdf")
