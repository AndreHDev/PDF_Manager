from pydantic import BaseModel
from typing import List

class Page(BaseModel):
    page_number: int
    thumbnail: str
    checked: bool = True

class Pdf(BaseModel):
    file_id: str
    pages: List[Page]