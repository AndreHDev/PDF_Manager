from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import PDF_Model
from routers import files

app = FastAPI()

model = PDF_Model()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files.router)