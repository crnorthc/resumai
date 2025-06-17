import json
import asyncio
from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from common.resume_templates import TEMPLATE_DATA
from common.api_key_service import encrypt_api_key
from common.applicant import Applicant

from server_app.schemas import EncryptApiKeySchema
from server_app.websocket_sync import manager, connection_manager
from server_app.websocket_message_service import handle_websocket_message


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Startup logic
    task = asyncio.create_task(connection_manager.handle_messages())

    yield

    # Shutdown logic (optional)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


origins = [
    "http://localhost:5173",
    "ws://localhost:5173",
]


app = FastAPI(lifespan=lifespan, debug=True)

# DEPRECATED - partial state stored in client local storage now
# app.include_router(applicant_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


@app.post("/applicant")
def create_applicant():
    return {"applicantId": str(uuid4())}


@app.post("/encrypt-api-key")
def handle_encryption(payload: EncryptApiKeySchema):
    return {
        "encrypted_key": encrypt_api_key(payload.key),
        "key_label": f"{payload.key[:3]}...{payload.key[-3:]}",
    }


@app.get("/applicant/{applicant_id}/resume")
def get_resume(applicant_id: str):
    applicant = Applicant.get_applicant(applicant_id)
    if applicant.document_type == "pdf":
        return FileResponse(
            applicant.resume_path,
            media_type="application/pdf",
            filename=f"{applicant.name.lower().replace(" ", "_")}_resume.pdf",
        )
    else:
        return FileResponse(
            applicant.resume_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"{applicant.name.lower().replace(" ", "_")}_resume.docx",
        )


@app.get("/templates")
def get_templates():
    return TEMPLATE_DATA


@app.websocket("/ws/{applicant_id}")
async def websocket_gateway(websocket: WebSocket, applicant_id: str):
    await manager.connect(websocket, applicant_id)
    try:
        while True:
            message = await websocket.receive_text()
            response = handle_websocket_message(applicant_id, json.loads(message))
            await manager.send_message(websocket, response)
    except WebSocketDisconnect:
        manager.disconnect(applicant_id)
