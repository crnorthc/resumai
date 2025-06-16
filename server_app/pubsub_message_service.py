from common.redis_types import JobUpdateMessage, JobUpdate, get_job_update_type
from common.applicant import Applicant
from server_app.communication_types import OutboundWebsocketMessage


def handle_pubsub_message(message: JobUpdateMessage):
    message_type = get_job_update_type(message["type"])
    if message_type == JobUpdate.JOB_STARTED:
        return {"type": OutboundWebsocketMessage.JOB_STARTED.value}
    elif message_type == JobUpdate.EDIT_PROMPT:
        applicant_id = message.get("applicant_id", "")
        applicant = Applicant.get_applicant(applicant_id)
        return {
            "type": OutboundWebsocketMessage.CONFIRM_PROMPT.value,
            "data": applicant.generated_prompt,
        }
    elif message_type == JobUpdate.EDIT_INFO:
        applicant_id = message.get("applicant_id", "")
        applicant = Applicant.get_applicant(applicant_id)
        return {
            "type": OutboundWebsocketMessage.CONFIRM_INFO.value,
            "data": applicant.generated_info,
        }
    elif message_type == JobUpdate.JOB_COMPLETED:
        return {"type": OutboundWebsocketMessage.JOB_COMPLETED.value}
    elif message_type == JobUpdate.GENERATING_DOCUMENT:
        return {"type": OutboundWebsocketMessage.DOCUMENT_GENERATING.value}
    else:
        return None
