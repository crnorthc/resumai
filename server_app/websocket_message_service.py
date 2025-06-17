from pydantic import ValidationError, validate_call
from common.applicant import Applicant, Status
from common.applicant_data import GeneratedData
from common.celery import TASK_NAME, celery_app, QUEUE_NAME


from server_app.message_enums import (
    InboundWebsocketMessage,
    OutboundWebsocketMessage,
)
from server_app.schemas import (
    WebsocketRequestMessageSchema,
    WebsocketResponseMessageSchema,
)


@validate_call
def handle_websocket_message(applicant_id: str, message: WebsocketRequestMessageSchema):
    if message.type == InboundWebsocketMessage.GENERATE_RESUME:
        errors = None
        try:
            applicant = Applicant.model_validate(
                {"applicant_id": applicant_id, **message.data}
            )
        except ValidationError as e:
            errors = e.errors()

        if errors:
            response = {
                "type": OutboundWebsocketMessage.MISSING_FIELDS,
                "data": [
                    ".".join([str(loc) for loc in error["loc"]])
                    for error in errors
                    if error["type"] in ["missing", "string_too_short", "too_short"]
                ],
            }
        else:
            applicant.update_status(Status.JOB_INITIALIZED)
            celery_app.send_task(
                TASK_NAME,
                args=[{"applicant_id": applicant.applicant_id}],
                queue=QUEUE_NAME,
            )
            response = {"type": OutboundWebsocketMessage.GENERATION_QUEUED}

    elif message.type == InboundWebsocketMessage.CONFIRMED_PROMPT:
        applicant = Applicant.get_applicant(applicant_id)
        applicant.confirmed_prompt = message.data
        applicant.save()

        celery_app.send_task(
            TASK_NAME, args=[{"applicant_id": applicant.applicant_id}], queue=QUEUE_NAME
        )
        applicant.update_status(Status.PROMPT_CONFIRMED)

        response = {"type": OutboundWebsocketMessage.GENERATION_QUEUED}

    else:  # Confirmed Info
        applicant = Applicant.get_applicant(applicant_id)
        applicant.confirmed_info = GeneratedData.model_validate(message.data)
        applicant.save()

        celery_app.send_task(
            TASK_NAME, args=[{"applicant_id": applicant.applicant_id}], queue=QUEUE_NAME
        )
        applicant.update_status(Status.INFO_CONFIRMED)

        response = {"type": OutboundWebsocketMessage.GENERATION_QUEUED}

    return WebsocketResponseMessageSchema.model_validate(response)
