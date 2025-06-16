from pydantic import ValidationError
from common.applicant import Applicant, Status
from server_app.communication_types import (
    InboundWebsocketMessage,
    OutboundWebsocketMessage,
    get_websocket_message_type,
)
from server_app.schemas import GeneratePayloadSchema, WebsocketRequestMessageSchema
from common.celery import TASK_NAME, celery_app, QUEUE_NAME


def handle_websocket_message(applicant_id: str, message: WebsocketRequestMessageSchema):
    message_type = get_websocket_message_type(message["type"])
    if message_type == InboundWebsocketMessage.GENERATE_RESUME:
        try:
            applicant_data = GeneratePayloadSchema.model_validate(message["data"])
        except ValidationError as e:
            errors = e.errors()

            return {
                "type": OutboundWebsocketMessage.MISSING_FIELDS.value,
                "data": [
                    ".".join([str(loc) for loc in error["loc"]])
                    for error in errors
                    if error["type"] in ["missing", "string_too_short", "too_short"]
                ],
            }

        applicant = Applicant(applicant_id, **applicant_data.model_dump())
        applicant.save()

        celery_app.send_task(
            TASK_NAME, args=[{"applicant_id": applicant.applicant_id}], queue=QUEUE_NAME
        )
        applicant.update_status(Status.GENERATING)

        return {"type": OutboundWebsocketMessage.GENERATION_QUEUED.value}
    elif message_type == InboundWebsocketMessage.CONFIRMED_PROMPT:
        applicant = Applicant.get_applicant(applicant_id)
        applicant.confirmed_prompt = message["data"]
        applicant.generated_info = None
        applicant.confirmed_info = None
        applicant.resume_path = None
        applicant.save()

        celery_app.send_task(
            TASK_NAME, args=[{"applicant_id": applicant.applicant_id}], queue=QUEUE_NAME
        )
        applicant.update_status(Status.GENERATING)

        return {"type": OutboundWebsocketMessage.GENERATION_QUEUED.value}
    elif message_type == InboundWebsocketMessage.CONFIRMED_INFO:
        applicant = Applicant.get_applicant(applicant_id)
        applicant.confirmed_info = message["data"]
        applicant.resume_path = None
        applicant.save()

        celery_app.send_task(
            TASK_NAME, args=[{"applicant_id": applicant.applicant_id}], queue=QUEUE_NAME
        )
        applicant.update_status(Status.GENERATING)

        return {"type": OutboundWebsocketMessage.GENERATION_QUEUED.value}
