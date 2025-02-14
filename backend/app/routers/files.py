from model import pdf_model_instance
from model import MergePDFRequest
from fastapi import UploadFile, File, APIRouter

import uuid
import shutil

router = APIRouter()

@router.post("/merge")
async def merge_pdfs(request: MergePDFRequest):
    print("Received request to merge PDFs!", request)

    pdf_model_instance.merge_selected_pages(request.files)
    pass

@router.get("/thumbnails")
async def get_all_thumbnails_for_file(file_id: str):
    print(f"Got request to get all thumbnails for file: {file_id}")
    return {"thumbnails": pdf_model_instance.get_pdf(file_id).get_thumbnails()}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print("Received request to upload file!")
    file_id = str(uuid.uuid4())
    file_path = f"temp/{file_id}.pdf"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    print(f"Saved file to {file_path}")

    # Add the file to the model
    pdf_model_instance.add_pdf_file(file_id, file_path)
    return {"file_id": file_id}