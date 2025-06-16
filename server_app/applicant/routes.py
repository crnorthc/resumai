"""
DEPRECATED
Partials state is stored in clients local storage
"""

from uuid import uuid4
from fastapi import APIRouter
from fastapi.responses import FileResponse

from common.applicant_data import PositionSchema
from server_app.applicant.dependencies import Currrent_Applicant
from server_app.applicant.schemas import ApplicantDataSchema, JobSchema
from server_app.applicant.applicant_service import (
    update_applicant_data,
    add_position,
    update_position,
    delete_position,
)


applicant_router = APIRouter(
    prefix="/applicant",
    responses={404: {"description": "Not found"}},
)


@applicant_router.get("/{applicant_id}/resume")
def get_resume(applicant: Currrent_Applicant):
    return FileResponse(
        applicant.resume_path,
        media_type="application/pdf",
        filename=f"{applicant.name.lower().replace(" ", "_")}_resume.pdf",
    )


@applicant_router.post("/")
def create_applicant():
    return {"applicantId": str(uuid4())}


@applicant_router.put("/{applicant_id}")
def update_applicant_route(
    applicant_data: ApplicantDataSchema, applicant: Currrent_Applicant
):
    update_applicant_data(applicant, applicant_data)

    return applicant.to_response()


@applicant_router.post("/{applicant_id}/position")
def add_position_route(position_data: PositionSchema, applicant: Currrent_Applicant):
    add_position(applicant, position_data)

    return applicant.to_response()


@applicant_router.post("/{applicant_id}/job")
def update_job_route(job_data: JobSchema, applicant: Currrent_Applicant):
    update_applicant_data(applicant, job_data)

    return {
        "job_company": applicant.job_company,
        "job_position": applicant.job_position,
        "job_description": applicant.job_description,
    }


@applicant_router.put("/{applicant_id}/position/{position_index}")
def update_position_route(
    position_data: PositionSchema, applicant: Currrent_Applicant, position_index: int
):
    update_position(applicant, position_data, position_index)

    return applicant.to_response()


@applicant_router.delete("/{applicant_id}/position/{position_index}")
def delete_position_route(applicant: Currrent_Applicant, position_index: int):
    delete_position(applicant, position_index)

    return applicant.to_response()
