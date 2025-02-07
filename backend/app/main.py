from fastapi import FastAPI
from app.services.upload_service import upload_file
#from services.preview_service import preview_pdf
#from services.merge_service import merge_pdfs, download_pdf

app = FastAPI()

app.post("/upload")(upload_file)