from model import pdf_model_instance
from schemas import Page
from fastapi import UploadFile, File, APIRouter
from typing import List

fileRouter = APIRouter()

@fileRouter.post("/merge")
async def merge_pdfs(request: List[Page]):
    print("Received request to merge PDFs!")

    pdf_model_instance.merge_selected_pages(request)
    return


@fileRouter.post("/upload", response_model=List[Page])
async def upload_file(file: UploadFile = File(...)):
    print("Received request to upload file!")

    pages = pdf_model_instance.add_pdf_file(file)
    return pages