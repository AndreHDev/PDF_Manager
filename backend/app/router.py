from backend import pdf_model_instance
from schemas import Page
from fastapi import UploadFile, File, APIRouter, HTTPException
from fastapi.responses import FileResponse
from typing import List
from starlette.background import BackgroundTasks
import os

fileRouter = APIRouter()

@fileRouter.post("/pages/merge", response_model=dict)
async def merge_pdfs(request: List[Page]):
    """
    Merge passed page objects into a single PDF file. Only pages with checked=True will be merged.

    Args:
        request (List[Page]): List of Page objects to merge.

    Returns:
        dict: A dictionary containing the file_id of the merged PDF.
    """
    print("Received request to merge PDFs!")

    try:
        merged_file_id = pdf_model_instance.merge_selected_pages(request)
    except ValueError as ve: # No page selected for merging
        raise HTTPException(status_code=400, detail=str(ve))
    except FileNotFoundError as fnf: # File not found
        raise HTTPException(status_code=404, detail=str(fnf)) 
    except IndexError as ie: # Page not found in file
        raise HTTPException(status_code=404, detail=str(ie))
    except Exception as e: # Everything else
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


    return {"file_id": merged_file_id}


@fileRouter.post("/pdfs", response_model=dict)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Uploads a PDF and returns its unique file_id.

    Args:
        file (UploadFile, optional): The PDF file to upload.

    Returns:
        dict: A dictionary containing the file_id of the uploaded PDF.
    """
    print("Received request to upload file!")

    try:
        pdf_id = pdf_model_instance.add_pdf_file(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"pdf_id": pdf_id}


@fileRouter.get("/pdfs/{pdf_id}/pages", response_model=List[Page])
async def get_pdf_pages(pdf_id: str):
    """
    Returns a list of Page objects for a given PDF.

    Args:
        pdf_id (str): The file_id of the PDF to fetch pages for.

    Returns:
        List[Page]: A list of Page objects for the given PDF.
    """
    print(f"Fetching pages for PDF: {pdf_id}")

    try:
        pages = pdf_model_instance.get_pdf_pages(pdf_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="PDF file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return pages


@fileRouter.get("/pdfs/{pdf_id}/download")
async def download_pdf(pdf_id: str):
    """
    Gets a PDf file for download by its file_id
    Args:
        pdf_id (str): The file_id of the PDF to download.

    Returns:
        FileResponse: The PDF file for download.
    """
    print(f"Received request to download PDF: {pdf_id}")

    pdf_path = pdf_model_instance.get_pdf_path(pdf_id)

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF file not found")

    return FileResponse(pdf_path, filename=f"{pdf_id}.pdf")


@fileRouter.delete("/pdfs")
async def clean_up_temp_files():
    """
    Cleans up temporary files created by the backend.

    Returns:
        dict: A message indicating the cleanup was successful.
    """
    print("Received request to clean up temporary files!")

    try:
        pdf_model_instance.clean_up()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Temporary files cleaned up successfully"}