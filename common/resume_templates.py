from enum import Enum


class ResumeTemplate(Enum):
    CLASSIC = "classic"


TEMPLATE_DATA = [
    {
        "key": ResumeTemplate.CLASSIC.value,
        "name": "Classic",
        "previews": {
            "light": "classic_light.png",
            "dark": "classic_dark.png",
        },
    }
]


def get_resume_template(template: str):
    for resume_template in ResumeTemplate:
        if template == resume_template.value:
            return resume_template
