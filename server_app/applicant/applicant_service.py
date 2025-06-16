"""
DEPRECATED
Partials state is stored in clients local storage
"""

from common.applicant import Applicant, Status
from common.applicant_data import PositionSchema
from server_app.exceptions import InvalidApplicantUpdateState, InvalidUpdateDataValues
from server_app.applicant.schemas import ApplicantDataSchema

LOCKED_STATES = [
    Status.GENERATING,
    Status.AWAITING_INFO_CONFIRMATION,
    Status.INFO_CONFIRMED,
]


def update_applicant_data(applicant: Applicant, applicant_updates: ApplicantDataSchema):
    if applicant.status in LOCKED_STATES:
        raise InvalidApplicantUpdateState("Applicant in locked state")

    for key, value in applicant_updates.model_dump(exclude_unset=True).items():
        if hasattr(applicant, key):
            setattr(applicant, key, value)

    applicant.save()


def add_position(applicant: Applicant, position: PositionSchema):
    applicant.positions.append(position.model_dump())
    applicant.save()


def update_position(
    applicant: Applicant, position: PositionSchema, position_index: int
):
    if not len(applicant.positions) > position_index - 1:
        raise InvalidUpdateDataValues("Invalid position update index")

    applicant.positions[position_index] = position.model_dump()
    applicant.save()


def delete_position(applicant: Applicant, position_index: int):
    if len(applicant.positions) == 0 or len(applicant.positions) < position_index - 1:
        raise InvalidUpdateDataValues("Invalid position update index")

    del applicant.positions[position_index]
    applicant.save()
