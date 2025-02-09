from fastapi import FastAPI
from services.upload_service import upload_file
#from services.preview_service import preview_pdf
#from services.merge_service import merge_pdfs, download_pdf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.post("/upload")(upload_file)