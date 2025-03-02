from backend_services import pdf_model_instance
from schemas import Page
from fastapi import UploadFile, File, APIRouter, HTTPException
from fastapi.responses import FileResponse
from typing import List
import os
from logger import logger

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
    logger.info(f"Received request to merge {len(request)} pages!")

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
    
    logger.info(f"Successfully merged pages into file with id: {merged_file_id}")
    return {"file_id": merged_file_id}


@fileRouter.post("/pdfs", response_model=dict)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Uploads a PDF and saves each pages indivdualy as a pdf.

    Args:
        file (UploadFile, optional): The PDF file to upload.

    Returns:
        dict: 
    """
    logger.info(f"Received request to upload PDF: {file.filename}!")

    try:
        file_id = pdf_model_instance.add_pdf_file(file)
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    logger.info(f"Successfully uploaded PDF with id: {file_id}")
    return {"file_id": file_id}


@fileRouter.get("/pdfs/{file_id}/pages", response_model=List[Page])
async def get_pdf_pages(file_id: str):
    """
    Returns a list of Page objects for a given PDF.

    Args:
        file_id (str): The file_id of the PDF to fetch pages for.

    Returns:
        List[Page]: A list of Page objects for the given PDF.
    """
    logger.info(f"Received request to get pages for PDF with id: {file_id}!")

    try:
        pages = pdf_model_instance.get_pdf_pages(file_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="PDF file not found")
    except Exception as e:
        logger.error(f"Error fetching pages for pdf with id {file_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    logger.info(f"Successfully fetched {len(pages)} pages for PDF with id: {file_id}")
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
    logger.info(f"Received request to download PDF with id: {pdf_id}!")

    pdf_path = pdf_model_instance.generate_file_path(pdf_id)

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF file not found")

    logger.info(f"Successfully responded with downloadable PDF with id: {pdf_id}")
    return FileResponse(pdf_path, filename=f"{pdf_id}.pdf")


@fileRouter.delete("/pdfs")
async def clean_up_temp_files():
    """
    Cleans up temporary files created by the backend.

    Returns:
        dict: A message indicating the cleanup was successful.
    """
    logger.info("Received request to clean up temporary files!")

    try:
        pdf_model_instance.clean_up()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    logger.info("Successfully cleaned up temporary files")
    return {"message": "Temporary files cleaned up successfully"}