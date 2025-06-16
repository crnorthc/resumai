from enum import Enum
from typing import TypedDict, List, Optional


class Font(Enum):
    ROBOTO = "Roboto"


class FontStyle(Enum):
    EXTRALIGHT = "ExtraLight"
    LIGHT = "Light"
    REGULAR = "Regular"
    MEDIUM = "Medium"
    SEMIBOLD = "SemiBold"
    BOLD = "Bold"
    ITALIC_EXTRALIGHT = "ExtraLightItalic"
    ITALIC_LIGHT = "LightItalic"
    ITALIC_REGULAR = "Italic"
    ITALIC_MEDIUM = "MediumItalic"
    ITALIC_SEMIBOLD = "SemiBoldItalic"
    ITALIC_BOLD = "BoldItalic"


class WriterOptions(TypedDict):
    font: Font
    default_font_size: Optional[int]
    default_font_style: Optional[FontStyle]
    margin_top: Optional[int]
    margin_bottom: Optional[int]
    margin_left: Optional[int]
    margin_right: Optional[int]


class Alignment(Enum):
    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"


class TextLineData(TypedDict):
    value: str
    font_style: FontStyle
    font_size: int


class TextLine:
    def __init__(self, parts: List[TextLineData]):
        self.parts = parts


class TableCellData(TypedDict):
    value: str
    alignment: Alignment
    font_style: FontStyle
    font_size: int


class TableCellTextLine(TypedDict):
    value: TextLine
    alignment: Alignment


TableCell = TableCellData | TableCellTextLine

TableData = List[List[TableCell]]


class BulletPointData(TypedDict):
    value: str
    font_style: FontStyle
    font_size: int


class BulletPointTextLine(TypedDict):
    value: TextLine


BulletPoint = BulletPointData | BulletPointTextLine

BulletPoints = List[BulletPoint]
