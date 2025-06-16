from typing import List, Optional

from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.colors import HexColor


from worker_app.document_builder.resume_writer_interface import ResumeWriter
from worker_app.document_builder.writer_types import (
    BulletPoints,
    Font,
    FontStyle,
    Alignment,
    TableData,
    TextLine,
)
from worker_app.document_builder.utils import FONT_CONFIGS

WIDTH, HEIGHT = LETTER


class PDFWriter(ResumeWriter):

    def __init__(
        self,
        file_path: str,
        font: Font,
        default_font_size=12,
        default_font_style=FontStyle.REGULAR,
        margin_top=72,
        margin_bottom=50,
        margin_left=72,
        margin_right=72,
        background_color="#ffffff",
        text_color="#000000",
    ):
        super().__init__(
            font=font,
            file_path=f"./completed_resumes/{file_path}.pdf",
            default_font_size=default_font_size,
            default_font_style=default_font_style,
            margin_top=margin_top,
            margin_bottom=margin_bottom,
            margin_left=margin_left,
            margin_right=margin_right,
            background_color=background_color,
            text_color=text_color,
        )
        self.document = canvas.Canvas(self.file_path, pagesize=LETTER)
        self.__load_font(font)

        self.document.setFillColor(HexColor(background_color))

        self.document.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)

        self.document.setFillColor(HexColor(text_color))
        self.document.setStrokeColor(HexColor(text_color))

        self.current_line_y = HEIGHT - self.margin_top

        self.current_footer_line_y = self.margin_bottom

    def __load_font(self, font):
        font_config = FONT_CONFIGS.get(font)

        for font_style in font_config:
            pdfmetrics.registerFont(TTFont(font_style["name"], font_style["path"]))

    def add_footer_line(
        self,
        value: str | TextLine,
        font_size: int = 12,
        font_style: FontStyle = FontStyle.LIGHT,
        alignment: Alignment = Alignment.LEFT,
    ):
        line_height = 0

        if isinstance(value, TextLine):
            textobject = self.document.beginText()
            textobject.setTextOrigin(
                self.__get_text_x_position(
                    value=value,
                    alignment=alignment,
                ),
                self.current_footer_line_y,
            )
            for part in value.parts:
                line_height = max(line_height, part["font_size"])
                textobject.setFont(
                    self._get_font(part["font_style"]), part["font_size"]
                )
                textobject.textOut(part["value"])
            self.document.drawText(textobject)
        else:
            line_height = max(line_height, font_size)
            textobject = self.document.beginText()
            textobject.setFont(self._get_font(font_style), font_size)
            textobject.setTextOrigin(
                self.__get_text_x_position(
                    value=value,
                    font_style=font_style,
                    font_size=font_size,
                    alignment=alignment,
                ),
                self.current_footer_line_y,
            )
            textobject.textLine(value)
            self.document.drawText(textobject)

        self.current_footer_line_y -= line_height * 1.5

    def save(self):
        self.document.showPage()
        self.document.save()

        return self.file_path

    def add_table(
        self,
        data: TableData,
        column_widths: Optional[List[int]] = None,
        row_padding: int = 0,
    ):
        if not column_widths:
            column_widths = [1] * len(data[0])

        self._validate_table_params(data, column_widths)

        available_width = WIDTH - self.margin_left - self.margin_right

        total_column_widths = sum(column_widths)
        column_start_x = []
        column_end_x = []
        last_end_x = self.margin_left

        for column_width in column_widths:
            column_start_x.append(last_end_x)
            column_pixels = (column_width / total_column_widths) * available_width
            last_end_x += column_pixels
            column_end_x.append(last_end_x)

        for row in data:
            line_height = 0
            for cell_index, cell in enumerate(row):
                if isinstance(cell["value"], TextLine):
                    textobject = self.document.beginText()
                    textobject.setTextOrigin(
                        self.__get_text_x_position(
                            value=cell["value"],
                            alignment=cell["alignment"],
                            start_x=column_start_x[cell_index],
                            end_x=column_end_x[cell_index],
                        ),
                        self.current_line_y,
                    )
                    for part in cell["value"].parts:
                        line_height = max(line_height, part["font_size"])
                        textobject.setFont(
                            self._get_font(part["font_style"]), part["font_size"]
                        )
                        textobject.textOut(part["value"])
                    self.document.drawText(textobject)
                else:
                    font_style = cell.get("font_style", self.default_font_style)
                    font_size = cell.get("font_size", self.default_font_size)
                    line_height = max(line_height, font_size)
                    value = cell.get("value", "")
                    alignment = cell.get("alignment", Alignment.CENTER)
                    textobject = self.document.beginText()
                    textobject.setFont(self._get_font(font_style), font_size)
                    textobject.setTextOrigin(
                        self.__get_text_x_position(
                            value=value,
                            font_style=font_style,
                            font_size=font_size,
                            alignment=alignment,
                            start_x=column_start_x[cell_index],
                            end_x=column_end_x[cell_index],
                        ),
                        self.current_line_y,
                    )
                    textobject.textLine(value)
                    self.document.drawText(textobject)
            self.current_line_y -= line_height + row_padding
        self.current_line_y -= row_padding

    def write_text_line(self, line: TextLine):
        textobject = self.document.beginText()
        textobject.setTextOrigin(
            self.__get_text_x_position(value=line, alignment=Alignment.LEFT),
            self.current_line_y,
        )

        line_height = 0

        for part in line.parts:
            line_height = max(line_height, part["font_size"])
            textobject.setFont(self._get_font(part["font_style"]), part["font_size"])
            textobject.textOut(part["value"])
        self.document.drawText(textobject)
        self.current_line_y -= line_height

    def add_bullet_points(
        self, points: BulletPoints, space_from_point=10, line_spacing=1.5
    ):
        def print_line(line, point):
            textobject = self.document.beginText()
            textobject.setFont(self._get_font(point["font_style"]), point["font_size"])
            textobject.setTextOrigin(
                self.margin_left + 1 + space_from_point,
                self.current_line_y,
            )
            textobject.textOut(line)
            self.document.drawText(textobject)
            self.current_line_y -= point["font_size"] * line_spacing

        for point in points:
            self.document.setFillColor(HexColor(self.text_color))
            self.document.circle(
                self.margin_left + 3,
                self.current_line_y + (0.25 * point["font_size"]),
                r=1,
                stroke=1,
                fill=1,
            )

            current_line = ""

            for word in point["value"].split():
                new_line = f"{current_line} {word}".strip()
                line_width = self.document.stringWidth(
                    new_line,
                    self._get_font(point["font_style"]),
                    point["font_size"],
                )

                if line_width > WIDTH - self.margin_left - self.margin_right - (
                    0.5 + space_from_point
                ):
                    print_line(current_line, point)
                    current_line = word
                else:
                    current_line = new_line

            if current_line:
                print_line(current_line, point)

    def add_vertical_space(self, space: int):
        self.current_line_y -= space

    def __get_text_x_position(
        self,
        value: str | TextLine,
        alignment: Alignment,
        font_style: Optional[FontStyle] = None,
        font_size: Optional[int] = None,
        start_x=None,
        end_x=None,
    ):
        if start_x is None:
            start_x = self.margin_left
        if end_x is None:
            end_x = WIDTH - self.margin_right

        width = end_x - start_x
        if isinstance(value, str):
            text_width = self.document.stringWidth(
                value, self._get_font(font_style), font_size
            )
        else:
            text_width = sum(
                [
                    self.document.stringWidth(
                        parts["value"],
                        self._get_font(parts["font_style"]),
                        parts["font_size"],
                    )
                    for parts in value.parts
                ]
            )
        if alignment == Alignment.CENTER:
            return start_x + (width - text_width) / 2
        elif alignment == Alignment.RIGHT:
            return end_x - text_width
        return start_x

    def add_text(
        self,
        value: str,
        font_size: int,
        font_style: FontStyle = FontStyle.SEMIBOLD,
        alignment: Alignment = Alignment.CENTER,
        line_spacing: float = 1.0,
    ):
        textobject = self.document.beginText()

        textobject.setFont(self._get_font(font_style), font_size)
        textobject.setTextOrigin(
            self.__get_text_x_position(
                value=value,
                font_style=font_style,
                font_size=font_size,
                alignment=alignment,
            ),
            self.current_line_y,
        )
        textobject.textLine(value)
        textobject.setLeading(font_size * line_spacing)
        self.document.drawText(textobject)
        self.current_line_y -= font_size * line_spacing

    def add_horizontal_line(self, width=1):
        self.document.setLineWidth(width)
        self.document.line(
            self.margin_left,
            self.current_line_y - 2,
            WIDTH - self.margin_right,
            self.current_line_y - 2,
        )
        self.current_line_y -= 24
