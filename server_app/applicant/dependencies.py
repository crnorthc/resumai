from typing import Annotated
from fastapi import Depends, Path, HTTPException
from starlette.status import HTTP_404_NOT_FOUND

from common.applicant import Applicant


def get_current_applicant(applicant_id: str = Path(...)):
    applicant = Applicant.get_applicant(applicant_id)
    if not applicant:  # Replace with your logic
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND, detail="Invalid applicant_id"
        )

    return applicant


Currrent_Applicant = Annotated[Applicant, Depends(get_current_applicant)]
