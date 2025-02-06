import uuid
import shutil
from fastapi import UploadFile, File

TEMP_STORAGE = {}

async def upload_file(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = f"temp/{file_id}.pdf"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    TEMP_STORAGE[file_id] = file_path
    return {"file_id": file_id}