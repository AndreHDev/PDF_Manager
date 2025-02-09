import uuid
import shutil
from fastapi import UploadFile, File
from model import pdf_model_instance

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