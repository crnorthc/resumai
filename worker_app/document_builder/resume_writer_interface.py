from abc import ABC, abstractmethod
from typing import List, Optional

from worker_app.document_builder.writer_types import (
    Alignment,
    BulletPoints,
    Font,
    FontStyle,
    TableData,
    TextLineData,
    TextLine,
)


class ResumeWriter(ABC):

    @abstractmethod
    def __init__(
        self,
        file_path: str,
        font: Font,
        default_font_size=12,
        default_font_style=FontStyle.REGULAR,
        margin_top=72,
        margin_bottom=72,
        margin_left=72,
        margin_right=72,
        background_color="#ffffff",
        text_color="#000000",
    ):
        self.font = font
        self.file_path = file_path
        self.default_font_size = default_font_size
        self.default_font_style = default_font_style
        self.margin_top = margin_top
        self.margin_bottom = margin_bottom
        self.margin_left = margin_left
        self.margin_right = margin_right
        self.background_color = background_color
        self.text_color = text_color

    @abstractmethod
    def add_table(
        self,
        data: TableData,
        column_widths: Optional[List[int]] = None,
        row_padding: int = 0,
    ):
        pass

    @abstractmethod
    def add_footer_line(
        self,
        value: str | TextLine,
        font_size: int = 12,
        font_style: FontStyle = FontStyle.LIGHT,
        alignment: Alignment = Alignment.LEFT,
    ):
        pass

    @abstractmethod
    def add_vertical_space(self, space: int):
        pass

    @abstractmethod
    def save(self) -> str:
        pass

    @abstractmethod
    def add_text(
        self,
        value: str,
        font_size: int,
        font_style: FontStyle = FontStyle.SEMIBOLD,
        alignment: Alignment = Alignment.CENTER,
        line_spacing: float = 1.0,
    ):
        pass

    @abstractmethod
    def add_horizontal_line(self, width=1):
        pass

    @abstractmethod
    def add_bullet_points(
        self, points: BulletPoints, space_from_point=10, line_spacing=1.5
    ):
        pass

    def _validate_table_params(self, data: TableData, column_widths: List[int]):
        if not data or not isinstance(data, list):
            raise ValueError("Data must be a non-empty list.")

        expected_length = len(data[0])
        for row in data:
            if not isinstance(row, list):
                raise ValueError("Each row in data must be a list.")
            if not all(isinstance(cell, dict) for cell in row):
                raise ValueError("Each cell in a row must be a dictionary.")
            if len(row) != expected_length:
                raise ValueError("All rows in data must have the same length.")

        if not column_widths or not isinstance(column_widths, list):
            raise ValueError("Column widths must be a non-empty list.")

        if len(data[0]) != len(column_widths):
            raise ValueError(
                "Number of columns in data must match the number of column widths."
            )

    def _get_font(self, style: FontStyle):
        return f"{self.font.value}-{style.value}"

    def create_text_line(self, parts: List[TextLineData]):
        return TextLine(parts)
