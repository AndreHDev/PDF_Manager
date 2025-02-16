from model import pdf_model_instance
from schemas import Page
from fastapi import UploadFile, File, APIRouter
from fastapi.responses import FileResponse
from typing import List

fileRouter = APIRouter()

@fileRouter.post("/merge")
async def merge_pdfs(request: List[Page]):
    """
    Merge passed page objects into a single PDF file. Only pages with checked=True will be merged.

    Args:
        request (List[Page]): List of Page objects to merge.

    Returns:
        FileResponse: Merged PDF file.
    """
    print("Received request to merge PDFs!")

    pdf_model_instance.merge_selected_pages(request)

    return FileResponse("merged_output.pdf")


@fileRouter.post("/upload", response_model=List[Page])
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF file to get all pages from that file.

    Args:
        file (UploadFile): The PDF file to be uploaded.

    Returns:
        List[Page]: A list of page objects. extracted from the uploaded PDF file.
    """
    print("Received request to upload file!")

    pages = pdf_model_instance.add_pdf_file(file)
    
    return pages