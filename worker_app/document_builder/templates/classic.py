from urllib.parse import urlencode
from common.applicant import Applicant
from worker_app.document_builder.docx_writer import DOCXWriter
from worker_app.document_builder.pdf_writer import PDFWriter
from worker_app.document_builder.templates.template_interface import ResumeTemplate
from worker_app.document_builder.writer_types import (
    Alignment,
    FontStyle,
    WriterOptions,
    Font,
)


class ClassicTemplate(ResumeTemplate):
    def __init__(self, applicant: Applicant):
        self.applicant = applicant
        print("HERE")
        self.writer_class = (
            PDFWriter if self.applicant.document_type == "pdf" else DOCXWriter
        )

    @property
    def options(self) -> WriterOptions:
        return {
            "font": Font.ROBOTO,
            "file_path": f"{self.applicant.name.lower().replace(" ", "_")}_resume",
            "background_color": "#323232" if self.applicant.dark_mode else "#efefef",
            "text_color": "#efefef" if self.applicant.dark_mode else "#323232",
        }

    def run(self):
        writer = self.writer_class(**self.options)
        writer.add_text(self.applicant.name, font_style=FontStyle.REGULAR, font_size=21)
        writer.add_table(
            [
                [
                    {
                        "value": self.applicant.email,
                        "alignment": Alignment.CENTER,
                        "font_style": FontStyle.REGULAR,
                        "font_size": 12,
                    },
                    {
                        "value": self.applicant.phone,
                        "alignment": Alignment.CENTER,
                        "font_style": FontStyle.REGULAR,
                        "font_size": 12,
                    },
                    {
                        "value": self.applicant.location,
                        "alignment": Alignment.CENTER,
                        "font_style": FontStyle.REGULAR,
                        "font_size": 12,
                    },
                ]
            ],
            row_padding=5,
        )
        writer.add_vertical_space(5)
        writer.add_text(
            "Work Experience",
            font_style=FontStyle.BOLD,
            font_size=13,
            alignment=Alignment.LEFT,
            line_spacing=0.5,
        )
        writer.add_horizontal_line(2)

        for position in self.applicant.positions:
            textline = writer.create_text_line(
                [
                    {
                        "value": position["position"],
                        "font_style": FontStyle.SEMIBOLD,
                        "font_size": 11,
                    },
                    {
                        "value": f", {position["company"]} - {position["location"]}",
                        "font_style": FontStyle.LIGHT,
                        "font_size": 11,
                    },
                ]
            )
            writer.add_table(
                [
                    [
                        {"value": textline, "alignment": Alignment.LEFT},
                        {
                            "value": f"{position["start"]} - {position["end"]}",
                            "alignment": Alignment.RIGHT,
                            "font_style": FontStyle.LIGHT,
                            "font_size": 11,
                        },
                    ]
                ],
                row_padding=3,
            )
            writer.add_bullet_points(
                [
                    {
                        "value": point,
                        "alignment": Alignment.LEFT,
                        "font_style": FontStyle.LIGHT,
                        "font_size": 11,
                    }
                    for point in self.applicant.confirmed_info.get(
                        "positions", self.applicant.generated_info["positions"]
                    )[position["company"]]
                ]
            )
        writer.add_vertical_space(10)
        writer.add_text(
            "Skills",
            font_style=FontStyle.BOLD,
            font_size=13,
            alignment=Alignment.LEFT,
            line_spacing=0.5,
        )
        writer.add_horizontal_line(2)
        writer.add_table(
            [
                [
                    {
                        "value": "Languages",
                        "alignment": Alignment.LEFT,
                        "font_style": FontStyle.SEMIBOLD,
                        "font_size": 11,
                    },
                    {
                        "value": ", ".join(
                            self.applicant.confirmed_info.get(
                                "languages", self.applicant.generated_info["languages"]
                            )
                        ),
                        "alignment": Alignment.LEFT,
                        "font_style": FontStyle.LIGHT,
                        "font_size": 11,
                    },
                ],
                [
                    {
                        "value": "Technologies",
                        "alignment": Alignment.LEFT,
                        "font_style": FontStyle.SEMIBOLD,
                        "font_size": 11,
                    },
                    {
                        "value": ", ".join(
                            self.applicant.confirmed_info.get(
                                "tools", self.applicant.generated_info["tools"]
                            )
                        ),
                        "alignment": Alignment.LEFT,
                        "font_style": FontStyle.LIGHT,
                        "font_size": 11,
                    },
                ],
            ],
            row_padding=5,
            column_widths=[1, 5],
        )
        writer.add_vertical_space(10)
        writer.add_text(
            "Education",
            font_style=FontStyle.BOLD,
            font_size=13,
            alignment=Alignment.LEFT,
            line_spacing=0.5,
        )
        writer.add_horizontal_line(2)
        textline = writer.create_text_line(
            [
                {
                    "value": self.applicant.college,
                    "font_style": FontStyle.SEMIBOLD,
                    "font_size": 11,
                },
                {
                    "value": f" - {self.applicant.degree}",
                    "font_style": FontStyle.LIGHT,
                    "font_size": 11,
                },
            ]
        )
        writer.add_table(
            [
                [
                    {"value": textline, "alignment": Alignment.LEFT},
                    {
                        "value": self.applicant.graduation_year,
                        "alignment": Alignment.RIGHT,
                        "font_style": FontStyle.LIGHT,
                        "font_size": 11,
                    },
                ]
            ],
            row_padding=3,
            column_widths=[4, 1],
        )
        textline = writer.create_text_line(
            [
                {
                    "value": "This resume was custom generated by an AI tool ",
                    "font_style": FontStyle.LIGHT,
                    "font_size": 10,
                },
                {
                    "value": "I built",
                    "font_style": FontStyle.BOLD,
                    "font_size": 10,
                },
                {
                    "value": " - check it out here:",
                    "font_style": FontStyle.LIGHT,
                    "font_size": 10,
                },
            ]
        )
        writer.add_footer_line(textline)
        link_params = {
            "id": f"{self.applicant.open_position["company"]}, {self.applicant.open_position["position"]}"
        }

        link = f"https://calebnorthcott.com/resume?{urlencode(link_params)}"
        writer.add_footer_line(link, font_size=10)
        return writer.save()
