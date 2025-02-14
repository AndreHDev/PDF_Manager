from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import PDF_Model
from services.upload_service import upload_file
from services.thumbnail_service import get_all_thumbnails_for_file
from services.merge_service import merge_pdfs

app = FastAPI()

model = PDF_Model()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.post("/upload")(upload_file)
app.get("/thumbnails/{file_id}")(get_all_thumbnails_for_file)
app.post("/merge")(merge_pdfs)