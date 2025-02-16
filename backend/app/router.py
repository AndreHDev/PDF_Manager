from backend import pdf_model_instance
from schemas import Page
from fastapi import UploadFile, File, APIRouter, HTTPException
from fastapi.responses import FileResponse
from typing import List
from starlette.background import BackgroundTasks
import os

fileRouter = APIRouter()

@fileRouter.post("/merge")
async def merge_pdfs(request: List[Page], background_tasks: BackgroundTasks):
    """
    Merge passed page objects into a single PDF file. Only pages with checked=True will be merged.

    Args:
        request (List[Page]): List of Page objects to merge.

    Returns:
        FileResponse: Merged PDF file.
    """
    print("Received request to merge PDFs!")

    try:
        output_file = pdf_model_instance.merge_selected_pages(request)
    except ValueError as ve: # No page selected for merging
        raise HTTPException(status_code=400, detail=str(ve))
    except FileNotFoundError as fnf: # File not found
        raise HTTPException(status_code=404, detail=str(fnf)) 
    except IndexError as ie: # Page not found in file
        raise HTTPException(status_code=404, detail=str(ie))
    except Exception as e: # Everything else
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    

    output_file = "merged_output.pdf"
    if not os.path.exists(output_file):
        raise HTTPException(status_code=404,
        detail="Merged PDF file not found, something went wrong while tryging to merge the files.")

    background_tasks.add_task(pdf_model_instance.delete_merged_file, output_file)

    response = FileResponse(output_file)

    return response


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

    try:
        pages = pdf_model_instance.add_pdf_file(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    return pages

@fileRouter.get("/clean-up")
async def clean_up():
    print("Received request to clean up!")
    try:
        pdf_model_instance.clean_up()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))