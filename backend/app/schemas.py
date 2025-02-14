from pydantic import BaseModel

class Page(BaseModel):
    file_id: str
    page_number: int
    thumbnail: str
    checked: bool = True